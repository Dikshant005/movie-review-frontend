import { useEffect, useState } from 'react';
import { getAdminUsersApi, getAdminReviewsApi, deleteAdminReviewApi, type AdminUser, type AdminReview } from '../api/admin';
import { Trash2, Users, MessageSquare, Shield, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'users' | 'reviews'>('users');
  
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        if (activeTab === 'users') {
          const data = await getAdminUsersApi();
          if (isMounted) setUsers(data);
        } else {
          const data = await getAdminReviewsApi();
          if (isMounted) setReviews(data);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) toast.error('Failed to load admin data');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [activeTab]);

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) return;
    
    try {
      await deleteAdminReviewApi(id);
      setReviews(prev => prev.filter(r => r.id !== id));
      toast.success('Review deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete review');
    }
  };

  return (
    <div className="px-8 md:px-16 py-12 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-red-600" />
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => { setActiveTab('users'); setLoading(true); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === 'users' ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
          }`}
        >
          <Users className="w-5 h-5" />
          Manage Users
        </button>
        <button
          onClick={() => { setActiveTab('reviews'); setLoading(true); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === 'reviews' ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          Moderate Reviews
        </button>
      </div>

      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-2xl min-h-125">
        {loading ? (
          <div className="h-full flex items-center justify-center min-h-100">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
          </div>
        ) : activeTab === 'users' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-300">
              <thead className="text-xs uppercase bg-black/50 text-gray-400">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg">Username</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 rounded-tr-lg text-right">Stats (Rev / Com)</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{user.username}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'ADMIN' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-yellow-500">{user._count.reviews}</span> / <span className="text-blue-400">{user._count.comments}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-white">{review.users?.username}</span>
                    <span className="text-gray-500 text-sm">reviewed</span>
                    <span className="font-bold text-red-400">{review.movie_title}</span>
                  </div>
                  <div className="text-gray-300 text-sm prose prose-invert line-clamp-2" dangerouslySetInnerHTML={{ __html: review.content_html }} />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                  <button 
                    onClick={() => handleDeleteReview(review.id)}
                    className="p-2 bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm font-bold">Delete</span>
                  </button>
                </div>
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="text-center py-12 text-gray-400">No reviews found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
