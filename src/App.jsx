import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'; // ✅ No BrowserRouter here
import 'bootstrap/dist/css/bootstrap.min.css';

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
import Charts from './pages/Dashboard/Charts';
import NotFound from './pages/NotFound';
import { startAuthWatcher } from './utils/authWatcher';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const stopWatcher = startAuthWatcher(() => {
      navigate('/login');
    });

    return () => stopWatcher();
  }, [navigate]);

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Navbar />

      <div className='flex-grow-1 container my-4'>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/resend-verification' element={<ResendEmail />} />
          <Route path='/verify-success' element={<VerifySuccess />} />
          <Route path='/verify-failed' element={<VerifyFailed />} />

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
    </div>
  );
}

export default App;
