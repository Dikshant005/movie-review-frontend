import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type{ AppDispatch, RootState } from '../store/store';
import { loginUserThunk } from '../features/authSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const result = await dispatch(loginUserThunk({ email, password }));
    
    if (loginUserThunk.fulfilled.match(result)) {
      navigate('/'); // Or to dashboard
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <div className="backdrop-blur-xl bg-black/60 border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
        
        {/* Subtle glow effect behind form */}
        <div className="absolute -inset-0.5 bg-linear-to-br from-red-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition duration-700 blur-xl"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">Welcome Back</h1>
            <p className="text-gray-400">Enter your credentials to access the syndicate.</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-900/50 border border-red-500/50 text-red-200 text-sm text-center">
              {typeof error === 'string' ? error : 'Authentication failed'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all placeholder-gray-400"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-red-500 hover:text-red-400 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-70 disabled:hover:bg-red-600 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-white font-medium hover:text-red-500 transition-colors underline decoration-white/30 underline-offset-4">
              Join now
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
