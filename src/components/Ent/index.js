import React, { useId } from "react";
import Link from "@docusaurus/Link";
import authorities from "@site/src/data/authorities.json";
import { useLetterDate, officesOn } from "@site/src/components/LetterDate";
import styles from "./styles.module.css";

const { entities } = authorities;

// Describe a man by what he held when this letter names him, not by what he
// is remembered for: Alamanni is inviato in 1570 and ambasciatore only in 1572.
function personDetail(rec, letterDate) {
  const held = officesOn(rec, letterDate)
    .map((o) => o.label)
    .slice(0, 2)
    .join(" · ");
  return [held || rec.role, rec.note].filter(Boolean);
}

/**
 * Born and died, for the card. Identifiers belong in the index, not here.
 *
 * The authority file records whatever precision its source gives — Alamanni is
 * 1536-03-13 after the Dizionario Biografico — but a card beside a sentence
 * wants the year alone.
 */
function life(rec) {
  const year = (d) => (d ? String(d).slice(0, 4) : "");
  return [year(rec.birth), year(rec.death)].filter(Boolean).join("–");
}

function placeDetail(rec) {
  const coords = rec.lat && rec.lon ? `${rec.lat}, ${rec.lon}` : "";
  return [rec.country, coords, rec.note].filter(Boolean);
}

/**
 * A person or place in the transcription, resolved against the authority
 * files. Renders the manuscript's own wording; the card carries the
 * authoritative name, the dates, and what the person held at the time.
 * Identifiers are deliberately absent: a catalogue number is of no use to
 * someone reading a sentence, and the indexes carry them.
 */
export default function Ent({ k, id, children }) {
  const letterDate = useLetterDate();
  const rec = entities[id];
  if (!rec) {
    return <>{children}</>;
  }

  const isPerson = k === "p";
  const isPeople = k === "e";
  const detail = isPerson ? personDetail(rec, letterDate) : placeDetail(rec);
  const lead = isPeople ? "the people of " : "";
  const index = isPerson ? "/people" : "/places";
  const dates = isPerson ? life(rec) : "";

  // The card below already says all of this. A title attribute would make the
  // browser draw its own plain tooltip beside it — the same words a second
  // time, without the portrait. The card is bound to the name for assistive
  // technology instead, which is what the title was doing that mattered.
  const cardId = useId();

  const label = rec.author ? (
    <span className={styles.author} aria-describedby={cardId}>
      {children}
    </span>
  ) : null;

  return (
    <span className={styles.ent}>
      {label}
      {!label && (
        <Link
          to={`${index}#${id}`}
          className={isPeople ? styles.people : isPerson ? styles.person : styles.place}
          aria-describedby={cardId}
        >
          {children}
        </Link>
      )}
      <span className={styles.card} id={cardId} role="note">
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
        <span className={styles.cardBody}>
          <span className={styles.cardName}>
            {lead}
            {rec.name}
          </span>
          {dates && <span className={styles.cardDates}>{dates}</span>}
          {detail.length > 0 && (
            <span className={styles.cardDetail}>{detail.join(" · ")}</span>
          )}
        </span>
      </span>
    </span>
  );
}
