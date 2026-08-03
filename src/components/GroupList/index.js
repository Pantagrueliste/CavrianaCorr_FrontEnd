import React from 'react';
import Link from '@docusaurus/Link';
import authorities from '@site/src/data/authorities.json';
import styles from './styles.module.css';

const {entities} = authorities;

function letterHref({slug, date}) {
  const year = (date || slug).slice(0, 4);
  return `/docs/${year}/${slug}`;
}

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/**
 * The collectives Cavriana writes about, as against the individuals.
 *
 * He reports on parties, confessions and bodies of soldiers at least as often
 * as on named men, and an index built only of persons left those passages
 * unreachable. A group that stands for a country links to it and counts
 * towards it; one defined by belief or by trade belongs to no territory and
 * is recorded here alone.
 */
export default function GroupList() {
  const groups = Object.entries(entities)
    .filter(([, r]) => r.kind === 'group' && r.total > 0)
    .sort((a, b) => b[1].total - a[1].total);

  if (groups.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.title} id="groups">
        Groups of people
      </h2>
      <p className={styles.intro}>
        Cavriana reports on parties and peoples as much as on individuals. A group named for a
        country also counts towards that country in the{' '}
        <Link to="/places">index of places</Link>; the Huguenots and the reiters belong to no
        territory and are recorded here alone. The characterisations describe how he presents
        each group, not what the group was.
      </p>

      <ol className={styles.list}>
        {groups.map(([id, r]) => (
          <li key={id} id={id} className={styles.entry}>
            <div className={styles.head}>
              <h3 className={styles.name}>{r.name}</h3>
              <span className={styles.count}>
                {plural(r.total, 'mention')} in {plural(r.letters.length, 'letter')}
              </span>
              {r.role && <span className={styles.role}>{r.role}</span>}
            </div>

            {r.aliases?.length > 0 && (
              <p className={styles.detail}>Cavriana writes {r.aliases.join(', ')}</p>
            )}
            {r.note && <p className={styles.note}>{r.note}</p>}

            {(r.place || r.wikidata) && (
              <p className={styles.authority}>
                {r.place && (
                  <Link to={`/places#${r.place}`}>
                    also counted under {entities[r.place]?.name ?? 'its country'}
                  </Link>
                )}
                {r.wikidata && (
                  <>
                    {r.place && ' · '}
                    <a
                      href={`https://www.wikidata.org/wiki/${r.wikidata}`}
                      rel="noopener noreferrer">
                      Wikidata {r.wikidata}
                    </a>
                  </>
                )}
              </p>
            )}

            <p className={styles.letters}>
              {r.letters.map((l) => (
                <Link key={l.slug} to={letterHref(l)} className={styles.letter}>
                  {l.slug}
                </Link>
              ))}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
