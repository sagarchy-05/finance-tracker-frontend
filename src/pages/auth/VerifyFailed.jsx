import { Link } from 'react-router-dom';

const VerifyFailed = () => {
  return (
    <div
      className='container d-flex justify-content-center align-items-center'
      style={{ minHeight: '80vh' }}
    >
      <div
        className='card shadow-sm p-4 p-md-5 text-center'
        style={{ maxWidth: '500px', width: '100%' }}
      >
        <div className='mb-4 text-danger'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='64'
            height='64'
            fill='currentColor'
            className='bi bi-x-circle'
            viewBox='0 0 16 16'
          >
            <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z' />
            <path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z' />
          </svg>
        </div>
        <h2 className='mb-3 fw-bold'>Email Verification Failed</h2>
        <p className='text-muted mb-4'>The link may be expired or invalid.</p>

        <div className='d-grid gap-2'>
          <p className='mb-2'>
            Try{' '}
            <Link
              to='/register'
              className='text-primary text-decoration-none fw-semibold'
            >
              signing up
            </Link>{' '}
            again or check your inbox for a new link.
          </p>
          <p className='mb-0'>
            Didn't get the email?{' '}
            <Link
              to='/resend-verification'
              className='text-primary text-decoration-none fw-semibold'
            >
              Resend it here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyFailed;
