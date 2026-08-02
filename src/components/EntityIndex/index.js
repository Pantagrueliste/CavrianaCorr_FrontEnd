import React, {useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import authorities from '@site/src/data/authorities.json';
import styles from './styles.module.css';

const {entities} = authorities;

function splitSortName(rec) {
  const s = rec.sortName ?? rec.name;
  const i = s.indexOf(',');
  return i === -1 ? [s, ''] : [s.slice(0, i), s.slice(i + 1).trim()];
}

function letterHref({slug, date}) {
  const year = (date || slug).slice(0, 4);
  return `/docs/${year}/${slug}`;
}

function Entry({id, rec, children}) {
  return (
    <li className={styles.entry} id={id}>
      <div className={styles.head}>
        <h2 className={styles.name}>{rec.sortName ?? rec.name}</h2>
        <span className={styles.count}>
          {rec.total} {rec.total === 1 ? 'mention' : 'mentions'}
          {rec.letters.length > 0 &&
            ` in ${rec.letters.length} ${rec.letters.length === 1 ? 'letter' : 'letters'}`}
        </span>
      </div>
      {children}
      {rec.letters.length > 0 && (
        <p className={styles.letters}>
          {rec.letters.map((l) => (
            <Link key={l.slug} to={letterHref(l)} className={styles.letter}>
              {l.slug}
            </Link>
          ))}
        </p>
      )}
    </li>
  );
}

export default function EntityIndex({kind, title, description, renderDetail, children}) {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('');

  // The Medici Archive's own classification of these people's offices, used
  // here only to let a reader narrow the index to the churchmen or the soldiers.
  const roles = useMemo(() => {
    const count = new Map();
    for (const rec of Object.values(entities)) {
      if (rec.kind !== kind || rec.author) continue;
      for (const c of rec.categories ?? []) count.set(c, (count.get(c) ?? 0) + 1);
    }
    return [...count.entries()].sort((a, b) => b[1] - a[1]);
  }, [kind]);

  const classified = useMemo(
    () =>
      Object.values(entities).filter(
        (rec) => rec.kind === kind && !rec.author && (rec.categories ?? []).length > 0,
      ).length,
    [kind],
  );

  const records = useMemo(() => {
    // Cavriana signs nearly every letter, so an entry counting his own
    // signatures would say nothing. He keeps his authority record.
    const all = Object.entries(entities).filter(([, rec]) => rec.kind === kind && !rec.author);
    // File on the surname first, then the forename, so "Bourbon, Henri"
    // precedes "Bourbon-Vendôme" — comparing the whole string would let the
    // hyphen outrank the comma and invert them.
    all.sort((a, b) => {
      const [aSur, aFore] = splitSortName(a[1]);
      const [bSur, bFore] = splitSortName(b[1]);
      return (
        aSur.localeCompare(bSur, 'it', {sensitivity: 'base'}) ||
        aFore.localeCompare(bFore, 'it', {sensitivity: 'base'})
      );
    });
    const byRole = role
      ? all.filter(([, rec]) => (rec.categories ?? []).includes(role))
      : all;
    const q = query.trim().toLowerCase();
    if (!q) {
      return byRole;
    }
    return byRole.filter(([id, rec]) =>
      [rec.name, rec.sortName, id, rec.role, rec.country, ...(rec.aliases ?? []), ...(rec.historical ?? [])]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q)),
    );
  }, [kind, query, role]);

  const cited = records.filter(([, r]) => r.total > 0);
  const uncited = records.filter(([, r]) => r.total === 0);

  return (
    <Layout title={title} description={description}>
      <main className={styles.page}>
        <header className={styles.masthead}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
          <p className={styles.dataNote}>
            Every identifier here was checked against the authority itself. The whole set is
            available as a{' '}
            <a href={useBaseUrl('/authorities.csv')} download>
              plain table
            </a>{' '}
            for anyone who wants to reuse it.
          </p>
          {children}
          <input
            type="search"
            className={styles.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={kind === 'person' ? 'Search names, roles…' : 'Search places…'}
            aria-label={`Search ${title}`}
          />
          {roles.length > 0 && (
            <div className={styles.roles} role="group" aria-label="Narrow by calling">
              <button
                type="button"
                className={role === '' ? styles.roleOn : styles.role}
                onClick={() => setRole('')}>
                everyone
              </button>
              {roles.map(([name, n]) => (
                <button
                  key={name}
                  type="button"
                  className={role === name ? styles.roleOn : styles.role}
                  onClick={() => setRole(role === name ? '' : name)}>
                  {name} <span className={styles.roleCount}>{n}</span>
                </button>
              ))}
            </div>
          )}
          {role && (
            <p className={styles.roleNote}>
              The Medici Archive classes {roles.find(([r]) => r === role)?.[1]} of these people
              under {role.toLowerCase()}. Only the {classified} people matched to the archive
              carry a calling at all, so this narrows the index rather than sorting all of it.
            </p>
          )}
        </header>

        <ol className={styles.list}>
          {cited.map(([id, rec]) => (
            <Entry key={id} id={id} rec={rec}>
              {renderDetail(rec, id)}
            </Entry>
          ))}
        </ol>

        {uncited.length > 0 && query === '' && (
          <section className={styles.uncited}>
            <h2 className={styles.uncitedTitle}>Recorded but not yet cited</h2>
            <p className={styles.uncitedNote}>
              These have authority records but are not referenced by any published letter —
              either they appear only in letters still to be transcribed, or the reference is
              still to be encoded.
            </p>
            <ol className={styles.list}>
              {uncited.map(([id, rec]) => (
                <Entry key={id} id={id} rec={rec}>
                  {renderDetail(rec, id)}
                </Entry>
              ))}
            </ol>
          </section>
        )}
      </main>
    </Layout>
  );
}
