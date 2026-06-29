import { Outlet, Link } from 'react-router-dom';
import { Film, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { logout } from '../features/authSlice';
import SearchBar from '../components/SearchBar';

export default function DashboardLayout() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-500/30">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full px-6 py-4 bg-black/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <Film className="w-8 h-8 text-red-600 group-hover:text-red-500 transition-colors" />
          <span className="text-2xl font-bold tracking-widest text-white uppercase">
            Cine<span className="text-red-600">Review</span>
          </span>
        </Link>
        
        {/* Search Bar */}
        <SearchBar />

        {/* User Actions */}
        <div className="flex items-center gap-6">
          <Link to="/profile" className="hidden md:flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-purple-600 p-[2px] group-hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-shadow">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white uppercase">
                  {user?.username?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            <span className="font-medium text-gray-200 group-hover:text-white transition-colors">{user?.username || 'Guest'}</span>
          </Link>
          
          <button 
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-white/5 flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline text-sm font-medium">Logout</span>
          </button>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="relative">
        <Outlet />
      </main>
    </div>
  );
}
