import PlotlyChart from './PlotlyChart.jsx';
import EmptyState from './EmptyState.jsx';

export default function TopProductsChart({ products, metric, theme }) {
  if (!products.length) return <EmptyState message="No products match the current search." />;
  const isRating = metric === 'rating';
  const valueKey = isRating ? 'rating' : 'revenue';
  const colors = theme === 'dark'
    ? { text: '#ececec', primary: '#4f98a3', border: 'rgba(255,255,255,.08)' }
    : { text: '#222', primary: '#01696f', border: 'rgba(34,34,34,.08)' };
  return (
    <PlotlyChart
      data={[{
        x: products.map((item) => item[valueKey]).reverse(),
        y: products.map((item) => `Product ${item.productId}`).reverse(),
        type: 'bar', orientation: 'h', marker: { color: colors.primary }
      }]}
      layout={{
        paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
        font: { color: colors.text, family: 'Inter, sans-serif' },
        margin: { l: 80, r: 20, t: 20, b: 50 },
        xaxis: { title: isRating ? 'Average rating' : 'Revenue', gridcolor: colors.border, ...(isRating ? { range: [0, 5] } : {}) },
        yaxis: { automargin: true }
      }}
    />
  );
}
