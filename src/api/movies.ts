import axios from "axios";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export interface Movie {
  _id: string; // We map tmdb id to string _id for compatibility
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  releaseYear: number;
  averageRating: number;
}

// Map TMDB response to our Movie interface
const mapTmdbToMovie = (tmdbMovie: { id: number; title?: string; name?: string; overview: string; poster_path?: string; backdrop_path?: string; release_date?: string; vote_average: number; }): Movie => ({
  _id: tmdbMovie.id.toString(),
  title: tmdbMovie.title || tmdbMovie.name,
  description: tmdbMovie.overview,
  posterUrl: tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : '',
  backdropUrl: tmdbMovie.backdrop_path ? `https://image.tmdb.org/t/p/original${tmdbMovie.backdrop_path}` : '',
  releaseYear: tmdbMovie.release_date ? parseInt(tmdbMovie.release_date.substring(0, 4)) : 0,
  averageRating: tmdbMovie.vote_average,
});

export const getTrendingMoviesApi = async (): Promise<Movie[]> => {
  const response = await tmdbApi.get("/trending/movie/day");
  return response.data.results.map(mapTmdbToMovie);
};

export const getAllMoviesApi = async (): Promise<Movie[]> => {
  const response = await tmdbApi.get("/movie/now_playing");
  return response.data.results.map(mapTmdbToMovie);
};

export const searchMoviesApi = async (query: string): Promise<Movie[]> => {
  if (!query) return [];
  const response = await tmdbApi.get(`/search/movie?query=${encodeURIComponent(query)}`);
  return response.data.results.map(mapTmdbToMovie);
};

export const getMovieTrailerApi = async (tmdbId: string): Promise<string | null> => {
  const response = await tmdbApi.get(`/movie/${tmdbId}/videos`);
  const videos = response.data.results;
  const trailer = videos.find((v: { type: string; site: string; key: string }) => v.type === "Trailer" && v.site === "YouTube");
  return trailer ? trailer.key : null;
};

export interface MovieDetails extends Movie {
  runtime: number;
  genres: string[];
}

export const getMovieDetailsApi = async (tmdbId: string): Promise<MovieDetails> => {
  const response = await tmdbApi.get(`/movie/${tmdbId}`);
  const data = response.data;
  return {
    ...mapTmdbToMovie(data),
    runtime: data.runtime,
    genres: data.genres?.map((g: { name: string }) => g.name) || [],
  };
};

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
}

export const getMovieCreditsApi = async (tmdbId: string): Promise<CastMember[]> => {
  const response = await tmdbApi.get(`/movie/${tmdbId}/credits`);
  return response.data.cast.slice(0, 10).map((cast: { id: number; name: string; character: string; profile_path?: string }) => ({
    id: cast.id,
    name: cast.name,
    character: cast.character,
    profileUrl: cast.profile_path ? `https://image.tmdb.org/t/p/w200${cast.profile_path}` : null,
  }));
};
