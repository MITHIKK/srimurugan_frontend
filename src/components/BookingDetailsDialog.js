import React from 'react';
import './BookingDetailsDialog.css';

const BookingDetailsDialog = ({ booking, isOpen, onClose, onEdit, onCancel }) => {
  if (!isOpen || !booking) return null;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="booking-dialog-overlay">
      <div className="booking-dialog">
        <div className="booking-dialog-header">
          <h2>Booking Details</h2>
        </div>
        
        <div className="booking-dialog-content">
          <div className="booking-detail-row">
            <span className="booking-label">Bus Name:</span>
            <span className="booking-value">{booking.busName}</span>
          </div>
          
          <div className="booking-detail-row">
            <span className="booking-label">Party Name:</span>
            <span className="booking-value">{booking.partyName}</span>
          </div>
          
          {booking.partyPhone && (
            <div className="booking-detail-row">
              <span className="booking-label">Phone Number:</span>
              <span className="booking-value">{booking.partyPhone}</span>
            </div>
          )}
          
          <div className="booking-detail-row">
            <span className="booking-label">From:</span>
            <span className="booking-value">{booking.from}</span>
          </div>
          
          {booking.via && (
            <div className="booking-detail-row">
              <span className="booking-label">Via:</span>
              <span className="booking-value">{booking.via}</span>
            </div>
          )}
          
          <div className="booking-detail-row">
            <span className="booking-label">To:</span>
            <span className="booking-value">{booking.to}</span>
          </div>
          
          <div className="booking-detail-row">
            <span className="booking-label">Number of Days:</span>
            <span className="booking-value">{booking.numberOfDays}</span>
          </div>
          
          <div className="booking-detail-row">
            <span className="booking-label">Booking Date:</span>
            <span className="booking-value">{formatDate(booking.bookingDate)}</span>
          </div>
          
          {booking.beforeNightPickup && (
            <div className="booking-detail-row">
              <span className="booking-label">Night Pickup:</span>
              <span className="booking-value">Yes</span>
            </div>
          )}
          
          {booking.pickupTime && (
            <div className="booking-detail-row">
              <span className="booking-label">Pickup Time:</span>
              <span className="booking-value">{booking.pickupTime}</span>
            </div>
          )}
          
          {booking.totalAmount && (
            <div className="booking-detail-row">
              <span className="booking-label">Total Amount:</span>
              <span className="booking-value">₹{booking.totalAmount}</span>
            </div>
          )}
          
          {booking.advance && (
            <div className="booking-detail-row">
              <span className="booking-label">Advance:</span>
              <span className="booking-value">₹{booking.advance}</span>
            </div>
          )}
          
          {booking.balance && (
            <div className="booking-detail-row">
              <span className="booking-label">Balance:</span>
              <span className="booking-value">₹{booking.balance}</span>
            </div>
          )}
          
          {booking.recommendedBy && (
            <div className="booking-detail-row">
              <span className="booking-label">Recommended By:</span>
              <span className="booking-value">{booking.recommendedBy}</span>
            </div>
          )}
        </div>
        
        <div className="booking-dialog-actions">
          <button 
            className="booking-action-btn edit-btn" 
            onClick={() => onEdit(booking)}
          >
            Edit Booking
          </button>
          <button 
            className="booking-action-btn cancel-btn" 
            onClick={() => onCancel(booking)}
          >
            Cancel Booking
          </button>
          <button 
            className="booking-action-btn exit-btn" 
            onClick={onClose}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsDialog;
