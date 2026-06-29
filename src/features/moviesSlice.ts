import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTrendingMoviesApi, getAllMoviesApi, type Movie } from "../api/movies";

interface MoviesState {
  trendingMovies: Movie[];
  allMovies: Movie[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MoviesState = {
  trendingMovies: [],
  allMovies: [],
  isLoading: false,
  error: null,
};

export const fetchTrendingMovies = createAsyncThunk<Movie[], void, { rejectValue: string }>(
  "movies/fetchTrending",
  async (_, { rejectWithValue }) => {
    try {
      return await getTrendingMoviesApi();
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Failed to fetch trending movies");
    }
  }
);

export const fetchAllMovies = createAsyncThunk<Movie[], void, { rejectValue: string }>(
  "movies/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllMoviesApi();
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Failed to fetch movies");
    }
  }
);

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Trending Movies
    builder.addCase(fetchTrendingMovies.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTrendingMovies.fulfilled, (state, action) => {
      state.isLoading = false;
      state.trendingMovies = action.payload;
    });
    builder.addCase(fetchTrendingMovies.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? "An error occurred";
    });

    // All Movies
    builder.addCase(fetchAllMovies.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAllMovies.fulfilled, (state, action) => {
      state.isLoading = false;
      state.allMovies = action.payload;
    });
    builder.addCase(fetchAllMovies.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? "An error occurred";
    });
  },
});

export default moviesSlice.reducer;
