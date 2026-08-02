import React, {createContext, useContext} from 'react';

/**
 * The date of the letter being read, in the Julian reckoning the letters use.
 *
 * Entity cards consult it so that a man is described by the office he actually
 * held when the letter names him, rather than by the one he is remembered for.
 */
const LetterDateContext = createContext('');

export function LetterDateProvider({date, children}) {
  return <LetterDateContext.Provider value={date || ''}>{children}</LetterDateContext.Provider>;
}

export function useLetterDate() {
  return useContext(LetterDateContext);
}

/**
 * Pick the offices a person held on a given date. Offices with no dates are
 * held throughout and only used when nothing dated applies.
 */
export function officesOn(rec, iso) {
  const year = Number((iso || '').slice(0, 4));
  const all = [
    {label: rec.role, from: rec.roleFrom, to: rec.roleTo},
    ...(rec.offices || []),
  ].filter((o) => o.label);

  if (!year) {
    return all;
  }

  const covers = (o) => {
    const from = Number(o.from) || null;
    const to = Number(o.to) || null;
    if (from && year < from) return false;
    if (to && year > to) return false;
    return Boolean(from || to);
  };

  const dated = all.filter(covers);
  return dated.length > 0 ? dated : all.filter((o) => !o.from && !o.to);
}
