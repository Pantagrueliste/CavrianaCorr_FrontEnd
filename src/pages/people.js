import React from 'react';
import EntityIndex from '@site/src/components/EntityIndex';
import styles from '@site/src/components/EntityIndex/styles.module.css';

function detail(rec) {
  const life = [rec.birth, rec.death].filter(Boolean).join('–');
  const facts = [rec.role, life].filter(Boolean).join(' · ');
  return (
    <>
      {(facts || rec.aliases?.length > 0) && (
        <p className={styles.detail}>
          {facts}
          {rec.aliases?.length > 0 && (
            <>
              {facts && ' · '}
              also called {rec.aliases.join(', ')}
            </>
          )}
        </p>
      )}
      {rec.note && <p className={styles.detail}>{rec.note}</p>}
      {rec.viaf && (
        <p className={styles.authority}>
          <a href={`https://viaf.org/viaf/${rec.viaf}`} rel="noopener noreferrer">
            VIAF {rec.viaf}
          </a>
        </p>
      )}
    </>
  );
}

export default function People() {
  return (
    <EntityIndex
      kind="person"
      title="People"
      description="Everyone named in the correspondence, with the letters that mention them. Cavriana wrote to Medicean secretaries and the Duke of Mantua, and reported on the French court under two pseudonyms of his own."
      renderDetail={detail}
    />
  );
}
