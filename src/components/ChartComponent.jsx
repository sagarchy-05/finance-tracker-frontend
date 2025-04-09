// src/components/ChartComponent.jsx
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2'];

const ChartComponent = ({
  data,
  type,
  dataKey = 'total',
  nameKey = 'category',
  title,
}) => {
  const isEmpty = !Array.isArray(data) || data.length === 0;

  if (isEmpty) {
    return (
      <div className='mb-5 text-center'>
        {title && <h4 className='mb-3'>{title}</h4>}
        <div className='alert alert-light'>
          No data available to render the chart.
        </div>
      </div>
    );
  }

  const renderChart = () => {
    switch (type) {
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              cx='50%'
              cy='50%'
              outerRadius={100}
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );

      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey={nameKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill='#8884d8' />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey={nameKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type='monotone' dataKey={dataKey} stroke='#82ca9d' />
          </LineChart>
        );

      default:
        return <p className='text-danger'>Unsupported chart type: {type}</p>;
    }
  };

  return (
    <div className='mb-5'>
      {title && <h4 className='mb-3'>{title}</h4>}
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>{renderChart()}</ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartComponent;
