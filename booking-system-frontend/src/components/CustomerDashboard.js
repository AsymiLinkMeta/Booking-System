// src/components/CustomerDashboard.js
import React, { useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/CustomerDashboard.css';

const CustomerDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Customer Dashboard</h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
      <nav className="dashboard-nav">
        <ul>
          <li>
            <Link to="/customer/home">Home</Link>
          </li>
          <li>
            <Link to="/customer/business-list">View Business List</Link>
          </li>
          <li>
            <Link to="/customer/bookings">View Your Bookings</Link>
          </li>
        </ul>
      </nav>
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerDashboard;
