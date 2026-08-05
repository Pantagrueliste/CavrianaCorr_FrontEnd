import React, {useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import authorities from '@site/src/data/authorities.json';
import styles from './styles.module.css';

const {itinerary = [], entities} = authorities;

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/* A place keeps one colour throughout, so the eye can follow it down the
   years. Paris is given the quietest of them: it is where he is most of the
   time, and the point of the band is what interrupts it. */
const PALETTE = [
  '#8c9bab', '#b4531f', '#2f6f4e', '#7d4f9c', '#b98900',
  '#356fa8', '#a03d5f', '#4f7a1f', '#8a6a3d', '#6f4b8a',
];

const nameOf = (row) => entities[row.place]?.name || row.label || 'unrecorded';

export default function Itinerary() {
  const [hover, setHover] = useState(null);

  const {years, places} = useMemo(() => {
    // One colour per place, in order of how much of the correspondence it
    // accounts for, so the commonest reads first in the legend.
    const tally = new Map();
    itinerary.forEach((r) => {
      const key = r.place || r.label || '?';
      tally.set(key, (tally.get(key) || 0) + 1);
    });
    const ordered = [...tally.entries()].sort((a, b) => b[1] - a[1]);
    const colour = new Map(ordered.map(([key], i) => [key, PALETTE[i % PALETTE.length]]));

    const byYear = new Map();
    itinerary.forEach((r) => {
      const y = Number(r.date.slice(0, 4));
      const m = Number(r.date.slice(5, 7)) - 1;
      if (!byYear.has(y)) byYear.set(y, Array.from({length: 12}, () => []));
      if (m >= 0 && m < 12) byYear.get(y)[m].push(r);
    });

    return {
      years: [...byYear.entries()].sort((a, b) => a[0] - b[0]),
      places: ordered.map(([key, n]) => ({
        key,
        n,
        colour: colour.get(key),
        name: entities[key]?.name || key,
      })),
    };
  }, []);

  if (years.length === 0) return null;
  const colourOf = (key) => places.find((p) => p.key === key)?.colour || '#ccc';

  return (
    <section className={styles.section} id="movements">
      <h2 className={styles.title}>Where he wrote from</h2>
      <p className={styles.intro}>
        One row to the year, one cell to the month, coloured by the place a letter was sent
        from. Cavriana is not travelling a circuit: he is at Paris and the court for most of
        nine years, and what the band shows is the absences — Nevers in 1568, the journey to
        Italy at the end of 1569, the summer of 1571 at the baths above Lucca, and the winters
        the court kept at Blois. A month with no letter is left blank, which is a gap in the
        correspondence and not a claim about where he was.
      </p>

      <div className={styles.band}>
        {years.map(([year, months]) => (
          <div key={year} className={styles.row}>
            <span className={styles.year}>{year}</span>
            <div className={styles.months}>
              {months.map((rows, m) => {
                if (rows.length === 0) {
                  return <span key={m} className={styles.empty} />;
                }
                const keys = [...new Set(rows.map((r) => r.place || r.label || '?'))];
                return (
                  <span
                    key={m}
                    className={styles.cell}
                    tabIndex={0}
                    onMouseEnter={() => setHover({year, m, rows})}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover({year, m, rows})}
                    onBlur={() => setHover(null)}
                    aria-label={`${FULL[m]} ${year}: ${keys
                      .map((k) => entities[k]?.name || k)
                      .join(', ')}, ${rows.length} letter${rows.length === 1 ? '' : 's'}`}>
                    {/* A month he wrote from two places is split, rather than
                        made to choose one and hide the move. */}
                    {keys.map((k) => (
                      <span
                        key={k}
                        className={styles.slice}
                        style={{background: colourOf(k), flexGrow: 1}}
                      />
                    ))}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
        <div className={styles.row}>
          <span className={styles.year} />
          <div className={styles.months}>
            {MONTHS.map((label, m) => (
              <span key={m} className={styles.tick}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className={styles.readout} role="status">
        {hover ? (
          <>
            <strong>
              {FULL[hover.m]} {hover.year}
            </strong>{' '}
            — {[...new Set(hover.rows.map(nameOf))].join(', ')}:{' '}
            {hover.rows.map((r, i) => (
              <React.Fragment key={r.slug}>
                {i > 0 && ', '}
                <Link to={`/docs/${r.date.slice(0, 4)}/${r.slug}`}>{r.slug}</Link>
              </React.Fragment>
            ))}
          </>
        ) : (
          'Hover a month to see where he was and which letters he wrote.'
        )}
      </p>

      <ul className={styles.legend}>
        {places.map((p) => (
          <li key={p.key} className={styles.legendItem}>
            <span className={styles.swatch} style={{background: p.colour}} />
            {entities[p.key] ? (
              <Link to={`/places#${p.key}`}>{p.name}</Link>
            ) : (
              <span className={styles.unplaced} title="no authority record yet">
                {p.name}
              </span>
            )}
            <span className={styles.count}>{p.n}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
