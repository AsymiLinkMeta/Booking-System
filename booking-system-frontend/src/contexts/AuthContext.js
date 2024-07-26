// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('role');
    if (token && userId) {
      setUser({ token, id: parseInt(userId, 10) }); 
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, { email, password });
      const { access_token, id, role } = response.data; 
      setUser({ token: access_token, id }); 
      setRole(role);
      localStorage.setItem('token', access_token);
      localStorage.setItem('userId', id);
      localStorage.setItem('role', role);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'An error occurred during login.');
    }
  };

  const register = async (email, password, role) => {
    try {
      await axios.post(`${apiUrl}/auth/register`, { email, password, role });
      await login(email, password); 
    } catch (error) {
      throw new Error(error.response?.data?.message || 'An error occurred during registration.');
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ user, role, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
