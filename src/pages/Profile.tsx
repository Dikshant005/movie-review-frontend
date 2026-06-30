import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Mail, Star, Loader2, Calendar, ArrowLeft } from 'lucide-react';
import type { RootState } from '../store/store';
import { getUserReviewsApi, type Review } from '../api/reviews';
import { getMovieDetailsApi, type MovieDetails } from '../api/movies';
import { motion } from 'framer-motion';

function ReviewCard({ review }: { review: Review }) {
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);

  useEffect(() => {
    getMovieDetailsApi(review.tmdb_id.toString())
      .then(setMovie)
      .catch(console.error);
  }, [review.tmdb_id]);

  if (!movie) return (
    <div className="bg-gray-900 border border-white/5 rounded-xl p-4 flex items-center justify-center min-h-[160px] animate-pulse">
      <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`/movie/${movie._id}`)}
      className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden shadow-lg hover:border-red-500/50 hover:shadow-red-500/10 transition-all cursor-pointer flex flex-col sm:flex-row group"
    >
      <div className="w-full sm:w-32 md:w-40 aspect-[2/3] relative flex-shrink-0">
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-red-400 transition-colors">{movie.title}</h3>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <Star 
                  key={star} 
                  className={`w-4 h-4 ${star <= (review.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} 
                />
              ))}
            </div>
            <span className="text-gray-400 text-xs flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          </div>

          <div 
            className="text-gray-300 text-sm line-clamp-3 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: review.content_html }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function Profile() {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getUserReviewsApi();
        setReviews(data);
      } catch (error) {
        console.error("Failed to load user reviews", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Profile Header */}
      <div className="relative pt-20 pb-12 px-6 md:px-16 border-b border-white/10 bg-gradient-to-b from-red-950/20 to-black">
        <button 
          onClick={() => navigate('/dashboard')}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Dashboard
        </button>

        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-red-600 to-purple-600 p-[3px] shadow-[0_0_20px_rgba(220,38,38,0.3)]">
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-white uppercase">
                {user?.username?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              {user?.username || 'Guest'}
            </h1>
            <p className="text-gray-400 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {user?.email || 'No email provided'}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Feed */}
      <div className="max-w-4xl mx-auto px-6 md:px-16 pt-12">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-red-600 rounded-full inline-block"></span>
          Your Reviews ({reviews.length})
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-white/5">
            <Star className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No reviews yet</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              You haven't shared your thoughts on any movies. Head back to the dashboard and review your first cinematic experience!
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-red-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-red-700 transition-colors"
            >
              Explore Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
