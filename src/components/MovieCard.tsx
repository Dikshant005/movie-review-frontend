import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Movie } from '../api/movies';
import WatchlistButton from './WatchlistButton';

interface MovieCardProps {
  movie: Movie;
  index?: number;
  onPlayTrailer: (id: string) => void;
  onReview: (movie: Movie) => void;
}

export default function MovieCard({ movie, index = 0, onPlayTrailer, onReview }: MovieCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => navigate(`/movie/${movie._id}`)}
      className="group relative rounded-xl overflow-hidden cursor-pointer aspect-[2/3] bg-gray-900 border border-white/5 shadow-xl"
    >
      <img 
        src={movie.posterUrl} 
        alt={movie.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" onClick={e => e.stopPropagation()}>
        <WatchlistButton movie={movie} />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-2 z-10">
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
            onClick={() => onPlayTrailer(movie._id)}
            className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold py-2 rounded transition-colors flex items-center justify-center gap-1"
          >
            <Play className="w-3 h-3 fill-white" />
            Trailer
          </button>
          <button 
            onClick={() => onReview(movie)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded transition-colors"
          >
            Review
          </button>
        </div>
      </div>
    </motion.div>
  );
}
