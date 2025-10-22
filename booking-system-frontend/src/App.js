// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import HomePage from './components/HomePage';
import Register from './components/Register';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import BusinessOwnerDashboard from './components/BusinessOwnerDashboard';
import BusinessOwnerHome from './components/BusinessOwnerHome';
import CustomerDashboard from './components/CustomerDashboard';
import CustomerHome from './components/CustomerHome';
import RegisterBusiness from './components/RegisterBusiness';
import BusinessList from './components/BusinessList';
import BusinessDetail from './components/BusinessDetail';
import EditBusiness from './components/EditBusiness';
import CustomerBusinessList from './components/CustomerBusinessList';
import CustomerBusinessDetail from './components/CustomerBusinessDetail';
import BookService from './components/BookService';
import CustomerBookings from './components/CustomerBookings';
import EditBooking from './components/EditBooking';
import Checkout from './components/Checkout';
import BusinessOwnerBookings from './components/BusinessOwnerBookings';
import BusinessReviews from './components/BusinessReviews';

const App = () => {
  const { user, role } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<PrivateRoute component={AdminDashboard} role="admin" />} />
        <Route path="/businessowner" element={<PrivateRoute component={BusinessOwnerDashboard} role="businessowner" />}>
          <Route path="home" element={<BusinessOwnerHome />} />
          <Route path="register-business" element={<RegisterBusiness />} />
          <Route path="business-list" element={<BusinessList />} />
          <Route path="business-details/:id" element={<BusinessDetail />} />
          <Route path="business-list/:id/edit" element={<EditBusiness />} />
          <Route path="bookings" element={<BusinessOwnerBookings />} />
          <Route path="reviews/:userId" element={<BusinessReviews />} />
        </Route>
        <Route path="/customer" element={<PrivateRoute component={CustomerDashboard} role="customer" />}>
          <Route path="home" element={<CustomerHome />} />
          <Route path="business-list" element={<CustomerBusinessList />} />
          <Route path="business-details/:id" element={<CustomerBusinessDetail />} />
          <Route path="book-service/:businessId/:serviceName" element={<BookService />} />
          <Route path="bookings" element={<CustomerBookings />} />
          <Route path="bookings/edit/:id" element={<EditBooking />} />
          <Route path="bookings/checkout/:bookingId" element={<Checkout />} />
        </Route>
        <Route
          path="/"
          element={
            user ? (
              <NavigateToDashboard role={role} />
            ) : (
              <HomePage />
            )
          }
        />
      </Routes>
    </Router>
  );
};

const PrivateRoute = ({ component: Component, role, ...rest }) => {
  const { user, role: userRole } = useContext(AuthContext);

  return user && userRole === role ? <Component {...rest} /> : <Navigate to="/login" />;
};

const NavigateToDashboard = ({ role }) => {
  switch (role) {
    case 'admin':
      return <Navigate to="/admin" />;
    case 'businessowner':
      return <Navigate to="/businessowner/home" />;
    case 'customer':
      return <Navigate to="/customer/home" />;
    default:
      return <Navigate to="/register" />;
  }
};

const Main = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default Main;
