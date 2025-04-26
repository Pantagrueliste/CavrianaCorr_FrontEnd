
import React, { useEffect, useRef } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// Component that loads CalHeatmap only in browser context
const CavrianaHeatmap = () => {
  return (
    <BrowserOnly>
      {() => {
        try {
          // Dynamic import will happen in the nested component
          return <HeatmapContent />;
        } catch (error) {
          console.error("Error loading calendar heatmap:", error);
          return <div>Error loading correspondence heatmap. Please check console for details.</div>;
        }
      }}
    </BrowserOnly>
  );
};

// The actual heatmap content
const HeatmapContent = () => {
  const calendarEl = useRef(null);
  const tooltipEl = useRef(null);
  const legendEl = useRef(null);

  useEffect(() => {
    // Import dynamically since we're in the browser
    const loadLibraries = async () => {
      try {
        // Import required libraries
        const CalHeatmapModule = await import('cal-heatmap');
        const CalHeatmap = CalHeatmapModule.default;
        await import('cal-heatmap/cal-heatmap.css');
        
        // Create a new instance
        const cal = new CalHeatmap();
        
        // Initialize with data
        const data = {"-12677644800": 544, "-12675744000": 786, "-12675225600": 780, "-12675139200": 494, "-12673152000": 488, "-12672115200": 410, "-12670041600": 490, "-12668227200": 538, "-12664339200": 854, "-12654144000": 1238, "-12625632000": 500, "-12623731200": 648, "-12610771200": 1876, "-12605932800": 2314, "-12604723200": 614, "-12603081600": 3314, "-12601785600": 5380, "-12600921600": 3826, "-12600662400": 436, "-12599020800": 912, "-12598329600": 3348, "-12596428800": 894, "-12595824000": 278, "-12590121600": 3903, "-12582000000": 328, "-12574396800": 326};

        // Create legend
        const legend = document.createElement('div');
        legend.className = 'ch-legend';
        if (legendEl.current) {
          legendEl.current.appendChild(legend);
        }

        // Initialize the calendar
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

        return () => {
          cal.destroy();
        };
      } catch (error) {
        console.error('Failed to load CalHeatmap:', error);
        if (calendarEl.current) {
          calendarEl.current.innerHTML = '<p>Failed to load calendar visualization</p>';
        }
      }
    };

    loadLibraries();
  }, []);

  return (
    <div className="cavriana-heatmap">
      <h2>Cavriana's Letter-Writing Activity</h2>
      <p>The heatmap below shows the volume of Filippo Cavriana's correspondence (in word count) over time. Each colored cell represents a day when Cavriana wrote a letter, with darker colors indicating more words written.</p>
      <div ref={calendarEl} className="cal-heatmap"></div>
      <div ref={legendEl} className="cal-heatmap-legend"></div>
      <div ref={tooltipEl} className="cal-heatmap-tooltip"></div>
      <div className="cal-heatmap-info">
        <p>Hover over a colored cell to see the exact number of words written on that day.</p>
        <p className="cal-heatmap-updated">Last updated: 2025-04-26</p>
      </div>
    </div>
  );
};

export default CavrianaHeatmap;
