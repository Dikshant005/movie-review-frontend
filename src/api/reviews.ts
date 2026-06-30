import API from "./auth";

export const createReviewApi = async (tmdb_id: string, rating: number, content_html: string) => {
  const response = await API.post("/reviews", {
    tmdb_id,
    rating,
    content_html
  });
  return response.data;
};

export interface Review {
  id: string;
  user_id: string;
  tmdb_id: number;
  rating: number | null;
  content_html: string;
  created_at: string;
  users?: {
    username: string;
  };
  _count?: {
    likes: number;
    comments: number;
  };
}

export const getMovieReviewsApi = async (tmdbId: string): Promise<Review[]> => {
  const response = await API.get(`/reviews/movie/${tmdbId}`);
  return response.data.reviews;
};

export const getUserReviewsApi = async (): Promise<Review[]> => {
  const response = await API.get('/reviews/user/me');
  return response.data.reviews;
};

export const likeReviewApi = async (reviewId: string): Promise<void> => {
  await API.post(`/reviews/${reviewId}/like`);
};

export const unlikeReviewApi = async (reviewId: string): Promise<void> => {
  await API.delete(`/reviews/${reviewId}/like`);
};

export interface Comment {
  id: string;
  user_id: string;
  review_id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    username: string;
  };
}

export const addCommentApi = async (reviewId: string, content: string): Promise<Comment> => {
  const response = await API.post(`/reviews/${reviewId}/comments`, { content });
  return response.data;
};

export const getCommentsApi = async (reviewId: string): Promise<Comment[]> => {
  const response = await API.get(`/reviews/${reviewId}/comments`);
  return response.data;
};

export const getFeedApi = async (): Promise<Review[]> => {
  const response = await API.get('/feed');
  return response.data;
};
