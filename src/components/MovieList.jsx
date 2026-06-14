import MovieCard from './MovieCard';
import './MovieList.css';

function MovieList({ movies, onMovieClick }) {
  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onClick={() => onMovieClick(movie)}
        />
      ))}
    </div>
  );
}

export default MovieList;
