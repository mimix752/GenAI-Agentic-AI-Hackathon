import React from 'react';
import { Zap, Target, Shield, TrendingUp, FileText, Globe } from 'lucide-react';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: "Analyse ultra-rapide",
      description: "Traitez des centaines de CVs en quelques secondes grâce à notre IA optimisée"
    },
    {
      icon: Target,
      title: "Précision maximale",
      description: "95% de précision dans l'identification des compétences et de l'expérience"
    },
    {
      icon: Shield,
      title: "Données sécurisées",
      description: "Vos données sont cryptées et protégées selon les normes RGPD"
    },
    {
      icon: TrendingUp,
      title: "Scoring intelligent",
      description: "Système de notation avancé basé sur vos critères personnalisés"
    },
    {
      icon: FileText,
      title: "Export flexible",
      description: "Exportez vos résultats en JSON, CSV ou PDF pour vos équipes"
    },
    {
      icon: Globe,
      title: "Multi-langues",
      description: "Support de 3 langues pour une analyse internationale"
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="features-container">
        <h2 className="features-title">Fonctionnalités puissantes</h2>
        <p className="features-subtitle">
          Tout ce dont vous avez besoin pour recruter les meilleurs talents efficacement
        </p>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="feature-icon-wrapper">
                <div className="feature-icon-bg"></div>
                <feature.icon size={32} className="feature-icon" />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;