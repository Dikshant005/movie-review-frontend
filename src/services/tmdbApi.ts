import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Movie, DiscoverFilters } from '../api/movies';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const tmdbApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.themoviedb.org/3',
    prepareHeaders: (headers) => {
      // We will pass API key in query params instead of Bearer token
      headers.set('accept', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTrendingMovies: builder.query<Movie[], number | void>({
      query: (page = 1) => `/trending/movie/day?language=en-US&page=${page}&api_key=${TMDB_API_KEY}`,
      transformResponse: (response: any) => response.results.map((movie: any) => ({
        _id: movie.id.toString(),
        title: movie.title,
        description: movie.overview,
        posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
        backdropUrl: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : '',
        releaseYear: movie.release_date ? parseInt(movie.release_date.split('-')[0]) : 0,
        averageRating: movie.vote_average,
      })),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg && arg > 1) {
          const existingIds = new Set(currentCache.map(m => m._id));
          const filtered = newItems.filter(m => !existingIds.has(m._id));
          currentCache.push(...filtered);
        } else {
          return newItems;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      }
    }),
    
    discoverMovies: builder.query<Movie[], DiscoverFilters>({
      query: (filters) => {
        let url = `/discover/movie?language=en-US&api_key=${TMDB_API_KEY}`;
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            url += `&${key}=${value}`;
          }
        });
        return url;
      },
      transformResponse: (response: any) => response.results.map((movie: any) => ({
        _id: movie.id.toString(),
        title: movie.title,
        description: movie.overview,
        posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
        backdropUrl: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : '',
        releaseYear: movie.release_date ? parseInt(movie.release_date.split('-')[0]) : 0,
        averageRating: movie.vote_average,
      })),
      serializeQueryArgs: ({ queryArgs }) => {
        const { page, ...rest } = queryArgs;
        return rest; 
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page && arg.page > 1) {
          const existingIds = new Set(currentCache.map(m => m._id));
          const filtered = newItems.filter(m => !existingIds.has(m._id));
          currentCache.push(...filtered);
        } else {
          return newItems;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page || JSON.stringify(currentArg) !== JSON.stringify(previousArg);
      }
    }),
  }),
});

export const { useGetTrendingMoviesQuery, useDiscoverMoviesQuery } = tmdbApi;
