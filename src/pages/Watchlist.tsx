import { useEffect, useState } from 'react';
import { getWatchlistApi, type WatchlistItem } from '../api/watchlist';
import MovieCard from '../components/MovieCard';
import { Loader2, Bookmark } from 'lucide-react';
import type { Movie } from '../api/movies';
import TrailerModal from '../components/TrailerModal';
import ReviewModal from '../components/ReviewModal';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [trailerTmdbId, setTrailerTmdbId] = useState<string | null>(null);
  const [reviewMovie, setReviewMovie] = useState<Movie | null>(null);

  useEffect(() => {
    getWatchlistApi().then(data => {
      setWatchlist(data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-8 md:px-16 py-12 min-h-screen">
      <TrailerModal isOpen={!!trailerTmdbId} onClose={() => setTrailerTmdbId(null)} tmdbId={trailerTmdbId} />
      <ReviewModal isOpen={!!reviewMovie} onClose={() => setReviewMovie(null)} movie={reviewMovie} />

      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <Bookmark className="w-8 h-8 text-red-600" />
        My Watchlist
      </h1>

      {watchlist.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-white/5">
          <Bookmark className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Your watchlist is empty</h2>
          <p className="text-gray-400">Save movies to your watchlist to keep track of what you want to watch.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {watchlist.map(item => {
            // Map WatchlistItem back to Movie for the MovieCard
            const movie: Movie = {
              _id: item.tmdb_id.toString(),
              title: item.movie_title,
              posterUrl: item.movie_poster || '',
              description: '',
              backdropUrl: '',
              releaseYear: 0,
              averageRating: 0
            };
            return (
              <MovieCard 
                key={item.id} 
                movie={movie} 
                onPlayTrailer={setTrailerTmdbId}
                onReview={setReviewMovie}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
