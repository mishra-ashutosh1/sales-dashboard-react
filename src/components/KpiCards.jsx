export default function KpiCards({ kpis, formatCurrency, formatNumber }) {
  const cards = [
    { label: 'Total revenue', value: formatCurrency(kpis.totalRevenue) },
    { label: 'Units sold', value: formatNumber(kpis.totalUnits) },
    { label: 'Average rating', value: kpis.averageRating.toFixed(2) },
    { label: 'Inventory units', value: formatNumber(kpis.inventoryUnits) }
  ];

  return (
    <section className="kpis">
      {cards.map((card) => (
        <div className="card kpi" key={card.label}>
          <div className="label">{card.label}</div>
          <div className="value">{card.value}</div>
        </div>
      ))}
    </section>
  );
}
