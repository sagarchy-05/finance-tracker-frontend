// src/pages/VerifyFailed.jsx
import { Link } from 'react-router-dom';

const VerifyFailed = () => {
  return (
    <div className='text-center mt-5'>
      <h2>Email Verification Failed ❌</h2>
      <p>The link may be expired or invalid.</p>
      <p>
        Try <Link to='/register'>signing up</Link> again or check your inbox for
        a new link.
      </p>
      <p>
        Didn't get the email?{' '}
        <Link to='/resend-verification'>Resend it here</Link>
      </p>
    </div>
  );
};

export default VerifyFailed;
