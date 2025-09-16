import React from 'react';

const ConflictWarning = ({ conflicts }) => {
  const conflictDates = conflicts.map(c =>
    c.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  ).join(', ');

  const conflictParties = [...new Set(conflicts.map(c => c.booking.partyName).filter(Boolean))];
  const partyInfo = conflictParties.length > 0 ? ` (${conflictParties.join(', ')})` : '';

  return (
    <div className="conflict-warning">
      <div className="warning-icon">⚠️</div>
      <div className="warning-content">
        <h4>Booking Conflict Detected!</h4>
        <p>The following dates already have bookings: {conflictDates}{partyInfo}. Please choose different dates or edit the existing booking.</p>
      </div>
    </div>
  );
};

export default ConflictWarning;
