import API from "./auth";

export interface WatchlistItem {
  id: string;
  user_id: string;
  tmdb_id: number;
  movie_title: string;
  movie_poster: string | null;
  created_at: string;
}

export const getWatchlistApi = async (): Promise<WatchlistItem[]> => {
  const response = await API.get('/watchlist');
  return response.data;
};

export const addToWatchlistApi = async (tmdb_id: string, movie_title: string, movie_poster: string | null): Promise<WatchlistItem> => {
  const response = await API.post('/watchlist', { tmdb_id, movie_title, movie_poster });
  return response.data;
};

export const removeFromWatchlistApi = async (tmdb_id: string): Promise<void> => {
  await API.delete(`/watchlist/${tmdb_id}`);
};
