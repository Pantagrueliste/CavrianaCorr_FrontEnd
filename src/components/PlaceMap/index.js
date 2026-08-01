import React, {useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import authorities from '@site/src/data/authorities.json';
import europe from '@site/src/data/europe.json';
import styles from './styles.module.css';

const {entities} = authorities;

const WIDTH = 760;
const HEIGHT = 520;

// The extent the vendored geometry was cut to.
const [MIN_LON, MIN_LAT, MAX_LON, MAX_LAT] = europe.bbox;

const project = (lon, lat) => [
  ((lon - MIN_LON) / (MAX_LON - MIN_LON)) * WIDTH,
  // Latitude increases northward, y increases downward.
  ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * HEIGHT,
];

const ringPath = (ring) =>
  ring
    .map(([lon, lat], i) => {
      const [x, y] = project(lon, lat);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join('') + 'Z';

const toPath = (ring) => ringPath(ring);

// A polity polygon is an exterior ring followed by its holes; drawn as one
// path with the even-odd rule so an enclave stays a hole rather than being
// filled over by the state around it.
const polyPath = (rings) => rings.map(ringPath).join('');

// Polities that were an umbrella over many principalities rather than a single
// administration. They are stippled rather than subdivided: no boundary set for
// their constituent states exists in the public domain, and modern
// subdivisions would be three centuries wrong.
const COMPOSITE = new Set(['Holy Roman Empire', 'Swiss Confederation']);

// Only the polities this correspondence actually moves through are named on the
// map; the rest are drawn and left to the hover.
const LABEL_ALWAYS = new Set([
  'Kingdom of France',
  'Spain',
  'Holy Roman Empire',
  'Habsburg Netherlands',
  'Duchy of Savoy',
  'Papal States',
  'Republic of Venice',
  'Grand Duchy of Tuscany',
  'Duchy of Milan',
  'Kingdom of Naples',
  'England and Wales',
  'Portugal',
]);

const shortLabel = (name) =>
  name
    .replace(/^(Kingdom|Duchy|Republic|Grand Duchy) of /, '')
    .replace('Habsburg Netherlands', 'Netherlands')
    .replace('England and Wales', 'England');

export default function PlaceMap() {
  const [active, setActive] = useState(null);
  const [hoveredPolity, setHoveredPolity] = useState(null);

  const landPaths = useMemo(() => europe.land.map(toPath), []);
  const lakePaths = useMemo(() => (europe.lakes ?? []).map(toPath), []);
  const polities = useMemo(
    () =>
      (europe.polities ?? []).map((p) => ({
        ...p,
        paths: p.p.map(polyPath),
        anchor: project(p.c[0], p.c[1]),
      })),
    [],
  );

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
  // one already placed — otherwise the Île-de-France cluster buries Paris.
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

  // Place names win: a polity label is dropped if it would sit on one, or on
  // a polity label already placed.
  const polityLabels = [];
  for (const p of polities) {
    if (!LABEL_ALWAYS.has(p.n) || p.n === hoveredPolity) {
      continue;
    }
    const w = shortLabel(p.n).length * 5.2;
    const box = {
      x1: p.anchor[0] - w / 2,
      y1: p.anchor[1] - 5,
      x2: p.anchor[0] + w / 2,
      y2: p.anchor[1] + 5,
    };
    const clash = boxes.some(
      (b) => !(box.x2 < b.x1 || box.x1 > b.x2 || box.y2 < b.y1 || box.y1 > b.y2),
    );
    if (!clash) {
      boxes.push(box);
      polityLabels.push(p);
    }
  }

  const hovered = polities.find((p) => p.n === hoveredPolity);

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.map}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={`Map of ${onMap.length} places named in the correspondence, over the political divisions of Europe in 1570`}>
        <defs>
          <pattern id="cav-stipple" width="5" height="5" patternUnits="userSpaceOnUse">
            <circle cx="1.4" cy="1.4" r="0.5" className={styles.stippleDot} />
            <circle cx="3.9" cy="3.9" r="0.5" className={styles.stippleDot} />
          </pattern>
        </defs>

        <g className={styles.land}>
          {landPaths.map((d, i) => (
            <path key={`land-${i}`} d={d} />
          ))}
        </g>

        <g className={styles.polities}>
          {polities.map((p) => (
            <g
              key={p.n}
              className={hoveredPolity === p.n ? styles.polityActive : undefined}
              onMouseEnter={() => setHoveredPolity(p.n)}
              onMouseLeave={() => setHoveredPolity(null)}>
              {p.paths.map((d, i) => (
                <path key={i} d={d} fillRule="evenodd" />
              ))}
              <title>{p.n}</title>
            </g>
          ))}
        </g>

        {/* Composite territory is stippled, not subdivided. */}
        <g className={styles.stipple}>
          {polities
            .filter((p) => COMPOSITE.has(p.n))
            .flatMap((p) => p.paths.map((d, i) => <path key={`${p.n}-${i}`} d={d} fillRule="evenodd" />))}
        </g>

        <g className={styles.water}>
          {lakePaths.map((d, i) => (
            <path key={`lake-${i}`} d={d} />
          ))}
        </g>

        <g className={styles.polityLabels}>
          {polityLabels.map((p) => (
            <text key={`pl-${p.n}`} x={p.anchor[0]} y={p.anchor[1]} textAnchor="middle">
              {shortLabel(p.n)}
            </text>
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
        {hovered && (
          <g className={styles.hoverLabel} aria-hidden="true">
            <text x={hovered.anchor[0]} y={hovered.anchor[1]} textAnchor="middle">
              {hovered.n}
            </text>
          </g>
        )}
      </svg>
      <figcaption className={styles.caption}>
        {onMap.length} located places, sized by how often each is named, over the political
        divisions of 1570. Frontiers are indicative: composed from modern administrative
        units, they cannot show enclaves or a border that followed a river bank. Stippling
        marks composite territory — the Empire counted hundreds of principalities, not drawn
        separately.
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
