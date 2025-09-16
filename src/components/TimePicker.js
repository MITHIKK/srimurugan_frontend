import React from 'react';

const TimePicker = ({ 
  isNightPickup, 
  pickupHour, 
  pickupMinute, 
  pickupPeriod, 
  nightHour, 
  nightMinute,
  onTimeChange 
}) => {
  const handleHourChange = (e, isNight = false) => {
    const value = e.target.value;
    const field = isNight ? 'nightHour' : 'pickupHour';
    const max = isNight ? 11 : 12;
    const min = isNight ? 7 : 1;
    
    if (value > max) e.target.value = max;
    if (value < min && value !== '') e.target.value = min;
    
    onTimeChange(field, e.target.value);
  };

  const handleMinuteChange = (e, isNight = false) => {
    const value = e.target.value;
    const field = isNight ? 'nightMinute' : 'pickupMinute';
    
    if (value > 59) e.target.value = 59;
    if (value < 0) e.target.value = 0;
    
    onTimeChange(field, e.target.value.padStart(2, '0'));
  };

  const setPickupTime = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    const [hour, minute] = time.split(':');
    
    onTimeChange('pickupHour', hour);
    onTimeChange('pickupMinute', minute.padStart(2, '0'));
    onTimeChange('pickupPeriod', period);
  };

  const setNightTime = (timeStr) => {
    const [time] = timeStr.split(' ');
    const [hour, minute] = time.split(':');
    
    onTimeChange('nightHour', hour);
    onTimeChange('nightMinute', minute.padStart(2, '0'));
  };

  if (!isNightPickup) {
    return (
      <div className="form-group">
        <label>Pickup Time:</label>
        <div className="clean-time-picker">
          <div className="time-input-group">
            <input
              type="number"
              className="time-input hour-input"
              min="1"
              max="12"
              value={pickupHour}
              onChange={(e) => handleHourChange(e)}
              placeholder="HH"
            />
            <span className="time-colon">:</span>
            <input
              type="number"
              className="time-input minute-input"
              min="0"
              max="59"
              value={pickupMinute}
              onChange={(e) => handleMinuteChange(e)}
              placeholder="MM"
            />
            <div className="period-toggle">
              <input
                type="radio"
                id="pickupAM"
                name="pickupPeriod"
                value="AM"
                checked={pickupPeriod === 'AM'}
                onChange={() => onTimeChange('pickupPeriod', 'AM')}
              />
              <label htmlFor="pickupAM" className="period-btn">AM</label>
              <input
                type="radio"
                id="pickupPM"
                name="pickupPeriod"
                value="PM"
                checked={pickupPeriod === 'PM'}
                onChange={() => onTimeChange('pickupPeriod', 'PM')}
              />
              <label htmlFor="pickupPM" className="period-btn">PM</label>
            </div>
          </div>
          <div className="time-presets">
            <span className="preset-label">Quick select:</span>
            <button type="button" className="time-preset" onClick={() => setPickupTime('6:00 AM')}>6:00 AM</button>
            <button type="button" className="time-preset" onClick={() => setPickupTime('7:00 AM')}>7:00 AM</button>
            <button type="button" className="time-preset" onClick={() => setPickupTime('8:00 AM')}>8:00 AM</button>
            <button type="button" className="time-preset" onClick={() => setPickupTime('9:00 AM')}>9:00 AM</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-group">
      <label>Night Pickup Time (Previous Day):</label>
      <div className="clean-time-picker">
        <div className="time-input-group">
          <input
            type="number"
            className="time-input hour-input"
            min="7"
            max="11"
            value={nightHour}
            onChange={(e) => handleHourChange(e, true)}
            placeholder="HH"
          />
          <span className="time-colon">:</span>
          <input
            type="number"
            className="time-input minute-input"
            min="0"
            max="59"
            value={nightMinute}
            onChange={(e) => handleMinuteChange(e, true)}
            placeholder="MM"
          />
          <div className="period-display">
            <span className="period-fixed">PM</span>
          </div>
        </div>
        <div className="time-presets">
          <span className="preset-label">Quick select:</span>
          <button type="button" className="time-preset" onClick={() => setNightTime('7:00 PM')}>7:00 PM</button>
          <button type="button" className="time-preset" onClick={() => setNightTime('8:00 PM')}>8:00 PM</button>
          <button type="button" className="time-preset" onClick={() => setNightTime('9:00 PM')}>9:00 PM</button>
          <button type="button" className="time-preset" onClick={() => setNightTime('10:00 PM')}>10:00 PM</button>
        </div>
      </div>
    </div>
  );
};

export default TimePicker;
