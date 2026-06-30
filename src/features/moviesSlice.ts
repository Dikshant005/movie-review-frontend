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

interface FetchTrendingArgs {
  page?: number;
  append?: boolean;
}

export const fetchTrendingMovies = createAsyncThunk<Movie[], FetchTrendingArgs | undefined, { rejectValue: string }>(
  "movies/fetchTrending",
  async (args, { rejectWithValue }) => {
    try {
      return await getTrendingMoviesApi(args?.page || 1);
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
      const append = action.meta.arg?.append;
      if (append) {
        // filter out duplicates just in case
        const existingIds = new Set(state.trendingMovies.map(m => m._id));
        const newMovies = action.payload.filter(m => !existingIds.has(m._id));
        state.trendingMovies = [...state.trendingMovies, ...newMovies];
      } else {
        state.trendingMovies = action.payload;
      }
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
