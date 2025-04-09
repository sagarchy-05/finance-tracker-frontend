// src/pages/dashboard/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Chart from '../../components/ChartComponent';
import Alert from '../../components/Alert';

const Dashboard = () => {
  const [categoryTotals, setCategoryTotals] = useState(null);
  const [monthlyTrends, setMonthlyTrends] = useState(null);
  const [budgetVsActual, setBudgetVsActual] = useState(null);
  const [dailySummary, setDailySummary] = useState(null);
  const [alert, setAlert] = useState({ visible: false, message: '', type: '' });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [catRes, monthRes, budgetRes, dailyRes] = await Promise.all([
        api.get('/charts/category-totals'),
        api.get('/charts/monthly-trends'),
        api.get('/charts/budget-vs-actual'),
        api.get('/charts/daily-summary'),
      ]);

      setCategoryTotals(catRes.data);
      setMonthlyTrends(monthRes.data);
      setBudgetVsActual(budgetRes.data);
      setDailySummary(dailyRes.data);
    } catch (error) {
      setAlert({
        visible: true,
        message: 'Failed to load dashboard data.',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className='container py-4'>
      <h2 className='mb-4 text-center'>Dashboard</h2>

      {alert.visible && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ ...alert, visible: false })}
        />
      )}

      {loading ? (
        <div className='text-center'>Loading dashboard...</div>
      ) : (
        <div className='row g-4'>
          <div className='col-md-6'>
            <Chart title='Category Totals' type='pie' data={categoryTotals} />
          </div>
          <div className='col-md-6'>
            <Chart
              title='Monthly Spending Trends'
              type='line'
              data={monthlyTrends}
            />
          </div>
          <div className='col-md-6'>
            <Chart title='Budget vs Actual' type='bar' data={budgetVsActual} />
          </div>
          <div className='col-md-6'>
            <Chart
              title='Daily Expense Summary'
              type='line'
              data={dailySummary}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
