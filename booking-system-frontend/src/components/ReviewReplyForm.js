// src/components/ReviewReplyForm.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ReviewReplyForm.css';

const ReviewReplyForm = ({ reviewId, onReplySubmitted }) => {
  const [reply, setReply] = useState('');

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:3000/reviews/${reviewId}`, { ownerReply: reply });
      onReplySubmitted();
      setReply('');
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  return (
    <form onSubmit={handleReplySubmit} className="review-reply-form">
      <textarea
        value={reply}
        onChange={handleReplyChange}
        placeholder="Write your reply here"
        required
      />
      <button type="submit">Submit Reply</button>
    </form>
  );
};

export default ReviewReplyForm;
