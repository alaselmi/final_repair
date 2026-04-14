import { memo, useEffect, useState } from 'react';

function AnimatedValue({ value }) {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    if (currentValue === value) {
      return undefined;
    }

    const start = currentValue;
    const end = value;
    const step = Math.max(1, Math.round((end - start) / 12));
    let next = start;
    const interval = setInterval(() => {
      next += step;
      if ((step > 0 && next >= end) || (step < 0 && next <= end)) {
        setCurrentValue(end);
        clearInterval(interval);
      } else {
        setCurrentValue(next);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [currentValue, value]);

  return <p className="analytics-value">{currentValue}</p>;
}

function TrendBadge({ value }) {
  if (value === 0) {
    return <span className="trend-badge neutral">—</span>;
  }

  const positive = value > 0;
  return (
    <span className={`trend-badge ${positive ? 'positive' : 'negative'}`}>
      {positive ? '↑' : '↓'} {Math.abs(value)}
    </span>
  );
}

function AnalyticsCards({ stats, trend }) {
  const safeRevenue = Number(stats.revenue || 0);

  return (
    <section className="analytics-grid">
      <div className="analytics-card">
        <div className="analytics-card-header">
          <p className="analytics-label">Total repairs</p>
          <TrendBadge value={trend.total} />
        </div>
        <AnimatedValue value={stats.total} />
      </div>
      <div className="analytics-card">
        <div className="analytics-card-header">
          <p className="analytics-label">Pending</p>
          <TrendBadge value={trend.pending} />
        </div>
        <AnimatedValue value={stats.pending} />
      </div>
      <div className="analytics-card">
        <div className="analytics-card-header">
          <p className="analytics-label">In progress</p>
          <TrendBadge value={trend.inProgress} />
        </div>
        <AnimatedValue value={stats.inProgress} />
      </div>
      <div className="analytics-card">
        <div className="analytics-card-header">
          <p className="analytics-label">Completed</p>
          <TrendBadge value={trend.completed} />
        </div>
        <AnimatedValue value={stats.completed} />
      </div>
      <div className="analytics-card">
        <div className="analytics-card-header">
          <p className="analytics-label">Revenue estimate</p>
          <TrendBadge value={Math.round(trend.revenue || 0)} />
        </div>
        <AnimatedValue value={safeRevenue} />
      </div>
    </section>
  );
}

export default memo(AnalyticsCards);
