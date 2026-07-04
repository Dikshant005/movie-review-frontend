import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, ToastBar } from 'react-hot-toast';

import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MovieDetail from './pages/MovieDetail';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import Watchlist from './pages/Watchlist';
import Discover from './pages/Discover';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import RequireAdmin from './components/RequireAdmin';

import type { AppDispatch, RootState } from './store/store';
import { fetchUserThunk } from './features/authSlice';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchUserThunk());
    }
  }, [dispatch, accessToken]);

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        containerStyle={{
          top: 40,
          right: 40,
        }}
      >
        {(t) => (
          <div
            style={{
              opacity: t.visible ? 1 : 0,
              transform: t.visible ? 'translateX(0)' : 'translateX(120%)',
              transition: 'all 0.4s cubic-bezier(0.21, 1.02, 0.73, 1)',
            }}
          >
            <ToastBar 
              toast={t}
              style={{
                background: '#1f2937',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            />
          </div>
        )}
      </Toaster>
      <Routes>
        {/* Public Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/discover" element={<Discover />} />
            <Route element={<RequireAdmin />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
