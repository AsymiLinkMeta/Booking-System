// src/components/BusinessOwnerHome.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BusinessOwnerHome.css';

const BusinessOwnerHome = () => {
  return (
    <div className="home-container">
      <h2>Welcome to Your Dashboard</h2>
      <p>Manage your businesses and bookings efficiently.</p>
      <div className="card-container">
        <div className="card">
          <h3>Register Your Business</h3>
          <Link to="/businessowner/register-business" className="action-button">
            Register
          </Link>
        </div>
        <div className="card">
          <h3>View Your Businesses</h3>
          <Link to="/businessowner/business-list" className="action-button">
            View
          </Link>
        </div>
        <div className="card">
          <h3>View Your Bookings</h3>
          <Link to="/businessowner/bookings" className="action-button">
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessOwnerHome;
