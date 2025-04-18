import { Link } from 'react-router-dom';

const VerifySuccess = () => {
  return (
    <div
      className='container d-flex justify-content-center align-items-center'
      style={{ minHeight: '80vh' }}
    >
      <div
        className='card shadow-sm p-4 p-md-5 text-center'
        style={{ maxWidth: '500px', width: '100%' }}
      >
        <div className='mb-4 text-success'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='64'
            height='64'
            fill='currentColor'
            className='bi bi-check-circle'
            viewBox='0 0 16 16'
          >
            <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z' />
            <path d='M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z' />
          </svg>
        </div>
        <h2 className='mb-3 fw-bold'>Email Verified Successfully</h2>
        <p className='text-muted mb-4'>You can now log in to your account.</p>

        <div className='d-grid'>
          <Link to='/login' className='btn btn-success btn-lg'>
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifySuccess;
