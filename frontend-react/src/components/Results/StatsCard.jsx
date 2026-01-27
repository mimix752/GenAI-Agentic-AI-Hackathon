import React from 'react';

const StatsCard = ({ icon: Icon, value, label, delay = 0 }) => {
  return (
    <div 
      className="stat-card" 
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="stat-icon-wrapper">
        {Icon && <Icon size={44} className="stat-icon" />}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-glow"></div>
    </div>
  );
};

export default StatsCard;