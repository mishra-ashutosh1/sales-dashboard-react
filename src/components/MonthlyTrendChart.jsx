import PlotlyChart from './PlotlyChart.jsx';

export default function MonthlyTrendChart({ data, theme }) {
  const colors = getColors(theme);

  return (
    <PlotlyChart
      data={[
        {
          x: data.map((item) => item.month),
          y: data.map((item) => item.revenue),
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: colors.primary, width: 3 },
          marker: { size: 8 }
        }
      ]}
      layout={{
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: colors.text, family: 'Inter, sans-serif' },
        margin: { l: 50, r: 20, t: 20, b: 50 },
        xaxis: { title: 'Month', gridcolor: colors.border },
        yaxis: { title: 'Revenue', gridcolor: colors.border }
      }}
    />
  );
}

function getColors(theme) {
  return theme === 'dark'
    ? { text: '#ececec', primary: '#4f98a3', border: 'rgba(255,255,255,.08)' }
    : { text: '#222', primary: '#01696f', border: 'rgba(34,34,34,.08)' };
}
