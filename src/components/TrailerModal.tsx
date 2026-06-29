import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getMovieTrailerApi } from '../api/movies';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tmdbId: string | null;
}

export default function TrailerModal({ isOpen, onClose, tmdbId }: TrailerModalProps) {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && tmdbId) {
      const loadTrailer = async () => {
        setIsLoading(true);
        setError('');
        try {
          const key = await getMovieTrailerApi(tmdbId);
          if (key) setTrailerKey(key);
          else setError("Trailer not found.");
        } catch (err) {
          setError("Failed to load trailer.");
        } finally {
          setIsLoading(false);
        }
      };
      loadTrailer();
    } else {
      setTrailerKey(null);
    }
  }, [isOpen, tmdbId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-red-600 rounded-full text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-red-600" />
              </div>
            )}
            
            {error && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                {error}
              </div>
            )}

            {trailerKey && !isLoading && (
              <iframe 
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                title="Movie Trailer"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
