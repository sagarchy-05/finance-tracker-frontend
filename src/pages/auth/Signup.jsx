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

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/signup', formData);

      setAlert({
        type: 'success',
        message: res.data.message || 'Account created successfully!',
        visible: true,
      });

      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setAlert({
        type: 'danger',
        message: error.response?.data?.message || 'Signup failed',
        visible: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col-12 col-md-8 col-lg-6 col-xl-5'>
          <div className='card shadow-sm mt-4 mt-md-5'>
            <div className='card-body p-4 p-md-5'>
              <h2 className='mb-4 text-center fw-bold'>Sign Up</h2>

              {alert.visible && (
                <Alert
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert({ ...alert, visible: false })}
                  className='mb-4'
                />
              )}

              <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                  <label htmlFor='name' className='form-label fw-medium'>
                    Full Name
                  </label>
                  <input
                    type='text'
                    className='form-control form-control-lg'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoFocus
                  />
                </div>

                <div className='mb-3'>
                  <label htmlFor='email' className='form-label fw-medium'>
                    Email address
                  </label>
                  <input
                    type='email'
                    className='form-control form-control-lg'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className='mb-4'>
                  <label htmlFor='password' className='form-label fw-medium'>
                    Password
                  </label>
                  <input
                    type='password'
                    className='form-control form-control-lg'
                    id='password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className='d-grid gap-2'>
                  <LoadingButton
                    type='submit'
                    className='btn-primary py-2'
                    loading={loading}
                    size='lg'
                  >
                    Sign Up
                  </LoadingButton>
                </div>
              </form>

              <div className='text-center mt-4'>
                <p className='mb-0'>
                  Already have an account?{' '}
                  <a href='/login' className='text-decoration-none'>
                    Login
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
