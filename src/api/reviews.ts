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
}

export const getMovieReviewsApi = async (tmdbId: string): Promise<Review[]> => {
  const response = await API.get(`/reviews/movie/${tmdbId}`);
  return response.data.reviews;
};

export const getUserReviewsApi = async (): Promise<Review[]> => {
  const response = await API.get('/reviews/user/me');
  return response.data.reviews;
};
