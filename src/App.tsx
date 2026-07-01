import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

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
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }} 
      />
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
