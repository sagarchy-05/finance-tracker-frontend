import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChartBar, FaWallet, FaPiggyBank, FaLightbulb } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import financialQuotes from '../../utils/financialQuotes';

const Dashboard = () => {
  const { user } = useAuth();
  const [quote, setQuote] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    document.title = 'Dashboard - Finance Tracker';
    setCurrentTime(getTimeOfDay());
    setQuote(getRandomQuote());

    if (user?.name) {
      setUserName(user.name.split(' ')[0]);
    }
  }, [user]);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const getRandomQuote = () => {
    return financialQuotes[Math.floor(Math.random() * financialQuotes.length)];
  };

  const features = [
    {
      title: 'Transactions',
      description: 'Log, edit, and review your income and expenses.',
      icon: <FaWallet className='text-primary fs-1 mb-2' />,
      link: '/transactions',
    },
    {
      title: 'Budgets',
      description: 'Set and manage spending limits by category.',
      icon: <FaPiggyBank className='text-success fs-1 mb-2' />,
      link: '/budgets',
    },
    {
      title: 'Charts',
      description: 'Visualize your spending trends and daily activity.',
      icon: <FaChartBar className='text-info fs-1 mb-2' />,
      link: '/charts',
    },
    {
      title: 'Insights',
      description: 'Get AI-generated suggestions for better budgeting.',
      icon: <FaLightbulb className='text-warning fs-1 mb-2' />,
      link: '/insights',
    },
  ];

  return (
    <div className='container py-4'>
      <div className='text-center mb-4'>
        <h2 className='fw-bold mb-3 display-5'>
          Good {currentTime}
          {userName ? `, ${userName}` : ''}!
        </h2>
        <div
          className='card bg-light border-0 shadow-sm mb-4 mx-auto'
          style={{ maxWidth: '800px' }}
        >
          <div className='card-body py-3'>
            <p className='lead mb-0 fst-italic'>"{quote}"</p>
          </div>
        </div>
      </div>

      <div className='row g-4'>
        {features.map((feature, idx) => (
          <div className='col-md-6 col-lg-3' key={idx}>
            <Link to={feature.link} className='text-decoration-none'>
              <div className='card h-100 shadow-sm border-0 hover-shadow transition-all'>
                <div className='card-body text-center p-4'>
                  {feature.icon}
                  <h5 className='card-title mt-2'>{feature.title}</h5>
                  <p className='card-text text-muted'>{feature.description}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
