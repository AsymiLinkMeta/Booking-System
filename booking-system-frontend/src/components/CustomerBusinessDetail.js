// src/components/CustomerBusinessDetail.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import '../styles/BusinessDetail.css';

const CustomerBusinessDetail = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/businesses/${id}`);
        setBusiness(response.data);
      } catch (error) {
        console.error('Error fetching business details:', error);
      }
    };

    fetchBusiness();
  }, [id]);

  useEffect(() => {
    if (selectedService) {
      const fetchReviews = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/reviews/service/${selectedService.id}`);
          setReviews(response.data);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      };

      fetchReviews();
    }
  }, [selectedService]);

  const handleReviewSubmitted = (newReview) => {
    setReviews((prevReviews) => [...prevReviews, newReview]);
  };

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
            {day}: {hours.open.toLowerCase() === 'closed' ? 'Closed' : `${hours.open} - ${hours.close}`}
          </li>
        ))}
      </ul>
      <h3>Services Offered</h3>
      <ul>
        {business.servicesOffered.map((service, index) => (
          <li key={index}>
            <strong>{service.serviceName}</strong>: {service.description} - {service.duration} minutes - ${service.price}
            <button
              onClick={() => {
                setSelectedService(service);
                navigate(`/customer/book-service/${business.id}/${service.serviceName}`);
              }}
              className="book-service-button"
            >
              Book
            </button>
            <button
              onClick={() => setSelectedService(service)}
              className="review-service-button"
            >
              View Reviews / Add Review
            </button>
          </li>
        ))}
      </ul>

      {selectedService && (
        <div className="reviews-section">
          <h3>Reviews for {selectedService.serviceName}</h3>
          <ReviewForm serviceId={selectedService.id} businessId={business.id} onReviewSubmitted={handleReviewSubmitted} />
          <ReviewList reviews={reviews} />
        </div>
      )}

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
    </div>
  );
};

export default CustomerBusinessDetail;
