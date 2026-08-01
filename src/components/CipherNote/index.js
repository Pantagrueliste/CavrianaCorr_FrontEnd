import React from 'react';
import styles from './styles.module.css';

/**
 * States how much of an enciphered letter has been read. Cavriana wrote in
 * numeric cipher; some passages were solved by a contemporary hand, others
 * by the editor, and one letter remains unbroken.
 */
export default function CipherNote({total, solved}) {
  const t = Number(total) || 0;
  const s = Math.min(Number(solved) || 0, t);
  const unsolved = t - s;

  return (
    <p className={styles.note}>
      <span className={styles.label}>Cipher</span>
      {t === 1 ? 'One enciphered passage' : `${t} enciphered passages`}
      {s === 0
        ? ' in this letter; none has been deciphered.'
        : unsolved === 0
          ? t === 1
            ? ', deciphered.'
            : ', all deciphered.'
          : `, of which ${s} deciphered and ${unsolved} still unread.`}
    </p>
  );
}
