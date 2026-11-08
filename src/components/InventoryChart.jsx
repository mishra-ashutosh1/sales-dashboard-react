import PlotlyChart from './PlotlyChart.jsx';

export default function InventoryChart({ data, theme }) {
  const colors = getColors(theme);

  return (
    <PlotlyChart
      data={[
        {
          x: data.map((item) => item.status),
          y: data.map((item) => item.products),
          type: 'bar',
          marker: {
            color: [colors.error, colors.warn, colors.success]
          }
        }
      ]}
      layout={{
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: colors.text, family: 'Inter, sans-serif' },
        margin: { l: 50, r: 20, t: 20, b: 50 },
        xaxis: { title: 'Status' },
        yaxis: { title: 'Products', gridcolor: colors.border }
      }}
    />
  );
}

function getColors(theme) {
  return theme === 'dark'
    ? {
        text: '#ececec',
        error: '#ff8aa0',
        warn: '#ffb85c',
        success: '#7cc65a',
        border: 'rgba(255,255,255,.08)'
      }
    : {
        text: '#222',
        error: '#a13544',
        warn: '#da7101',
        success: '#437a22',
        border: 'rgba(34,34,34,.08)'
      };
}
