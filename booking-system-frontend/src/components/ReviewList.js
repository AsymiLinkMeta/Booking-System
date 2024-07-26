// src/components/ReviewList.js
import React, { useState } from 'react';
import ReviewReplyForm from './ReviewReplyForm';
import '../styles/ReviewList.css';

const ReviewList = ({ reviews, onReplySubmitted, role }) => {
  const [replyingTo, setReplyingTo] = useState(null);

  const extractUsername = (email) => {
    return email.split('@')[0];
  };

  const handleReplyClick = (reviewId) => {
    setReplyingTo(replyingTo === reviewId ? null : reviewId);
  };

  return (
    <div className="review-list">
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review, index) => (
          <div key={index} className="review-item">
                        <p><strong>Service:</strong> {review.service ? review.service.serviceName : 'Unknown'}</p>
            <p><strong>Rating:</strong> {review.rating} / 5</p>
            <p>{review.reviewText}</p>
            <p><em>By {review.user ? extractUsername(review.user.email) : 'Anonymous'}</em></p>
            {review.ownerReply && (
              <div className="owner-reply">
                <p><strong>Owner's Reply:</strong> {review.ownerReply}</p>
              </div>
            )}
            {role === 'businessowner' && (
              <div className="reply-section">
                {replyingTo === review.id ? (
                  <ReviewReplyForm reviewId={review.id} onReplySubmitted={onReplySubmitted} />
                ) : (
                  <button onClick={() => handleReplyClick(review.id)}>
                    {review.ownerReply ? 'Edit Reply' : 'Reply'}
                  </button>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
