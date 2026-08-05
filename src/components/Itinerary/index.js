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

/* Thirteen separate hues, several of them neighbours, told a reader nothing.
   There are really two families here — the places in France and the places in
   Italy — and that is the distinction the band exists to show, since every
   Italian month is an absence from the French court.

   So: one hue to a country, one shade of it to each place, darkest for the
   place he wrote from most. France reads cool and Italy warm, and a season
   spent in Italy stands out from a year of Paris without anyone having to
   consult the legend. Which country a place belongs to is read from its
   record, not from a list kept here. */
const RAMPS = {
  // Seven places in France and only so much room between one blue and the
  // next, so the ramp turns as it lightens — deep navy through blue to a cool
  // slate — rather than fading along a single hue, where the middle steps
  // become a coin toss.
  France: ['#16345c', '#22558c', '#2f7fae', '#5aa3c4', '#8dbcd2', '#b6d2de', '#d7e6ec'],
  Italy: ['#7a2c10', '#ab4a1c', '#cd7a2b', '#e0a862', '#eecfa4'],
};
const UNRECORDED = '#6b6f76';

const keyOf = (r) => r.place || r.label || '?';
const nameOf = (row) => entities[row.place]?.name || row.label || 'unrecorded';

/** France, Italy, or neither — from the place's own record. */
function familyOf(key) {
  const country = entities[key]?.country;
  return RAMPS[country] ? country : 'Unrecorded';
}

export default function Itinerary() {
  const [hover, setHover] = useState(null);

  const {years, families, colours} = useMemo(() => {
    const tally = new Map();
    itinerary.forEach((r) => {
      const k = keyOf(r);
      tally.set(k, (tally.get(k) || 0) + 1);
    });

    // Within a country, the place he wrote from most takes the darkest shade.
    const grouped = new Map();
    [...tally.entries()]
      .sort((a, b) => b[1] - a[1])
      .forEach(([key, n]) => {
        const fam = familyOf(key);
        if (!grouped.has(fam)) grouped.set(fam, []);
        grouped.get(fam).push({key, n});
      });

    const colours = new Map();
    grouped.forEach((list, fam) => {
      const ramp = RAMPS[fam];
      list.forEach((p, i) => {
        // More places than shades would wrap and repeat a colour; the last
        // shade is reused rather than starting the ramp again, which would
        // put the palest beside the darkest.
        p.colour = ramp ? ramp[Math.min(i, ramp.length - 1)] : UNRECORDED;
        p.name = entities[p.key]?.name || (p.key === '?' ? 'unrecorded' : p.key);
        colours.set(p.key, p.colour);
      });
    });

    const byYear = new Map();
    itinerary.forEach((r) => {
      const y = Number(r.date.slice(0, 4));
      const m = Number(r.date.slice(5, 7)) - 1;
      if (!byYear.has(y)) byYear.set(y, Array.from({length: 12}, () => []));
      if (m >= 0 && m < 12) byYear.get(y)[m].push(r);
    });

    // France first, then Italy, then whatever has no record.
    const order = ['France', 'Italy', 'Unrecorded'];
    return {
      years: [...byYear.entries()].sort((a, b) => a[0] - b[0]),
      families: order.filter((f) => grouped.has(f)).map((f) => [f, grouped.get(f)]),
      colours,
    };
  }, []);

  if (years.length === 0) return null;

  return (
    <section className={styles.section} id="movements">
      <h2 className={styles.title}>Where he wrote from</h2>
      <p className={styles.intro}>
        One row to the year, one cell to the month, coloured by the place a letter was sent
        from — blue for France, warm for Italy, the darkest shade in each for the place he
        wrote from most. Cavriana is not travelling a circuit: he is at Paris and the court for
        most of nine years, and what the band shows is the absences from it — Nevers in 1568,
        the journey to Italy at the end of 1569, the summer of 1571 at the baths above Lucca,
        and the winters the court kept at Blois. A month with no letter is left empty, which is
        a gap in the correspondence and not a claim about where he was.
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
                const keys = [...new Set(rows.map(keyOf))];
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
                        style={{background: colours.get(k) || UNRECORDED, flexGrow: 1}}
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

      {families.map(([family, list]) => (
        <ul key={family} className={styles.legend}>
          <li className={styles.family}>{family === 'Unrecorded' ? 'No record' : family}</li>
          {list.map((p) => (
            <li key={p.key} className={styles.legendItem}>
              <span className={styles.swatch} style={{background: p.colour}} />
              {entities[p.key] ? (
                <Link to={`/places#${p.key}`}>{p.name}</Link>
              ) : (
                <span className={styles.unplaced}>{p.name}</span>
              )}
              <span className={styles.count}>{p.n}</span>
            </li>
          ))}
        </ul>
      ))}
    </section>
  );
}
