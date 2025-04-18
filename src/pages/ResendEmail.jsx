import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import LoadingButton from '../components/LoadingButton';

const ResendEmail = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Resend Email - Finance Tracker';
  }, []);

  const handleResend = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/resend-verification', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col-12 col-md-8 col-lg-6'>
          <div className='card shadow-sm mt-4 mt-md-5'>
            <div className='card-body p-4 p-md-5'>
              <div className='text-center mb-4'>
                <svg
                  width='64'
                  height='64'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='text-primary mb-3'
                >
                  <path
                    d='M22 16.92V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H16'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M19 20C20.1046 20 21 19.1046 21 18C21 16.8954 20.1046 16 19 16C17.8954 16 17 16.8954 17 18C17 19.1046 17.8954 20 19 20Z'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M11.9941 15H12.0031'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M8.29492 10.7L11.9949 7L15.6949 10.7'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <h2 className='fw-bold'>Resend Verification Email</h2>
                <p className='text-muted'>
                  Enter your email to receive a new verification link
                </p>
              </div>

              <form onSubmit={handleResend}>
                <div className='mb-3'>
                  <label htmlFor='email' className='form-label fw-medium'>
                    Email Address
                  </label>
                  <input
                    type='email'
                    className='form-control form-control-lg'
                    id='email'
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className='d-grid gap-2 mb-3'>
                  <LoadingButton
                    type='submit'
                    className='btn-primary py-2'
                    loading={loading}
                    size='lg'
                  >
                    <i className='bi bi-envelope-arrow-up me-2'></i>
                    Resend Email
                  </LoadingButton>
                </div>

                {message && (
                  <div className='alert alert-success d-flex align-items-center'>
                    <i className='bi bi-check-circle-fill me-2'></i>
                    <div>{message}</div>
                  </div>
                )}
                {error && (
                  <div className='alert alert-danger d-flex align-items-center'>
                    <i className='bi bi-exclamation-triangle-fill me-2'></i>
                    <div>{error}</div>
                  </div>
                )}
              </form>

              <div className='text-center mt-4'>
                <p className='mb-0'>
                  Remembered your password?{' '}
                  <Link to='/login' className='text-decoration-none fw-medium'>
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResendEmail;
