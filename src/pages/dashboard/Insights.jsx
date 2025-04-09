// src/pages/dashboard/Insights.jsx
import { useEffect, useState } from 'react';
import Spinner from '../../components/Spinner';
import { getToken } from '../../utils/token';
import api from '../../api/axios';

const Insights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await api.get('/insights');
      if (Array.isArray(res.data.insights)) {
        setInsights(res.data.insights);
        setMessage(res.data.message || '');
      } else {
        setInsights([]);
        setMessage('No insights available yet.');
      }
      setError('');
    } catch (err) {
      console.error('Error fetching insights:', err);
      setError('Failed to fetch insights.');
      setInsights([]);
    }
    setLoading(false);
  };

  const generateInsight = async () => {
    setGenerating(true);
    setMessage('');
    setError('');
    try {
      const res = await api.post('/insights');
      if (res.data && res.data.insight?.content) {
        setInsights((prev) => [res.data.insight, ...prev]);
      } else if (res.data?.message) {
        setMessage(res.data.message);
      } else {
        throw new Error('Invalid insight format');
      }
    } catch (err) {
      if (err.response?.status === 429) {
        const retryAfter = err.response.data.retryAfter; // ❗ will break if undefined
        const minutes = Math.floor(retryAfter / 60);
        const seconds = retryAfter % 60;
        setMessage(
          `Rate limit exceeded. Try again in ${minutes}m ${seconds}s.`
        );
      } else {
        console.error('Error generating insight:', err);
        if (err.response?.data?.message) {
          setMessage(err.response.data.message);
        } else {
          setError('Could not generate new insight. Try again later.');
        }
      }
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h2>Your Financial Insights</h2>
        <button
          className='btn btn-primary'
          onClick={generateInsight}
          disabled={generating}
        >
          {generating ? 'Generating...' : 'Generate Insights'}
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className='alert alert-danger'>{error}</div>
      ) : message ? (
        <div className='alert alert-info'>{message}</div>
      ) : insights.length === 0 ? (
        <div className='alert alert-info'>
          No insights yet. Generate one to get started!
        </div>
      ) : (
        insights.map((insight, idx) => (
          <div className='card mb-3' key={idx}>
            <div className='card-body'>
              <h5 className='card-title'>Insight #{insights.length - idx}</h5>
              <ul>
                {insight.content
                  .split('\n')
                  .filter((line) => line.startsWith('-'))
                  .map((point, i) => (
                    <li key={i}>{point.replace(/^-\s*/, '')}</li>
                  ))}
              </ul>
              <p className='text-muted'>
                Generated on{' '}
                {insight.createdAt
                  ? new Date(insight.createdAt).toLocaleString()
                  : 'Unknown time'}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Insights;
