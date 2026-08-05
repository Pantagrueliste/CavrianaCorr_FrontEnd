import React from 'react';
import Link from '@docusaurus/Link';
import authorities from '@site/src/data/authorities.json';
import styles from './styles.module.css';
import { longDate } from '@site/src/utils/dates';

const {events = []} = authorities;

const days = (a, b) => Math.round((Date.parse(a) - Date.parse(b)) / 86400000);

function phrase(letterDate, ev) {
  const start = ev.when || ev.from;
  const end = ev.to || ev.when || ev.from;
  if (ev.from && ev.to && letterDate >= ev.from && letterDate <= ev.to) {
    return 'under way';
  }
  const n = days(letterDate, letterDate > end ? end : start);
  if (n === 0) return 'the same day';
  const unit = Math.abs(n) === 1 ? 'day' : 'days';
  return `${Math.abs(n)} ${unit} ${n > 0 ? 'after' : 'before'}`;
}

/**
 * What was happening when this letter was written. Events are matched on date
 * alone: the strip says when the letter falls relative to an event, and makes
 * no claim that the letter discusses it.
 */
export default function LetterContext({date}) {
  if (!date) return null;

  const near = events
    .map((ev) => {
      const start = ev.when || ev.from;
      const end = ev.to || ev.when || ev.from;
      if (!start) return null;
      const within = date >= start && date <= end;
      const gap = within ? 0 : Math.min(Math.abs(days(date, start)), Math.abs(days(date, end)));
      return gap <= 45 ? {ev, gap, within} : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.gap - b.gap);

  if (near.length === 0) return null;

  return (
    <aside className={styles.strip} aria-label="Events around this letter">
      <span className={styles.label}>Written</span>
      <ul className={styles.list}>
        {near.map(({ev}) => (
          <li key={ev.id}>
            <span className={styles.offset}>{phrase(date, ev)}</span>{' '}
            <Link to={`/events#${ev.id}`}>{ev.label}</Link>
            <span className={styles.when}> ({longDate(ev.when || ev.from)})</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
