import React from 'react';
import '../styles/Report.css';

const Report = ({ report }) => {
  return (
    <div className="report">
      <p><strong>Total Businesses:</strong> {report.businesses}</p>
      <p><strong>Total Users:</strong> {report.users}</p>
      <p><strong>Total Bookings:</strong> {report.bookings}</p>
    </div>
  );
};

export default Report;
