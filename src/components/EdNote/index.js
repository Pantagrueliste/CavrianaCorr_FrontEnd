import React, {useEffect, useRef, useState} from 'react';
import styles from './styles.module.css';

/**
 * An editorial note, attached to the passage it annotates.
 *
 * The transform emits the marker immediately after the annotated element, so
 * the note binds to its own previous sibling: hovering the words themselves —
 * not a footnote number somewhere else — brings up the remark. The passage
 * carries a faint underline so a reader can see there is something to hover.
 *
 * Where the note is about the letter rather than a passage, it stands alone.
 */
export default function EdNote({note, standalone = false}) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (standalone || !ref.current) return undefined;
    const passage = ref.current.previousElementSibling;
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
  }, [standalone]);

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
