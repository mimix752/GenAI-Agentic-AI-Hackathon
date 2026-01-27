import React, { useState } from 'react';
import { X, CreditCard, Lock } from 'lucide-react';
import './PaymentModal.css';

const PaymentModal = ({ plan, onClose }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Paiement:', { plan, formData });
    alert(`Paiement de ${plan.price} en cours de traitement...`);
    // Ici, intégrez Stripe, PayPal, etc.
  };

  const handleChange = (e) => {
    let value = e.target.value;
    
    // Format carte bancaire
    if (e.target.name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    }
    
    // Format date expiration
    if (e.target.name === 'expiryDate') {
      value = value.replace(/\D/g, '').replace(/(.{2})/, '$1/').substr(0, 5);
    }
    
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <h2 className="modal-title">Finaliser votre abonnement</h2>
          <p className="modal-subtitle">
            Plan {plan.name} - {plan.price}{plan.period}
          </p>
        </div>

        <div className="payment-summary">
          <div className="summary-row">
            <span>Plan {plan.name}</span>
            <span className="summary-price">{plan.price}{plan.period}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span className="summary-price">{plan.price}{plan.period}</span>
          </div>
        </div>

        <form className="payment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <CreditCard size={18} />
              Numéro de carte
            </label>
            <input
              type="text"
              name="cardNumber"
              className="form-input"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleChange}
              maxLength="19"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nom sur la carte</label>
            <input
              type="text"
              name="cardName"
              className="form-input"
              placeholder="JOHN DOE"
              value={formData.cardName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Expiration</label>
              <input
                type="text"
                name="expiryDate"
                className="form-input"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={handleChange}
                maxLength="5"
                required
              />
            </div><br />

            <div className="form-group">
              <label className="form-label">CVV</label>
              <input
                type="text"
                name="cvv"
                className="form-input"
                placeholder="123"
                value={formData.cvv}
                onChange={handleChange}
                maxLength="3"
                required
              /><br />
            </div>
          </div>

          <div className="payment-security">
            <Lock size={16} />
            <span>Paiement sécurisé SSL 256-bit</span>
          </div>

          <button type="submit" className="form-submit">
            Confirmer le paiement
          </button>

          <p className="payment-note">
            En confirmant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;