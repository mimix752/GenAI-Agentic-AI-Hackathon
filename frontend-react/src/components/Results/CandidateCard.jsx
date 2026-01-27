import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const CandidateCard = ({ candidate, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const scoreClass = candidate.score >= 75 ? 'score-high' : 
                     candidate.score >= 50 ? 'score-medium' : 'score-low';
  
  const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📄';

  if (candidate.status === 'error') {
    return (
      <div className="candidate-card error-card" style={{ animationDelay: `${index * 0.1}s` }}>
        <div className="error-content">
          <div className="error-icon"></div>
          <div>
            <div className="candidate-name">{candidate.name}</div>
            <p className="error-message">{candidate.error_message || 'Erreur lors du traitement'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="candidate-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="candidate-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="candidate-name">
          <span className="candidate-medal">{medal}</span>
          {candidate.name}
        </div>
        <div className="header-right">
          <div className={`score-badge ${scoreClass}`}>
            <span className="score-value">{candidate.score}</span>
            <span className="score-max">/100</span>
          </div>
          <ChevronDown 
            size={24} 
            className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
          />
        </div>
      </div>

      <div className={`candidate-details ${isExpanded ? 'active' : ''}`}>
        <div className="details-grid">
          {/* Column 1 */}
          <div className="details-column">
            <div className="detail-section">
              <div className="detail-title">Compétences</div>
              <div className="skills-container">
                {candidate.skills?.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="skill-tag" 
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <div className="detail-title"> Formation</div>
              <div className="education-list">
                {candidate.education?.map((edu, idx) => (
                  <div key={idx} className="education-item">
                    <span className="bullet">•</span>
                    {edu}
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <div className="detail-title">Points Forts</div>
              <div className="strengths-list">
                {candidate.strengths?.map((strength, idx) => (
                  <div key={idx} className="strength-item">
                    <span className="icon"></span>
                    {strength}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="details-column">
            <div className="detail-section">
              <div className="detail-title">Points d'Amélioration</div>
              <div className="weaknesses-list">
                {candidate.weaknesses?.map((weakness, idx) => (
                  <div key={idx} className="weakness-item">
                    <span className="icon"></span>
                    {weakness}
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <div className="detail-title">Feedback</div>
              <p className="feedback-text">{candidate.feedback}</p>
            </div>

            <div className="detail-section">
              <div className="detail-title">Questions d'Entretien</div>
              <div className="questions-list">
                {candidate.interview_questions?.map((question, idx) => (
                  <div key={idx} className="question-item">
                    <span className="question-number">{idx + 1}.</span>
                    <span className="question-text">{question}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;