import { useState, useEffect } from 'react';
import { followUserApi, unfollowUserApi, getUserProfileApi } from '../api/users';
import { useSelector } from 'react-redux';
import type{ RootState } from '../store/store';

export default function FollowButton({ username, targetUserId }: { username: string, targetUserId: string }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(!!user && user.username !== username);

  useEffect(() => {
    if (!user || user.username === username) return;

    getUserProfileApi(username).then(data => {
      setIsFollowing(!!data.isFollowing);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [username, user]);

  if (!user || user.username === username) return null;

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (isFollowing) {
        await unfollowUserApi(targetUserId);
        setIsFollowing(false);
      } else {
        await followUserApi(targetUserId);
        setIsFollowing(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="w-20 h-6 bg-gray-800 rounded-full animate-pulse"></div>;

  return (
    <button 
      onClick={handleFollow}
      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
        isFollowing 
          ? 'bg-transparent border border-white/20 text-white hover:border-red-500 hover:text-red-500' 
          : 'bg-white text-black hover:bg-gray-200'
      }`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}
