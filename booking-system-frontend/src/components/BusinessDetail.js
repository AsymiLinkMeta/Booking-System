// src/components/BusinessDetail.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../styles/BusinessDetail.css';

const BusinessDetail = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await axios.get(`${apiUrl}/businesses/${id}`);
        setBusiness(response.data);
      } catch (error) {
        console.error('Error fetching business details:', error);
      }
    };

    fetchBusiness();
  }, [id, apiUrl]);

  if (!business) {
    return <div>Loading...</div>;
  }

  return (
    <div className="business-detail-container">
      <h2>{business.name}</h2>
      <p>{business.description}</p>
      <h3>Business Hours</h3>
      <ul>
        {Object.entries(business.businessHours).map(([day, hours]) => (
          <li key={day}>
            {day}: {hours && hours.open ? (hours.open.toLowerCase() === 'closed' ? 'Closed' : `${hours.open} - ${hours.close}`) : 'No hours available'}
          </li>
        ))}
      </ul>
      <h3>Services Offered</h3>
      <ul>
        {business.servicesOffered.map((service, index) => (
          <li key={index}>
            <strong>{service.serviceName}</strong>: {service.description} - {service.duration} minutes - ${service.price}
          </li>
        ))}
      </ul>
      <p><strong>Pricing:</strong> {business.pricing}</p>
      <p><strong>Category:</strong> {business.category}</p>
      <p><strong>Address:</strong> {business.address}</p>
      <p><strong>Phone:</strong> {business.phone}</p>
      <p><strong>Email:</strong> {business.email}</p>
      <p><strong>Website:</strong> <a href={business.website} target="_blank" rel="noopener noreferrer">{business.website}</a></p>
      <p><strong>Cancellation Policy:</strong> {business.cancellationPolicy}</p>
      <p><strong>Rescheduling Policy:</strong> {business.reschedulingPolicy}</p>
      <p><strong>Booking Lead Time:</strong> {business.bookingLeadTime} minutes</p>
      <p><strong>Max Booking Duration:</strong> {business.maxBookingDuration} minutes</p>
      
      <Link to={`/businessowner/business-list/${business.id}/edit`} className="edit-link">
        Edit
      </Link>
    </div>
  );
};

export default BusinessDetail;
