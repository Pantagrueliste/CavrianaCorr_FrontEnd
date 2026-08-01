import React from "react";
import Link from "@docusaurus/Link";
import authorities from "@site/src/data/authorities.json";
import styles from "./styles.module.css";

const { entities } = authorities;

function personDetail(rec) {
  const life = [rec.birth, rec.death].filter(Boolean).join("–");
  return [rec.role, life, rec.note].filter(Boolean);
}

function placeDetail(rec) {
  const coords = rec.lat && rec.lon ? `${rec.lat}, ${rec.lon}` : "";
  return [rec.country, coords, rec.note].filter(Boolean);
}

/**
 * A person or place in the transcription, resolved against the authority
 * files. Renders the manuscript's own wording; the card carries the
 * authoritative name and identifiers.
 */
export default function Ent({ k, id, children }) {
  const rec = entities[id];
  if (!rec) {
    return <>{children}</>;
  }

  const isPerson = k === "p";
  const detail = isPerson ? personDetail(rec) : placeDetail(rec);
  const index = isPerson ? "/people" : "/places";
  const authority = isPerson
    ? [
        rec.wikidata && `Wikidata ${rec.wikidata}`,
        rec.viaf && `VIAF ${rec.viaf}`,
      ]
        .filter(Boolean)
        .join(" · ")
    : [
        rec.wikidata && `Wikidata ${rec.wikidata}`,
        rec.tgn && `Getty TGN ${rec.tgn}`,
      ]
        .filter(Boolean)
        .join(" · ");

  const label = rec.author ? (
    <span className={styles.author} title={[rec.name, ...detail].join(" · ")}>
      {children}
    </span>
  ) : null;

  return (
    <span className={styles.ent}>
      {label}
      {!label && (
        <Link
          to={`${index}#${id}`}
          className={isPerson ? styles.person : styles.place}
          title={[rec.name, ...detail].join(" · ")}
        >
          {children}
        </Link>
      )}
      <span className={styles.card} role="note">
        {rec.image && (
          <img
            className={styles.cardPortrait}
            src={`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
              rec.image,
            )}?width=120`}
            alt=""
            loading="lazy"
          />
        )}
        <span className={styles.cardName}>{rec.name}</span>
        {detail.length > 0 && (
          <span className={styles.cardDetail}>{detail.join(" · ")}</span>
        )}
        {authority && <span className={styles.cardAuthority}>{authority}</span>}
      </span>
    </span>
  );
}
