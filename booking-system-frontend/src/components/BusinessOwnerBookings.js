// src/components/BusinessOwnerBookings.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { format, parseISO, isBefore } from 'date-fns'; 

const BusinessOwnerBookings = () => {
  const { user } = useContext(AuthContext);
  const [pastBookings, setPastBookings] = useState({});
  const [futureBookings, setFutureBookings] = useState({});
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${apiUrl}/bookings/business-owner/${user.id}`);
        const data = await response.json();

        console.log('Bookings data:', data);  

        const today = new Date();
        const past = {};
        const future = {};

        data.forEach(booking => {
          const bookingDate = parseISO(booking.date); 
          const bookingDateString = format(bookingDate, 'yyyy-MM-dd'); 

          if (isBefore(bookingDate, today)) {
            if (!past[bookingDateString]) {
              past[bookingDateString] = [];
            }
            past[bookingDateString].push(booking);
          } else {
            if (!future[bookingDateString]) {
              future[bookingDateString] = [];
            }
            future[bookingDateString].push(booking);
          }
        });

        // Sort past and future bookings by date
        for (const key in past) {
          past[key] = past[key].sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        for (const key in future) {
          future[key] = future[key].sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        setPastBookings(past);
        setFutureBookings(future);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [user.id, apiUrl]);

  const formatDateString = (dateStr) => {
    const dateObj = parseISO(dateStr); 
    return format(dateObj, 'EEEE, MM/dd/yyyy'); 
  };

  return (
    <div className="bookings-container">
      <h2>Your Bookings</h2>

      <h3>Past Bookings</h3>
      {Object.keys(pastBookings).length === 0 ? (
        <p>No past bookings found.</p>
      ) : (
        Object.keys(pastBookings).sort((a, b) => new Date(a) - new Date(b)).map(date => (
          <div key={date}>
            <h4>{formatDateString(date)}</h4>
            <div className="bookings-list">
              {pastBookings[date].map(booking => (
                <div key={booking.id} className="booking-card">
                  <p>Business: {booking.business?.name || 'Unknown Business'}</p>
                  <p>Service: {booking.service?.serviceName || 'Unknown Service'}</p>
                  <p>Date: {formatDateString(booking.date)}</p>
                  <p>Time: {`${booking.startTime} - ${booking.endTime}`}</p>
                  <p>Status: {booking.status}</p>
                  <p>Payment Status: {booking.paymentStatus}</p>
                  <p>Customer Email: {booking.customer?.email || 'Unknown Email'}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <h3>Future Bookings</h3>
      {Object.keys(futureBookings).length === 0 ? (
        <p>No future bookings found.</p>
      ) : (
        Object.keys(futureBookings).sort((a, b) => new Date(a) - new Date(b)).map(date => (
          <div key={date}>
            <h4>{formatDateString(date)}</h4>
            <div className="bookings-list">
              {futureBookings[date].map(booking => (
                <div key={booking.id} className="booking-card">
                  <p>Business: {booking.business?.name || 'Unknown Business'}</p>
                  <p>Service: {booking.service?.serviceName || 'Unknown Service'}</p>
                  <p>Date: {formatDateString(booking.date)}</p>
                  <p>Time: {`${booking.startTime} - ${booking.endTime}`}</p>
                  <p>Status: {booking.status}</p>
                  <p>Payment Status: {booking.paymentStatus}</p>
                  <p>Customer Email: {booking.customer?.email || 'Unknown Email'}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BusinessOwnerBookings;
