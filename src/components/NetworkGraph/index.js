import React, {useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const W = 900;
const H = 640;

/**
 * A small deterministic force layout.
 *
 * Nodes start on a circle in a fixed order and are relaxed for a fixed number
 * of steps, so the same data always draws the same picture — a graph that
 * rearranges itself on every reload is no use to a reader citing it.
 */
function layout(nodes, edges) {
  const n = nodes.length;
  const index = new Map(nodes.map((d, i) => [d.id, i]));
  const pos = nodes.map((d, i) => {
    const a = (2 * Math.PI * i) / n;
    return {x: W / 2 + Math.cos(a) * 260, y: H / 2 + Math.sin(a) * 240};
  });

  const links = edges
    .map((e) => ({s: index.get(e.a), t: index.get(e.b), w: e.shared}))
    .filter((l) => l.s !== undefined && l.t !== undefined);

  const maxW = Math.max(1, ...links.map((l) => l.w));

  for (let step = 0; step < 320; step++) {
    const cool = 1 - step / 320;
    const fx = new Float64Array(n);
    const fy = new Float64Array(n);

    // every pair pushes apart, so labels have room
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let dx = pos[i].x - pos[j].x;
        let dy = pos[i].y - pos[j].y;
        let d2 = dx * dx + dy * dy || 0.01;
        const f = 14000 / d2;
        const d = Math.sqrt(d2);
        fx[i] += (dx / d) * f; fy[i] += (dy / d) * f;
        fx[j] -= (dx / d) * f; fy[j] -= (dy / d) * f;
      }
    }
    // shared documents pull together, the more the tighter
    for (const l of links) {
      const dx = pos[l.t].x - pos[l.s].x;
      const dy = pos[l.t].y - pos[l.s].y;
      const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
      const f = (d - 90) * 0.012 * (0.25 + l.w / maxW);
      fx[l.s] += (dx / d) * f; fy[l.s] += (dy / d) * f;
      fx[l.t] -= (dx / d) * f; fy[l.t] -= (dy / d) * f;
    }
    for (let i = 0; i < n; i++) {
      // a gentle pull to the middle keeps stragglers on the canvas
      fx[i] += (W / 2 - pos[i].x) * 0.004;
      fy[i] += (H / 2 - pos[i].y) * 0.004;
      pos[i].x = Math.max(40, Math.min(W - 40, pos[i].x + Math.max(-18, Math.min(18, fx[i])) * cool));
      pos[i].y = Math.max(28, Math.min(H - 28, pos[i].y + Math.max(-18, Math.min(18, fy[i])) * cool));
    }
  }
  return {pos, index, maxW};
}

/** "Medici" alone names five people here; give the forename too. */
function label(d) {
  const s = d.sortName.replace(/\(.*?\)/g, '').replace(/\s+/g, ' ').trim();
  return s.length > 22 ? s.slice(0, 21) + '…' : s;
}

export default function NetworkGraph({nodes, edges, limit = 40}) {
  const [focus, setFocus] = useState(null);

  const {shown, links, pos, index, maxW} = useMemo(() => {
    const shown = nodes.slice(0, limit);
    const keep = new Set(shown.map((d) => d.id));
    const links = edges.filter((e) => keep.has(e.a) && keep.has(e.b));
    const l = layout(shown, links);
    return {shown, links, ...l};
  }, [nodes, edges, limit]);

  const maxDeg = Math.max(...shown.map((d) => d.degree), 1);
  const near = focus
    ? new Set(links.filter((e) => e.a === focus || e.b === focus).flatMap((e) => [e.a, e.b]))
    : null;

  return (
    <figure className={styles.figure}>
      <div className={styles.scroll}>
        <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} role="img"
             aria-label="People connected by shared documents in the Medici Archive">
          <g>
            {links.map((e) => {
              const a = pos[index.get(e.a)];
              const b = pos[index.get(e.b)];
              const dim = near && !(e.a === focus || e.b === focus);
              return (
                <line
                  key={`${e.a}|${e.b}`}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  className={e.direct ? styles.linkDirect : styles.link}
                  strokeWidth={0.4 + (e.shared / maxW) * 3}
                  opacity={dim ? 0.06 : undefined}
                />
              );
            })}
          </g>
          <g>
            {shown.map((d, i) => {
              const r = 3 + Math.sqrt(d.degree / maxDeg) * 9;
              const dim = near && !near.has(d.id);
              return (
                <g key={d.id} transform={`translate(${pos[i].x},${pos[i].y})`}
                   className={styles.node} opacity={dim ? 0.15 : 1}
                   onMouseEnter={() => setFocus(d.id)} onMouseLeave={() => setFocus(null)}>
                  <circle r={r} className={styles.dot} />
                  <text x={r + 3} y={3.5} className={styles.label}>
                    {label(d)}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      <figcaption className={styles.caption}>
        The {shown.length} most connected people, drawn from the Medici Archive's document index.
        A line means the same document names both; a heavier line means more documents. Solid
        lines are letters one wrote to the other. Hover a name to isolate its ties.
        {focus && (
          <>
            {' '}
            <Link to={`/people#${focus}`} className={styles.focusLink}>
              open {shown.find((d) => d.id === focus)?.name} in the index
            </Link>
          </>
        )}
      </figcaption>
    </figure>
  );
}
