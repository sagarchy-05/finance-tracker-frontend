import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import VerifySuccess from './pages/auth/VerifySuccess';
import VerifyFailed from './pages/auth/VerifyFailed';
import ResendEmail from './pages/ResendEmail';
import Dashboard from './pages/dashboard/Dashboard';
import Transactions from './pages/dashboard/Transactions';
import Budgets from './pages/dashboard/Budgets';
import Insights from './pages/dashboard/Insights';
import Charts from './pages/dashboard/Charts';
import NotFound from './pages/NotFound';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { startAuthWatcher } from './utils/authWatcher';

function App() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stopWatcher = startAuthWatcher(() => {
      navigate('/login');
    });

    // Simulate token check
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => {
      stopWatcher();
      clearTimeout(timer);
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className='d-flex justify-content-center align-items-center vh-100'>
        <div className='spinner-border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Navbar />

      <div className='flex-grow-1 container my-4'>
        <ToastContainer />
        <Routes>
          {/* Home Route - redirects to dashboard if logged in */}
          <Route path='/' element={<HomeRoute />} />

          {/* Auth Routes - only accessible when logged out */}
          <Route path='/login' element={<LoginRoute />} />
          <Route path='/signup' element={<SignupRoute />} />
          <Route
            path='/resend-verification'
            element={
              <AuthRoute>
                <ResendEmail />
              </AuthRoute>
            }
          />
          <Route
            path='/verify-success'
            element={
              <AuthRoute>
                <VerifySuccess />
              </AuthRoute>
            }
          />
          <Route
            path='/verify-failed'
            element={
              <AuthRoute>
                <VerifyFailed />
              </AuthRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path='/dashboard'
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/transactions'
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path='/budgets'
            element={
              <ProtectedRoute>
                <Budgets />
              </ProtectedRoute>
            }
          />
          <Route
            path='/insights'
            element={
              <ProtectedRoute>
                <Insights />
              </ProtectedRoute>
            }
          />
          <Route
            path='/charts'
            element={
              <ProtectedRoute>
                <Charts />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
      <SpeedInsights />
    </div>
  );
}

// Helper components for route protection
function HomeRoute() {
  const token = localStorage.getItem('token');
  return token ? <Navigate to='/dashboard' replace /> : <Home />;
}

function AuthRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? <Navigate to='/dashboard' replace /> : children;
}

function LoginRoute() {
  const token = localStorage.getItem('token');
  return token ? <Navigate to='/dashboard' replace /> : <Login />;
}

function SignupRoute() {
  const token = localStorage.getItem('token');
  return token ? <Navigate to='/dashboard' replace /> : <Signup />;
}

export default App;
