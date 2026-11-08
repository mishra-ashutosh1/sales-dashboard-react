import { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';

export default function PlotlyChart({ data, layout, config }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    Plotly.newPlot(chartRef.current, data, layout, {
      responsive: true,
      displayModeBar: false,
      ...config
    });

    return () => {
      if (chartRef.current) {
        Plotly.purge(chartRef.current);
      }
    };
  }, [data, layout, config]);

  return <div ref={chartRef} className="plotly-chart" />;
}
