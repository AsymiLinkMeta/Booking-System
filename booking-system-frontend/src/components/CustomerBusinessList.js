// src/components/CustomerBusinessList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/BusinessList.css';

const CustomerBusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get(`${apiUrl}/businesses`);
        // Sort businesses alphabetically by name
        const sortedBusinesses = response.data.sort((a, b) => a.name.localeCompare(b.name));
        setBusinesses(sortedBusinesses);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    };

    fetchBusinesses();
  }, [apiUrl]);

  return (
    <div className="business-list-container">
      <h2>Available Businesses</h2>
      <ul className="business-list">
        {businesses.map((business) => (
          <li key={business.id}>
            <Link to={`/customer/business-details/${business.id}`}>{business.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerBusinessList;
