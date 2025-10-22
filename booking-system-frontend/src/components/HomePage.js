import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const equipment = [
    {
      name: 'Mini Excavator',
      image: 'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Perfect for digging, trenching, and landscaping projects',
      dailyRate: '$150'
    },
    {
      name: 'Skid Steer Loader',
      image: 'https://images.pexels.com/photos/259984/pexels-photo-259984.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Versatile equipment for material handling and site work',
      dailyRate: '$180'
    },
    {
      name: 'Compact Wheel Loader',
      image: 'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Ideal for loading, moving, and stockpiling materials',
      dailyRate: '$200'
    },
    {
      name: 'Dumper Truck',
      image: 'https://images.pexels.com/photos/257970/pexels-photo-257970.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Transport materials efficiently across your site',
      dailyRate: '$120'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Landscaping Contractor',
      comment: 'TSL Mini Plant Hire has been our go-to for equipment rental. Easy booking, reliable equipment, and excellent service every time.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Construction Manager',
      comment: 'The online booking system is incredibly efficient. We can have equipment on-site within hours. Highly recommended!',
      rating: 5
    },
    {
      name: 'Emma Williams',
      role: 'Property Developer',
      comment: 'Great selection of mini plant equipment and competitive rates. The team is professional and always responsive.',
      rating: 5
    }
  ];

  const stats = [
    { number: '500+', label: 'Happy Customers' },
    { number: '50+', label: 'Equipment Units' },
    { number: '5000+', label: 'Completed Projects' },
    { number: '24/7', label: 'Customer Support' }
  ];

  return (
    <div className="home-page">
      <header className={`home-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <div className="logo-section">
            <div className="logo-icon">TSL</div>
            <div className="logo-text">
              <span className="logo-main">TSL Mini Plant Hire</span>
              <span className="logo-tagline">Equipment You Can Trust</span>
            </div>
          </div>
          <nav className="main-nav">
            <a href="#equipment" className="nav-link">Equipment</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#testimonials" className="nav-link">Reviews</a>
            <a href="#contact" className="nav-link">Contact</a>
            <Link to="/login" className="nav-link-btn">Login</Link>
            <Link to="/register" className="nav-btn-primary">Get Started</Link>
          </nav>
        </div>
      </header>

      <section className="hero-main">
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <div className="hero-badge">Industry Leading Equipment Hire</div>
          <h1 className="hero-title">
            Premium Mini Plant<br />Equipment Rental
          </h1>
          <p className="hero-description">
            Access professional-grade mini plant equipment for your construction, landscaping, and development projects.
            Book online in minutes and get your equipment delivered on time, every time.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-hero-primary">
              Browse Equipment
              <span className="btn-arrow">→</span>
            </Link>
            <a href="#how-it-works" className="btn-hero-secondary">
              Learn More
            </a>
          </div>
          <div className="hero-features">
            <div className="hero-feature-item">
              <span className="check-icon">✓</span>
              <span>Instant Booking</span>
            </div>
            <div className="hero-feature-item">
              <span className="check-icon">✓</span>
              <span>Flexible Rental Terms</span>
            </div>
            <div className="hero-feature-item">
              <span className="check-icon">✓</span>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="equipment" className="equipment-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Our Fleet</span>
            <h2 className="section-title">Popular Equipment</h2>
            <p className="section-description">
              Choose from our wide range of well-maintained mini plant equipment
            </p>
          </div>
          <div className="equipment-grid">
            {equipment.map((item, index) => (
              <div key={index} className="equipment-card">
                <div className="equipment-image-wrapper">
                  <img src={item.image} alt={item.name} className="equipment-image" />
                  <div className="equipment-badge">Available Now</div>
                </div>
                <div className="equipment-content">
                  <h3 className="equipment-name">{item.name}</h3>
                  <p className="equipment-description">{item.description}</p>
                  <div className="equipment-footer">
                    <div className="equipment-price">
                      <span className="price-label">From</span>
                      <span className="price-amount">{item.dailyRate}</span>
                      <span className="price-period">/day</span>
                    </div>
                    <Link to="/register" className="btn-equipment">Book Now</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="equipment-cta">
            <Link to="/register" className="btn-view-all">View All Equipment</Link>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="process-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Simple Process</span>
            <h2 className="section-title">How It Works</h2>
            <p className="section-description">
              Get the equipment you need in four easy steps
            </p>
          </div>
          <div className="process-grid">
            <div className="process-step">
              <div className="step-icon-wrapper">
                <div className="step-icon">🔍</div>
                <div className="step-number">01</div>
              </div>
              <h3 className="step-title">Search & Browse</h3>
              <p className="step-description">
                Browse our extensive catalog of mini plant equipment and find exactly what you need for your project
              </p>
            </div>
            <div className="process-step">
              <div className="step-icon-wrapper">
                <div className="step-icon">📅</div>
                <div className="step-number">02</div>
              </div>
              <h3 className="step-title">Select Dates</h3>
              <p className="step-description">
                Choose your rental period with our real-time availability calendar and flexible booking options
              </p>
            </div>
            <div className="process-step">
              <div className="step-icon-wrapper">
                <div className="step-icon">💳</div>
                <div className="step-number">03</div>
              </div>
              <h3 className="step-title">Secure Payment</h3>
              <p className="step-description">
                Complete your booking with our secure payment system powered by industry-leading encryption
              </p>
            </div>
            <div className="process-step">
              <div className="step-icon-wrapper">
                <div className="step-icon">🚚</div>
                <div className="step-number">04</div>
              </div>
              <h3 className="step-title">Delivery & Pickup</h3>
              <p className="step-description">
                Receive your equipment on time and ready to use, with optional delivery and pickup services
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="benefits-section">
        <div className="section-container">
          <div className="benefits-grid">
            <div className="benefits-content">
              <span className="section-badge">Why Choose Us</span>
              <h2 className="benefits-title">Equipment Rental Made Easy</h2>
              <p className="benefits-intro">
                We provide professional-grade equipment with unmatched service and support
              </p>
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">⚡</div>
                  <div className="benefit-text">
                    <h4>Instant Availability</h4>
                    <p>Real-time booking with immediate confirmation</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🛡️</div>
                  <div className="benefit-text">
                    <h4>Well-Maintained Fleet</h4>
                    <p>Regular servicing and safety inspections</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">💰</div>
                  <div className="benefit-text">
                    <h4>Competitive Pricing</h4>
                    <p>Transparent rates with no hidden fees</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🎯</div>
                  <div className="benefit-text">
                    <h4>Expert Support</h4>
                    <p>Technical guidance and operational training</p>
                  </div>
                </div>
              </div>
              <Link to="/register" className="btn-benefits">Start Your Project</Link>
            </div>
            <div className="benefits-image">
              <img
                src="https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Construction Equipment"
                className="benefits-img"
              />
              <div className="benefits-badge">
                <div className="badge-content">
                  <div className="badge-number">500+</div>
                  <div className="badge-text">Projects Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Customer Reviews</span>
            <h2 className="section-title">What Our Clients Say</h2>
            <p className="section-description">
              Trusted by contractors, developers, and businesses across the region
            </p>
          </div>
          <div className="testimonials-slider">
            <div className="testimonial-card active">
              <div className="testimonial-stars">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <span key={i} className="star">★</span>
                ))}
              </div>
              <p className="testimonial-text">"{testimonials[activeTestimonial].comment}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{testimonials[activeTestimonial].name[0]}</div>
                <div className="author-info">
                  <div className="author-name">{testimonials[activeTestimonial].name}</div>
                  <div className="author-role">{testimonials[activeTestimonial].role}</div>
                </div>
              </div>
            </div>
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === activeTestimonial ? 'active' : ''}`}
                  onClick={() => setActiveTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="cta-final-section">
        <div className="cta-final-container">
          <div className="cta-final-content">
            <h2 className="cta-final-title">Ready to Get Started?</h2>
            <p className="cta-final-description">
              Join hundreds of satisfied customers and experience hassle-free equipment rental today
            </p>
            <div className="cta-final-buttons">
              <Link to="/register" className="btn-cta-primary">Create Free Account</Link>
              <Link to="/login" className="btn-cta-secondary">Sign In</Link>
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="home-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-column">
              <div className="footer-logo">
                <div className="footer-logo-icon">TSL</div>
                <div className="footer-logo-text">TSL Mini Plant Hire</div>
              </div>
              <p className="footer-description">
                Your trusted partner for professional mini plant equipment rental. Quality equipment, exceptional service.
              </p>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#equipment">Equipment</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><Link to="/register">Get Started</Link></li>
                <li><Link to="/login">Login</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">Services</h4>
              <ul className="footer-links">
                <li><a href="#equipment">Equipment Hire</a></li>
                <li><a href="#equipment">Delivery Service</a></li>
                <li><a href="#equipment">Operator Training</a></li>
                <li><a href="#equipment">Maintenance Support</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">Contact</h4>
              <ul className="footer-contact">
                <li>📞 1-800-TSL-HIRE</li>
                <li>✉️ info@tslplanthire.com</li>
                <li>📍 Your City, State</li>
                <li>🕒 Mon-Sat: 7AM-6PM</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 TSL Mini Plant Hire. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
