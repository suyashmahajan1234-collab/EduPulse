import React from 'react';

export default function MetricCard({ title, value, subtext, icon: Icon, color = 'blue' }) {
  const colorStyles = {
    blue: { bg: '#eff6ff', color: '#2563eb' },
    green: { bg: '#ecfdf5', color: '#059669' },
    amber: { bg: '#fffbeb', color: '#d97706' },
    purple: { bg: '#f5f3ff', color: '#7c3aed' },
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div className="card metric-card">
      <div className="metric-info">
        <h3>{title}</h3>
        <div className="value">{value}</div>
        {subtext && <div className="subtext">{subtext}</div>}
      </div>
      <div className="metric-icon-wrap" style={{ backgroundColor: style.bg, color: style.color }}>
        <Icon size={24} />
      </div>
    </div>
  );
}

