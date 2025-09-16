import React from 'react';

const ConfirmationModal = ({ booking, date, onEdit, onCancel, onClose }) => {
  const services = [
    booking.includeRent && 'Rent',
    booking.includeDiesel && 'Diesel',
    booking.includeDriverBeta && 'Driver Beta',
    booking.includeToll && 'Toll',
    booking.includeCheckPost && 'Check Post',
    booking.includeParking && 'Parking'
  ].filter(Boolean).join(', ');

  const startDate = date;
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (booking.numberOfDays ? booking.numberOfDays - 1 : 0));
  
  const startDateText = startDate.toLocaleDateString('en-IN', { 
    year: 'numeric', month: 'short', day: 'numeric' 
  });
  const endDateText = booking.numberOfDays && booking.numberOfDays > 1
    ? endDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
    : startDateText;

  const handleEdit = () => {
    if (window.confirm('Do you want to edit this booking?')) {
      onEdit();
    }
  };

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content confirmation-modal">
        <div className="modal-header">
          <h2>Booking Confirmation</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <div className="modal-body">
          <div className="confirmation-details">
            <div className="detail-row">
              <div className="detail-label">Bus</div>
              <div className="detail-value">{booking.bus}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Trip Dates</div>
              <div className="detail-value">
                {startDateText}
                {booking.numberOfDays && booking.numberOfDays > 1 && 
                  ` → ${endDateText} (${booking.numberOfDays} days)`}
              </div>
            </div>
            {booking.pickupTime && (
              <div className="detail-row">
                <div className="detail-label">Pickup Time</div>
                <div className="detail-value">{booking.pickupTime}</div>
              </div>
            )}
            {booking.nightPickup && booking.nightPickupTime && (
              <div className="detail-row">
                <div className="detail-label">From Night</div>
                <div className="detail-value">{booking.nightPickupTime} (prev day)</div>
              </div>
            )}
            <div className="detail-row">
              <div className="detail-label">From → To</div>
              <div className="detail-value">
                {booking.fromLocation || '-'} → {booking.toLocation || '-'}
              </div>
            </div>
            {booking.viaRoute && (
              <div className="detail-row">
                <div className="detail-label">Via</div>
                <div className="detail-value">{booking.viaRoute}</div>
              </div>
            )}
            <div className="detail-row">
              <div className="detail-label">Party</div>
              <div className="detail-value">
                {booking.partyName || '-'}
                {booking.phone1 && ` | ${booking.phone1}`}
                {booking.phone2 && ` / ${booking.phone2}`}
              </div>
            </div>
            {booking.recommendedBy && (
              <div className="detail-row">
                <div className="detail-label">Recommended By</div>
                <div className="detail-value">{booking.recommendedBy}</div>
              </div>
            )}
            <div className="detail-row">
              <div className="detail-label">Amount</div>
              <div className="detail-value">
                Total ₹{booking.totalAmount || 0} | 
                Advance ₹{booking.advanceAmount || 0} | 
                Balance ₹{booking.balanceAmount || 0}
              </div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Includes</div>
              <div className="detail-value">{services || '-'}</div>
            </div>
          </div>
          <div className="confirmation-actions">
            <button onClick={handleEdit} className="btn-edit">✏️ Edit Booking</button>
            <button onClick={onCancel} className="btn-cancel-booking">❌ Cancel Booking</button>
            <button onClick={onClose} className="btn-close">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
