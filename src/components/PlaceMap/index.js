import React, {useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import authorities from '@site/src/data/authorities.json';
import europe from '@site/src/data/europe.json';
import styles from './styles.module.css';

const {entities} = authorities;

const WIDTH = 760;
const HEIGHT = 520;

// The extent the vendored coastline was cut to.
const [MIN_LON, MIN_LAT, MAX_LON, MAX_LAT] = europe.bbox;

const project = (lon, lat) => [
  ((lon - MIN_LON) / (MAX_LON - MIN_LON)) * WIDTH,
  // Latitude increases northward, y increases downward.
  ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * HEIGHT,
];

/**
 * Where the correspondence reaches. Places are plotted from the coordinates
 * in the place authority file over a simplified coastline held in the repo —
 * no tiles, no external requests, and it prints.
 */
export default function PlaceMap() {
  const [active, setActive] = useState(null);

  const toPath = (ring) =>
    ring
      .map(([lon, lat], i) => {
        const [x, y] = project(lon, lat);
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join('') + 'Z';

  const landPaths = useMemo(() => europe.land.map(toPath), []);
  const lakePaths = useMemo(() => (europe.lakes ?? []).map(toPath), []);

  const points = useMemo(() => {
    const located = Object.entries(entities)
      .filter(([, r]) => r.kind === 'place' && r.lat && r.lon && r.total > 0)
      .map(([id, r]) => ({id, name: r.name, lat: Number(r.lat), lon: Number(r.lon), total: r.total}))
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lon));
    if (located.length === 0) {
      return [];
    }
    const max = Math.max(...located.map((p) => p.total));
    return located
      .sort((a, b) => b.total - a.total)
      .map((p) => {
        const [x, y] = project(p.lon, p.lat);
        return {...p, x, y, r: 2.5 + Math.sqrt(p.total / max) * 10};
      });
  }, []);

  if (points.length === 0) {
    return null;
  }

  const offMap = points.filter(
    (p) => p.lon < MIN_LON || p.lon > MAX_LON || p.lat < MIN_LAT || p.lat > MAX_LAT,
  );
  const onMap = points.filter((p) => !offMap.includes(p));

  // Label the most-cited places first, skipping any whose label would sit on
  // one already placed — otherwise the Paris cluster buries its own busiest
  // name under its neighbours'.
  const labelled = new Set();
  const boxes = [];
  for (const p of onMap.slice(0, 16)) {
    const box = {
      x1: p.x + p.r + 2,
      y1: p.y - 5,
      x2: p.x + p.r + 2 + p.name.length * 5.6,
      y2: p.y + 6,
    };
    const clash = boxes.some((b) => !(box.x2 < b.x1 || box.x1 > b.x2 || box.y2 < b.y1 || box.y1 > b.y2));
    if (!clash) {
      boxes.push(box);
      labelled.add(p.id);
    }
    if (labelled.size >= 10) {
      break;
    }
  }

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.map}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={`Map of ${onMap.length} places named in the correspondence`}>
        <g className={styles.land}>
          {landPaths.map((d, i) => (
            <path key={`land-${i}`} d={d} />
          ))}
        </g>
        <g className={styles.water}>
          {lakePaths.map((d, i) => (
            <path key={`lake-${i}`} d={d} />
          ))}
        </g>
        <g>
          {onMap.map((p) => (
            <g
              key={p.id}
              className={`${styles.point} ${active === p.id ? styles.pointActive : ''}`}
              onMouseEnter={() => setActive(p.id)}
              onMouseLeave={() => setActive(null)}>
              <circle cx={p.x} cy={p.y} r={p.r} />
              <title>{`${p.name} — ${p.total} ${p.total === 1 ? 'mention' : 'mentions'}`}</title>
            </g>
          ))}
        </g>
        <g className={styles.labels}>
          {onMap
            .filter((p) => labelled.has(p.id) || active === p.id)
            .map((p) => (
              <text key={`l-${p.id}`} x={p.x + p.r + 3} y={p.y + 3.5}>
                {p.name}
              </text>
            ))}
        </g>
      </svg>
      <figcaption className={styles.caption}>
        {onMap.length} located places, sized by how often each is named. Coastline only —
        the frontiers of Cavriana&rsquo;s Europe are not drawn, and modern ones would be
        three centuries out of date.
        {offMap.length > 0 && ` ${offMap.length} places lie beyond this frame.`}{' '}
        {active && (
          <Link to={`#${active}`} className={styles.jump}>
            Go to {entities[active].name}
          </Link>
        )}
      </figcaption>
    </figure>
  );
}
