export default function Sidebar({
  theme,
  onToggleTheme,
  metric,
  onMetricChange,
  topN,
  onTopNChange,
  region,
  onRegionChange,
  search,
  onSearchChange
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo" />
        <div>
          <div className="title">Business Dashboard</div>
          <div className="sub">React POC</div>
        </div>
      </div>

      <button className="btn" type="button" onClick={onToggleTheme}>
        Toggle theme
      </button>

      <div className="control">
        <label htmlFor="metricSelect">Primary metric</label>
        <select
          id="metricSelect"
          value={metric}
          onChange={(event) => onMetricChange(event.target.value)}
        >
          <option value="revenue">Revenue</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <div className="control">
        <label htmlFor="topProducts">Top products shown: {topN}</label>
        <input
          id="topProducts"
          type="range"
          min="3"
          max="10"
          value={topN}
          onChange={(event) => onTopNChange(Number(event.target.value))}
        />
      </div>

      <div className="control">
        <label htmlFor="regionFilter">Region filter</label>
        <select
          id="regionFilter"
          value={region}
          onChange={(event) => onRegionChange(event.target.value)}
        >
          <option value="All">All regions</option>
        </select>
      </div>

      <div className="control">
        <label htmlFor="searchBox">Product search</label>
        <input
          id="searchBox"
          type="text"
          placeholder="Enter product ID"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <p className="footer-note">
        This React POC uses component-based state, reusable chart cards, and placeholder states for unavailable data.
      </p>
    </aside>
  );
}
