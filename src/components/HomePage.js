import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const buses = [
    { name: 'Vettaiyan', color: '#FF6B6B', route: '/bus/vettaiyan' },
    { name: 'Dheeran', color: '#4ECDC4', route: '/bus/dheeran' },
    { name: 'Maaran', color: '#45B7D1', route: '/bus/maaran' },
    { name: 'Veeran', color: '#96CEB4', route: '/bus/veeran' }
  ];

  const handleBusClick = (route) => {
    navigate(route);
  };

  const handleReportsClick = () => {
    navigate('/reports');
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>🚌 Sri Murugan Tours & Travels</h1>
        <p>Select a Bus to Manage Bookings</p>
        <button className="reports-access-btn" onClick={handleReportsClick}>
          📊 View Reports Dashboard
        </button>
      </div>

      <div className="bus-grid">
        {buses.map(bus => (
          <div
            key={bus.name}
            className="bus-card"
            style={{ 
              borderColor: bus.color,
              '--bus-color': bus.color
            }}
            onClick={() => handleBusClick(bus.route)}
          >
            <div className="bus-card-header" style={{ backgroundColor: bus.color }}>
              <h2>🚌 {bus.name}</h2>
            </div>
            <div className="bus-card-body">
              <p>Click to manage bookings for {bus.name}</p>
              <div className="bus-features">
                <span>📅 Calendar View</span>
                <span>📝 Book Trips</span>
                <span>📊 View Bookings</span>
              </div>
              <button 
                className="manage-btn"
                style={{ backgroundColor: bus.color }}
              >
                Manage Bookings
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="home-footer">
        <p>Choose a bus above to start managing bookings</p>
      </div>
    </div>
  );
};

export default HomePage;
