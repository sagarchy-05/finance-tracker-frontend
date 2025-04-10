// src/pages/NotFound.jsx
import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  useEffect(() => {
    document.title = '404 - Finance Tracker';
  }, []);

  return (
    <div className='container text-center mt-5'>
      <h1 className='display-3 text-danger'>404</h1>
      <p className='lead'>Oops! The page you're looking for doesn't exist.</p>
      <Link to='/' className='btn btn-primary mt-3'>
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
