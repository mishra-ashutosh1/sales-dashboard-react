import { useMemo, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import KpiCards from './components/KpiCards.jsx';
import ChartCard from './components/ChartCard.jsx';
import DatasetSummary from './components/DatasetSummary.jsx';
import MonthlyTrendChart from './components/MonthlyTrendChart.jsx';
import TopProductsChart from './components/TopProductsChart.jsx';
import InventoryChart from './components/InventoryChart.jsx';
import RatingsChart from './components/RatingsChart.jsx';
import EmptyState from './components/EmptyState.jsx';
import dashboardData from './data/dashboardData.json';

const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
const formatNumber = (value) => new Intl.NumberFormat().format(Math.round(value));

export default function App() {
  const [theme, setTheme] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const [metric, setMetric] = useState('revenue');
  const [topN, setTopN] = useState(6);
  const [region, setRegion] = useState('All');
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const source = metric === 'rating' ? dashboardData.ratingsByProduct : dashboardData.productSales;
    return source.filter((item) => !query || String(item.productId).includes(query)).slice(0, topN);
  }, [metric, search, topN]);

  const filteredRatings = useMemo(() => {
    const query = search.trim().toLowerCase();
    return dashboardData.ratingsByProduct.filter((item) => !query || String(item.productId).includes(query)).slice(0, topN);
  }, [search, topN]);

  return (
    <div className="wrap" data-theme={theme}>
      <Sidebar theme={theme} onToggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} metric={metric} onMetricChange={setMetric} topN={topN} onTopNChange={setTopN} region={region} onRegionChange={setRegion} search={search} onSearchChange={setSearch} />
      <main className="main">
        <header className="top"><div><h1>Sales, inventory, and feedback overview</h1><p className="sub">React + Vite proof of concept</p></div></header>
        <KpiCards kpis={dashboardData.kpis} formatCurrency={formatCurrency} formatNumber={formatNumber} />
        <section className="grid">
          <ChartCard title="Monthly trend" className="span-8"><MonthlyTrendChart data={dashboardData.monthlySales} theme={theme} /></ChartCard>
          <ChartCard title="Regional contribution" className="span-4"><EmptyState message="Region data is not available in the current dataset." /></ChartCard>
          <ChartCard title={metric === 'rating' ? 'Top products by rating' : 'Top products by revenue'} className="span-6"><TopProductsChart products={filteredProducts} metric={metric} theme={theme} /></ChartCard>
          <ChartCard title="Inventory status" className="span-6"><InventoryChart data={dashboardData.inventoryStatus} theme={theme} /></ChartCard>
          <ChartCard title="Product ratings" className="span-6"><RatingsChart data={filteredRatings} theme={theme} /></ChartCard>
          <ChartCard title="Sentiment mix" className="span-6"><EmptyState message="Sentiment data is not available in the current dataset." /></ChartCard>
          <DatasetSummary data={dashboardData} />
        </section>
      </main>
    </div>
  );
}
