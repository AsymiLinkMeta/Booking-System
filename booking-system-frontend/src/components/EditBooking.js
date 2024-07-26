// src/components/EditBooking.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/EditBooking.css';

const EditBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [booking, setBooking] = useState({});
  const [date, setDate] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/bookings/${id}`);
        const bookingData = response.data;
        setBooking(bookingData);

        const dateObj = new Date(bookingData.date);
        const formattedDateString = formatDateString(dateObj);
        setFormattedDate(formattedDateString);
        setDate(bookingData.date);
        setStartTime(bookingData.startTime);
        setEndTime(bookingData.endTime);
        setStatus(bookingData.status);
      } catch (error) {
        console.error('Error fetching booking:', error);
      }
    };

    fetchBooking();
  }, [id]);

  const formatDateString = (dateObj) => {
    const options = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };
    return dateObj.toLocaleDateString('en-US', options);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const updatedBooking = { date, startTime, endTime, status };
      await axios.put(`http://localhost:3000/bookings/${id}`, updatedBooking);
      alert('Booking successfully updated');
      navigate('/customer/bookings');
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Error updating booking');
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    const dateObj = new Date(newDate);
    setFormattedDate(formatDateString(dateObj));
  };

  const today = new Date().toISOString().split('T')[0]; 

  return (
    <div className="edit-booking-container">
      <h2>Edit Booking</h2>
      <h3>{booking.business?.name || 'Unknown Business'}</h3>
      <h4>{booking.service?.serviceName || 'Unknown Service'}</h4>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={handleDateChange} min={today} required />
          <p>Selected Date: {formattedDate}</p>
        </div>
        <div>
          <label>Start Time:</label>
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </div>
        <div>
          <label>End Time:</label>
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </div>
        <div>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value="Confirmed">Confirmed</option>
          </select>
        </div>
        <button type="submit">Update Booking</button>
      </form>
    </div>
  );
};

export default EditBooking;
