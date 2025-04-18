import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title
);

const generateColors = (count) => {
  const palette = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#8e44ad',
    '#2ecc71',
    '#e67e22',
    '#3498db',
    '#f39c12',
    '#1abc9c',
    '#9b59b6',
    '#34495e',
    '#2c3e50',
  ];
  return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
};

const ChartComponent = ({
  type,
  labels = [],
  data = [],
  title = '',
  datasets = null,
}) => {
  const backgroundColors = generateColors(data?.length || 0);

  const chartData = {
    labels,
    datasets: datasets
      ? datasets.map((ds) => ({
          ...ds,
          backgroundColor:
            type === 'pie'
              ? generateColors(ds.data.length)
              : ds.backgroundColor,
          borderColor: ds.borderColor || 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          tension: 0.4,
          fill: false,
          pointRadius: 4,
        }))
      : [
          {
            label: title,
            data,
            backgroundColor:
              type === 'pie' ? backgroundColors : 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            tension: 0.4,
            fill: false,
            pointRadius: 4,
          },
        ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: type !== 'bar' || !!datasets,
        position: type === 'pie' ? 'right' : 'bottom',
        labels: {
          padding: 20,
          boxWidth: 12,
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
        },
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: window.innerWidth < 768 ? 14 : 16,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        bodyFont: {
          size: 12,
        },
        titleFont: {
          size: 14,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: window.innerWidth < 768 ? 45 : 0,
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  const hasData =
    (datasets && datasets.length && datasets.some((ds) => ds.data?.length)) ||
    (data && data.length);

  if (!hasData) {
    return (
      <div className='p-4 text-center text-muted bg-light rounded'>
        <i className='bi bi-bar-chart fs-4 d-block mb-2'></i>
        {title}: No data available
      </div>
    );
  }

  return (
    <div
      className='position-relative'
      style={{ minHeight: '300px', height: '100%' }}
    >
      <div className='p-3 border rounded bg-white shadow-sm h-100'>
        {type === 'bar' && <Bar data={chartData} options={options} />}
        {type === 'pie' && <Pie data={chartData} options={options} />}
        {type === 'line' && <Line data={chartData} options={options} />}
      </div>
    </div>
  );
};

export default ChartComponent;
