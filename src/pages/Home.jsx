// src/pages/Home.jsx
import React from 'react';
import { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    document.title = 'Home - Finance Tracker';
  }, []);

  return (
    <div className='text-center mt-5'>
      <h1 className='mb-3'>Welcome to FinanceTracker 💸</h1>
      <p className='lead'>
        Manage your expenses, set budgets, track spending, and gain insights —
        all in one place.
      </p>
    </div>
  );
};

export default Home;
