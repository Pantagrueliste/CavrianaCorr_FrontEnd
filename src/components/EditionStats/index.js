import React from 'react';
import authorities from '@site/src/data/authorities.json';
import styles from './styles.module.css';

const {stats} = authorities;

const n = (v) => (v ?? 0).toLocaleString('en-GB');

/**
 * What the edition amounts to, at this build.
 *
 * Counted from the TEI every time the site is rebuilt, so the figures cannot
 * drift from the files the way a sentence typed into the introduction does.
 * The word count is the reading text alone — abbreviations counted once by
 * their expansion, ciphertext left out, editorial matter left out — so it is
 * the length of the correspondence and not of its markup.
 */
export default function EditionStats() {
  if (!stats) return null;
  const {catalogued, transcribed, words, cipherGroups, firstYear, lastYear} = stats;
  const figures = [
    {value: n(catalogued), label: 'letters catalogued', note: `${firstYear}–${lastYear}`},
    {value: n(transcribed), label: 'transcribed so far'},
    {value: n(words), label: 'words of transcription'},
    {value: n(cipherGroups), label: 'passages in cipher'},
  ];

  return (
    <div className={styles.wrap}>
      <dl className={styles.figures}>
        {figures.map((f) => (
          <div key={f.label} className={styles.figure}>
            <dt className={styles.value}>{f.value}</dt>
            <dd className={styles.label}>
              {f.label}
              {f.note && <span className={styles.note}>{f.note}</span>}
            </dd>
          </div>
        ))}
      </dl>
      <p className={styles.caption}>
        Counted from the encoded text at every build. The word count is the transcription
        itself: an abbreviation counts once, by its expansion, and ciphertext and editorial
        matter are left out.
      </p>
    </div>
  );
}
