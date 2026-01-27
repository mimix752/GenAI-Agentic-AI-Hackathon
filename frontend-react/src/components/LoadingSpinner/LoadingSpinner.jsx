import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="spinner-wrapper">
        <div className="spinner"></div>
        <div className="spinner-inner"></div>
        <div className="spinner-core"></div>
      </div>
      
      <div className="loading-content">
        <p className="loading-text">Analyse en cours...</p>
        <p className="loading-subtext">L'IA traite vos CVs et génère les résultats</p>
        
        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>

        <div className="loading-steps">
          <div className="step">
            <div className="step-icon">📄</div>
            <div className="step-text">Extraction des données</div>
          </div>
          <div className="step">
            <div className="step-icon">🔍</div>
            <div className="step-text">Analyse et évaluation</div>
          </div>
          <div className="step">
            <div className="step-icon">✨</div>
            <div className="step-text">Génération des insights</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;