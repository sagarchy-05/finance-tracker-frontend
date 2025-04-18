import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import ChartComponent from '../../components/ChartComponent';
import { Button } from 'react-bootstrap';
import Spinner from '../../components/Spinner';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const Charts = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (input, type = 'date') => {
    const options =
      type === 'month'
        ? { month: 'short', year: 'numeric' }
        : { day: '2-digit', month: 'short' };
    return new Date(input).toLocaleDateString('en-IN', options);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, monthRes, budgetRes, dailyRes] = await Promise.all([
          api.get('/charts/category-totals'),
          api.get('/charts/monthly-trends'),
          api.get('/charts/budget-vs-actual'),
          api.get('/charts/daily-summary'),
        ]);

        setCategoryData(
          Array.isArray(catRes.data?.data) ? catRes.data.data : []
        );
        setMonthlyData(
          (Array.isArray(monthRes.data?.data) ? monthRes.data.data : [])
            .sort((a, b) => new Date(a.month) - new Date(b.month))
            .map((item) => ({
              ...item,
              month: formatDate(item.month, 'month'),
            }))
        );
        setBudgetData(
          Array.isArray(budgetRes.data?.data) ? budgetRes.data.data : []
        );
        setDailyData(
          (Array.isArray(dailyRes.data?.data) ? dailyRes.data.data : [])
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((item) => ({
              ...item,
              date: formatDate(item.date, 'date'),
            }))
        );
      } catch (err) {
        console.error('Error fetching chart data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const exportPDF = async () => {
    const input = document.getElementById('charts-section');
    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        logging: false,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('financial-charts.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (loading) return <Spinner fullScreen />;

  return (
    <div className='container py-3'>
      <div className='d-flex flex-column flex-md-row justify-content-between align-items-center mb-4'>
        <h2 className='fw-bold mb-3 mb-md-0'>Financial Insights</h2>
        <Button
          variant='primary'
          onClick={exportPDF}
          disabled={
            !categoryData.length &&
            !monthlyData.length &&
            !budgetData.length &&
            !dailyData.length
          }
          className='ms-md-3'
        >
          <i className='bi bi-file-earmark-pdf me-2'></i>
          Export Report
        </Button>
      </div>

      <div id='charts-section' className='row g-4'>
        {categoryData.length > 0 && (
          <div className='col-12 col-lg-6'>
            <ChartComponent
              title='Spending by Category'
              type='pie'
              labels={categoryData.map((item) => item.category)}
              data={categoryData.map((item) => item.total)}
            />
          </div>
        )}

        {monthlyData.length > 0 && (
          <div className='col-12 col-lg-6'>
            <ChartComponent
              title='Monthly Spending Trend'
              type='line'
              labels={monthlyData.map((item) => item.month)}
              data={monthlyData.map((item) => item.total)}
            />
          </div>
        )}

        {budgetData.length > 0 && (
          <div className='col-12'>
            <ChartComponent
              title='Budget vs Actual Spending'
              type='bar'
              labels={budgetData.map((item) => item.category)}
              datasets={[
                {
                  label: 'Budget',
                  data: budgetData.map((item) => item.budget ?? 0),
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                },
                {
                  label: 'Actual',
                  data: budgetData.map((item) => item.spent ?? 0),
                  backgroundColor: 'rgba(255, 159, 64, 0.6)',
                  borderColor: 'rgba(255, 159, 64, 1)',
                },
              ]}
            />
          </div>
        )}

        {dailyData.length > 0 && (
          <div className='col-12'>
            <ChartComponent
              title='Daily Expense Summary'
              type='bar'
              labels={dailyData.map((item) => item.date)}
              data={dailyData.map((item) => item.total)}
              backgroundColor='rgba(153, 102, 255, 0.6)'
            />
          </div>
        )}

        {!categoryData.length &&
          !monthlyData.length &&
          !budgetData.length &&
          !dailyData.length && (
            <div className='col-12'>
              <div className='card shadow-sm'>
                <div className='card-body text-center py-5'>
                  <i className='bi bi-bar-chart fs-1 text-muted mb-3'></i>
                  <h4 className='mb-3'>No Chart Data Available</h4>
                  <p className='text-muted'>
                    Your financial charts will appear here once you have
                    transaction data.
                  </p>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Charts;
