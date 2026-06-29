import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star, Loader2 } from 'lucide-react';
import type{ AppDispatch, RootState } from '../store/store';
import { fetchTrendingMovies, fetchAllMovies } from '../features/moviesSlice';
import TrailerModal from '../components/TrailerModal';
import ReviewModal from '../components/ReviewModal';
import type{ Movie } from '../api/movies';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { trendingMovies, allMovies, isLoading, error } = useSelector((state: RootState) => state.movies);

  const [trailerTmdbId, setTrailerTmdbId] = useState<string | null>(null);
  const [reviewMovie, setReviewMovie] = useState<Movie | null>(null);

  useEffect(() => {
    dispatch(fetchTrendingMovies());
    dispatch(fetchAllMovies());
  }, [dispatch]);

  if (isLoading && trendingMovies.length === 0 && allMovies.length === 0) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
      </div>
    );
  }

  // Use a fallback featured movie if API isn't ready or returns empty
  const featuredMovie = trendingMovies.length > 0 ? trendingMovies[0] : {
    _id: 'fallback',
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=2028&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop',
    releaseYear: 2008,
    averageRating: 9.0
  };

  const moviesToList = allMovies.length > 0 ? allMovies : Array(8).fill({
    _id: 'mock',
    title: 'Cinematic Masterpiece',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop',
    releaseYear: 2024,
    averageRating: 8.5
  });

  return (
    <div className="pb-20">
      {/* Modals */}
      <TrailerModal 
        isOpen={!!trailerTmdbId} 
        onClose={() => setTrailerTmdbId(null)} 
        tmdbId={trailerTmdbId} 
      />
      
      <ReviewModal 
        isOpen={!!reviewMovie} 
        onClose={() => setReviewMovie(null)} 
        movie={reviewMovie} 
      />

      {/* Hero / Featured Section */}
      <section className="relative w-full h-[70vh] min-h-[500px]">
        <div className="absolute inset-0">
          <img 
            src={featuredMovie.backdropUrl} 
            alt={featuredMovie.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end px-8 md:px-16 pb-16 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase rounded-sm">Trending Now</span>
              <span className="text-gray-300 flex items-center gap-1 text-sm font-medium">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                {featuredMovie.averageRating?.toFixed(1)}
              </span>
            </div>
            
            <h1 
              onClick={() => navigate(`/movie/${featuredMovie._id}`)}
              className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight drop-shadow-lg cursor-pointer hover:text-red-500 transition-colors"
            >
              {featuredMovie.title}
            </h1>
            
            <p className="text-lg text-gray-300 mb-8 max-w-2xl line-clamp-3 drop-shadow-md">
              {featuredMovie.description}
            </p>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setTrailerTmdbId(featuredMovie._id)}
                className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors transform hover:scale-105"
              >
                <Play className="w-5 h-5 fill-black" />
                Watch Trailer
              </button>
              <button 
                onClick={() => setReviewMovie(featuredMovie as Movie)}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-3 rounded-lg font-bold hover:bg-white/30 transition-colors"
              >
                <Star className="w-5 h-5" />
                Write Review
              </button>
              <button 
                onClick={() => navigate(`/movie/${featuredMovie._id}`)}
                className="flex items-center gap-2 bg-black/40 backdrop-blur-md text-white border border-white/30 px-6 py-3 rounded-lg font-bold hover:bg-black/60 transition-colors"
              >
                Details
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Movies Grid Section */}
      <section className="px-8 md:px-16 pt-12 relative z-20 -mt-20">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-red-600 rounded-full inline-block"></span>
            Latest Releases
          </h2>
        </div>

        {error && (
           <div className="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-500/50 text-red-400 text-sm">
             Failed to load movies: {error}. Showing fallback UI until backend APIs are ready.
           </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {moviesToList.map((movie, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() => navigate(`/movie/${movie._id}`)}
              className="group relative rounded-xl overflow-hidden cursor-pointer aspect-2/3 bg-gray-900 border border-white/5 shadow-xl"
            >
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-2">
                <div>
                  <h3 className="text-white font-bold truncate">{movie.title}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-400 text-xs">{movie.releaseYear}</span>
                    <span className="text-yellow-500 text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-500" />
                      {movie.averageRating?.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => setTrailerTmdbId(movie._id)}
                    className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold py-2 rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    Trailer
                  </button>
                  <button 
                    onClick={() => setReviewMovie(movie as Movie)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded transition-colors"
                  >
                    Review
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
