// src/components/CavrianaHeatmap.jsx
import React, {useEffect, useState} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import CalHeatmap from 'cal-heatmap';

const CavrianaHeatmap = () => (
  <BrowserOnly fallback={<div>Loading heat-map…</div>}>
    {() => <HeatmapContent />}
  </BrowserOnly>
);

const HeatmapContent = () => {
  const [err , setErr ] = useState(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    const cal = new CalHeatmap();

    /* ── Cavriana word-counts (UNIX seconds) ─────────────────────────── */
    const raw = {
      "-12677644725": 544,  "-12675743925": 786,  "-12675225525": 780,
      "-12675139125": 494,  "-12673151925": 488,  "-12672115125": 406,
      "-12670041525": 490,  "-12668227125": 538,  "-12664339125": 854,
      "-12654143925": 1238, "-12625631925": 500,  "-12623731125": 648,
      "-12610771125": 1876, "-12605932725": 2314, "-12604723125": 1738,
      "-12603081525": 3314, "-12601785525": 5380, "-12600921525": 3826,
      "-12600662325": 436,  "-12599020725": 912,  "-12596428725": 864,
      "-12595823925": 278,  "-12590121525": 3903, "-12581999925": 328,
      "-12574396725": 326
    };

    /* seconds → milliseconds → array [{date,value}] */
    const rows = Object.entries(raw).map(([s, v]) => ({
      date : Number(s) * 1000,
      value: v,
    }));

    cal.paint({
      itemSelector : '#cav-calendar',
      legend       : {itemSelector: '#cav-legend', position: 'bottom'},

      date   : {start: new Date(1568, 0, 1)},
      range  : 4,
      domain : {type: 'year', gutter: 10},
      subDomain: {type: 'day', width: 11, height: 11, gutter: 2, radius: 2},

      data  : {type: 'json', source: rows, x: 'date', y: 'value'},

      scale : {
        color: {type: 'quantize', scheme: 'Spectral', domain: [278, 5380]},
      },

      tooltip: {
        enabled: true,
        text: (v, t) =>
          v
            ? `${new Date(t).toLocaleDateString('en-US',
               {year:'numeric', month:'long', day:'numeric'})}: ${v} words`
            : 'No letters on this day',
      },
    })
    .then(() => setBusy(false))
    .catch(e => { setErr(e.message); setBusy(false); });

    return () => cal.destroy();
  }, []);

  if (err) return <p style={{color:'red'}}>Heat-map error: {err}</p>;

  return (
    <div className="cavriana-heatmap">
      <h2>Cavriana Letter-Writing Activity</h2>
      {busy && <p>Loading…</p>}

      {/* Cal-Heatmap draws into these divs */}
      <div id="cav-calendar" style={{minHeight: 150}} />
      <div id="cav-legend"   style={{marginTop: 6}} />
    </div>
  );
};

export default CavrianaHeatmap;