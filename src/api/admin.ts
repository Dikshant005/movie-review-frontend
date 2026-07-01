import api from './auth';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
  _count: {
    reviews: number;
    comments: number;
  };
}

export interface AdminReview {
  id: string;
  user_id: string;
  tmdb_id: number;
  movie_title: string;
  rating: number;
  content_html: string;
  created_at: string;
  users: {
    username: string;
  };
}

export const getAdminUsersApi = async (): Promise<AdminUser[]> => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const getAdminReviewsApi = async (): Promise<AdminReview[]> => {
  const response = await api.get('/admin/reviews');
  return response.data;
};

export const deleteAdminReviewApi = async (id: string): Promise<void> => {
  await api.delete(`/admin/reviews/${id}`);
};
