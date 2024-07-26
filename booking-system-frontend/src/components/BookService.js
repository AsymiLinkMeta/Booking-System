// src/components/BookService.js
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/BookService.css';

const BookService = () => {
  const { user } = useContext(AuthContext);
  const { businessId, serviceName } = useParams();
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [service, setService] = useState(null);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/businesses/${businessId}/services`);
        const services = response.data;
        const matchedService = services.find(service => service.serviceName === serviceName);
        setService(matchedService);
      } catch (error) {
        console.error('Error fetching service details:', error);
      }
    };

    fetchServiceDetails();
  }, [businessId, serviceName, apiUrl]);

  const formatTime = (time) => {
    let [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'pm' : 'am';
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minute.toString().padStart(2, '0')}${period}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You need to be logged in to book a service.');
      return;
    }

    if (!service) {
      alert('Service not found.');
      return;
    }

    const bookingData = {
      date: bookingDate,
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
      businessId: parseInt(businessId),
      serviceId: service.id,
      customerId: user.id,
    };

    try {
      const response = await axios.post(`${apiUrl}/bookings`, bookingData);
      console.log('Booking created successfully:', response.data);
      navigate('/customer/bookings');
    } catch (error) {
      console.error('Error booking service:', error);
      alert('Error booking service: ' + (error.response?.data?.message || error.message));
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="book-service-container">
      <h2>Book Service: {serviceName}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Booking Date:</label>
          <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} min={today} required />
        </div>
        <div>
          <label>Start Time:</label>
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </div>
        <div>
          <label>End Time:</label>
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </div>
        <button type="submit">Book Service</button>
      </form>
    </div>
  );
};

export default BookService;
