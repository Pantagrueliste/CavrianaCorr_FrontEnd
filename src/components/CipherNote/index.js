import React from 'react';
import styles from './styles.module.css';

/**
 * States how much of an enciphered letter can be read, and on whose authority.
 *
 * Cavriana wrote in numeric cipher. Some groups were solved between the lines
 * at the time by a clerk of the Medici chancery; others have been solved by
 * the editor; some are still shut. Those are three different claims on a
 * reader's trust, and the note keeps them apart — "deciphered" alone would let
 * a modern conjecture pass for a contemporary reading.
 */
export default function CipherNote({total, chancery = 0, editor = 0}) {
  const t = Number(total) || 0;
  const c = Number(chancery) || 0;
  const e = Number(editor) || 0;
  const shut = Math.max(t - c - e, 0);
  if (t === 0) return null;

  const groups = t === 1 ? 'one enciphered group' : `${t} enciphered groups`;
  const parts = [];
  if (c) parts.push(`${c} read between the lines at the time`);
  if (e) parts.push(`${e} by the editor`);
  if (shut) parts.push(`${shut} still shut`);

  return (
    <p className={styles.note}>
      <span className={styles.label}>Cipher</span>
      <span className={styles.body}>
        {`This letter has ${groups}`}
        {parts.length > 0 ? `: ${parts.join(', ')}.` : '.'}
      </span>
      <span
        className={styles.meter}
        role="img"
        aria-label={`${c} of ${t} groups read at the time, ${e} by the editor, ${shut} unread`}>
        {c > 0 && <span className={styles.chancery} style={{flexGrow: c}} />}
        {e > 0 && <span className={styles.editor} style={{flexGrow: e}} />}
        {shut > 0 && <span className={styles.shut} style={{flexGrow: shut}} />}
      </span>
    </p>
  );
}
