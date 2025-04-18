import React from 'react';
import { Navigate } from 'react-router-dom';

// Decode JWT to check expiry or roles
const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token || !isTokenValid()) {
    return <Navigate to='/login' />;
  }
  return children;
};

export default ProtectedRoute;
