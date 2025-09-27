import React, { useState, useEffect } from 'react';
import './BusCalendar.css';
import { formatTamilDate, convertToTamilNumber } from '../utils/tamilCalendar';
import BookingForm from './BookingForm';
import BookingDetailsDialog from './BookingDetailsDialog';
import axios from 'axios';
import { API_URL } from '../config';

const BusCalendar = ({ busName, busColor }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [busName]);

  const fetchBookings = async () => {
    try {
      //const response = await axios.get(`http://localhost:5000/api/bookings/bus/${busName}`);
      const response = await axios.get(`${API_URL}/api/bookings/bus/${busName}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleDateClick = (value) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const clickedDate = new Date(value);
    clickedDate.setHours(0, 0, 0, 0);
    
    // Prevent booking past dates
    if (clickedDate < today) {
      alert('Cannot book dates in the past. Please select a future date.');
      return;
    }
    
    // If date is already booked, show booking details
    if (isDateBooked(value)) {
      const bookingForDate = getBookingInfo(value);
      if (bookingForDate) {
        setSelectedBooking(bookingForDate);
        setShowBookingDetails(true);
      }
      return;
    }
    
    // Otherwise, open booking form for available dates
    setSelectedDate(value);
    setShowBookingForm(true);
  };

  const checkDateOverlap = (startDate, numberOfDays) => {
    const conflicts = [];
    for (let i = 0; i < numberOfDays; i++) {
      const checkDate = new Date(startDate);
      checkDate.setDate(checkDate.getDate() + i);
      
      const conflictBooking = bookings.find(booking => {
        const bookingStartDate = new Date(booking.bookingDate);
        const bookingEndDate = new Date(booking.bookingDate);
        bookingEndDate.setDate(bookingEndDate.getDate() + booking.numberOfDays - 1);
        
        return checkDate >= bookingStartDate && checkDate <= bookingEndDate;
      });
      
      if (conflictBooking) {
        conflicts.push({
          date: checkDate.toLocaleDateString(),
          booking: conflictBooking
        });
      }
    }
    return conflicts;
  };

  const handleBookingSubmit = async (bookingData) => {
    // Check for date overlaps before submitting (but exclude current booking if editing)
    const conflicts = checkDateOverlap(selectedDate, bookingData.numberOfDays).filter(
      conflict => !editingBooking || conflict.booking._id !== editingBooking._id
    );
    
    if (conflicts.length > 0) {
      const conflictDates = conflicts.map(c => c.date).join(', ');
      alert(`Cannot book: The following dates are already booked: ${conflictDates}. Please choose different dates.`);
      return;
    }

    setLoading(true);
    try {
      const dataToSend = {
        ...bookingData,
        busName: busName,
        bookingDate: selectedDate
      };
      
      console.log('Sending booking data:', dataToSend);
      
      let response;
      if (editingBooking) {
        // Update existing booking
        //response = await axios.put(`http://localhost:5000/api/bookings/${editingBooking._id}`, dataToSend);
        response = await axios.put(`${API_URL}/api/bookings/${editingBooking._id}`, dataToSend);
        alert('Booking updated successfully!');
      } else {
        // Create new booking
        //response = await axios.post('http://localhost:5000/api/bookings', dataToSend);
        response = await axios.post(`${API_URL}/api/bookings`, dataToSend);
        alert('Booking saved successfully!');
      }
      
      console.log('Booking response:', response.data);
      
      setShowBookingForm(false);
      setSelectedDate(null);
      setEditingBooking(null);
      fetchBookings();
    } catch (error) {
      console.error('Error saving booking:', error);
      
      let errorMessage = editingBooking ? 'Error updating booking.' : 'Error saving booking.';
      
      if (error.response) {
        // Server responded with error status
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
          
          if (error.response.data.details) {
            const fieldErrors = error.response.data.details.map(d => `${d.field}: ${d.message}`).join(', ');
            errorMessage += ` (${fieldErrors})`;
          }
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check if the server is running on http://localhost:5000';
      } else {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowBookingForm(false);
    setSelectedDate(null);
    setEditingBooking(null);
  };

  const handleCloseBookingDetails = () => {
    setShowBookingDetails(false);
    setSelectedBooking(null);
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setSelectedDate(new Date(booking.bookingDate));
    setShowBookingDetails(false);
    setShowBookingForm(true);
  };

  const handleCancelBooking = async (booking) => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      setLoading(true);
      try {
        //await axios.delete(`http://localhost:5000/api/bookings/${booking._id}`);
        await axios.delete(`${API_URL}/api/bookings/${booking._id}`);
        alert('Booking cancelled successfully!');
        setShowBookingDetails(false);
        setSelectedBooking(null);
        fetchBookings();
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Error cancelling booking. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isDateBooked = (date) => {
    return bookings.some(booking => {
      const bookingDate = new Date(booking.bookingDate);
      const startDate = new Date(bookingDate);
      const endDate = new Date(bookingDate);
      endDate.setDate(endDate.getDate() + booking.numberOfDays - 1);
      
      return date >= startDate && date <= endDate;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  const hasBeforeNightPickupForDate = (date) => {
    return bookings.some(booking => {
      if (!booking.beforeNightPickup) return false;
      
      const bookingDate = new Date(booking.bookingDate);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      return bookingDate.toDateString() === nextDay.toDateString();
    });
  };

  const getBookingInfo = (date) => {
    return bookings.find(booking => {
      const bookingDate = new Date(booking.bookingDate);
      return bookingDate.toDateString() === date.toDateString();
    });
  };

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const renderCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(currentYear, currentMonth - 1, day);
      const tamilInfo = formatTamilDate(date);
      
      days.push(
        <div key={`prev-${day}`} className="calendar-day other-month">
          <div className="day-number">{day}</div>
          <div className="tamil-date">{tamilInfo.month} {tamilInfo.date}</div>
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const tamilInfo = formatTamilDate(date);
      const bookedInfo = getBookingInfo(date);
      const hasNightPickup = hasBeforeNightPickupForDate(date);
      
      let dayClass = 'calendar-day current-month';
      if (isToday(date)) dayClass += ' today';
      if (isPastDate(date)) dayClass += ' past';
      else if (isDateBooked(date)) dayClass += ' booked';
      else dayClass += ' available';
      if (hasNightPickup) dayClass += ' night-pickup';
      if (selectedDate && selectedDate.toDateString() === date.toDateString()) dayClass += ' selected';

      days.push(
        <div
          key={day}
          className={dayClass}
          onClick={() => !isPastDate(date) && handleDateClick(date)}
        >
          <div className="day-number">{day}</div>
          <div className="tamil-date">{tamilInfo.month} {tamilInfo.date}</div>
          <div className="tamil-day">{tamilInfo.day}</div>
          
          {bookedInfo && (
            <div className="booking-details">
              {bookedInfo.to && (
                <div className="destination">{bookedInfo.to}</div>
              )}
              {bookedInfo.numberOfDays > 1 && (
                <div className="days-count">{bookedInfo.numberOfDays} days</div>
              )}
            </div>
          )}
          
          {hasNightPickup && (
            <div className="night-pickup-indicator">
              <span>🌙 Night Pickup</span>
            </div>
          )}
          
          {isToday(date) && (
            <div className="today-badge">Today</div>
          )}
        </div>
      );
    }

    // Next month days to fill grid
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDay + daysInMonth);
    
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(currentYear, currentMonth + 1, day);
      const tamilInfo = formatTamilDate(date);
      
      days.push(
        <div key={`next-${day}`} className="calendar-day other-month">
          <div className="day-number">{day}</div>
          <div className="tamil-date">{tamilInfo.month} {tamilInfo.date}</div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bus-calendar-container">
      <div className="bus-header" style={{ backgroundColor: busColor }}>
        <h2>🚌 {busName}</h2>
        {selectedDate && (
          <div className="selected-date-info">
            Selected: {selectedDate.toLocaleDateString()} - {formatTamilDate(selectedDate).fullDate}
          </div>
        )}
      </div>

      <div className="calendar-wrapper">
        <div className="calendar-navigation">
          <button className="nav-btn prev-btn" onClick={previousMonth}>
            <span className="nav-icon">‹</span>
            <span className="nav-text">Previous</span>
          </button>
          
          <div className="month-display">
            <h1 className="month-title">{monthNames[currentMonth]} {currentYear}</h1>
            <p className="tamil-month-title">{formatTamilDate(new Date(currentYear, currentMonth, 1)).fullDate}</p>
          </div>
          
          <button className="nav-btn next-btn" onClick={nextMonth}>
            <span className="nav-text">Next</span>
            <span className="nav-icon">›</span>
          </button>
        </div>

        <div className="calendar-weekdays">
          {weekDays.map((day, index) => (
            <div key={day} className={`weekday-header ${index === 0 || index === 6 ? 'weekend-header' : ''}`}>
              <span className="weekday-name">{day}</span>
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {renderCalendar()}
        </div>
        
        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-color available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-color booked"></div>
            <span>Booked</span>
          </div>
          <div className="legend-item">
            <div className="legend-color today"></div>
            <span>Today</span>
          </div>
          <div className="legend-item">
            <div className="legend-color past"></div>
            <span>Past</span>
          </div>
        </div>
      </div>

      {showBookingForm && (
        <BookingForm
          busName={busName}
          date={selectedDate}
          onSubmit={handleBookingSubmit}
          onClose={handleCloseForm}
          loading={loading}
          editingBooking={editingBooking}
        />
      )}
      
      <BookingDetailsDialog
        booking={selectedBooking}
        isOpen={showBookingDetails}
        onClose={handleCloseBookingDetails}
        onEdit={handleEditBooking}
        onCancel={handleCancelBooking}
      />
    </div>
  );
};

export default BusCalendar;
