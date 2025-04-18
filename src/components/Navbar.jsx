import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeNavbar = () => {
    setIsNavExpanded(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-primary px-3 px-md-4 py-2'>
      <div className='container-fluid'>
        <Link className='navbar-brand fw-bold' to='/' onClick={closeNavbar}>
          <span className='d-inline-block me-2'>💰</span>
          <span className='d-none d-sm-inline'>Finance Tracker</span>
          <span className='d-inline d-sm-none'>FT</span>
        </Link>

        <button
          className={`navbar-toggler ${isNavExpanded ? '' : 'collapsed'}`}
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarContent'
          aria-controls='navbarContent'
          aria-expanded={isNavExpanded}
          aria-label='Toggle navigation'
          onClick={() => setIsNavExpanded(!isNavExpanded)}
        >
          <span
            className={`navbar-toggler-icon ${
              isNavExpanded ? 'navbar-toggler-x' : ''
            }`}
          ></span>
        </button>

        <div
          className={`collapse navbar-collapse ${isNavExpanded ? 'show' : ''}`}
          id='navbarContent'
          style={
            isNavExpanded
              ? {
                  position: 'fixed',
                  top: '56px',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: '#0d6efd',
                  zIndex: 1040,
                  overflowY: 'auto',
                }
              : {}
          }
        >
          <ul className='navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center'>
            {!token ? (
              <>
                <li className='nav-item text-center text-lg-start'>
                  <Link
                    className={`nav-link px-2 px-md-3 ${isActive('/login')}`}
                    to='/login'
                    onClick={closeNavbar}
                  >
                    Login
                  </Link>
                </li>
                <li className='nav-item text-center text-lg-start'>
                  <Link
                    className={`nav-link px-2 px-md-3 ${isActive('/signup')}`}
                    to='/signup'
                    onClick={closeNavbar}
                  >
                    Signup
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className='nav-item text-center text-lg-start'>
                  <Link
                    className={`nav-link px-2 px-md-3 ${isActive(
                      '/dashboard'
                    )}`}
                    to='/dashboard'
                    onClick={closeNavbar}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className='nav-item text-center text-lg-start'>
                  <Link
                    className={`nav-link px-2 px-md-3 ${isActive('/Budgets')}`}
                    to='/Budgets'
                    onClick={closeNavbar}
                  >
                    Budgets
                  </Link>
                </li>
                <li className='nav-item text-center text-lg-start'>
                  <Link
                    className={`nav-link px-2 px-md-3 ${isActive(
                      '/Transactions'
                    )}`}
                    to='/Transactions'
                    onClick={closeNavbar}
                  >
                    Transactions
                  </Link>
                </li>
                <li className='nav-item text-center text-lg-start'>
                  <Link
                    className={`nav-link px-2 px-md-3 ${isActive('/Charts')}`}
                    to='/Charts'
                    onClick={closeNavbar}
                  >
                    Charts
                  </Link>
                </li>
                <li className='nav-item text-center text-lg-start'>
                  <Link
                    className={`nav-link px-2 px-md-3 ${isActive('/Insights')}`}
                    to='/Insights'
                    onClick={closeNavbar}
                  >
                    AI Insights
                  </Link>
                </li>
                <li className='nav-item text-center mt-2 mt-lg-0 ms-lg-2 d-flex align-items-center justify-content-center'>
                  <button
                    className='btn btn-danger btn-sm px-3 py-1 rounded-pill d-flex align-items-center justify-content-center'
                    onClick={handleLogout}
                  >
                    <span>Logout</span>
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        .navbar-toggler-x {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255, 255, 255, 0.8)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
          transition: transform 0.3s ease;
        }
        .navbar-toggler-x:not(.collapsed) {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255, 255, 255, 0.8)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7L26 23M4 23L26 7'/%3e%3c/svg%3e");
        }
        @media (max-width: 991.98px) {
          .navbar-collapse.show {
            position: fixed;
            top: 56px;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #0d6efd;
            z-index: 1040;
            overflow-y: auto;
            padding: 20px;
          }
          .navbar-collapse.show .navbar-nav {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
