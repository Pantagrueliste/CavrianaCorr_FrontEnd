import React from 'react';
import EntityIndex from '@site/src/components/EntityIndex';
import PlaceMap from '@site/src/components/PlaceMap';
import styles from '@site/src/components/EntityIndex/styles.module.css';

function detail(rec) {
  const facts = [rec.country, rec.historical?.length > 0 && `called ${rec.historical.join(', ')}`]
    .filter(Boolean)
    .join(' · ');
  return (
    <>
      {facts && <p className={styles.detail}>{facts}</p>}
      {rec.note && <p className={styles.detail}>{rec.note}</p>}
      {rec.tgn && (
        <p className={styles.authority}>
          <a href={`http://vocab.getty.edu/tgn/${rec.tgn}`} rel="noopener noreferrer">
            Getty TGN {rec.tgn}
          </a>
        </p>
      )}
    </>
  );
}

export default function Places() {
  return (
    <EntityIndex
      kind="place"
      title="Places"
      description="Every place named in the correspondence, under the spellings Cavriana used and their modern forms, with the letters that mention them."
      renderDetail={detail}>
      <PlaceMap />
    </EntityIndex>
  );
}
