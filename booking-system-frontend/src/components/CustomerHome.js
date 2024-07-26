// src/components/CustomerHome.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/CustomerHome.css';

const CustomerHome = () => {
  return (
    <div className="home-container">
      <h2>Welcome to Your Customer Dashboard</h2>
      <p>Explore and book services from various businesses.</p>
      <div className="card-container">
        <div className="card">
          <h3>View Business List</h3>
          <Link to="/customer/business-list" className="action-button">
            View
          </Link>
        </div>
        <div className="card">
          <h3>View Your Bookings</h3>
          <Link to="/customer/bookings" className="action-button">
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;
