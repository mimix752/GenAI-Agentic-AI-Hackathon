import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './FAQ.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Comment fonctionne l'analyse de CV ?",
      answer:
        "Notre IA analyse automatiquement les CVs en extrayant les compétences, l'expérience, la formation et d'autres informations clés. Elle compare ensuite ces données avec la description du poste pour générer un score de correspondance."
    },
    {
      question: "Quels formats de fichiers sont acceptés ?",
      answer:
        "Nous acceptons les fichiers PDF, TXT et DOCX. Les fichiers doivent être bien formatés pour garantir une analyse précise."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer:
        "Absolument. Toutes les données sont cryptées et traitées selon les normes RGPD. Vos CVs ne sont jamais partagés et sont automatiquement supprimés après l'analyse."
    },
    {
      question: "Puis-je exporter les résultats ?",
      answer:
        "Oui, vous pouvez exporter les résultats en JSON, CSV ou PDF pour les partager avec votre équipe ou les intégrer dans vos systèmes."
    },
    {
      question: "Combien de CVs puis-je analyser ?",
      answer:
        "Cela dépend de votre plan. Le plan gratuit offre 10 analyses par mois, le plan Pro 500, et le plan Entreprise est illimité."
    },
    {
      question: "L'IA supporte-t-elle plusieurs langues ?",
      answer:
        "Oui, notre IA supporte 3 langues pour analyser des CVs internationaux avec une grande précision."
    },
    {
      question: "Puis-je personnaliser les critères d'analyse ?",
      answer:
        "Oui, vous pouvez définir vos propres critères comme les compétences requises, l'expérience minimale ou les mots-clés importants."
    }
  ];

  return (
    <section className="faq-section" id="faq">

      <h2 className="faq-title">Questions fréquentes</h2>
      <p className="faq-subtitle">
        Tout ce que vous devez savoir sur notre analyse intelligente de CV
      </p>

      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${openIndex === index ? 'open' : ''}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              <span>{faq.question}</span>
              <ChevronDown
                size={20}
                className={`faq-icon ${openIndex === index ? 'rotate' : ''}`}
              />
            </div>

            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
