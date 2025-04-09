// src/components/Footer.jsx
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='bg-dark text-white text-center py-3 mt-auto'>
      <div className='container'>
        <p className='mb-1'>&copy; {new Date().getFullYear()} FinanceTracker</p>
        <div>
          <Link className='text-white me-3 text-decoration-none' to='/'>
            Home
          </Link>
          <Link
            className='text-white me-3 text-decoration-none'
            to='/dashboard'
          >
            Dashboard
          </Link>
          <Link className='text-white text-decoration-none' to='/transactions'>
            Transactions
          </Link>
        </div>
        <p className='mt-2 small'>Made with ❤️ by Sagar</p>
      </div>
    </footer>
  );
};

export default Footer;
