// src/components/BusinessOwnerDashboard.js
import React, { useContext, useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/BusinessOwnerDashboard.css';

const BusinessOwnerDashboard = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get(`${apiUrl}/businesses?ownerId=${user.id}`);
        setBusinesses(response.data);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    };

    fetchBusinesses();
  }, [user.id, apiUrl]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Business Owner Dashboard</h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
      <nav className="dashboard-nav">
        <ul>
          <li><Link to="/businessowner/home">Home</Link></li>
          <li><Link to="/businessowner/register-business">Register Business</Link></li>
          <li><Link to="/businessowner/business-list">Your Businesses</Link></li>
          <li><Link to="/businessowner/bookings">View Your Bookings</Link></li>
          <li><Link to={`/businessowner/reviews/${user.id}`}>View Reviews</Link></li>
        </ul>
      </nav>
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default BusinessOwnerDashboard;
