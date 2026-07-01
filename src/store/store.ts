import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice';
import moviesReducer from '../features/moviesSlice';
import { tmdbApi } from '../services/tmdbApi';

const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: moviesReducer,
    [tmdbApi.reducerPath]: tmdbApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tmdbApi.middleware),
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store