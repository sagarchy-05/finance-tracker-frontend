// src/pages/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';
import api from '../../api/axios';
import LoadingButton from '../../components/LoadingButton';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [alert, setAlert] = useState({ type: '', message: '', visible: false });
  const [loading, setLoading] = useState(false); // <-- Added this line

  useEffect(() => {
    document.title = 'Signin - Finance Tracker';
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // <-- Set loading true at start

    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);

      setAlert({
        type: 'success',
        message: 'Logged in successfully!',
        visible: true,
      });

      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      setAlert({
        type: 'danger',
        message: error.response?.data?.message || 'Login failed',
        visible: true,
      });
    } finally {
      setLoading(false); // <-- Always reset loading at the end
    }
  };

  return (
    <div className='container' style={{ maxWidth: '500px' }}>
      <h2 className='mb-4 text-center'>Login</h2>

      {alert.visible && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ ...alert, visible: false })}
        />
      )}

      <form onSubmit={handleSubmit}>
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
          className='btn-success w-100'
          loading={loading}
        >
          Login
        </LoadingButton>
      </form>
    </div>
  );
};

export default Login;
