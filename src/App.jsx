import { useState } from 'react';
import data from './data/olistSummary.json';
import './olist.css';

const number = (v) => new Intl.NumberFormat('en-US').format(v);
const money = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);
const label = (s) => s.replaceAll('_', ' ');

function Bars({ rows, currency = false }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return rows.length ? <div className="bars">{rows.map(([name, value]) => <div className="bar-row" key={name}><div className="bar-caption"><span>{label(name)}</span><span>{currency ? money(value) : number(value)}</span></div><div className="track"><div style={{ width: `${value / max * 100}%` }} /></div></div>)}</div> : <p>No matching data.</p>;
}
function Card({ title, note, children }) {
  return <section className="olist-card"><h2>{title}</h2>{note && <p className="muted">{note}</p>}{children}</section>;
}
export default function App() {
  const [dark, setDark] = useState(false);
  const [top, setTop] = useState(10);
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('All');
  const k = data.kpis;
  const categories = data.categories.filter(([name]) => label(name).toLowerCase().includes(query.trim().toLowerCase())).slice(0, top);
  const monthly = data.monthly.filter(([month]) => year === 'All' || month.startsWith(year));
  return <div className={`olist-app ${dark ? 'night' : ''}`}>
    <header className="olist-header"><div><p className="eyebrow">REACT POC / OLIST PUBLIC DATA</p><h1>Brazilian e-commerce overview</h1><p className="muted">Historical order, sales and customer-review analytics</p></div><button onClick={() => setDark(!dark)}>Switch to {dark ? 'light' : 'dark'} theme</button></header>
    <div className="olist-notice">Sales = delivered-order item prices, excluding freight. Ratings use the latest review per delivered order. All KPI cards show the complete dataset; controls below affect only their named charts.</div>
    <div className="olist-kpis">{[['Item sales (BRL)', money(k.sales)], ['Items delivered', number(k.items)], ['Delivered orders', number(k.deliveredOrders)], ['Average order rating', `${k.rating.toFixed(2)} / 5`]].map(([name,value]) => <section className="olist-card" key={name}><p className="muted">{name}</p><strong>{value}</strong></section>)}</div>
    <div className="olist-controls"><label>Monthly chart year<select value={year} onChange={(e) => setYear(e.target.value)}><option>All</option><option>2016</option><option>2017</option><option>2018</option></select></label><label>Category search<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. health or furniture" /></label><label>Category and state rows: {top}<input type="range" min="3" max="20" value={top} onChange={(e) => setTop(Number(e.target.value))} /></label><button onClick={() => {setYear('All');setQuery('');setTop(10);}}>Reset controls</button></div>
    <div className="olist-grid">
      <Card title="Monthly item sales" note="Purchase month; delivered orders only. Missing months have no recorded delivered-item sales."><Bars rows={monthly} currency /></Card>
      <Card title="Sales by customer state" note="Brazilian state codes; delivered-order item sales."><Bars rows={data.states.slice(0, top)} currency /></Card>
      <Card title="Top product categories" note="Categories, not invented product names. Search applies only here."><Bars rows={categories} currency /></Card>
      <Card title="Order status" note={`${number(k.allOrders)} orders across all statuses; not an inventory measure.`}><Bars rows={data.status} /></Card>
      <Card title="Customer review scores" note={`${number(k.reviewedOrders)} delivered orders with a review; latest review per order. Not text sentiment.`}><Bars rows={data.ratings.map(([score,count]) => [`${score} stars`,count])} /></Card>
      <Card title="Payments by method" note="Delivered orders only. Payments can include freight and adjustments, so they differ from item sales."><Bars rows={data.payments} currency /></Card>
    </div>
    <Card title="Dataset and methodology"><p>Computed from the eight Olist CSVs supplied for this project. This is historical public data, not generated dummy data. No customer identifiers, addresses or review text are included in this summary.</p><p>Sales items were joined to orders, customers and products with many-to-one validation. Reviews and payments were aggregated separately to prevent duplicated sales. Review ties are resolved by review creation date, answer timestamp, then review ID. Untranslated categories retain their source label; missing categories are marked unknown.</p><p>Inventory and product-level ratings are intentionally omitted because these files do not support them directly. This POC uses a static summary, not a live backend or globally cross-filtered data model.</p><div className="source-grid">{Object.entries(data.quality).map(([name,count]) => <p key={name}>{name}: {number(count)}</p>)}</div><p className="muted">Source: Olist Brazilian E-Commerce Public Dataset (Kaggle). See README for attribution and limitations.</p></Card>
  </div>;
}
