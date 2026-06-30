import { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star, Loader2 } from 'lucide-react';
import type{ AppDispatch, RootState } from '../store/store';
import { fetchTrendingMovies } from '../features/moviesSlice';
import TrailerModal from '../components/TrailerModal';
import ReviewModal from '../components/ReviewModal';
import MovieCard from '../components/MovieCard';
import type{ Movie } from '../api/movies';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { trendingMovies, isLoading, error } = useSelector((state: RootState) => state.movies);

  const [trailerTmdbId, setTrailerTmdbId] = useState<string | null>(null);
  const [reviewMovie, setReviewMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchTrendingMovies({ page, append: page > 1 }));
  }, [dispatch, page]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastMovieElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading]);

  if (isLoading && page === 1 && trendingMovies.length === 0) {
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

  const moviesToList = trendingMovies.length > 0 ? trendingMovies.slice(1) : []; // skip featured

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
            src={featuredMovie.backdropUrl || featuredMovie.posterUrl} 
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
            Trending Movies
          </h2>
        </div>

        {error && (
           <div className="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-500/50 text-red-400 text-sm">
             Failed to load movies: {error}.
           </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {moviesToList.map((movie, index) => {
            if (index === moviesToList.length - 1) {
              return (
                <div ref={lastMovieElementRef} key={`${movie._id}-${index}`}>
                  <MovieCard 
                    movie={movie} 
                    index={index} 
                    onPlayTrailer={setTrailerTmdbId}
                    onReview={setReviewMovie}
                  />
                </div>
              );
            } else {
              return (
                <MovieCard 
                  key={`${movie._id}-${index}`}
                  movie={movie} 
                  index={index} 
                  onPlayTrailer={setTrailerTmdbId}
                  onReview={setReviewMovie}
                />
              );
            }
          })}
        </div>
        
        {isLoading && page > 1 && (
          <div className="w-full flex justify-center mt-12">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          </div>
        )}
      </section>
    </div>
  );
}
