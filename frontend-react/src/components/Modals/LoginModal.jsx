import React, { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import './LoginModal.css';

const LoginModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Logique de connexion
      console.log('Connexion:', formData);
      alert('Connexion en cours...\nEmail: ' + formData.email);
      // Ici, vous ajouteriez votre appel API
    } else {
      // Logique d'inscription
      console.log('Inscription:', formData);
      alert('Inscription en cours...\nEmail: ' + formData.email);
      // Ici, vous ajouteriez votre appel API
    }
    
    // onClose(); // Fermer après succès
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <h2 className="modal-title">
            {isLogin ? 'Connexion' : 'Inscription'}
          </h2>
          <p className="modal-subtitle">
            {isLogin 
              ? 'Accédez à votre compte CVAL' 
              : 'Créez votre compte gratuitement'
            }
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">
                <User size={18} />
                Nom complet
              </label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <Mail size={18} />
              Email
            </label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="vous@exemple.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={18} />
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {isLogin && (
            <div className="form-forgot">
              <a href="#" className="forgot-link">Mot de passe oublié ?</a>
            </div>
          )}

          <button type="submit" className="form-submit">
            {isLogin ? 'Se connecter' : "S'inscrire"}
          </button>

          <div className="form-divider">
            <span>ou</span>
          </div>

          <button type="button" className="social-btn google">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
            </svg>
            Continuer avec Google
          </button>

          <div className="form-switch">
            {isLogin ? (
              <p>
                Pas encore de compte ?{' '}
                <button 
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="switch-btn"
                >
                  S'inscrire
                </button>
              </p>
            ) : (
              <p>
                Déjà un compte ?{' '}
                <button 
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="switch-btn"
                >
                  Se connecter
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;