import { Film } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 bg-black/40 backdrop-blur-md border-b border-white/10 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 group">
        <Film className="w-8 h-8 text-red-600 group-hover:text-red-500 transition-colors" />
        <span className="text-2xl font-bold tracking-widest text-white uppercase font-sans">
          Cine<span className="text-red-600">Review</span>
        </span>
      </Link>
      <nav className="flex gap-6">
        <Link to="/login" className="text-gray-300 hover:text-white transition-colors font-medium">Login</Link>
        <Link to="/register" className="text-white hover:text-red-400 transition-colors font-medium">Register</Link>
      </nav>
    </header>
  );
}
