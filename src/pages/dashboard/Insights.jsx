import { useEffect, useState } from 'react';
import Spinner from '../../components/Spinner';
import api from '../../api/axios';
import { FaLightbulb, FaRegLightbulb, FaSyncAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Insights = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [retryTime, setRetryTime] = useState(null);

  useEffect(() => {
    document.title = 'AI Insights - Finance Tracker';
    fetchInsights();

    return () => clearInterval(retryTime?.interval);
  }, []);

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
      setError('Failed to fetch insights. Please try again later.');
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };

  const generateInsight = async () => {
    if (retryTime) return;

    setGenerating(true);
    setMessage('');
    setError('');
    try {
      const res = await api.post('/insights');
      if (res.data?.insight?.content) {
        setInsights((prev) => [res.data.insight, ...prev]);
        setMessage('New insight generated successfully!');
      } else if (res.data?.message) {
        setMessage(res.data.message);
      } else {
        throw new Error('Invalid insight format');
      }
    } catch (err) {
      if (err.response?.status === 429) {
        const retryAfter = err.response.data?.retryAfter || 60;
        startCooldownTimer(retryAfter);
      } else {
        console.error('Error generating insight:', err);
        setError(
          err.response?.data?.message ||
            'Could not generate new insight. Try again later.'
        );
      }
    } finally {
      setGenerating(false);
    }
  };

  const startCooldownTimer = (seconds) => {
    let remaining = seconds;

    const interval = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(interval);
        setRetryTime(null);
      } else {
        setRetryTime({
          remaining,
          interval,
        });
      }
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className='container py-3'>
      <div className='d-flex flex-column flex-md-row justify-content-between align-items-center mb-4'>
        <div className='text-center text-md-start mb-3 mb-md-0'>
          <h2 className='fw-bold mb-1'>
            <FaLightbulb className='text-warning me-2' />
            Financial Insights
          </h2>
          {user?.name && (
            <p className='text-muted'>Personalized for {user.name}</p>
          )}
        </div>

        <button
          className={`btn ${
            retryTime ? 'btn-secondary' : 'btn-primary'
          } d-flex align-items-center`}
          onClick={generateInsight}
          disabled={generating || retryTime}
        >
          {generating ? (
            <>
              <FaSyncAlt className='me-2 spin' />
              Generating...
            </>
          ) : retryTime ? (
            `Try again in ${formatTime(retryTime.remaining)}`
          ) : (
            <>
              <FaRegLightbulb className='me-2' />
              Generate Insight
            </>
          )}
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className='alert alert-danger d-flex align-items-center'>
          <i className='bi bi-exclamation-triangle-fill me-2'></i>
          {error}
        </div>
      ) : message ? (
        <div className='alert alert-info d-flex align-items-center'>
          <i className='bi bi-info-circle-fill me-2'></i>
          {message}
        </div>
      ) : insights.length === 0 ? (
        <div className='card shadow-sm'>
          <div className='card-body text-center py-5'>
            <FaLightbulb className='text-muted fs-1 mb-3' />
            <h4>No Insights Yet</h4>
            <p className='text-muted mb-4'>
              Generate your first insight to get personalized financial advice
            </p>
            <button
              className='btn btn-primary'
              onClick={generateInsight}
              disabled={generating || retryTime}
            >
              Generate First Insight
            </button>
          </div>
        </div>
      ) : (
        <div className='row g-4'>
          {insights.map((insight, idx) => (
            <div className='col-12' key={insight._id || idx}>
              <div className='card shadow-sm border-0'>
                <div className='card-body'>
                  <div className='d-flex justify-content-between align-items-start mb-3'>
                    <h5 className='card-title mb-0'>
                      <span className='badge bg-warning text-dark me-2'>
                        Insight #{insights.length - idx}
                      </span>
                    </h5>
                    <small className='text-muted'>
                      {insight.createdAt
                        ? new Date(insight.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )
                        : 'Recently'}
                    </small>
                  </div>

                  <div className='ms-3'>
                    {insight.content.split('\n').map((line, i) =>
                      line.startsWith('-') ? (
                        <div key={i} className='d-flex mb-2'>
                          <span className='me-2'>•</span>
                          <span>{line.replace(/^-\s*/, '')}</span>
                        </div>
                      ) : line.trim() ? (
                        <p key={i} className='mb-3'>
                          {line}
                        </p>
                      ) : null
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Insights;
