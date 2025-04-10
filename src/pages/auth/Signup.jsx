// src/pages/auth/Signup.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';
import api from '../../api/axios';
import LoadingButton from '../../components/LoadingButton';

const Signup = () => {
  useEffect(() => {
    document.title = 'Signup - Finance Tracker';
  }, []);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [alert, setAlert] = useState({
    type: '',
    message: '',
    visible: false,
  });

  const [loading, setLoading] = useState(false); // <-- Added loading state

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // <-- Set loading true at start

    try {
      const res = await api.post('/auth/signup', formData);

      setAlert({
        type: 'success',
        message: res.data.message || 'Account created successfully!',
        visible: true,
      });

      setTimeout(() => navigate('/login'), 10000);
    } catch (error) {
      setAlert({
        type: 'danger',
        message: error.response?.data?.message || 'Signup failed',
        visible: true,
      });
    } finally {
      setLoading(false); // <-- Always reset loading at the end
    }
  };

  return (
    <div className='container' style={{ maxWidth: '500px' }}>
      <h2 className='mb-4 text-center'>Sign Up</h2>

      {alert.visible && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ ...alert, visible: false })}
        />
      )}

      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label htmlFor='name' className='form-label'>
            Full Name
          </label>
          <input
            type='text'
            className='form-control'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className='mb-3'>
          <label htmlFor='email' className='form-label'>
            Email address
          </label>
          <input
            type='email'
            className='form-control'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className='mb-3'>
          <label htmlFor='password' className='form-label'>
            Password
          </label>
          <input
            type='password'
            className='form-control'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <LoadingButton
          type='submit'
          className='btn-primary w-100'
          loading={loading}
        >
          Sign Up
        </LoadingButton>
      </form>
    </div>
  );
};

export default Signup;
