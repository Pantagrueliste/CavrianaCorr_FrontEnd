import React, {useEffect, useRef, useState} from 'react';
import styles from './styles.module.css';

/**
 * An editorial note, attached to the passage it annotates.
 *
 * Hovering the words themselves — not a footnote number somewhere else —
 * brings up the remark, and the passage carries a faint underline so a reader
 * can see there is something to hover.
 *
 * The passage is found three ways, so that any note the editor writes behaves
 * the same. `for` names it outright, from the note's @target, and does not
 * depend on where the note sits. Otherwise the marker is emitted straight
 * after the passage, and binds to its own previous sibling. Where that
 * sibling is bare text — a note written after a few plain words, with no
 * element between — there is nothing to attach a listener to, so the text is
 * wrapped here and the wrapper used instead.
 *
 * Where the note is about the letter rather than a passage, it stands alone.
 */

/** The element the note annotates, wrapping a bare text passage if need be. */
function findPassage(marker, forId) {
  if (forId) return document.getElementById(forId);
  const prev = marker.previousSibling;
  if (!prev) return null;
  if (prev.nodeType === Node.ELEMENT_NODE) return prev;
  if (prev.nodeType === Node.TEXT_NODE && prev.textContent.trim()) {
    const span = document.createElement('span');
    prev.parentNode.insertBefore(span, prev);
    span.appendChild(prev);
    return span;
  }
  return null;
}

export default function EdNote({note, standalone = false, for: forId}) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (standalone || !ref.current) return undefined;
    const passage = findPassage(ref.current, forId);
    if (!passage) return undefined;

    const show = () => setOpen(true);
    const hide = () => setOpen(false);
    passage.classList.add(styles.annotated);
    passage.addEventListener('mouseenter', show);
    passage.addEventListener('mouseleave', hide);
    passage.addEventListener('focusin', show);
    passage.addEventListener('focusout', hide);
    return () => {
      passage.classList.remove(styles.annotated);
      passage.removeEventListener('mouseenter', show);
      passage.removeEventListener('mouseleave', hide);
      passage.removeEventListener('focusin', show);
      passage.removeEventListener('focusout', hide);
    };
  }, [standalone, forId]);

  if (standalone) {
    return (
      <aside className={styles.standalone}>
        <span className={styles.label}>Editorial note</span>
        {note}
      </aside>
    );
  }

  return (
    <span
      className={styles.wrap}
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className={styles.marker}
        aria-expanded={open}
        aria-label="Editorial note"
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}>
        ✻
      </button>
      <span className={open ? styles.cardOpen : styles.card} role="note">
        {note}
      </span>
    </span>
  );
}
