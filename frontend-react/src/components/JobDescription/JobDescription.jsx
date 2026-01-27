import React from 'react';
import { Briefcase } from 'lucide-react';
import './JobDescription.css';

const JobDescription = ({ value, onChange }) => {
  const characterCount = value.length;
  const minCharacters = 20;
  const isValid = characterCount >= minCharacters;

  return (
    <div className="job-description-section">
      <h2 className="section-title">
        
        Description du Poste
      </h2>
      
      <div className="textarea-container">
        <textarea
          className={`job-textarea ${!isValid && characterCount > 0 ? 'invalid' : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Décrivez le poste recherché en détail...

Exemple:
- Compétences techniques requises (langages, frameworks, outils)
- Années d'expérience souhaitées
- Responsabilités principales du poste
- Soft skills attendues
- Environnement de travail et culture d'entreprise"
          required
        />
        
        <div className="textarea-footer">
          <span className={`char-count ${isValid ? 'valid' : 'invalid'}`}>
            {characterCount} / {minCharacters} caractères minimum
            {isValid && ' ✓'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;