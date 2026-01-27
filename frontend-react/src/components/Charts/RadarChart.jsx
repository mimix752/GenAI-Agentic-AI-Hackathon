import React from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const CustomRadarChart = ({ candidates }) => {
  const successfulCandidates = candidates.filter(c => c.status === 'success');

  if (successfulCandidates.length === 0) {
    return (
      <div className="chart-card">
        <h3 className="chart-title">Analyse des Compétences</h3>
        <div className="no-data">
          <p>Aucune donnée disponible</p>
        </div>
      </div>
    );
  }

  const firstCandidate = successfulCandidates[0];
  
  const data = firstCandidate.skills.slice(0, 6).map(skill => ({
    skill: skill.length > 12 ? skill.substring(0, 12) + '...' : skill,
    value: 75 + Math.random() * 25, // Simulation de scores
    fullSkill: skill
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-name">{payload[0].payload.fullSkill}</p>
          <p className="tooltip-score">Niveau: {payload[0].value.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-card">
      <h3 className="detail-title">Compétences - {firstCandidate.name}</h3>
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.2)" />
          <PolarAngleAxis 
            dataKey="skill" 
            stroke="rgba(255,255,255,0.6)"
            style={{ fontSize: '0.85rem' }}
          />
          <PolarRadiusAxis 
            stroke="rgba(255,255,255,0.3)" 
            domain={[0, 100]}
            style={{ fontSize: '0.8rem' }}
          />
          <Radar
            name={firstCandidate.name}
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
            animationDuration={800}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ color: 'white', paddingTop: '20px' }}
            iconType="circle"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomRadarChart;