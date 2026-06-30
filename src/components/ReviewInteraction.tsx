import { useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { type Review, likeReviewApi, unlikeReviewApi, getCommentsApi, addCommentApi, type Comment } from '../api/reviews';
import { useSelector } from 'react-redux';
import type{ RootState } from '../store/store';

export default function ReviewInteraction({ review }: { review: Review }) {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [isLiked, setIsLiked] = useState(false); 
  const [likesCount, setLikesCount] = useState(review._count?.likes || 0);
  
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState(review._count?.comments || 0);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return; 
    try {
      if (isLiked) {
        await unlikeReviewApi(review.id);
        setLikesCount(c => Math.max(0, c - 1));
        setIsLiked(false);
      } else {
        await likeReviewApi(review.id);
        setLikesCount(c => c + 1);
        setIsLiked(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComments = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showComments) {
      setShowComments(true);
      setLoadingComments(true);
      try {
        const data = await getCommentsApi(review.id);
        setComments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingComments(false);
      }
    } else {
      setShowComments(false);
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!newComment.trim() || !user) return;
    try {
      const added = await addCommentApi(review.id, newComment);
      setComments([...comments, added]);
      setCommentsCount(c => c + 1);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-4 border-t border-white/10 pt-3" onClick={e => e.stopPropagation()}>
      <div className="flex gap-4">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
          {likesCount}
        </button>
        <button 
          onClick={toggleComments}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          {commentsCount}
        </button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-3">
          {loadingComments ? (
            <div className="text-gray-500 text-sm">Loading comments...</div>
          ) : (
            comments.map(c => (
              <div key={c.id} className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">{c.user.username.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-300">{c.user.username}</span>
                </div>
                <p className="text-sm text-gray-300 pl-7">{c.content}</p>
              </div>
            ))
          )}
          {user && (
            <form onSubmit={submitComment} className="flex gap-2 mt-2">
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-red-500/50"
              />
              <button 
                type="submit"
                disabled={!newComment.trim()}
                className="bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                Post
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
