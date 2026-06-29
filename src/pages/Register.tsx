import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type{ AppDispatch, RootState } from '../store/store';
import { registerUserThunk } from '../features/authSlice';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) return;

    const result = await dispatch(registerUserThunk({ username, email, password }));
    
    if (registerUserThunk.fulfilled.match(result)) {
      navigate('/'); // Or wherever you want after successful registration
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
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">Join the Family</h1>
            <p className="text-gray-400">Create an account to leave your mark.</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-900/50 border border-red-500/50 text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all placeholder-gray-400"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Email Address</label>
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

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Password</label>
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
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-70 disabled:hover:bg-red-600 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.4)] mt-4"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
              {isLoading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already a member?{' '}
            <Link to="/login" className="text-white font-medium hover:text-red-500 transition-colors underline decoration-white/30 underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
