import PlotlyChart from './PlotlyChart.jsx';

export default function TopProductsChart({ products, metric, theme }) {
  if (!products.length) {
    return <EmptyState message="No products match the current search." />;
  }

  const valueKey = metric === 'rating' ? 'rating' : 'revenue';
  const axisTitle = metric === 'rating' ? 'Average rating' : 'Revenue';
  const colors = getColors(theme);

  return (
    <PlotlyChart
      data={[
        {
          x: products.map((item) => item[valueKey]).reverse(),
          y: products.map((item) => `Product ${item.productId}`).reverse(),
          type: 'bar',
          orientation: 'h',
          marker: { color: colors.primary }
        }
      ]}
      layout={{
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: colors.text, family: 'Inter, sans-serif' },
        margin: { l: 80, r: 20, t: 20, b: 50 },
        xaxis: { title: axisTitle, gridcolor: colors.border },
        yaxis: { automargin: true }
      }}
    />
  );
}

function getColors(theme) {
  return theme === 'dark'
    ? { text: '#ececec', primary: '#4f98a3', border: 'rgba(255,255,255,.08)' }
    : { text: '#222', primary: '#01696f', border: 'rgba(34,34,34,.08)' };
}
