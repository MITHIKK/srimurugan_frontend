import React, { useState } from 'react';
import { 
  getTamilMonth, 
  getTamilMonthShort, 
  getTamilDateNumber, 
  getTamilDate,
  formatDateKey 
} from '../utils/dateUtils';

const Calendar = ({ currentBus, bookings, getBooking, onDateClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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

  const renderCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day other-month"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateStr = formatDateKey(date);
      const booking = getBooking(currentBus, dateStr);
      
      // Check for night pickup from next day
      const nextDay = new Date(currentYear, currentMonth, day + 1);
      const nextDayStr = formatDateKey(nextDay);
      const nextDayBooking = getBooking(currentBus, nextDayStr);
      const hasNightPickup = nextDayBooking && nextDayBooking.nightPickup && !nextDayBooking.isContinuation;

      days.push(
        <div
          key={day}
          className={`calendar-day ${booking ? 'booked' : 'available'} ${hasNightPickup ? 'has-night-pickup' : ''}`}
          onClick={() => onDateClick(date)}
        >
          <div className="day-number">{day}</div>
          <div className="tamil-month-date">
            {getTamilMonthShort(date)} {getTamilDateNumber(date)}
          </div>
          <div className="tamil-day">{getTamilDate(date)}</div>
          
          {booking && (
            <>
              {booking.toLocation && (
                <div className="day-destination">{booking.toLocation}</div>
              )}
              {booking.pickupTime && (
                <div className="day-time">{booking.pickupTime}</div>
              )}
              {booking.isContinuation && (
                <div className="day-time">
                  Day {booking.dayNumber}/{booking.totalDays}
                </div>
              )}
            </>
          )}
          
          {hasNightPickup && (
            <>
              <div className="night-indicator">FROM NIGHT</div>
              {nextDayBooking.nightPickupTime && (
                <div className="night-time">{nextDayBooking.nightPickupTime}</div>
              )}
              <div className="night-pickup-bar"></div>
            </>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <>
      <div className="calendar-nav">
        <button onClick={previousMonth}>◀ Previous</button>
        <div className="month-display">
          <h2 id="currentMonth">{monthNames[currentMonth]} {currentYear}</h2>
          <p id="tamilMonth">{getTamilMonth(currentMonth, currentYear)}</p>
        </div>
        <button onClick={nextMonth}>Next ▶</button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-header">Sun</div>
        <div className="calendar-header">Mon</div>
        <div className="calendar-header">Tue</div>
        <div className="calendar-header">Wed</div>
        <div className="calendar-header">Thu</div>
        <div className="calendar-header">Fri</div>
        <div className="calendar-header">Sat</div>
        {renderCalendarDays()}
      </div>
    </>
  );
};

export default Calendar;
