import React from 'react';
import '../styles/BookingList.css';

// Helper function to format time
const formatTime = (time) => {
  if (!time) return 'Unknown';
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const BookingList = ({ bookings }) => {
  return (
    <div className="booking-list">
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking.id} className="booking-item">
            <p><strong>Booking ID:</strong> {booking.id}</p>
            <p><strong>Customer:</strong> {booking.customer ? booking.customer.email : 'Unknown'}</p>
            <p><strong>Business:</strong> {booking.business ? booking.business.name : 'Unknown'}</p>
            <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
            <p><strong>Start Time:</strong> {formatTime(booking.startTime)}</p>
            <p><strong>End Time:</strong> {formatTime(booking.endTime)}</p>
            <p><strong>Status:</strong> {booking.status}</p>
            <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default BookingList;
