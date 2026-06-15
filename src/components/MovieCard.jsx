import './MovieCard.css';

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
          <p className="movie-rating">⭐ {movie.vote_average.toFixed(1)}</p>
          <div className="card-icons">
            <button
              type="button"
              className={`icon-button heart-button ${isFavorite ? 'active' : ''}`}
              onClick={handleFavorite}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={isFavorite}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  d="M12 20.7l-1.32-1.18C5.96 15.3 3 12.62 3 9.3 3 6.74 5.01 4.8 7.5 4.8c1.46 0 2.86.67 3.76 1.74L12 7.3l.74-.76C13.64 5.47 15.04 4.8 16.5 4.8 18.99 4.8 21 6.74 21 9.3c0 3.32-2.96 6-7.68 10.22L12 20.7z"
                  fill={isFavorite ? '#e50914' : 'none'}
                  stroke={isFavorite ? '#e50914' : '#ffffff'}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              className={`icon-button eye-button ${isWatched ? 'active' : ''}`}
              onClick={handleWatched}
              aria-label={isWatched ? 'Mark as not watched' : 'Mark as watched'}
              aria-pressed={isWatched}
            >
              {isWatched ? (
                // Watched: open eye (almond outline with pupil).
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path
                    d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
              ) : (
                // Not watched: closed eye (lower lid arc with lashes).
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <g
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M2 9c3.5 4 16.5 4 20 0" />
                    <line x1="4" y1="12.5" x2="3" y2="15.5" />
                    <line x1="8" y1="14" x2="7.4" y2="17" />
                    <line x1="12" y1="14.4" x2="12" y2="17.6" />
                    <line x1="16" y1="14" x2="16.6" y2="17" />
                    <line x1="20" y1="12.5" x2="21" y2="15.5" />
                  </g>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
