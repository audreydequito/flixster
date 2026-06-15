import './MovieCard.css';
import { StarIcon, HeartIcon, EyeIcon, EyeOffIcon } from './icons';

function MovieCard({
  movie,
  onClick,
  isFavorite,
  isWatched,
  onToggleFavorite,
  onToggleWatched,
}) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750/1a1a1a/ffffff?text=No+Poster';

  // Keep icon clicks from opening the detail modal.
  const handleFavorite = (e) => {
    e.stopPropagation();
    onToggleFavorite(movie);
  };

  const handleWatched = (e) => {
    e.stopPropagation();
    onToggleWatched(movie);
  };

  return (
    <div className="movie-card" onClick={onClick}>
      <img
        src={posterUrl}
        alt={`${movie.title} poster`}
        className="movie-poster"
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-meta">
          <p className="movie-rating">
            <StarIcon className="star-icon" /> {movie.vote_average.toFixed(1)}
          </p>
          <div className="card-icons">
            <button
              type="button"
              className={`icon-button heart-button ${isFavorite ? 'active' : ''}`}
              onClick={handleFavorite}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={isFavorite}
            >
              <HeartIcon filled={isFavorite} />
            </button>

            <button
              type="button"
              className={`icon-button eye-button ${isWatched ? 'active' : ''}`}
              onClick={handleWatched}
              aria-label={isWatched ? 'Mark as not watched' : 'Mark as watched'}
              aria-pressed={isWatched}
            >
              {isWatched ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
