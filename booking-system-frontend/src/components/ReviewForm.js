// src/components/ReviewForm.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import '../styles/ReviewForm.css';
import { AuthContext } from '../contexts/AuthContext';

const ReviewForm = ({ serviceId, businessId, onReviewSubmitted }) => {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3000/reviews`, {
        rating,
        reviewText,
        serviceId,
        businessId,
        userId: user.id 
      }, {
        headers: {
          Authorization: `Bearer ${user.token}` 
        }
      });
      onReviewSubmitted(response.data);
      setRating(0);
      setReviewText('');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <label>
        Rating:
        <select value={rating} onChange={handleRatingChange} required>
          <option value="" disabled>Select rating</option>
          {[1, 2, 3, 4, 5].map((rating) => (
            <option key={rating} value={rating}>{rating}</option>
          ))}
        </select>
      </label>
      <label>
        Review:
        <textarea
          value={reviewText}
          onChange={handleReviewTextChange}
          required
          rows="4"
        />
      </label>
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
