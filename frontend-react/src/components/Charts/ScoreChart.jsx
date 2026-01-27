import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ScoreChart = ({ candidates }) => {
  const successfulCandidates = candidates.filter(c => c.status === 'success');
  
  const data = successfulCandidates.map(c => ({
    name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
    score: c.score,
    fullName: c.name
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-name">{payload[0].payload.fullName}</p>
          <p className="tooltip-score">Score: {payload[0].value}/100</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-card">
      <h3 className="detail-title">Scores de Compatibilité</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="name" 
            stroke="rgba(255,255,255,0.6)" 
            angle={-45}
            textAnchor="end"
            height={100}
            style={{ fontSize: '0.85rem' }}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.6)" 
            domain={[0, 100]}
            style={{ fontSize: '0.9rem' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ color: 'white', paddingTop: '20px' }} 
            iconType="circle"
          />
          <Bar 
            dataKey="score" 
            fill="url(#colorGradient)" 
            name="Score de compatibilité"
            radius={[8, 8, 0, 0]}
            animationDuration={800}
            animationBegin={0}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreChart;