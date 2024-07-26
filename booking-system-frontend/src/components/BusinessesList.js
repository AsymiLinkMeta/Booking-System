import React from 'react';
import '../styles/BusinessesList.css';

const BusinessesList = ({ businesses }) => {
  return (
    <div className="businesses-list">
      {businesses.length === 0 ? (
        <p>No businesses registered.</p>
      ) : (
        businesses.map((business) => (
          <div key={business.id} className="business-item">
            <p><strong>{business.name}</strong></p>
            <p>{business.description}</p>
            <p>Owner: {business.owner ? business.owner.email : 'Unknown'}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default BusinessesList;
