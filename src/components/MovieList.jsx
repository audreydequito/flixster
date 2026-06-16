import MovieCard from './MovieCard';
import './MovieList.css';

function MovieList({
  movies,
  onMovieClick,
  favoriteIds,
  watchedIds,
  onToggleFavorite,
  onToggleWatched,
}) {
  return (
    <div className="movie-list">
      {movies.map((movie, index) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          index={index}
          onClick={() => onMovieClick(movie)}
          isFavorite={favoriteIds.has(movie.id)}
          isWatched={watchedIds.has(movie.id)}
          onToggleFavorite={onToggleFavorite}
          onToggleWatched={onToggleWatched}
        />
      ))}
    </div>
  );
}

export default MovieList;
