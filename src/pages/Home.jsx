import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  useEffect(() => {
    document.title = 'Home - Finance Tracker';
  }, []);

  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col-12 col-md-10 col-lg-8 text-center'>
          <div className='mt-5 pt-4 mt-md-5 pt-md-5'>
            <h1 className='display-4 fw-bold mb-4'>
              Welcome to FinanceTracker <span className='text-primary'>💸</span>
            </h1>
            <p className='lead fs-4 mb-5'>
              Manage your expenses, set budgets, track spending, and gain
              insights — all in one place.
            </p>

            <div className='d-grid gap-3 d-sm-flex justify-content-sm-center mb-5'>
              <Link to='/login' className='btn btn-primary btn-lg px-4 gap-3'>
                Login
              </Link>
              <Link
                to='/signup'
                className='btn btn-outline-secondary btn-lg px-4'
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
