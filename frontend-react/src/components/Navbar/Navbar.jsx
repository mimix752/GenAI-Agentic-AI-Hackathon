import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import LoginModal from '../Modals/LoginModal';
import './Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const navLinks = [
    { label: 'Fonctionnalités', href: '#features' },
    { label: 'Comment ça marche', href: '#how-it-works' },
    { label: 'Tarifs', href: '#pricing' },
    { label: 'FAQ', href: '#faq' }
  ];

  const scrollToUpload = () => {
    const uploadSection = document.querySelector('.upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    setLoginModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <a href="/" className="navbar-logo">
            <span className="logo-icon"></span>
            <span className="logo-text">
              <span className="logo-highlight">CV</span>AL
            </span>
          </a>

          <div className="nav-links-desktop">
            {navLinks.map((link, index) => (
              <a key={index} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </div>

          <div className="nav-actions">
            <button className="btn-secondary" onClick={handleLogin}>
              Se connecter
            </button>
            <button className="btn-primary" onClick={scrollToUpload}>
              Essayer gratuitement
            </button>
            
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            {navLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.href} 
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mobile-actions">
              <button className="btn-secondary-mobile" onClick={handleLogin}>
                Se connecter
              </button>
              <button className="btn-primary-mobile" onClick={scrollToUpload}>
                Essayer gratuitement
              </button>
            </div>
          </div>
        )}
      </nav>

      {loginModalOpen && (
        <LoginModal onClose={() => setLoginModalOpen(false)} />
      )}
    </>
  );
};

export default Navbar;