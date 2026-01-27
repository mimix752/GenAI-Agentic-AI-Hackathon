import React, { useState } from 'react';
import { Check } from 'lucide-react';
import PaymentModal from '../Modals/PaymentModal';
import './Pricing.css';

const Pricing = () => {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const scrollToUpload = () => {
    const uploadSection = document.querySelector('.upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handlePlanClick = (plan) => {
    if (plan.name === "Gratuit") {
      scrollToUpload();
    } else if (plan.name === "Entreprise") {
      alert('Contactez-nous à: contact@cval.com');
    } else {
      setSelectedPlan(plan);
      setPaymentModalOpen(true);
    }
  };

  const plans = [
    {
      name: "Gratuit",
      subtitle: "Pour tester notre service",
      price: "0DH",
      period: "/mois",
      features: [
        "10 analyses de CV par mois",
        "Export en JSON",
        "Support par email",
        "Accès aux fonctionnalités de base"
      ],
      buttonText: "Commencer gratuitement",
      buttonClass: "btn-free",
      popular: false
    },
    {
      name: "Pro",
      subtitle: "Pour les recruteurs actifs",
      price: "300DH",
      period: "/mois",
      features: [
        "500 analyses de CV par mois",
        "Export JSON, CSV et PDF",
        "Support prioritaire",
        "Analyse multi-critères avancée",
        "API access",
        "Rapports détaillés"
      ],
      buttonText: "Essayer 14 jours gratuits",
      buttonClass: "btn-pro",
      popular: true
    },
    {
      name: "Entreprise",
      subtitle: "Pour les grandes équipes",
      price: "Sur mesure",
      period: "",
      features: [
        "Analyses illimitées",
        "Tous les formats d'export",
        "Support dédié 24/7",
        "Intégration personnalisée",
        "Formation de l'équipe",
        "SLA garanti"
      ],
      buttonText: "Contactez-nous",
      buttonClass: "btn-enterprise",
      popular: false
    }
  ];

  return (
    <>
      <section id="pricing" className="pricing-section">
        <div className="pricing-container">
          <h2 className="pricing-title">Tarifs transparents</h2>
          <p className="pricing-subtitle">
            Choisissez le plan qui correspond à vos besoins. Annulation à tout moment.
          </p>

          <div className="pricing-grid">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`pricing-card ${plan.popular ? 'popular' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="popular-badge">Le plus populaire</div>
                )}
                
                <div className="pricing-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-subtitle">{plan.subtitle}</p>
                  <div className="plan-price">
                    <span className="price-value">{plan.price}</span>
                    <span className="price-period">{plan.period}</span>
                  </div>
                </div>

                <ul className="features-list">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="feature-item">
                      <Check size={20} className="check-icon" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  className={`pricing-btn ${plan.buttonClass}`}
                  onClick={() => handlePlanClick(plan)}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {paymentModalOpen && selectedPlan && (
        <PaymentModal 
          plan={selectedPlan}
          onClose={() => setPaymentModalOpen(false)}
        />
      )}
    </>
  );
};

export default Pricing;