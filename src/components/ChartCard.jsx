export default function ChartCard({ title, className = '', children }) {
  return (
    <div className={`card ${className}`}>
      <h3>{title}</h3>
      <div className="chart">{children}</div>
    </div>
  );
}
