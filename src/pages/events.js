import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import authorities from '@site/src/data/authorities.json';
import styles from './events.module.css';

const {events = []} = authorities;

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Format an ISO date without letting the browser shift it by a timezone. */
function longDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

function span(ev) {
  if (ev.when) return longDate(ev.when);
  if (ev.from && ev.to) return `${longDate(ev.from)} – ${longDate(ev.to)}`;
  return longDate(ev.from || ev.to);
}

/** "eleven days after", "the same day", "three days before". */
function offset(days) {
  if (days === 0) return 'the same day';
  const n = Math.abs(days);
  const unit = n === 1 ? 'day' : 'days';
  return `${n} ${unit} ${days > 0 ? 'after' : 'before'}`;
}

export default function Events() {
  const docsBase = useBaseUrl('/docs/');
  const ordered = [...events].sort((a, b) =>
    (a.when || a.from).localeCompare(b.when || b.from),
  );

  return (
    <Layout
      title="Events"
      description="Public events falling within the span of Cavriana's correspondence, with the letters written around them.">
      <main className={styles.page}>
        <header className={styles.masthead}>
          <h1 className={styles.title}>Events</h1>
          <p className={styles.description}>
            What was happening while Cavriana wrote. Letters are gathered here by date — that
            they were written around an event is a fact about the calendar, not a claim that
            they discuss it. Dates follow the Julian reckoning the letters themselves use,
            which runs ten days behind the Gregorian dates given by Wikidata.
          </p>
        </header>

        <ol className={styles.list}>
          {ordered.map((ev) => (
            <li key={ev.id} id={ev.id} className={styles.entry}>
              <div className={styles.head}>
                <h2 className={styles.name}>{ev.label}</h2>
                <span className={styles.when}>{span(ev)}</span>
              </div>

              {ev.desc && <p className={styles.detail}>{ev.desc}</p>}

              {ev.wikidata && (
                <p className={styles.authority}>
                  <a
                    href={`https://www.wikidata.org/wiki/${ev.wikidata}`}
                    rel="noopener noreferrer">
                    Wikidata {ev.wikidata}
                  </a>
                </p>
              )}

              {ev.letters?.length > 0 ? (
                <ul className={styles.letters}>
                  {ev.letters.map((l) => (
                    <li
                      key={l.slug}
                      className={l.slug === ev.firstAfter ? styles.firstAfter : undefined}>
                      <Link to={`${docsBase}${l.slug.slice(0, 4)}/${l.slug}`}>{l.slug}</Link>
                      <span className={styles.offset}>{offset(l.days)}</span>
                      {l.slug === ev.firstAfter && (
                        <span className={styles.badge}>first letter after</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.silence}>
                  No letter survives from the weeks around this event.
                </p>
              )}
            </li>
          ))}
        </ol>
      </main>
    </Layout>
  );
}
