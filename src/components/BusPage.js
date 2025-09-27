import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BusCalendar from './BusCalendar';
import './BusPage.css';

const BusPage = () => {
  const { busName } = useParams();
  const navigate = useNavigate();

  const busDetails = {
    vettaiyan: { name: 'Vettaiyan', color: '#FF6B6B' },
    dheeran: { name: 'Dheeran', color: '#4ECDC4' },
    maaran: { name: 'Maaran', color: '#45B7D1' },
    veeran: { name: 'Veeran', color: '#96CEB4' }
  };

  const bus = busDetails[busName.toLowerCase()];

  if (!bus) {
    return (
      <div className="error-page">
        <h1>Bus Not Found</h1>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className={`bus-page bus-page-${busName.toLowerCase()}`}>
      <div className="bus-page-content">
        <BusCalendar
          busName={bus.name}
          busColor={bus.color}
        />
      </div>
    </div>
  );
};

export default BusPage;
