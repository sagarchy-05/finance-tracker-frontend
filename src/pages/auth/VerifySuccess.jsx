// src/pages/auth/VerifySuccess.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const VerifySuccess = () => {
  return (
    <div className='text-center my-5'>
      <h2>Email Verified Successfully ✅</h2>
      <p>You can now log in to your account.</p>
      <Link to='/login' className='btn btn-success mt-3'>
        Go to Login
      </Link>
    </div>
  );
};

export default VerifySuccess;
