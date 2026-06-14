import { useState, useEffect } from 'react';
import './App.css';
import MovieList from './components/MovieList';
import SearchBar from './components/SearchBar';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mode, setMode] = useState('nowPlaying'); // 'nowPlaying' | 'search'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Builds the endpoint URL for the given mode/page/query.
  const buildUrl = (targetMode, page, query) => {
    if (targetMode === 'search') {
      return `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&page=${page}`;
    }
    return `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${page}`;
  };

  // Fetches a page of movies. `append` keeps existing results (Load More),
  // otherwise the list is replaced (new search / mode switch).
  const fetchMovies = async (targetMode, page, query, append) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(buildUrl(targetMode, page, query));

      if (!response.ok) {
        throw new Error(
          targetMode === 'search' ? 'API error' : 'Failed to load movies'
        );
      }

      const data = await response.json();
      setTotalPages(data.total_pages);

      if (append) {
        setMovies((prevMovies) => [...prevMovies, ...data.results]);
      } else {
        setMovies(data.results);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load the Now Playing list on first render.
  useEffect(() => {
    fetchMovies('nowPlaying', 1, '', false);
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) return; // don't call API on empty search
    setMode('search');
    setCurrentPage(1);
    fetchMovies('search', 1, searchQuery, false);
  };

  const handleClear = () => {
    setSearchQuery('');
    setMode('nowPlaying');
    setCurrentPage(1);
    fetchMovies('nowPlaying', 1, '', false);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchMovies(mode, nextPage, searchQuery, true);
  };

  const handleMovieClick = (movie) => {
    console.log('Movie clicked:', movie);
  };

  const hasMorePages = currentPage < totalPages;

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎬 Flixster 🎬</h1>
      </header>

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      {error && <div className="error">{error}</div>}

      {!error && movies.length === 0 && !isLoading && (
        <div className="no-movies">
          {mode === 'search'
            ? 'No movies match your search'
            : 'No movies available'}
        </div>
      )}

      <MovieList movies={movies} onMovieClick={handleMovieClick} />

      {isLoading && <div className="loading">Loading movies...</div>}

      {hasMorePages && !isLoading && movies.length > 0 && (
        <div className="load-more-container">
          <button className="load-more-button" onClick={handleLoadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
