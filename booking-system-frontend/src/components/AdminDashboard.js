// src/components/AdminDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import BusinessesList from '../components/BusinessesList';
import UserList from '../components/UserList';
import BookingList from '../components/BookingList';
import Report from '../components/Report';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [businesses, setBusinesses] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [report, setReport] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/businesses');
        console.log('Fetched businesses:', response.data);
        setBusinesses(response.data);
      } catch (err) {
        setError('Failed to fetch businesses');
        console.error('Error fetching businesses:', err);
      }
    };
    fetchBusinesses();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/users');
        console.log('Fetched users:', response.data);
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users');
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/bookings');
        console.log('Fetched bookings:', response.data);
        setBookings(response.data);
      } catch (err) {
        setError('Failed to fetch bookings');
        console.error('Error fetching bookings:', err);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/reports');
        console.log('Fetched report:', response.data);
        setReport(response.data);
      } catch (err) {
        setError('Failed to fetch report');
        console.error('Error fetching report:', err);
      }
    };
    fetchReport();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      {error && <p className="error">{error}</p>}
      <section>
        <h2>All Businesses</h2>
        <BusinessesList businesses={businesses} />
      </section>
      <section>
        <h2>All Users</h2>
        <UserList users={users} />
      </section>
      <section>
        <h2>All Bookings</h2>
        <BookingList bookings={bookings} />
      </section>
      <section>
        <h2>Report</h2>
        <Report report={report} />
      </section>
    </div>
  );
};

export default AdminDashboard;
