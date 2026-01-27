import React from 'react';
import { Upload, FileSearch, TrendingUp, Download } from 'lucide-react';
import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: Upload,
      title: "Uploadez vos CVs",
      description: "Glissez-déposez ou sélectionnez jusqu'à 10 CVs au format PDF ou TXT"
    },
    {
      number: 2,
      icon: FileSearch,
      title: "Décrivez le poste",
      description: "Ajoutez les critères et compétences recherchées pour le poste à pourvoir"
    },
    {
      number: 3,
      icon: TrendingUp,
      title: "Analyse IA instantanée",
      description: "Notre IA analyse et évalue chaque CV selon vos critères en quelques secondes"
    },
    {
      number: 4,
      icon: Download,
      title: "Obtenez les résultats",
      description: "Consultez les scores, visualisations et exportez les résultats en JSON ou CSV"
    }
  ];

  return (
    <section className="how-section" id="how-it-works">

    <div className="how-it-works-section">
      <div className="how-it-works-container">
        <h2 className="how-it-works-title">Comment ça marche ?</h2>
        <p className="how-it-works-subtitle">
          Trouvez les meilleurs candidats en 4 étapes simples grâce à l'Intelligence Artificielle
        </p>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={index} className="step-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="step-number-badge">{step.number}</div>
              <div className="step-icon-wrapper">
                <step.icon size={40} className="step-icon" />
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Ligne de connexion entre les étapes */}
        <div className="steps-connector"></div>
      </div>
    </div>
    </section>
  );
};

export default HowItWorks;