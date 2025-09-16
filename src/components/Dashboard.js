import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import BookingModal from './BookingModal';
import ConfirmationModal from './ConfirmationModal';
import { formatDateKey } from '../utils/dateUtils';

const Dashboard = ({ onLogout, bookings, setBookings }) => {
  const [currentBus, setCurrentBus] = useState('VETTAIYAN');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState(null);

  const buses = ['VETTAIYAN', 'DHEERAN', 'MAARAN', 'VEERAN'];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      if (data.success) {
        // Convert the array of bookings into our bookings object format
        const bookingsObj = {};
        data.data.forEach(booking => {
          const date = new Date(booking.date);
          const dateStr = formatDateKey(date);
          const key = `${booking.busName}_${dateStr}`;
          bookingsObj[key] = booking;
        });
        setBookings(bookingsObj);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setNotification({
        type: 'error',
        message: 'Failed to load bookings. Please try refreshing the page.'
      });
    }
  };

  const getBooking = (bus, date) => {
    const key = `${bus}_${date}`;
    return bookings[key] || null;
  };

  const setBooking = (bus, date, booking) => {
    const key = `${bus}_${date}`;
    const newBookings = { ...bookings, [key]: booking };
    setBookings(newBookings);
  };

  const removeBooking = (bus, date) => {
    const key = `${bus}_${date}`;
    const newBookings = { ...bookings };
    delete newBookings[key];
    setBookings(newBookings);
  };

  const removeChain = (bus, createdAt) => {
    const newBookings = { ...bookings };
    Object.keys(newBookings).forEach(key => {
      const booking = newBookings[key];
      if (booking && booking.bus === bus && booking.createdAt === createdAt) {
        delete newBookings[key];
      }
    });
    setBookings(newBookings);
  };

  const handleDateClick = (date) => {
    const dateStr = formatDateKey(date);
    const booking = getBooking(currentBus, dateStr);
    
    if (booking && !editMode) {
      setCurrentBooking({ booking, date });
      setShowConfirmationModal(true);
    } else {
      setSelectedDate(date);
      setShowBookingModal(true);
    }
  };

  const handleSaveBooking = (bookingData) => {
    const numberOfDays = bookingData.numberOfDays || 1;
    
    // If editing, remove old chain first
    if (bookingData.editChainCreatedAt) {
      removeChain(currentBus, bookingData.editChainCreatedAt);
    }

    // Save booking for each day
    for (let i = 0; i < numberOfDays; i++) {
      const bookingDate = new Date(selectedDate);
      bookingDate.setDate(bookingDate.getDate() + i);
      const dateStr = formatDateKey(bookingDate);
      
      const dayBooking = { ...bookingData };
      dayBooking.date = dateStr;
      dayBooking.bus = currentBus;
      
      if (i > 0) {
        dayBooking.isContinuation = true;
        dayBooking.dayNumber = i + 1;
        dayBooking.totalDays = numberOfDays;
      }
      
      setBooking(currentBus, dateStr, dayBooking);
    }
    
    setShowBookingModal(false);
    showNotification(numberOfDays > 1 
      ? `Booking saved successfully for ${numberOfDays} days!` 
      : 'Booking saved successfully!', 'success');
  };

  const handleEditBooking = () => {
    if (!currentBooking) return;
    
    const chainStartDate = getChainStartDate(currentBus, currentBooking.booking, currentBooking.date);
    setSelectedDate(chainStartDate);
    setEditMode(true);
    setShowConfirmationModal(false);
    setShowBookingModal(true);
  };

  const handleCancelBooking = () => {
    if (!currentBooking) return;
    
    if (window.confirm('Are you sure you want to cancel this trip? This will remove all days in this booking.')) {
      removeChain(currentBus, currentBooking.booking.createdAt);
      setShowConfirmationModal(false);
      showNotification('Booking cancelled.', 'success');
    }
  };

  const getChainStartDate = (bus, booking, clickedDate) => {
    const createdAt = booking.createdAt;
    let d = new Date(clickedDate);
    
    while (true) {
      const prev = new Date(d);
      prev.setDate(prev.getDate() - 1);
      const prevKey = formatDateKey(prev);
      const prevBooking = getBooking(bus, prevKey);
      
      if (prevBooking && prevBooking.createdAt === createdAt) {
        d = prev;
      } else {
        break;
      }
    }
    
    return d;
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getBusBackground = () => {
    switch(currentBus) {
      case 'VETTAIYAN': return '/vettaiyan.jpg';
      case 'DHEERAN': return '/dheeran.jpg';
      case 'MAARAN': return '/maara.jpg';
      case 'VEERAN': return '/veeran.jpg';
      default: return '';
    }
  };

  return (
    <div className="dashboard" style={{ backgroundImage: `url(${getBusBackground()})` }}>
      <header className="main-header">
        <div className="header-content">
          <h1>🚌 Sri Murugan - Tourist Bus Management</h1>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="bus-tabs">
        {buses.map(bus => (
          <button
            key={bus}
            className={`tab-btn ${currentBus === bus ? 'active' : ''}`}
            onClick={() => setCurrentBus(bus)}
          >
            {bus}
          </button>
        ))}
      </div>

      <Calendar
        currentBus={currentBus}
        bookings={bookings}
        getBooking={getBooking}
        onDateClick={handleDateClick}
      />

      <div className="status-legend">
        <div className="legend-item">
          <span className="status-dot free"></span> Available
        </div>
        <div className="legend-item">
          <span className="status-dot booked"></span> Booked
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          selectedDate={selectedDate}
          currentBus={currentBus}
          booking={editMode ? getBooking(currentBus, formatDateKey(selectedDate)) : null}
          bookings={bookings}
          getBooking={getBooking}
          onSave={handleSaveBooking}
          onClose={() => {
            setShowBookingModal(false);
            setEditMode(false);
          }}
          editMode={editMode}
        />
      )}

      {showConfirmationModal && currentBooking && (
        <ConfirmationModal
          booking={currentBooking.booking}
          date={currentBooking.date}
          onEdit={handleEditBooking}
          onCancel={handleCancelBooking}
          onClose={() => {
            setShowConfirmationModal(false);
            setCurrentBooking(null);
          }}
        />
      )}

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
