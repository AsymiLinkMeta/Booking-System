// src/components/CustomerBookings.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isBefore, isEqual } from 'date-fns'; 
import '../styles/CustomerBookings.css';

const CustomerBookings = () => {
  const { user } = useContext(AuthContext);
  const [pastBookings, setPastBookings] = useState({});
  const [futureBookings, setFutureBookings] = useState({});
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${apiUrl}/bookings/customer/${user.id}`);
        const data = await response.json();

        const today = new Date();
        const past = {};
        const future = {};

        for (const booking of data) {
          const bookingDate = parseISO(booking.date); 
          const bookingDateString = format(bookingDate, 'yyyy-MM-dd'); 

          // Check if the booking date is past and payment status is pending
          if (isBefore(bookingDate, today) && booking.paymentStatus !== 'paid' && booking.status !== 'Cancelled') {
            await cancelBooking(booking.id); // Automatically cancel the booking
            booking.status = 'Cancelled'; // Update booking status locally
          }

          if (isBefore(bookingDate, today)) {
            if (!past[bookingDateString]) past[bookingDateString] = [];
            past[bookingDateString].push(booking);
          } else {
            if (!future[bookingDateString]) future[bookingDateString] = [];
            future[bookingDateString].push(booking);
          }
        }

        // Sort bookings by date
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

    const cancelBooking = async (id) => {
      try {
        const response = await fetch(`${apiUrl}/bookings/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!response.ok) throw new Error('Error cancelling booking');
      } catch (error) {
        console.error('Error cancelling booking:', error);
      }
    };

    fetchBookings();
  }, [user.id]);

  const formatDateString = (dateStr) => {
    const dateObj = parseISO(dateStr); 
    return format(dateObj, 'EEEE, MM/dd/yyyy'); 
  };

  const handleCancel = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) throw new Error('Error cancelling booking');
      
      // Update the booking status in the state
      const updateBookings = (bookings) => {
        const newBookings = { ...bookings };
        for (const key in newBookings) {
          newBookings[key] = newBookings[key].map(booking =>
            booking.id === id ? { ...booking, status: 'Cancelled' } : booking
          );
        }
        return newBookings;
      };

      setPastBookings(updateBookings);
      setFutureBookings(updateBookings);

      alert('Booking successfully cancelled.');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert(`Error cancelling booking: ${error.message}`);
    }
  };

  const handleEdit = (id) => {
    navigate(`/customer/bookings/edit/${id}`);
  };

  const handleCheckout = (id) => {
    navigate(`/customer/bookings/checkout/${id}`);
  };

  return (
    <div className="bookings-container">
      <h2>Your Bookings</h2>

      <div className="warning-message">
        <p>Note: Bookings will be automatically cancelled if payment is not made before the booking date.</p>
      </div>

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
                  {booking.status !== 'Cancelled' && booking.paymentStatus !== 'paid' && (
                    <>
                      <button onClick={() => handleEdit(booking.id)}>Edit</button>
                      <button onClick={() => handleCancel(booking.id)}>Cancel</button>
                      <button onClick={() => handleCheckout(booking.id)}>Checkout</button>
                    </>
                  )}
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
                  {booking.status !== 'Cancelled' && booking.paymentStatus !== 'paid' && (
                    <>
                      <button onClick={() => handleEdit(booking.id)}>Edit</button>
                      <button onClick={() => handleCancel(booking.id)}>Cancel</button>
                      <button onClick={() => handleCheckout(booking.id)}>Checkout</button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CustomerBookings;
