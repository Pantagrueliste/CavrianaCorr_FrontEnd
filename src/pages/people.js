import React from "react";
import EntityIndex from "@site/src/components/EntityIndex";
import GroupList from "@site/src/components/GroupList";
import styles from "@site/src/components/EntityIndex/styles.module.css";

const commons = (file, width) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;

const n = (x, one, many) => `${x} ${x === 1 ? one : many}`;

/**
 * How a person figures in the Medici Archive at large, which is often not how
 * they figure here. Some of these people wrote and received; others are only
 * ever written about, and saying so is more use than a bare total.
 */
function archiveLine(a) {
  const wrote = a.sent + a.received;
  const parts = [];
  if (a.sent) parts.push(`${a.sent} sent`);
  if (a.received) parts.push(`${a.received} received`);
  const head = `${n(a.documents, "document", "documents")} in the Medici Archive`;
  return wrote > 0
    ? `${head} — ${parts.join(", ")}`
    : `${head}, never as sender or recipient`;
}

function detail(rec) {
  const life = [rec.birth, rec.death].filter(Boolean).join("–");
  const facts = [rec.role, life].filter(Boolean).join(" · ");
  return (
    <>
      {rec.image && (
        <a
          href={`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(rec.image)}`}
          rel="noopener noreferrer"
          className={styles.portraitLink}
        >
          <img
            className={styles.portrait}
            src={commons(rec.image, 160)}
            srcSet={`${commons(rec.image, 320)} 2x`}
            alt=""
            loading="lazy"
            width={80}
          />
        </a>
      )}
      {(facts || rec.aliases?.length > 0 || rec.probableName) && (
        <p className={styles.detail}>
          {facts}
          {rec.aliases?.length > 0 && (
            <>
              {facts && " · "}
              also called {rec.aliases.join(", ")}
            </>
          )}
          {/* A proposed identification is not an established name. The letters
              give this man a forename and an office and nothing else. */}
          {rec.probableName && (
            <>
              {(facts || rec.aliases?.length > 0) && " · "}
              probably {rec.probableName}
            </>
          )}
        </p>
      )}
      {rec.offices?.length > 0 && (
        <p className={styles.offices}>
          {rec.offices.map((o) => o.label).join(" · ")}
        </p>
      )}
      {rec.note && <p className={styles.detail}>{rec.note}</p>}
      {rec.archive && (
        <p className={styles.archive}>
          <a
            href={`https://mia.medici.org/Mia/index.html#/mia/people/${rec.map}`}
            rel="noopener noreferrer"
          >
            {archiveLine(rec.archive)}
          </a>
        </p>
      )}
      {(rec.wikidata || rec.map || rec.viaf) && (
        <p className={styles.authority}>
          {rec.wikidata && (
            <a
              href={`https://www.wikidata.org/wiki/${rec.wikidata}`}
              rel="noopener noreferrer"
            >
              Wikidata {rec.wikidata}
            </a>
          )}
          {rec.map && (
            <>
              {rec.wikidata && " · "}
              <a
                href={`https://mia.medici.org/Mia/index.html#/mia/people/${rec.map}`}
                rel="noopener noreferrer"
              >
                Medici Archive {rec.map}
              </a>
            </>
          )}
          {rec.viaf && (
            <>
              {(rec.wikidata || rec.map) && " · "}
              <a
                href={`https://viaf.org/viaf/${rec.viaf}`}
                rel="noopener noreferrer"
              >
                VIAF {rec.viaf}
              </a>
            </>
          )}
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
      description="Everyone named in the correspondence, with the letters that mention them. Cavriana himself is not listed: he wrote these letters and signs almost all of them, under his own name and under two pseudonyms."
      renderDetail={detail}
      after={<GroupList />}
    />
  );
}
