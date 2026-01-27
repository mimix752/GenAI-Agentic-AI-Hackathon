import React from 'react';
import { TrendingUp, FileCheck, Award, Download } from 'lucide-react';
import StatsCard from './StatsCard';
import CandidateCard from './CandidateCard';
import './Results.css';

const Results = ({ results, onExportJSON, onExportCSV }) => {
  if (!results) return null;

  return (
    <div className="results-container">
      <h2 className="results-title">
        
        Résultats de l'Analyse
      </h2>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatsCard
          icon={FileCheck}
          value={`${results.successful_analyses}/${results.total_candidates}`}
          label="CVs Analysés"
          delay={0.1}
        />
        <StatsCard
          icon={TrendingUp}
          value={`${results.average_score.toFixed(1)}/100`}
          label="Score Moyen"
          delay={0.2}
        />
        <StatsCard
          icon={Award}
          value={results.candidates[0]?.name || 'N/A'}
          label={`Meilleur Candidat (${results.candidates[0]?.score || 0}/100)`}
          delay={0.3}
        />
      </div>

      {/* Candidates List */}
      <div className="candidates-section">
        <h3 className="section-subtitle">Détails des Candidats</h3>
        <div className="candidates-list">
          {results.candidates.map((candidate, idx) => (
            <CandidateCard key={idx} candidate={candidate} index={idx} />
          ))}
        </div>
      </div>

      {/* Export Buttons */}
      <div className="export-section">
        <button className="export-btn" onClick={onExportJSON}>
          <Download size={20} />
          Télécharger JSON
        </button>
        <button className="export-btn" onClick={onExportCSV}>
          <Download size={20} />
          Télécharger CSV
        </button>
      </div>
    </div>
  );
};

export default Results;