import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(!!token);

  useEffect(() => {
    setIsAuth(!!token);
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-primary px-4'>
      <Link className='navbar-brand' to='/'>
        💰 Finance Tracker
      </Link>

      <div className='collapse navbar-collapse justify-content-end'>
        <ul className='navbar-nav'>
          {!isAuth ? (
            <>
              <li className='nav-item'>
                <Link className='nav-link' to='/login'>
                  Login
                </Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link' to='/signup'>
                  Signup
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className='nav-item'>
                <Link className='nav-link' to='/dashboard'>
                  Dashboard
                </Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link' to='/Budgets'>
                  Budgets
                </Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link' to='/Transactions'>
                  Transactions
                </Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link' to='/Charts'>
                  Charts
                </Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link' to='/Insights'>
                  AI Insights
                </Link>
              </li>
              <li className='nav-item'>
                <button
                  className='btn btn-light btn-sm ms-2'
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
