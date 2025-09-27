import React, { useState } from 'react';
import axios from 'axios';
import './PinAuth.css';

const PinAuth = ({ onAuthenticated }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple PIN check for 1969
    setTimeout(() => {
      if (pin === '1969') {
        onAuthenticated();
      } else {
        setError('Invalid PIN. Please try again.');
        setPin('');
      }
      setLoading(false);
    }, 500);
  };

  const handlePinChange = (e) => {
    const value = e.target.value;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPin(value);
      
      // Auto-submit when 4 digits are entered
      if (value.length === 4) {
        setError('');
        setLoading(true);
        
        // Simple PIN check for 1969
        setTimeout(() => {
          if (value === '1969') {
            onAuthenticated();
          } else {
            setError('Invalid PIN. Please try again.');
            setPin('');
          }
          setLoading(false);
        }, 300);
      }
    }
  };

  return (
    <div className="pin-auth-container">
      <div className="pin-auth-card">
        <div className="company-header">
          <h1>🚌 Bus Booking System</h1>
          <p>Sri Murugan Tours & Travels</p>
        </div>
        
        <form onSubmit={handleSubmit} className="pin-form">
          <h2>Enter PIN to Access</h2>
          
          <div className="pin-input-container">
            <input
              type="password"
              value={pin}
              onChange={handlePinChange}
              maxLength="4"
              className="pin-input"
              disabled={loading}
              autoFocus
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={pin.length !== 4 || loading}
          >
            {loading ? 'Verifying...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PinAuth;
