import React, { useState, useEffect } from 'react';
import { formatDateKey, getTamilDate, getTamilMonth } from '../utils/dateUtils';
import TimePicker from './TimePicker';
import ConflictWarning from './ConflictWarning';

const BookingModal = ({ 
  selectedDate, 
  currentBus, 
  booking, 
  bookings,
  getBooking,
  onSave, 
  onClose,
  editMode 
}) => {
  const [formData, setFormData] = useState({
    numberOfDays: 1,
    pickupNightBefore: false,
    pickupHour: '6',
    pickupMinute: '00',
    pickupPeriod: 'AM',
    nightHour: '9',
    nightMinute: '00',
    partyName: '',
    phone1: '',
    phone2: '',
    fromLocation: '',
    toLocation: '',
    viaRoute: '',
    recommendedBy: '',
    totalAmount: '',
    advanceAmount: '',
    balanceAmount: '',
    includeRent: true,
    includeDiesel: false,
    includeDriverBeta: false,
    includeToll: false,
    includeCheckPost: false,
    includeParking: false
  });

  const [conflicts, setConflicts] = useState([]);

  useEffect(() => {
    if (booking) {
      loadBookingData(booking);
    }
  }, [booking]);

  useEffect(() => {
    checkConflicts();
  }, [formData.numberOfDays]);

  const loadBookingData = (bookingData) => {
    const newFormData = { ...formData };
    
    if (bookingData.numberOfDays) newFormData.numberOfDays = bookingData.numberOfDays;
    if (bookingData.nightPickup) newFormData.pickupNightBefore = true;
    
    if (bookingData.pickupTime) {
      const [hour, minute, period] = bookingData.pickupTime.split(/[:s]/);
      newFormData.pickupHour = hour;
      newFormData.pickupMinute = minute.padStart(2, '0');
      newFormData.pickupPeriod = period;
    }
    
    if (bookingData.nightPickupTime) {
      const [hour, minute] = bookingData.nightPickupTime.split(':');
      newFormData.nightHour = hour;
      newFormData.nightMinute = minute.padStart(2, '0');
    }
    
    Object.keys(bookingData).forEach(key => {
      if (key in newFormData && bookingData[key] !== undefined) {
        newFormData[key] = bookingData[key];
      }
    });
    
    setFormData(newFormData);
  };

  const checkConflicts = () => {
    const conflictList = [];
    
    for (let i = 0; i < formData.numberOfDays; i++) {
      const checkDate = new Date(selectedDate);
      checkDate.setDate(checkDate.getDate() + i);
      const dateStr = formatDateKey(checkDate);
      const existingBooking = getBooking(currentBus, dateStr);
      
      if (existingBooking && (!editMode || existingBooking.createdAt !== booking?.createdAt)) {
        conflictList.push({
          date: checkDate,
          booking: existingBooking
        });
      }
    }
    
    setConflicts(conflictList);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDaysSelect = (days) => {
    setFormData(prev => ({ ...prev, numberOfDays: days }));
  };

  const handleTimeChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateBalance = () => {
    const total = parseFloat(formData.totalAmount) || 0;
    const advance = parseFloat(formData.advanceAmount) || 0;
    setFormData(prev => ({ ...prev, balanceAmount: total - advance }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const bookingData = {
      busName: currentBus,
      date: selectedDate,
      pickupTime: formData.pickupNightBefore ? '' : 
        `${formData.pickupHour}:${formData.pickupMinute.padStart(2, '0')} ${formData.pickupPeriod}`,
      nightPickup: formData.pickupNightBefore,
      nightPickupTime: formData.pickupNightBefore ? 
        `${formData.nightHour}:${formData.nightMinute.padStart(2, '0')} PM` : '',
      createdAt: booking?.createdAt || new Date().toISOString(),
      editChainCreatedAt: editMode ? booking?.createdAt : null,
      numberOfDays: formData.numberOfDays,
      partyName: formData.partyName,
      phone1: formData.phone1,
      phone2: formData.phone2,
      fromLocation: formData.fromLocation,
      toLocation: formData.toLocation,
      viaRoute: formData.viaRoute,
      recommendedBy: formData.recommendedBy,
      totalAmount: formData.totalAmount,
      advanceAmount: formData.advanceAmount,
      balanceAmount: formData.balanceAmount
    };
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error('Failed to save booking');
      }

      const data = await response.json();
      if (data.success) {
        onSave(data.data);
      } else {
        throw new Error(data.error || 'Failed to save booking');
      }
    } catch (error) {
      console.error('Error saving booking:', error);
      alert('Failed to save booking. Please try again.');
    }
  };

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Booking Details</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <div className="modal-body">
          <div className="booking-info">
            <h3>{currentBus} - {selectedDate?.toLocaleDateString('en-US', { 
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
            })}</h3>
            <p>Tamil: {getTamilDate(selectedDate)} - {getTamilMonth(selectedDate?.getMonth(), selectedDate?.getFullYear())}</p>
          </div>

          {conflicts.length > 0 && <ConflictWarning conflicts={conflicts} />}

          <form onSubmit={handleSubmit}>
            {/* Number of Days */}
            <div className="form-group">
              <label>Number of Days:</label>
              <div className="days-selector">
                {[1, 2, 3, 4, 5].map(day => (
                  <button
                    key={day}
                    type="button"
                    className={`day-btn ${formData.numberOfDays === day ? 'active' : ''}`}
                    onClick={() => handleDaysSelect(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <p className="days-info">
                {formData.numberOfDays === 1 
                  ? 'Single day booking'
                  : `${formData.numberOfDays} days booking (until ${
                      new Date(selectedDate.getTime() + (formData.numberOfDays - 1) * 24 * 60 * 60 * 1000)
                        .toLocaleDateString()
                    })`
                }
              </p>
            </div>

            {/* Time Selection */}
            <div className="form-section">
              <h4>Pickup Time</h4>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="pickupNightBefore"
                    checked={formData.pickupNightBefore}
                    onChange={handleInputChange}
                  />
                  Pickup from previous night?
                </label>
              </div>
              
              <TimePicker
                isNightPickup={formData.pickupNightBefore}
                pickupHour={formData.pickupHour}
                pickupMinute={formData.pickupMinute}
                pickupPeriod={formData.pickupPeriod}
                nightHour={formData.nightHour}
                nightMinute={formData.nightMinute}
                onTimeChange={handleTimeChange}
              />
            </div>

            {/* Party Details */}
            <div className="form-section">
              <h4>Party Details</h4>
              <div className="form-group">
                <label>Party Name:</label>
                <input
                  type="text"
                  name="partyName"
                  className="form-control"
                  placeholder="Enter party/customer name"
                  value={formData.partyName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number 1:</label>
                  <input
                    type="tel"
                    name="phone1"
                    className="form-control"
                    placeholder="Primary contact"
                    value={formData.phone1}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number 2:</label>
                  <input
                    type="tel"
                    name="phone2"
                    className="form-control"
                    placeholder="Secondary contact"
                    value={formData.phone2}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="form-section">
              <h4>Trip Details</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>From:</label>
                  <input
                    type="text"
                    name="fromLocation"
                    className="form-control"
                    placeholder="Starting point"
                    value={formData.fromLocation}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>To:</label>
                  <input
                    type="text"
                    name="toLocation"
                    className="form-control"
                    placeholder="Destination"
                    value={formData.toLocation}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Via (Route):</label>
                <input
                  type="text"
                  name="viaRoute"
                  className="form-control"
                  placeholder="Enter route/stops if any"
                  value={formData.viaRoute}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Recommendation */}
            <div className="form-section">
              <h4>Recommendation</h4>
              <div className="form-group">
                <label>Recommended By:</label>
                <input
                  type="text"
                  name="recommendedBy"
                  className="form-control"
                  placeholder="Name of person who recommended"
                  value={formData.recommendedBy}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Payment Details */}
            <div className="form-section">
              <h4>Payment Details</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Total Amount (₹):</label>
                  <input
                    type="number"
                    name="totalAmount"
                    className="form-control"
                    placeholder="0"
                    value={formData.totalAmount}
                    onChange={(e) => {
                      handleInputChange(e);
                      calculateBalance();
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Advance (₹):</label>
                  <input
                    type="number"
                    name="advanceAmount"
                    className="form-control"
                    placeholder="0"
                    value={formData.advanceAmount}
                    onChange={(e) => {
                      handleInputChange(e);
                      calculateBalance();
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Balance (₹):</label>
                  <input
                    type="number"
                    name="balanceAmount"
                    className="form-control"
                    placeholder="0"
                    value={formData.balanceAmount}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Service Inclusions */}
            <div className="form-section">
              <h4>This Rent Includes:</h4>
              <div className="checkbox-group">
                {[
                  { name: 'includeRent', label: 'Rent' },
                  { name: 'includeDiesel', label: 'Diesel' },
                  { name: 'includeDriverBeta', label: 'Driver Beta' },
                  { name: 'includeToll', label: 'Toll' },
                  { name: 'includeCheckPost', label: 'Check Post' },
                  { name: 'includeParking', label: 'Parking' }
                ].map(item => (
                  <label key={item.name} className="checkbox-label">
                    <input
                      type="checkbox"
                      name={item.name}
                      checked={formData[item.name]}
                      onChange={handleInputChange}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button type="submit" className="btn-save">Save Booking</button>
              <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
