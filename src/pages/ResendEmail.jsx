// src/pages/ResendEmail.jsx
import { useState } from 'react';
import api from '../api/axios';

const ResendEmail = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResend = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await api.post('/auth/resend-verification', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className='container mt-5 text-center'>
      <h2>Resend Verification Email</h2>
      <form onSubmit={handleResend} className='mt-3'>
        <input
          type='email'
          className='form-control mb-2'
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className='btn btn-primary w-100' type='submit'>
          Resend Email
        </button>
      </form>
      {message && <div className='alert alert-success mt-3'>{message}</div>}
      {error && <div className='alert alert-danger mt-3'>{error}</div>}
    </div>
  );
};

export default ResendEmail;
