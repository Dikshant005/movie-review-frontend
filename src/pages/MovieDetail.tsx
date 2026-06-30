import { useEffect, useState } from 'react';

import { useParams as useRouteParams, useNavigate as useRouteNavigate } from 'react-router-dom';
import { Play, Star, ArrowLeft, Clock, Calendar, User, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getMovieDetailsApi, getMovieCreditsApi, type MovieDetails,type CastMember } from '../api/movies';
import { getMovieReviewsApi, type Review } from '../api/reviews';
import TrailerModal from '../components/TrailerModal';
import ReviewModal from '../components/ReviewModal';
import ReviewInteraction from '../components/ReviewInteraction';
import FollowButton from '../components/FollowButton';
import WatchlistButton from '../components/WatchlistButton';

export default function MovieDetail() {
  const { id } = useRouteParams<{ id: string }>();
  const navigate = useRouteNavigate();
  
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showTrailer, setShowTrailer] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const loadMovie = async () => {
      setIsLoading(true);
      try {
        const [movieData, castData, reviewsData] = await Promise.all([
          getMovieDetailsApi(id),
          getMovieCreditsApi(id),
          getMovieReviewsApi(id).catch(() => []) // If backend fails, just load empty reviews
        ]);
        setMovie(movieData);
        setCast(castData);
        setReviews(reviewsData);
      } catch (err) {
        console.error(err);
        setError("Failed to load movie details.");
      } finally {
        setIsLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-xl">{error || "Movie not found"}</p>
        <button onClick={() => navigate('/dashboard')} className="text-white hover:text-red-500 underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Modals */}
      <TrailerModal 
        isOpen={showTrailer} 
        onClose={() => setShowTrailer(false)} 
        tmdbId={id || null} 
      />
      <ReviewModal 
        isOpen={showReviewModal} 
        onClose={() => {
          setShowReviewModal(false);
          // Refresh reviews after submitting
          if (id) getMovieReviewsApi(id).then(setReviews).catch(console.error);
        }} 
        movie={movie} 
      />

      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[400px]">
        <div className="absolute inset-0">
          <img 
            src={movie.backdropUrl || movie.posterUrl} 
            alt={movie.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 md:left-12 z-20 flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/40 px-4 py-2 rounded-full backdrop-blur-md"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="relative z-10 h-full flex items-end px-6 md:px-16 pb-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-end w-full">
            {/* Poster Thumbnail */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden md:block w-64 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 relative group cursor-pointer"
              onClick={() => setShowTrailer(true)}
            >
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="w-16 h-16 text-white fill-white" />
              </div>
            </motion.div>

            {/* Movie Info */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1"
            >
              <div className="flex flex-wrap items-center gap-4 mb-3 text-sm font-medium text-gray-300">
                <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {movie.averageRating?.toFixed(1)}
                </span>
                <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                  <Calendar className="w-4 h-4" />
                  {movie.releaseYear}
                </span>
                {movie.runtime > 0 && (
                  <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                    <Clock className="w-4 h-4" />
                    {movie.runtime} min
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                {movie.title}
              </h1>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map(g => (
                  <span key={g} className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-white/20 rounded-md text-gray-300">
                    {g}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                >
                  <Play className="w-5 h-5 fill-white" />
                  Play Trailer
                </button>
                <button 
                  onClick={() => setShowReviewModal(true)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-xl font-bold transition-all"
                >
                  <Star className="w-5 h-5" />
                  Write Review
                </button>
                <div className="flex items-center ml-4">
                  <WatchlistButton movie={movie} className="scale-125" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 pt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Description & Cast */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-red-600 rounded-full inline-block"></span>
              Storyline
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              {movie.description || "No description available."}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-red-600 rounded-full inline-block"></span>
              Top Cast
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {cast.map(actor => (
                <div key={actor.id} className="bg-gray-900 rounded-lg overflow-hidden border border-white/5">
                  <div className="aspect-[2/3] bg-gray-800 relative">
                    {actor.profileUrl ? (
                      <img src={actor.profileUrl} alt={actor.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-bold text-white truncate">{actor.name}</p>
                    <p className="text-xs text-gray-400 truncate">{actor.character}</p>
                  </div>
                </div>
              ))}
            </div>
            {cast.length === 0 && <p className="text-gray-500">No cast information available.</p>}
          </section>
        </div>

        {/* Right Column: Reviews */}
        <div className="lg:col-span-1">
          <section className="bg-gray-900/50 p-6 rounded-2xl border border-white/5 h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-red-500" />
                Reviews
              </h2>
              <span className="bg-white/10 px-3 py-1 rounded-full text-sm font-medium">
                {reviews.length}
              </span>
            </div>

            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {reviews.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <Star className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">No reviews yet.</p>
                  <p className="text-gray-500 text-sm mt-1 mb-4">Be the first to share your thoughts on this movie!</p>
                  <button 
                    onClick={() => setShowReviewModal(true)}
                    className="text-red-500 hover:text-red-400 text-sm font-bold underline"
                  >
                    Write a Review
                  </button>
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="bg-black/40 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-purple-600 flex items-center justify-center p-[2px]">
                          <div className="bg-black w-full h-full rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold">{review.users?.username?.charAt(0).toUpperCase() || 'U'}</span>
                          </div>
                        </div>
                        <span className="font-bold text-gray-200 text-sm mr-2">{review.users?.username || 'Unknown User'}</span>
                        {review.users?.username && (
                          <FollowButton username={review.users.username} targetUserId={review.user_id} />
                        )}
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            className={`w-3 h-3 ${star <= (review.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <div 
                      className="text-gray-300 text-sm prose prose-invert max-w-none mt-3"
                      dangerouslySetInnerHTML={{ __html: review.content_html }}
                    />
                    <div className="mt-3 text-xs text-gray-600 font-medium mb-1">
                      {new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                    <ReviewInteraction review={review} />
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
        
      </div>
    </div>
  );
}
