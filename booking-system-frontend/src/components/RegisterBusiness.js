// src/components/RegisterBusiness.js
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterBusiness.css'; 

const RegisterBusiness = () => {
  const { user, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    businessHours: {
      Monday: { open: '', close: '' },
      Tuesday: { open: '', close: '' },
      Wednesday: { open: '', close: '' },
      Thursday: { open: '', close: '' },
      Friday: { open: '', close: '' },
      Saturday: { open: '', close: '' },
      Sunday: { open: '', close: '' }
    },
    pricing: '',
    category: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    cancellationPolicy: '',
    reschedulingPolicy: '',
    bookingLeadTime: 0,
    maxBookingDuration: 0,
    servicesOffered: [{ serviceName: '', description: '', duration: 0, price: 0 }],
    ownerId: user?.id || null,
  });

  useEffect(() => {
    if (user && role === 'businessowner') { // Ensure the role matches 'businessowner'
      setFormData((prevData) => ({
        ...prevData,
        ownerId: user.id,
      }));
    }
  }, [user, role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleBusinessHoursChange = (e) => {
    const { name, value } = e.target;
    const [day, timeType] = name.split('_');
    setFormData((prevData) => ({
      ...prevData,
      businessHours: {
        ...prevData.businessHours,
        [day]: {
          ...prevData.businessHours[day], 
          [timeType]: value
        }
      }
    }));
  };
  
  const handleServiceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedServices = formData.servicesOffered.map((service, i) =>
      i === index ? { ...service, [name]: value } : service
    );
    setFormData({
      ...formData,
      servicesOffered: updatedServices
    });
  };

  const addService = () => {
    setFormData({
      ...formData,
      servicesOffered: [...formData.servicesOffered, { serviceName: '', description: '', duration: 0, price: 0 }]
    });
  };

  const removeService = (index) => {
    const updatedServices = formData.servicesOffered.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      servicesOffered: updatedServices
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting formData:', formData); 
    try {
      await axios.post('http://localhost:3000/businesses', formData);
      navigate('/businessowner/business-list');
    } catch (error) {
      console.error('Error registering business:', error);
    }
  };
  
  return (
    <div className="register-business-container">
      <h2>Register Your Business</h2>
      <form onSubmit={handleSubmit} className="register-business-form">
        <div>
          <label>Business Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Business Hours:</label>
          {Object.keys(formData.businessHours).map((day) => (
            <div key={day}>
              <label>{day}:</label>
              <input
                type="text"
                name={`${day}_open`}
                placeholder="Open"
                value={formData.businessHours[day].open}
                onChange={handleBusinessHoursChange}
                required
              />
              <input
                type="text"
                name={`${day}_close`}
                placeholder="Close"
                value={formData.businessHours[day].close}
                onChange={handleBusinessHoursChange}
                required
              />
            </div>
          ))}
        </div>
        <div>
          <label>Pricing:</label>
          <input type="text" name="pricing" value={formData.pricing} onChange={handleChange} required />
        </div>
        <div>
          <label>Category:</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} required />
        </div>
        <div>
          <label>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div>
          <label>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Website:</label>
          <input type="url" name="website" value={formData.website} onChange={handleChange} />
        </div>
        <div>
          <label>Cancellation Policy:</label>
          <textarea name="cancellationPolicy" value={formData.cancellationPolicy} onChange={handleChange} required />
        </div>
        <div>
          <label>Rescheduling Policy:</label>
          <textarea name="reschedulingPolicy" value={formData.reschedulingPolicy} onChange={handleChange} required />
        </div>
        <div>
          <label>Booking Lead Time (in minutes):</label>
          <input
            type="number"
            name="bookingLeadTime"
            value={formData.bookingLeadTime}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Max Booking Duration (in minutes):</label>
          <input
            type="number"
            name="maxBookingDuration"
            value={formData.maxBookingDuration}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Services Offered:</label>
          {formData.servicesOffered.map((service, index) => (
            <div key={index}>
              <div>
                <label>Service Name:</label>
                <input
                  type="text"
                  name="serviceName"
                  placeholder="Service Name"
                  value={service.serviceName}
                  onChange={(e) => handleServiceChange(index, e)}
                  required
                />
              </div>
              <div>
                <label>Description:</label>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={service.description}
                  onChange={(e) => handleServiceChange(index, e)}
                  required
                />
              </div>
              <div>
                <label>Duration (in minutes):</label>
                <input
                  type="number"
                  name="duration"
                  placeholder="Duration (in minutes)"
                  value={service.duration}
                  onChange={(e) => handleServiceChange(index, e)}
                  required
                />
              </div>
              <div>
                <label>Price:</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={service.price}
                  onChange={(e) => handleServiceChange(index, e)}
                  required
                />
              </div>
              <button type="button" onClick={() => removeService(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addService}>Add Another Service</button>
        </div>
        <button type="submit">Register Business</button>
      </form>
    </div>
  );
};

export default RegisterBusiness;
