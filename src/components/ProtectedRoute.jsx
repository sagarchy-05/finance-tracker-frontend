// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

// Optional: Decode JWT to check expiry or roles
const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000); // current time in seconds
    return payload.exp > now;
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
};

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');

  if (!token || !isTokenValid()) {
    return <Navigate to='/login' />;
  }

  // Optional: check role if needed in future
  if (requiredRole) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role !== requiredRole) {
      return <Navigate to='/unauthorized' />; // Create this page if needed
    }
  }

  return children;
};

export default ProtectedRoute;
