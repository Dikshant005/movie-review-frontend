import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Loader2, Send } from 'lucide-react';
import { createReviewApi } from '../api/reviews';
import type{ Movie } from '../api/movies';
import toast from 'react-hot-toast';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie | null;
}

export default function ReviewModal({ isOpen, onClose, movie }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movie) return;
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    if (!reviewText.trim()) {
      setError("Please write a review.");
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await createReviewApi(movie._id, rating, `<p>${reviewText}</p>`);
      setSuccess(true);
      toast.success('Review submitted successfully!');
      setTimeout(() => {
        setSuccess(false);
        setRating(0);
        setReviewText('');
        onClose();
      }, 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error.response?.data?.message || "Failed to submit review.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && movie && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="w-full max-w-lg bg-gray-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative h-40">
              <img 
                src={movie.backdropUrl} 
                alt={movie.title} 
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6">
                <h2 className="text-2xl font-bold text-white drop-shadow-md">{movie.title}</h2>
                <p className="text-gray-300 text-sm">Write your review</p>
              </div>
            </div>

            {/* Form Area */}
            <div className="p-6">
              {success ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                    <Star className="w-8 h-8 fill-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Review Submitted!</h3>
                  <p className="text-gray-400 mt-2">Thank you for sharing your thoughts.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Rating Stars */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Your Rating</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="transition-transform hover:scale-110 focus:outline-none"
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => setRating(star)}
                        >
                          <Star 
                            className={`w-8 h-8 transition-colors ${
                              (hoveredRating || rating) >= star 
                                ? 'text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]' 
                                : 'text-gray-600'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <div>
                    <textarea 
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="What did you think of the movie? (No spoilers!)"
                      className="w-full h-32 bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600/50 resize-none transition-all"
                    />
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Publish Review
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
