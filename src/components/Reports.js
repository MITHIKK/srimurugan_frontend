import React, { useState, useEffect } from 'react';
import './Reports.css';
import axios from 'axios';

const Reports = () => {
  const [selectedBus, setSelectedBus] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pastTrips, setPastTrips] = useState([]);
  const [futureTrips, setFutureTrips] = useState([]);

  const buses = [
    { name: 'Vettaiyan', color: '#ff6b6b', icon: '🚌' },
    { name: 'Dheeran', color: '#4ecdc4', icon: '🚍' },
    { name: 'Maaran', color: '#45b7d1', icon: '🚐' },
    { name: 'Veeran', color: '#96ceb4', icon: '🚑' }
  ];

  const fetchBusBookings = async (busName) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/bus/${busName}`);
      const bookingsData = response.data;
      setBookings(bookingsData);
      
      // Separate past and future trips
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      const past = bookingsData.filter(booking => {
        const bookingDate = new Date(booking.bookingDate);
        const endDate = new Date(bookingDate);
        endDate.setDate(endDate.getDate() + booking.numberOfDays - 1);
        return endDate < currentDate;
      });
      
      const future = bookingsData.filter(booking => {
        const bookingDate = new Date(booking.bookingDate);
        return bookingDate >= currentDate;
      });
      
      setPastTrips(past.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))); // Most recent first
      setFutureTrips(future.sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate))); // Earliest first
      
    } catch (error) {
      console.error('Error fetching bus bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBusSelect = (bus) => {
    setSelectedBus(bus);
    fetchBusBookings(bus.name);
  };

  const handleBackToBusList = () => {
    setSelectedBus(null);
    setBookings([]);
    setPastTrips([]);
    setFutureTrips([]);
  };

  const handleHomeClick = () => {
    window.location.href = '/';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  if (selectedBus) {
    return (
      <div className="reports-container">
        <div className="reports-header">
          <div className="header-navigation">
            <button className="back-btn" onClick={handleBackToBusList}>
              ← Back to Buses
            </button>
            <button className="home-btn" onClick={handleHomeClick}>
              🏠 Home
            </button>
          </div>
          <h1 className="reports-title">
            <span className="bus-icon">{selectedBus.icon}</span>
            {selectedBus.name} - Trip Reports
          </h1>
        </div>

        {loading ? (
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <p>Loading trip data...</p>
          </div>
        ) : (
          <div className="reports-content">
            {/* Summary Statistics */}
            <div className="summary-stats">
              <div className="stat-card">
                <h3>Total Bookings</h3>
                <p className="stat-number">{bookings.length}</p>
              </div>
              <div className="stat-card">
                <h3>Past Trips</h3>
                <p className="stat-number">{pastTrips.length}</p>
              </div>
              <div className="stat-card">
                <h3>Future Trips</h3>
                <p className="stat-number">{futureTrips.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p className="stat-number">
                  {formatCurrency(bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0))}
                </p>
              </div>
            </div>

            {/* Future Trips Section */}
            <div className="trips-section">
              <h2 className="section-title">
                <span className="section-icon">📅</span>
                Upcoming Trips ({futureTrips.length})
              </h2>
              
              {futureTrips.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📭</span>
                  <p>No upcoming trips scheduled</p>
                </div>
              ) : (
                <div className="trips-grid">
                  {futureTrips.map(trip => (
                    <div key={trip._id} className="trip-card future-trip">
                      <div className="trip-header">
                        <h3 className="trip-route">
                          <span className="location-from">{trip.from}</span>
                          <span className="route-arrow">→</span>
                          <span className="location-to">{trip.to}</span>
                        </h3>
                        <span className="trip-status future">Future</span>
                      </div>
                      
                      <div className="trip-details">
                        <div className="detail-row">
                          <span className="detail-label">Party Name:</span>
                          <span className="detail-value">{trip.partyName}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Trip Date:</span>
                          <span className="detail-value">{formatDate(trip.bookingDate)}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Duration:</span>
                          <span className="detail-value">{trip.numberOfDays} day{trip.numberOfDays > 1 ? 's' : ''}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Total Amount:</span>
                          <span className="detail-value price">{formatCurrency(trip.totalAmount)}</span>
                        </div>
                        {trip.via && (
                          <div className="detail-row">
                            <span className="detail-label">Via:</span>
                            <span className="detail-value via">{trip.via}</span>
                          </div>
                        )}
                        {trip.beforeNightPickup && (
                          <div className="detail-row">
                            <span className="detail-label">Night Pickup:</span>
                            <span className="detail-value night-pickup">
                              🌙 {trip.pickupTime || 'Yes'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Trips Section */}
            <div className="trips-section">
              <h2 className="section-title">
                <span className="section-icon">📋</span>
                Transaction History ({pastTrips.length})
              </h2>
              
              {pastTrips.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📝</span>
                  <p>No past trips recorded</p>
                </div>
              ) : (
                <div className="trips-grid">
                  {pastTrips.map(trip => (
                    <div key={trip._id} className="trip-card past-trip">
                      <div className="trip-header">
                        <h3 className="trip-route">
                          <span className="location-from">{trip.from}</span>
                          <span className="route-arrow">→</span>
                          <span className="location-to">{trip.to}</span>
                        </h3>
                        <span className="trip-status completed">Completed</span>
                      </div>
                      
                      <div className="trip-details">
                        <div className="detail-row">
                          <span className="detail-label">Party Name:</span>
                          <span className="detail-value">{trip.partyName}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Trip Date:</span>
                          <span className="detail-value">{formatDate(trip.bookingDate)}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Duration:</span>
                          <span className="detail-value">{trip.numberOfDays} day{trip.numberOfDays > 1 ? 's' : ''}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Total Amount:</span>
                          <span className="detail-value price">{formatCurrency(trip.totalAmount)}</span>
                        </div>
                        {trip.via && (
                          <div className="detail-row">
                            <span className="detail-label">Via:</span>
                            <span className="detail-value via">{trip.via}</span>
                          </div>
                        )}
                        {trip.beforeNightPickup && (
                          <div className="detail-row">
                            <span className="detail-label">Night Pickup:</span>
                            <span className="detail-value night-pickup">
                              🌙 {trip.pickupTime || 'Yes'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div className="header-navigation-main">
          <button className="home-btn" onClick={handleHomeClick}>
            🏠 Home
          </button>
        </div>
        <h1 className="reports-title">
          <span className="title-icon">📊</span>
          Bus Reports Dashboard
        </h1>
        <p className="reports-subtitle">Select a bus to view detailed trip reports</p>
      </div>

      <div className="bus-selection-grid">
        {buses.map((bus) => (
          <div 
            key={bus.name} 
            className="bus-card"
            onClick={() => handleBusSelect(bus)}
            style={{ '--bus-color': bus.color }}
          >
            <div className="bus-card-header">
              <span className="bus-icon">{bus.icon}</span>
              <h3 className="bus-name">{bus.name}</h3>
            </div>
            <div className="bus-card-action">
              <span className="action-text">View Reports</span>
              <span className="action-arrow">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
