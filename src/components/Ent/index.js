import React from 'react';
import Link from '@docusaurus/Link';
import authorities from '@site/src/data/authorities.json';
import styles from './styles.module.css';

const {entities} = authorities;

function personDetail(rec) {
  const life = [rec.birth, rec.death].filter(Boolean).join('–');
  return [rec.role, life, rec.note].filter(Boolean);
}

function placeDetail(rec) {
  const coords = rec.lat && rec.lon ? `${rec.lat}, ${rec.lon}` : '';
  return [rec.country, coords, rec.note].filter(Boolean);
}

/**
 * A person or place in the transcription, resolved against the authority
 * files. Renders the manuscript's own wording; the card carries the
 * authoritative name and identifiers.
 */
export default function Ent({k, id, children}) {
  const rec = entities[id];
  if (!rec) {
    return <>{children}</>;
  }

  const isPerson = k === 'p';
  const detail = isPerson ? personDetail(rec) : placeDetail(rec);
  const index = isPerson ? '/people' : '/places';
  const authority = isPerson
    ? rec.viaf && {label: `VIAF ${rec.viaf}`, href: `https://viaf.org/viaf/${rec.viaf}`}
    : rec.tgn && {label: `Getty TGN ${rec.tgn}`, href: `http://vocab.getty.edu/tgn/${rec.tgn}`};

  return (
    <span className={styles.ent}>
      <Link
        to={`${index}#${id}`}
        className={isPerson ? styles.person : styles.place}
        title={[rec.name, ...detail].join(' · ')}>
        {children}
      </Link>
      <span className={styles.card} role="note">
        <span className={styles.cardName}>{rec.name}</span>
        {detail.length > 0 && <span className={styles.cardDetail}>{detail.join(' · ')}</span>}
        {authority && (
          <span className={styles.cardAuthority}>{authority.label}</span>
        )}
      </span>
    </span>
  );
}
