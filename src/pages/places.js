import React from 'react';
import EntityIndex from '@site/src/components/EntityIndex';
import PlaceMap from '@site/src/components/PlaceMap';
import styles from '@site/src/components/EntityIndex/styles.module.css';

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** "its people named 25 times in 15 letters" — kept apart from naming the place. */
function peopleLine(rec) {
  return `its people named ${plural(rec.asPeopleTotal, 'time')} in ${plural(rec.asPeople.length, 'letter')}`;
}

function detail(rec) {
  const facts = [rec.country, rec.historical?.length > 0 && `called ${rec.historical.join(', ')}`]
    .filter(Boolean)
    .join(' · ');
  return (
    <>
      {facts && <p className={styles.detail}>{facts}</p>}
      {rec.asPeopleTotal > 0 && (
        <p className={styles.detail}>{peopleLine(rec)}</p>
      )}
      {rec.note && <p className={styles.detail}>{rec.note}</p>}
      {(rec.wikidata || rec.tgn || rec.geonames) && (
        <p className={styles.authority}>
          {rec.wikidata && (
            <a href={`https://www.wikidata.org/wiki/${rec.wikidata}`} rel="noopener noreferrer">
              Wikidata {rec.wikidata}
            </a>
          )}
          {rec.tgn && (
            <>
              {rec.wikidata && ' · '}
              <a href={`https://vocab.getty.edu/page/tgn/${rec.tgn}`} rel="noopener noreferrer">
                Getty TGN {rec.tgn}
              </a>
            </>
          )}
          {rec.geonames && (
            <>
              {(rec.wikidata || rec.tgn) && ' · '}
              <a href={`https://www.geonames.org/${rec.geonames}`} rel="noopener noreferrer">
                GeoNames {rec.geonames}
              </a>
            </>
          )}
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
