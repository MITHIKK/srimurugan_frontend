import React, { useState, useEffect } from 'react';
import './App.css';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';

import axios from 'axios';

// API base URL from environment variable
const API_URL = process.env.REACT_APP_API_URL;

// Example GET request
const fetchData = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/some-route`);
    console.log(response.data);
  } catch (err) {
    console.error('API error:', err);
  }
};


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookings, setBookings] = useState({});

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    const stored = localStorage.getItem('sriMuruganBookings');
    if (stored) {
      setBookings(JSON.parse(stored));
    }
  };

  const saveBookingsToStorage = (newBookings) => {
    localStorage.setItem('sriMuruganBookings', JSON.stringify(newBookings));
    setBookings(newBookings);
  };

  const handleLogin = (pin) => {
    if (pin === '1969') {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <Dashboard 
          onLogout={handleLogout}
          bookings={bookings}
          setBookings={saveBookingsToStorage}
        />
      )}
    </div>
  );
}

export default App;
