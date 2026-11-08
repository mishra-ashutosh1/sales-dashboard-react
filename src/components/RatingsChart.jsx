import PlotlyChart from './PlotlyChart.jsx';

export default function RatingsChart({ data, theme }) {
  if (!data.length) {
    return <EmptyState message="No rating data matches the current filter." />;
  }

  const colors = getColors(theme);

  return (
    <PlotlyChart
      data={[
        {
          x: data.map((item) => `Product ${item.productId}`),
          y: data.map((item) => item.rating),
          type: 'bar',
          marker: { color: colors.success }
        }
      ]}
      layout={{
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: colors.text, family: 'Inter, sans-serif' },
        margin: { l: 50, r: 20, t: 20, b: 70 },
        xaxis: { tickangle: -25 },
        yaxis: {
          title: 'Average rating',
          range: [0, 5],
          gridcolor: colors.border
        }
      }}
    />
  );
}

function getColors(theme) {
  return theme === 'dark'
    ? { text: '#ececec', success: '#7cc65a', border: 'rgba(255,255,255,.08)' }
    : { text: '#222', success: '#437a22', border: 'rgba(34,34,34,.08)' };
}
