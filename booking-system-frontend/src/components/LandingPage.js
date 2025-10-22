import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="logo">TSL Mini Plant Hire</div>
        <nav className="landing-nav">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-button">Get Started</Link>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h1>Equipment Hire Made Simple</h1>
          <p>Book mini plant equipment and machinery for your projects with ease. Quality equipment, flexible rental periods, and reliable service.</p>
          <div className="hero-actions">
            <Link to="/register" className="cta-button primary">Book Equipment</Link>
            <Link to="/login" className="cta-button secondary">Sign In</Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose TSL Mini Plant Hire?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚜</div>
            <h3>Wide Selection</h3>
            <p>Access a comprehensive range of mini plant equipment and machinery for all your project needs</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Easy Booking</h3>
            <p>Quick online booking system with real-time availability and instant confirmation</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Secure Payments</h3>
            <p>Safe and secure payment processing with flexible payment options</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Verified Reviews</h3>
            <p>Read authentic reviews from other customers to make informed decisions</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Browse Equipment</h3>
            <p>Search through available mini plant equipment and machinery</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Select & Book</h3>
            <p>Choose your dates and times, then confirm your booking</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Make Payment</h3>
            <p>Securely pay online to complete your reservation</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Get Equipment</h3>
            <p>Pick up your equipment and start your project</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join TSL Mini Plant Hire today and simplify your equipment rental process</p>
        <Link to="/register" className="cta-button large">Create Your Account</Link>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2025 TSL Mini Plant Hire. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
