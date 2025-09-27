import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import PinAuth from './components/PinAuth';
import HomePage from './components/HomePage';
import BusPage from './components/BusPage';
import Reports from './components/Reports';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/');
  };

  if (!isAuthenticated) {
    return <PinAuth onAuthenticated={handleAuthenticated} />;
  }

  const isHomePage = location.pathname === '/';
  const isReportsPage = location.pathname === '/reports';

  return (
    <div className="App">
      {!isHomePage && !isReportsPage && (
        <header className="app-header">
          <div className="header-content">
            <h1>🚌 Sri Murugan Tours & Travels</h1>
            <p>Bus Booking Management System</p>
            <div className="header-actions">
              <button 
                className="reports-btn" 
                onClick={() => navigate('/reports')}
              >
                📊 Reports
              </button>
              <button 
                className="home-btn" 
                onClick={() => navigate('/')}
              >
                🏠 Home
              </button>
              <button 
                className="logout-btn" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </header>
      )}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bus/:busName" element={<BusPage />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 Sri Murugan Tours & Travels. All rights reserved.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
