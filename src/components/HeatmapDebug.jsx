import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

function HeatmapDebug() {
  return (
    <BrowserOnly>
      {() => {
        const debugInfo = {
          windowExists: typeof window !== 'undefined',
          d3Global: typeof window !== 'undefined' && typeof window.d3 !== 'undefined',
          calHeatmapGlobal: typeof window !== 'undefined' && typeof window.CalHeatmap !== 'undefined',
          documentExists: typeof document !== 'undefined',
        };
        
        return (
          <div style={{
            margin: '20px 0',
            padding: '15px',
            border: '2px dashed #ff5555',
            borderRadius: '5px',
            backgroundColor: '#333',
            color: 'white',
            fontFamily: 'monospace'
          }}>
            <h3>Heatmap Debugging Info</h3>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            <div>
              <button
                onClick={() => {
                  try {
                    const script1 = document.createElement('script');
                    script1.src = 'https://d3js.org/d3.v6.min.js';
                    document.head.appendChild(script1);
                    
                    const script2 = document.createElement('script');
                    script2.src = 'https://unpkg.com/cal-heatmap@3.6.2/cal-heatmap.min.js';
                    document.head.appendChild(script2);
                    
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = 'https://unpkg.com/cal-heatmap@3.6.2/cal-heatmap.css';
                    document.head.appendChild(link);
                    
                    alert('Scripts loaded manually. Refresh the page to see if it works.');
                  } catch (e) {
                    alert('Error loading scripts: ' + e.message);
                  }
                }}
                style={{
                  backgroundColor: '#4CAF50',
                  border: 'none',
                  color: 'white',
                  padding: '10px 15px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'inline-block',
                  fontSize: '16px',
                  margin: '4px 2px',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                Try Manual Load
              </button>
            </div>
          </div>
        );
      }}
    </BrowserOnly>
  );
}

export default HeatmapDebug;
