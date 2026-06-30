import { useEffect, useState } from 'react';
import { getFeedApi, type Review } from '../api/reviews';
import { getMovieDetailsApi, type MovieDetails } from '../api/movies';
import { useNavigate } from 'react-router-dom';
import ReviewInteraction from '../components/ReviewInteraction';
import FollowButton from '../components/FollowButton';
import { Loader2, Film } from 'lucide-react';
import { motion } from 'framer-motion';

function FeedReviewCard({ review }: { review: Review }) {
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);

  useEffect(() => {
    getMovieDetailsApi(review.tmdb_id.toString()).then(setMovie).catch(console.error);
  }, [review.tmdb_id]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => movie && navigate(`/movie/${movie._id}`)}
      className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden shadow-lg hover:border-red-500/50 hover:shadow-red-500/10 transition-all cursor-pointer flex flex-col sm:flex-row group"
    >
      <div className="w-full sm:w-32 md:w-40 aspect-[2/3] relative flex-shrink-0">
        {movie ? (
          <>
            <img 
              src={movie.posterUrl} 
              alt={movie.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
          </>
        ) : (
          <div className="w-full h-full bg-gray-800 animate-pulse" />
        )}
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-purple-600 flex items-center justify-center p-[2px]">
                <div className="bg-black w-full h-full rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">{review.users?.username?.charAt(0).toUpperCase() || 'U'}</span>
                </div>
              </div>
              <span className="font-bold text-gray-200 text-sm">{review.users?.username || 'Unknown User'}</span>
              {review.users?.username && (
                <FollowButton username={review.users.username} targetUserId={review.user_id} />
              )}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              {new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-red-400 transition-colors">
            {movie ? movie.title : <div className="h-6 w-3/4 bg-gray-800 rounded animate-pulse" />}
          </h3>

          <div 
            className="text-gray-300 text-sm mt-3 prose prose-invert line-clamp-3"
            dangerouslySetInnerHTML={{ __html: review.content_html }}
          />
          <ReviewInteraction review={review} />
        </div>
      </div>
    </motion.div>
  );
}

export default function Feed() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeedApi()
      .then(data => setReviews(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Film className="w-8 h-8 text-red-500" />
        <h1 className="text-3xl font-bold text-white">Your Feed</h1>
      </div>
      
      {reviews.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-white/5">
          <p className="text-gray-400 text-lg">Your feed is empty.</p>
          <p className="text-gray-500 mt-2">Follow some users to see their reviews here!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <FeedReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
