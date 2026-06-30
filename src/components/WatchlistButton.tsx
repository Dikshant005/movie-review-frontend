import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { addToWatchlistApi, removeFromWatchlistApi, getWatchlistApi } from '../api/watchlist';
import { useSelector } from 'react-redux';
import type{ RootState } from '../store/store';
import { type Movie } from '../api/movies';
import toast from 'react-hot-toast';

export default function WatchlistButton({ movie, className = "" }: { movie: Movie, className?: string }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    getWatchlistApi().then(list => {
      if (list.some(item => item.tmdb_id === Number(movie._id))) {
        setInWatchlist(true);
      }
    }).catch(console.error);
  }, [movie._id, user]);

  if (!user) return null;

  const toggleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    try {
      if (inWatchlist) {
        await removeFromWatchlistApi(movie._id);
        setInWatchlist(false);
        toast.success(`Removed from watchlist`, { id: `watchlist-${movie._id}` });
      } else {
        await addToWatchlistApi(movie._id, movie.title, movie.posterUrl);
        setInWatchlist(true);
        toast.success(`Added to watchlist`, { id: `watchlist-${movie._id}` });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update watchlist`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={toggleWatchlist}
      disabled={loading}
      className={`p-2 rounded-full backdrop-blur-md transition-all shadow-lg border border-white/20 ${
        inWatchlist 
          ? 'bg-red-600/90 text-white hover:bg-red-700' 
          : 'bg-black/60 text-white hover:bg-black/80 hover:text-red-500 hover:border-red-500/50'
      } ${className}`}
      title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
    >
      {inWatchlist ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
    </button>
  );
}
