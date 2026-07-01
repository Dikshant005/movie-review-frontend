import { useState, useRef, useCallback } from 'react';
import { useDiscoverMoviesQuery } from '../services/tmdbApi';
import type { Movie, DiscoverFilters } from '../api/movies';
import MovieCard from '../components/MovieCard';
import { Loader2, Search, Filter } from 'lucide-react';
import TrailerModal from '../components/TrailerModal';
import ReviewModal from '../components/ReviewModal';

const GENRES = [
  { id: '28', name: 'Action' },
  { id: '12', name: 'Adventure' },
  { id: '16', name: 'Animation' },
  { id: '35', name: 'Comedy' },
  { id: '80', name: 'Crime' },
  { id: '99', name: 'Documentary' },
  { id: '18', name: 'Drama' },
  { id: '10751', name: 'Family' },
  { id: '14', name: 'Fantasy' },
  { id: '36', name: 'History' },
  { id: '27', name: 'Horror' },
  { id: '10402', name: 'Music' },
  { id: '9648', name: 'Mystery' },
  { id: '10749', name: 'Romance' },
  { id: '878', name: 'Science Fiction' },
  { id: '10770', name: 'TV Movie' },
  { id: '53', name: 'Thriller' },
  { id: '10752', name: 'War' },
  { id: '37', name: 'Western' }
];

const DECADES = [
  { label: '2020s', gte: '2020-01-01', lte: '2029-12-31' },
  { label: '2010s', gte: '2010-01-01', lte: '2019-12-31' },
  { label: '2000s', gte: '2000-01-01', lte: '2009-12-31' },
  { label: '1990s', gte: '1990-01-01', lte: '1999-12-31' },
  { label: '1980s', gte: '1980-01-01', lte: '1989-12-31' },
];

export default function Discover() {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [trailerTmdbId, setTrailerTmdbId] = useState<string | null>(null);
  const [reviewMovie, setReviewMovie] = useState<Movie | null>(null);

  const [filters, setFilters] = useState({
    genre: '',
    decade: '',
    rating: '',
    language: ''
  });

  const activeDecade = DECADES.find(d => d.label === filters.decade);
  const queryFilters: DiscoverFilters = { page };
  if (filters.genre) queryFilters.with_genres = filters.genre;
  if (filters.rating) queryFilters['vote_average.gte'] = Number(filters.rating);
  if (filters.language) queryFilters.with_original_language = filters.language;
  if (activeDecade) {
    queryFilters['primary_release_date.gte'] = activeDecade.gte;
    queryFilters['primary_release_date.lte'] = activeDecade.lte;
  }

  const { data: movies = [], isLoading: loading, isFetching } = useDiscoverMoviesQuery(queryFilters);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastMovieElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isFetching) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isFetching, hasMore]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPage(1);
    setHasMore(true);
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="px-8 md:px-16 py-12 min-h-screen">
      <TrailerModal isOpen={!!trailerTmdbId} onClose={() => setTrailerTmdbId(null)} tmdbId={trailerTmdbId} />
      <ReviewModal isOpen={!!reviewMovie} onClose={() => setReviewMovie(null)} movie={reviewMovie} />

      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <Search className="w-8 h-8 text-red-600" />
        Discover Movies
      </h1>

      <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl mb-8 flex flex-wrap gap-4 items-center shadow-2xl">
        <div className="flex items-center gap-2 text-gray-400 mr-2">
          <Filter className="w-5 h-5" />
          <span className="font-bold">Filters:</span>
        </div>
        
        <select name="genre" value={filters.genre} onChange={handleFilterChange} className="bg-black border border-white/20 text-white rounded-lg px-4 py-2 outline-none focus:border-red-500 transition-colors">
          <option value="">Any Genre</option>
          {GENRES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>

        <select name="decade" value={filters.decade} onChange={handleFilterChange} className="bg-black border border-white/20 text-white rounded-lg px-4 py-2 outline-none focus:border-red-500 transition-colors">
          <option value="">Any Decade</option>
          {DECADES.map(d => <option key={d.label} value={d.label}>{d.label}</option>)}
        </select>

        <select name="rating" value={filters.rating} onChange={handleFilterChange} className="bg-black border border-white/20 text-white rounded-lg px-4 py-2 outline-none focus:border-red-500 transition-colors">
          <option value="">Any Rating</option>
          <option value="8">8+ (Great)</option>
          <option value="7">7+ (Good)</option>
          <option value="6">6+ (Okay)</option>
        </select>

        <select name="language" value={filters.language} onChange={handleFilterChange} className="bg-black border border-white/20 text-white rounded-lg px-4 py-2 outline-none focus:border-red-500 transition-colors">
          <option value="">Any Language</option>
          <option value="en">English</option>
          <option value="ko">Korean</option>
          <option value="ja">Japanese</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {movies.map((movie, index) => {
          if (index === movies.length - 1) {
            return (
              <div ref={lastMovieElementRef} key={`${movie._id}-${index}`}>
                <MovieCard movie={movie} index={index} onPlayTrailer={setTrailerTmdbId} onReview={setReviewMovie} />
              </div>
            );
          } else {
            return <MovieCard key={`${movie._id}-${index}`} movie={movie} index={index} onPlayTrailer={setTrailerTmdbId} onReview={setReviewMovie} />;
          }
        })}
      </div>
      
      {loading && (
        <div className="w-full flex justify-center mt-12">
          <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
        </div>
      )}

      {!loading && movies.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No movies found matching these filters.</p>
        </div>
      )}
    </div>
  );
}
