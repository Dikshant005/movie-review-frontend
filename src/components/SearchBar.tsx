import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Star, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchMoviesApi, type Movie } from '../api/movies';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 2) {
        const fetchResults = async () => {
          setIsSearching(true);
          try {
            const data = await searchMoviesApi(query);
            setResults(data.slice(0, 5)); // Show top 5 results
            setIsOpen(true);
          } catch (error) {
            console.error("Search failed", error);
          } finally {
            setIsSearching(false);
          }
        };
        fetchResults();
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  const handleResultClick = (movieId: string) => {
    navigate(`/movie/${movieId}`);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="hidden md:flex flex-1 max-w-xl mx-8 relative" ref={dropdownRef}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        {isSearching ? (
          <Loader2 className="h-5 w-5 text-red-500 animate-spin" />
        ) : (
          <Search className="h-5 w-5 text-gray-500" />
        )}
      </div>
      
      <input 
        type="text" 
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (e.target.value.length === 0) setIsOpen(false);
        }}
        onFocus={() => {
          if (results.length > 0) setIsOpen(true);
        }}
        placeholder="Search movies..."
        className="w-full bg-white/5 border border-white/10 text-white rounded-full pl-12 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all placeholder:text-gray-500"
      />

      {/* Live Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 max-h-96 custom-scrollbar overflow-y-auto"
          >
            {results.length > 0 ? (
              <div className="py-2">
                {results.map((movie) => (
                  <div 
                    key={movie._id}
                    onClick={() => handleResultClick(movie._id)}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    {movie.posterUrl ? (
                      <img 
                        src={movie.posterUrl} 
                        alt={movie.title} 
                        className="w-12 h-16 object-cover rounded-md flex-shrink-0 bg-gray-800"
                      />
                    ) : (
                      <div className="w-12 h-16 bg-gray-800 rounded-md flex items-center justify-center flex-shrink-0">
                        <Film className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold text-sm truncate">{movie.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-gray-400 text-xs">{movie.releaseYear || 'Unknown Year'}</span>
                        <span className="flex items-center gap-1 text-yellow-500 text-xs font-medium">
                          <Star className="w-3 h-3 fill-yellow-500" />
                          {movie.averageRating?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                No movies found for "{query}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
