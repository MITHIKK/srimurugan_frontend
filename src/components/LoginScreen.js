import React, { useState } from 'react';

const LoginScreen = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin(pin)) {
      setError('');
    } else {
      setError('Invalid PIN. Please try again.');
      setPin('');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: 'url(/back.jpg)' }}>
      <div className="login-box">
        <div className="company-header">
          <h1>Sri Murugan Bus</h1>
          <p>It is Restricted</p>
        </div>
        <div className="login-form">
          <h2>Enter PIN to Access</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Enter PIN"
              maxLength="4"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button type="submit">Login</button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
