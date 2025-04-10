// src/pages/Dashboard/Charts.jsx
import React, { useEffect, useState, useRef } from 'react';
import api from '../../api/axios';
import ChartComponent from '../../components/ChartComponent';
import Spinner from '../../components/Spinner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const formatDate = (input, type = 'date') => {
  const options =
    type === 'month'
      ? { month: 'short', year: 'numeric' }
      : { day: '2-digit', month: 'short' };
  return new Date(input).toLocaleDateString('en-IN', options);
};

const Charts = () => {
  const chartRef = useRef();
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    document.title = 'Charts - Finance Tracker';
  }, []);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const [catRes, monthRes, budgetRes, dailyRes] = await Promise.all([
        api.get('/charts/category-totals'),
        api.get('/charts/monthly-trends'),
        api.get('/charts/budget-vs-actual'),
        api.get('/charts/daily-summary'),
      ]);

      setCategoryData(catRes.data.data);

      setMonthlyData(
        monthRes.data.data
          .sort((a, b) => new Date(a.month) - new Date(b.month))
          .map((item) => ({
            ...item,
            month: formatDate(item.month, 'month'),
          }))
      );

      setBudgetData(budgetRes.data.data);

      setDailyData(
        dailyRes.data.data
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((item) => ({
            ...item,
            date: formatDate(item.date, 'date'),
          }))
      );
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  const handleDownloadPDF = async () => {
    const input = chartRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const ratio = Math.min(
      pageWidth / imgProps.width,
      pageHeight / imgProps.height
    );
    const imgWidth = imgProps.width * ratio;
    const imgHeight = imgProps.height * ratio;

    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save('charts.pdf');
  };

  return (
    <div className='container'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h2>Spending Charts</h2>
        <button onClick={handleDownloadPDF} className='btn btn-primary'>
          Download PDF
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div ref={chartRef}>
          <ChartComponent
            title='Category-wise Spending'
            type='pie'
            data={categoryData}
            dataKey='total'
            nameKey='category'
          />

          <ChartComponent
            title='Monthly Spending Trend'
            type='line'
            data={monthlyData}
            dataKey='total'
            nameKey='month'
          />

          <div className='mb-5'>
            <h4>Budget vs Actual</h4>
            {budgetData.length === 0 ? (
              <p className='text-muted'>No budget data available.</p>
            ) : (
              budgetData.map((item, index) => {
                const percentage = Math.min(
                  (item.spent / item.budget) * 100,
                  100
                );
                return (
                  <div key={index} className='mb-3'>
                    <strong>{item.category}</strong>
                    <div className='progress'>
                      <div
                        className={`progress-bar ${
                          percentage >= 100 ? 'bg-danger' : 'bg-success'
                        }`}
                        role='progressbar'
                        style={{ width: `${percentage}%` }}
                      >
                        ₹{item.spent} / ₹{item.budget}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <ChartComponent
            title='Daily Expense Summary'
            type='bar'
            data={dailyData}
            dataKey='total'
            nameKey='date'
          />
        </div>
      )}
    </div>
  );
};

export default Charts;
