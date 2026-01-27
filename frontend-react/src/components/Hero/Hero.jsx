import React from 'react';
import './Hero.css';

const Hero = () => {
  const scrollToUpload = () => {
    const uploadSection = document.querySelector('.upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToDemo = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>Analyse Intelligente de CVs</span>
          </div>
          
          <h1 className="hero-title">
            <span className="brand-name">CVAL</span>'s{' '}
            <span className="highlight">CV Analyzer</span>
            <br />
            assists you in finding
            <br />
            <span className="highlight-green">the best candidates</span>
          </h1>

          <p className="hero-description">
            Analysez automatiquement vos CVs grâce à l'Intelligence Artificielle.
            Identifiez les meilleurs profils en quelques secondes.
          </p>

          <div className="hero-cta-buttons">
            <button className="btn-primary" onClick={scrollToUpload}>
              Commencer gratuitement
            </button>   <br />
            <button className="btn-primary" onClick={scrollToDemo}>
              Voir la démo
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">10x</div>
              <div className="label">Plus rapide</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="label">Précision</div>
            </div>
            
            
          </div>
        </div>

        <div className="hero-visual">
          <div className="cv-preview-card">
            <div className="cv-header">
              <div className="cv-avatar"></div>
              <div className="cv-info">
                <div className="cv-line long"></div>
                <div className="cv-line short"></div>
              </div>
            </div>
            <div className="cv-section">
              <div className="cv-line"></div>
              <div className="cv-line"></div>
              <div className="cv-line short"></div>
            </div>
            <div className="cv-section">
              <div className="cv-line"></div>
              <div className="cv-line"></div>
            </div>
            <div className="score-badge-hero">
              <div className="score-circle">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#f0f0f0" strokeWidth="8"/>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#4CAF50" strokeWidth="8" strokeDasharray="283" strokeDashoffset="70" strokeLinecap="round"/>
                </svg>
                <div className="score-text">85</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;