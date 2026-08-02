import React from "react";
import Link from "@docusaurus/Link";
import authorities from "@site/src/data/authorities.json";
import { useLetterDate, officesOn } from "@site/src/components/LetterDate";
import styles from "./styles.module.css";

const { entities } = authorities;

// Describe a man by what he held when this letter names him, not by what he
// is remembered for: Alamanni is inviato in 1570 and ambasciatore only in 1572.
function personDetail(rec, letterDate) {
  const life = [rec.birth, rec.death].filter(Boolean).join("–");
  const held = officesOn(rec, letterDate)
    .map((o) => o.label)
    .slice(0, 2)
    .join(" · ");
  return [held || rec.role, life, rec.note].filter(Boolean);
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
  const letterDate = useLetterDate();
  const rec = entities[id];
  if (!rec) {
    return <>{children}</>;
  }

  const isPerson = k === "p";
  const detail = isPerson ? personDetail(rec, letterDate) : placeDetail(rec);
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
