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

// A polity polygon is an exterior ring followed by its holes; drawn as one
// path with the even-odd rule so an enclave stays a hole rather than being
// filled over by the state around it.
const polyPath = (rings) => rings.map(ringPath).join('');

// Polities that were an umbrella over many principalities rather than a single
// administration. They are stippled rather than subdivided: no boundary set for
// their constituent states exists in the public domain, and modern
// subdivisions would be three centuries wrong.
const COMPOSITE = new Set(['Holy Roman Empire', 'Swiss Confederation']);

export default function PlaceMap() {
  const [active, setActive] = useState(null);
  const [hoveredPolity, setHoveredPolity] = useState(null);
  const [hoveredCircle, setHoveredCircle] = useState(null);

  const landPaths = useMemo(() => europe.land.map(ringPath), []);
  const linePath = (line) =>
    line
      .map(([lon, lat], i) => {
        const [x, y] = project(lon, lat);
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join('');
  const coastPaths = useMemo(() => (europe.coast ?? []).map(linePath), []);
  const circleLinePaths = useMemo(() => (europe.circleLines ?? []).map(linePath), []);
  const circles = useMemo(
    () => (europe.circles ?? []).map((c) => ({...c, paths: c.p.map(ringPath), anchor: project(c.c[0], c.c[1])})),
    [],
  );
  const borderPaths = useMemo(() => (europe.borders ?? []).map(linePath), []);
  const lakePaths = useMemo(() => (europe.lakes ?? []).map(ringPath), []);
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

  const hoveredPlace = onMap.find((p) => p.id === active);
  const hovered = polities.find((p) => p.n === hoveredPolity);
  const hoveredCircleRec = circles.find((c) => c.n === hoveredCircle);

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

        {/* Land is a fill only. The coast is stroked once, by the polity that
            holds it — stroking it here too would double the shoreline, the two
            lines simplified to different tolerances and visibly apart. */}
        <g className={styles.land}>
          {landPaths.map((d, i) => (
            <path key={`land-${i}`} d={d} />
          ))}
        </g>

        <g className={styles.polityFills}>
          {polities.map((p) => (
            <g
              key={p.n}
              className={hoveredPolity === p.n ? styles.polityActive : undefined}
              onMouseEnter={() => setHoveredPolity(p.n)}
              onMouseLeave={() => setHoveredPolity(null)}>
              {p.paths.map((d, i) => (
                <path key={i} d={d} fillRule="evenodd" />
              ))}
            </g>
          ))}
        </g>

        {/* The Empire is one crown over many states; its Imperial Circles are
            drawn inside it, quieter than a frontier. The Confederation keeps
            the stipple: its cantons are not mapped here. */}
        <g className={styles.circleFills}>
          {circles.map((c) => (
            <g
              key={c.n}
              className={hoveredCircle === c.n ? styles.circleActive : undefined}
              onMouseEnter={() => setHoveredCircle(c.n)}
              onMouseLeave={() => setHoveredCircle(null)}>
              {c.paths.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </g>
          ))}
        </g>

        <g className={styles.stipple}>
          {polities
            .filter((p) => COMPOSITE.has(p.n) && p.n !== 'Holy Roman Empire')
            .flatMap((p) => p.paths.map((d, i) => <path key={`${p.n}-${i}`} d={d} fillRule="evenodd" />))}
        </g>

        <g className={styles.water}>
          {lakePaths.map((d, i) => (
            <path key={`lake-${i}`} d={d} />
          ))}
        </g>

        {/* Inland frontiers are drawn lighter than the shoreline: the coast is
            the shape of the world, a border is a claim upon it. */}
        <g className={styles.circleLines}>
          {circleLinePaths.map((d, i) => (
            <path key={`cl-${i}`} d={d} />
          ))}
        </g>
        <g className={styles.borders}>
          {borderPaths.map((d, i) => (
            <path key={`b-${i}`} d={d} />
          ))}
        </g>
        <g className={styles.coast}>
          {coastPaths.map((d, i) => (
            <path key={`c-${i}`} d={d} />
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
            </g>
          ))}
        </g>

        {/* Nothing is named until the reader asks. A place under the cursor
            wins over the territory beneath it. */}
        {hoveredPlace ? (
          <g className={styles.hoverLabel}>
            <text x={hoveredPlace.x + hoveredPlace.r + 4} y={hoveredPlace.y + 3.5}>
              {hoveredPlace.name}
              <tspan className={styles.hoverCount}>
                {`  ${hoveredPlace.total} ${hoveredPlace.total === 1 ? 'mention' : 'mentions'}`}
              </tspan>
            </text>
          </g>
        ) : hoveredCircleRec ? (
          <g className={styles.hoverLabel}>
            <text x={hoveredCircleRec.anchor[0]} y={hoveredCircleRec.anchor[1]} textAnchor="middle">
              {hoveredCircleRec.n}
            </text>
          </g>
        ) : (
          hovered && (
            <g className={styles.hoverLabel}>
              <text x={hovered.anchor[0]} y={hovered.anchor[1]} textAnchor="middle">
                {hovered.n}
              </text>
            </g>
          )
        )}
      </svg>
      <figcaption className={styles.caption}>
        {onMap.length} places, sized by how often the letters name them, on the Europe of
        1570. Hover to identify. Frontiers are indicative; dotted lines divide the Empire into
        its ten Imperial Circles. After HistoGIS and IEG-Maps.
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
