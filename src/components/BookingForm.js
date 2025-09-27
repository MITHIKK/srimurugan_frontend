import React, { useState } from 'react';
import Modal from 'react-modal';
import { formatTamilDate } from '../utils/tamilCalendar';
import './BookingForm.css';

Modal.setAppElement('#root');

const BookingForm = ({ busName, date, onSubmit, onClose, loading, editingBooking }) => {
  const [formData, setFormData] = useState({
    partyName: editingBooking?.partyName || '',
    partyPhone: editingBooking?.partyPhone || '',
    from: editingBooking?.from || '',
    via: editingBooking?.via || '',
    to: editingBooking?.to || '',
    numberOfDays: editingBooking?.numberOfDays || 1,
    beforeNightPickup: editingBooking?.beforeNightPickup || false,
    pickupTime: editingBooking?.pickupTime || '',
    totalAmount: editingBooking?.totalAmount || '',
    advance: editingBooking?.advance || '',
    recommendedBy: editingBooking?.recommendedBy || ''
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});

  const timeOptions = ['7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM', '12:00 AM'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;
    
    if (name === 'numberOfDays') {
      processedValue = parseInt(value) || 1;
    } else if (name === 'partyPhone') {
      // Only allow digits and limit to 10
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'totalAmount' || name === 'advance') {
      // Only allow numbers and decimals
      processedValue = value.replace(/[^0-9.]/g, '');
    } else if (type === 'checkbox') {
      processedValue = checked;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Only 'To' field is mandatory
    if (!formData.to.trim()) {
      newErrors.to = 'Destination (To) is required';
    }
    
    // Optional validations - only validate if fields are filled
    if (formData.partyPhone.trim() && formData.partyPhone.length !== 10) {
      newErrors.partyPhone = 'Phone number must be 10 digits';
    }
    
    if (formData.beforeNightPickup && !formData.pickupTime) {
      newErrors.pickupTime = 'Please select pickup time';
    }
    
    if (formData.totalAmount && formData.advance) {
      const total = parseFloat(formData.totalAmount);
      const adv = parseFloat(formData.advance);
      if (adv > total) {
        newErrors.advance = 'Advance cannot be more than total amount';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmBooking = () => {
    const bookingData = {
      ...formData,
      balance: formData.totalAmount && formData.advance ? 
        (parseFloat(formData.totalAmount) - parseFloat(formData.advance)).toString() : ''
    };
    onSubmit(bookingData);
    setShowConfirmation(false);
  };

  const calculateBalance = () => {
    if (formData.totalAmount && formData.advance) {
      const total = parseFloat(formData.totalAmount) || 0;
      const advance = parseFloat(formData.advance) || 0;
      return (total - advance).toFixed(2);
    }
    return '0.00';
  };

  const tamilDateInfo = formatTamilDate(date);

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      className="booking-modal"
      overlayClassName="booking-modal-overlay"
    >
      <div className="booking-form-container">
        <div className="booking-form-header">
          <h2>{editingBooking ? 'Edit Booking' : 'New Booking'} - {busName}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="selected-date-info">
          <div className="date-display">
            <span className="english-date">
              📅 {date.toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <span className="tamil-date">
              🗓️ {tamilDateInfo.fullDate}
            </span>
          </div>
        </div>

        {!showConfirmation ? (
        <form onSubmit={handleSubmit} className="booking-form">
          {/* Party Details */}
          <div className="form-section">
            <h3>Party Details</h3>
            <div className="form-group">
              <label htmlFor="partyName">Party Name</label>
              <input
                type="text"
                id="partyName"
                name="partyName"
                value={formData.partyName}
                onChange={handleInputChange}
                placeholder="Enter party name"
                disabled={loading}
                className={errors.partyName ? 'error' : ''}
              />
              {errors.partyName && <span className="error-text">{errors.partyName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="partyPhone">Party Phone Number</label>
              <input
                type="text"
                id="partyPhone"
                name="partyPhone"
                value={formData.partyPhone}
                onChange={handleInputChange}
                placeholder="Enter 10-digit phone number"
                disabled={loading}
                className={errors.partyPhone ? 'error' : ''}
              />
              {errors.partyPhone && <span className="error-text">{errors.partyPhone}</span>}
            </div>
          </div>

          {/* Route Details */}
          <div className="form-section">
            <h3>Route Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="from">From</label>
                <input
                  type="text"
                  id="from"
                  name="from"
                  value={formData.from}
                  onChange={handleInputChange}
                  placeholder="Starting location"
                  disabled={loading}
                  className={errors.from ? 'error' : ''}
                />
                {errors.from && <span className="error-text">{errors.from}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="to">To *</label>
                <input
                  type="text"
                  id="to"
                  name="to"
                  value={formData.to}
                  onChange={handleInputChange}
                  placeholder="Destination"
                  disabled={loading}
                  className={errors.to ? 'error' : ''}
                />
                {errors.to && <span className="error-text">{errors.to}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="via">VIA (Optional)</label>
              <input
                type="text"
                id="via"
                name="via"
                value={formData.via}
                onChange={handleInputChange}
                placeholder="Intermediate stops (if any)"
                disabled={loading}
              />
            </div>
          </div>

          {/* Trip Details */}
          <div className="form-section">
            <h3>Trip Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="numberOfDays">Number of Days</label>
                <select
                  id="numberOfDays"
                  name="numberOfDays"
                  value={formData.numberOfDays}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  {[...Array(30)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} day{i > 0 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="recommendedBy">Recommended By</label>
                <input
                  type="text"
                  id="recommendedBy"
                  name="recommendedBy"
                  value={formData.recommendedBy}
                  onChange={handleInputChange}
                  placeholder="Person who recommended us"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Before Night Pickup */}
            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="beforeNightPickup"
                  name="beforeNightPickup"
                  checked={formData.beforeNightPickup}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <label htmlFor="beforeNightPickup" className="checkbox-label">
                  Before Night Pickup (Previous day pickup)
                </label>
              </div>
              {formData.beforeNightPickup && (
                <div className="pickup-time-section">
                  <label htmlFor="pickupTime">Select Pickup Time *</label>
                  <select
                    id="pickupTime"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={errors.pickupTime ? 'error' : ''}
                  >
                    <option value="">Select time</option>
                    {timeOptions.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  {errors.pickupTime && <span className="error-text">{errors.pickupTime}</span>}
                </div>
              )}
            </div>
          </div>

          {/* Financial Details */}
          <div className="form-section">
            <h3>Financial Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="totalAmount">Total Amount (₹)</label>
                <input
                  type="text"
                  id="totalAmount"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="advance">Advance Amount (₹)</label>
                <input
                  type="text"
                  id="advance"
                  name="advance"
                  value={formData.advance}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  disabled={loading}
                  className={errors.advance ? 'error' : ''}
                />
                {errors.advance && <span className="error-text">{errors.advance}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Balance Amount (₹)</label>
              <div className="calculated-field">
                ₹ {calculateBalance()}
              </div>
            </div>
          </div>

          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <div className="summary-item">
              <span>Bus:</span> <strong>{busName}</strong>
            </div>
            <div className="summary-item">
              <span>Start Date:</span> <strong>{date.toLocaleDateString()}</strong>
            </div>
            <div className="summary-item">
              <span>End Date:</span> 
              <strong>
                {new Date(date.getTime() + (formData.numberOfDays - 1) * 24 * 60 * 60 * 1000)
                  .toLocaleDateString()}
              </strong>
            </div>
            <div className="summary-item">
              <span>Route:</span> 
              <strong>{formData.from || '...'} → {formData.to || '...'}</strong>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading ? (editingBooking ? 'Updating...' : 'Saving...') : (editingBooking ? 'Update Booking' : 'Save Booking')}
            </button>
          </div>
        </form>
        ) : (
        <div className="confirmation-dialog">
          <h3>🎉 Confirm Booking Details</h3>
          <div className="confirmation-details">
            <div className="detail-group">
              <h4>Party Information</h4>
              {formData.partyName.trim() && <p><strong>Name:</strong> {formData.partyName}</p>}
              {formData.partyPhone.trim() && <p><strong>Phone:</strong> {formData.partyPhone}</p>}
              {formData.recommendedBy.trim() && <p><strong>Recommended by:</strong> {formData.recommendedBy}</p>}
              {!formData.partyName.trim() && !formData.partyPhone.trim() && !formData.recommendedBy.trim() && (
                <p><em>No party information provided</em></p>
              )}
            </div>

            <div className="detail-group">
              <h4>Trip Details</h4>
              <p><strong>Bus:</strong> {busName}</p>
              <p><strong>Route:</strong> {formData.from || 'Not specified'} {formData.via ? `via ${formData.via}` : ''} → {formData.to}</p>
              <p><strong>Duration:</strong> {formData.numberOfDays} day{formData.numberOfDays > 1 ? 's' : ''}</p>
              <p><strong>Start Date:</strong> {date.toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(date.getTime() + (formData.numberOfDays - 1) * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              {formData.beforeNightPickup && (
                <p><strong>Before Night Pickup:</strong> Yes, at {formData.pickupTime}</p>
              )}
            </div>

            {(formData.totalAmount.trim() || formData.advance.trim()) && (
              <div className="detail-group">
                <h4>Financial Details</h4>
                {formData.totalAmount.trim() && <p><strong>Total Amount:</strong> ₹{formData.totalAmount}</p>}
                {formData.advance.trim() && <p><strong>Advance Paid:</strong> ₹{formData.advance}</p>}
                {formData.totalAmount.trim() && formData.advance.trim() && (
                  <p><strong>Balance Due:</strong> ₹{calculateBalance()}</p>
                )}
              </div>
            )}
          </div>

          <div className="confirmation-actions">
            <button
              type="button"
              onClick={() => setShowConfirmation(false)}
              className="back-btn"
              disabled={loading}
            >
              ← Back to Edit
            </button>
            <button
              type="button"
              onClick={handleConfirmBooking}
              className="confirm-btn"
              disabled={loading}
            >
              {loading ? 'Confirming...' : '✓ Confirm Booking'}
            </button>
          </div>
        </div>
        )}
      </div>
    </Modal>
  );
};

export default BookingForm;
