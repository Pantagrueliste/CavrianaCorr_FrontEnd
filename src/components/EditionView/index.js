import React, {useCallback, useEffect, useState} from 'react';
import {createStorageSlot} from '@docusaurus/theme-common';
import styles from './styles.module.css';

/**
 * Reader-level settings for how the edited text is presented.
 *
 * The <html> attribute is the source of truth: a script injected before
 * hydration (plugins/edition-view.js) applies the stored value, so the page
 * never flashes the wrong reading. React state starts as null and is read
 * from the DOM in an effect, which is what avoids a hydration mismatch.
 */
/* The ciphertext used to have a switch of its own. It no longer needs one:
   the diplomatic view shows the digits, with each reading on hover, and the
   reading view shows the words. Two controls for the same thing could
   contradict each other. */
export const SETTINGS = [
  {
    key: 'cav.view',
    attr: 'data-cav-view',
    on: 'diplomatic',
    off: 'reading',
    label: 'Diplomatic text',
    hint: "Show the manuscript's own abbreviations instead of their expansions",
  },
];

// Safe at module scope: on the server these return a stub whose methods
// throw, so they are only ever touched inside effects and handlers.
const SLOTS = Object.fromEntries(SETTINGS.map((s) => [s.key, createStorageSlot(s.key)]));

function useSetting({key, attr, on, off}) {
  const [checked, setChecked] = useState(null);

  useEffect(() => {
    setChecked(document.documentElement.getAttribute(attr) === on);
  }, [attr, on]);

  // Cross-tab sync only. Re-applying the stored value here would clobber a
  // ?docusaurus-data-* override from the URL.
  useEffect(
    () =>
      SLOTS[key].listen((event) => {
        const value = event.newValue ?? off;
        document.documentElement.setAttribute(attr, value);
        setChecked(value === on);
      }),
    [key, attr, on, off],
  );

  const toggle = useCallback(
    (next) => {
      const value = next ? on : off;
      document.documentElement.setAttribute(attr, value);
      setChecked(next);
      SLOTS[key].set(value);
    },
    [key, attr, on, off],
  );

  return [checked ?? false, toggle];
}

function Setting({setting}) {
  const [checked, toggle] = useSetting(setting);
  return (
    <label className={styles.item} title={setting.hint}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => toggle(event.target.checked)}
      />
      <span>{setting.label}</span>
    </label>
  );
}

export default function EditionView() {
  const settings = SETTINGS;
  return (
    <div className={styles.bar}>
      <span className={styles.legend}>Reading</span>
      {settings.map((setting) => (
        <Setting key={setting.key} setting={setting} />
      ))}
    </div>
  );
}
