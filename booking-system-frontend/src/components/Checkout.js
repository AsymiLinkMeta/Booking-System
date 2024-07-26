// src/components/Checkout.js
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import '../styles/Checkout.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const { user } = useContext(AuthContext);
  const { bookingId } = useParams();
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/bookings/${bookingId}`);
        const booking = response.data;
        setAmount(booking.service.price);
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    };

    fetchBookingDetails();
  }, [bookingId, apiUrl]);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        console.error('Error creating payment method:', error);
        alert(error.message);
        setLoading(false);
        return;
      }

      const paymentData = {
        bookingId: parseInt(bookingId),
        customerId: user.id,
        paymentMethodId: paymentMethod.id,
        amount,
      };

      const response = await axios.post(`${apiUrl}/payments/create-checkout-session`, paymentData);
      console.log('Payment successful:', response.data);

      await axios.post(`${apiUrl}/bookings/${bookingId}/confirm`, { paymentIntentId: response.data.paymentIntentId });

      alert('Payment successful! Your booking has been confirmed.');
      setLoading(false);

      setTimeout(() => {
        navigate('/customer/bookings');
      }, 2000); 

      navigate('/customer/bookings'); 
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error processing payment: ' + (error.response?.data?.message || error.message));
    }

    setLoading(false);
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form onSubmit={handlePayment}>
        <div>
          <label>Card Details:</label>
          <CardElement />
        </div>
        <div>
          <label>Amount: ${amount}</label>
        </div>
        <button type="submit" disabled={!stripe || loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

const Checkout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Checkout;
