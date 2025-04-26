import React, { useEffect, useRef, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const CavrianaHeatmap = () => {
  return (
    <BrowserOnly fallback={<div>Loading heatmap...</div>}>
      {() => <HeatmapContent />}
    </BrowserOnly>
  );
};

const HeatmapContent = () => {
  const calendarEl = useRef(null);
  const legendEl = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initHeatmap = async () => {
      try {
        setLoading(true);
        
        // Try to use the global CalHeatmap first (from CDN)
        let CalHeatmap;
        if (typeof window.CalHeatmap !== 'undefined') {
          CalHeatmap = window.CalHeatmap;
          console.log("Using global CalHeatmap");
        } else {
          // Fallback to NPM package
          try {
            const module = await import('cal-heatmap');
            CalHeatmap = module.default;
            console.log("Using NPM CalHeatmap");
          } catch (e) {
            throw new Error(`Failed to load cal-heatmap: ${e.message}`);
          }
        }
        
        const data = {"-12677644725": 544, "-12675743925": 786, "-12675225525": 780, "-12675139125": 494, "-12673151925": 488, "-12672115125": 406, "-12670041525": 490, "-12668227125": 538, "-12664339125": 854, "-12654143925": 1238, "-12625631925": 500, "-12623731125": 648, "-12610771125": 1876, "-12605932725": 2314, "-12604723125": 1738, "-12603081525": 3314, "-12601785525": 5380, "-12600921525": 3826, "-12600662325": 436, "-12599020725": 912, "-12596428725": 864, "-12595823925": 278, "-12590121525": 3903, "-12581999925": 328, "-12574396725": 326};
        
        const cal = new CalHeatmap();
        
        // Create legend element
        const legend = document.createElement('div');
        legend.className = 'ch-legend';
        if (legendEl.current) {
          legendEl.current.appendChild(legend);
        }
        
        cal.init({
          itemSelector: calendarEl.current,
          legendElement: legend,
          domain: {
            type: 'year',
            gutter: 10,
            label: { text: 'Year', textAlign: 'start', position: 'top' },
          },
          subDomain: { 
            type: 'day',
            label: 'D',
            width: 11,
            height: 11,
            gutter: 2,
            radius: 2,
          },
          date: { start: new Date(1568, 0, 1) },
          range: 4,
          data: {
            source: data,
            type: 'json',
            x: d => +d,
            y: d => +data[d],
          },
          scale: {
            color: {
              type: 'linear',
              domain: [278, 5380],
              scheme: 'YlGnBu'
            }
          },
          tooltip: {
            enabled: true,
            text: function(date, value) {
              if (!value) return 'No letters on this day';
              const dateObj = new Date(date * 1000);
              const formattedDate = dateObj.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              });
              return `<strong>${formattedDate}</strong>: ${value} words`;
            }
          }
        });
        
        setLoading(false);
        
        return () => {
          cal.destroy();
        };
      } catch (err) {
        console.error('Error initializing heatmap:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initHeatmap();
  }, []);

  if (error) {
    return (
      <div className="cavriana-heatmap error">
        <h2>Cavriana's Letter-Writing Activity</h2>
        <div className="error-message">
          <p>Failed to load calendar visualization</p>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cavriana-heatmap">
      <h2>Cavriana's Letter-Writing Activity</h2>
      {loading ? (
        <p>Loading heatmap visualization...</p>
      ) : (
        <>
          <p>The heatmap below shows the volume of Filippo Cavriana's correspondence (in word count) over time. Each colored cell represents a day when Cavriana wrote a letter, with darker colors indicating more words written.</p>
          <div ref={calendarEl} className="cal-heatmap"></div>
          <div ref={legendEl} className="cal-heatmap-legend"></div>
          <div className="cal-heatmap-info">
            <p>Hover over a colored cell to see the exact number of words written on that day.</p>
            <p className="cal-heatmap-updated">Last updated: 2025-04-26</p>
          </div>
        </>
      )}
    </div>
  );
};

export default CavrianaHeatmap;
