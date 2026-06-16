import { useEffect, useRef, useState } from 'react';
import './MovieCard.css';
import { StarIcon, HeartIcon, EyeIcon, EyeOffIcon } from './icons';

function MovieCard({
  movie,
  index = 0,
  onClick,
  isFavorite,
  isWatched,
  onToggleFavorite,
  onToggleWatched,
}) {
  const cardRef = useRef(null);
  const [inView, setInView] = useState(false);

  // Reveal the card on scroll-in (and immediately if already on screen).
  // Observer disconnects after the first reveal so it only fires once.
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

  // Make the card activatable by keyboard (Enter/Space), like a button.
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      ref={cardRef}
      className={`movie-card ${inView ? 'in-view' : ''}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${movie.title}`}
      style={{ animationDelay: `${Math.min(index, 12) * 0.04}s` }}
    >
      <div className="movie-poster-wrap">
        <img
          src={posterUrl}
          alt={`${movie.title} poster`}
          className="movie-poster"
        />
        <span className="movie-rating">
          <StarIcon className="star-icon" /> {movie.vote_average.toFixed(1)}
        </span>

        {/* Hover/focus preview — a centered "View Details" cue */}
        <div className="movie-hover" aria-hidden="true">
          <span className="movie-hover-cue">View Details</span>
        </div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
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
  );
}

export default MovieCard;
