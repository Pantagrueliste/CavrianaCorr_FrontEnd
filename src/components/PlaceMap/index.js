import React, {useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import authorities from '@site/src/data/authorities.json';
import styles from './styles.module.css';

const {entities} = authorities;

const WIDTH = 720;
const HEIGHT = 460;
const PAD = 34;

/**
 * Where the correspondence reaches. Plotted from the coordinates in the
 * place authority file — an equirectangular projection over the extent of
 * the data, with a graticule for orientation. No basemap: the point is the
 * shape of Cavriana's network, not cartographic detail.
 */
export default function PlaceMap() {
  const [active, setActive] = useState(null);

  const {points, bounds} = useMemo(() => {
    const located = Object.entries(entities)
      .filter(([, r]) => r.kind === 'place' && r.lat && r.lon && r.total > 0)
      .map(([id, r]) => ({id, name: r.name, lat: Number(r.lat), lon: Number(r.lon), total: r.total}))
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lon));

    if (located.length === 0) {
      return {points: [], bounds: null};
    }
    const lats = located.map((p) => p.lat);
    const lons = located.map((p) => p.lon);
    const b = {
      minLat: Math.min(...lats), maxLat: Math.max(...lats),
      minLon: Math.min(...lons), maxLon: Math.max(...lons),
    };
    const spanLat = b.maxLat - b.minLat || 1;
    const spanLon = b.maxLon - b.minLon || 1;
    const max = Math.max(...located.map((p) => p.total));

    const pts = located.map((p) => ({
      ...p,
      x: PAD + ((p.lon - b.minLon) / spanLon) * (WIDTH - PAD * 2),
      // Latitude increases northward, y increases downward.
      y: PAD + ((b.maxLat - p.lat) / spanLat) * (HEIGHT - PAD * 2),
      r: 3 + Math.sqrt(p.total / max) * 11,
    }));
    return {points: pts, bounds: b};
  }, []);

  if (points.length === 0) {
    return null;
  }

  const graticule = [];
  for (let lat = Math.ceil(bounds.minLat / 5) * 5; lat <= bounds.maxLat; lat += 5) {
    const y = PAD + ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * (HEIGHT - PAD * 2);
    graticule.push({key: `lat${lat}`, x1: PAD, x2: WIDTH - PAD, y1: y, y2: y, label: `${lat}°N`, lx: 4, ly: y - 3});
  }
  for (let lon = Math.ceil(bounds.minLon / 5) * 5; lon <= bounds.maxLon; lon += 5) {
    const x = PAD + ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * (WIDTH - PAD * 2);
    graticule.push({key: `lon${lon}`, x1: x, x2: x, y1: PAD, y2: HEIGHT - PAD, label: `${lon}°E`, lx: x + 3, ly: HEIGHT - PAD + 12});
  }

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.map}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={`Map of ${points.length} places named in the correspondence`}>
        <g className={styles.graticule}>
          {graticule.map((g) => (
            <g key={g.key}>
              <line x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2} />
              <text x={g.lx} y={g.ly} className={styles.gridLabel}>{g.label}</text>
            </g>
          ))}
        </g>
        {points.map((p) => (
          <g
            key={p.id}
            className={`${styles.point} ${active === p.id ? styles.pointActive : ''}`}
            onMouseEnter={() => setActive(p.id)}
            onMouseLeave={() => setActive(null)}>
            <circle cx={p.x} cy={p.y} r={p.r} />
            <title>{`${p.name} — ${p.total} ${p.total === 1 ? 'mention' : 'mentions'}`}</title>
          </g>
        ))}
        {points
          .filter((p) => p.total >= 8 || active === p.id)
          .map((p) => (
            <text key={`l-${p.id}`} x={p.x + p.r + 3} y={p.y + 3} className={styles.pointLabel}>
              {p.name}
            </text>
          ))}
      </svg>
      <figcaption className={styles.caption}>
        {points.length} located places, sized by how often each is named.{' '}
        {active && (
          <Link to={`#${active}`} className={styles.jump}>
            Go to {entities[active].name}
          </Link>
        )}
      </figcaption>
    </figure>
  );
}
