import { useEffect, useState } from 'react';
import './MovieModal.css';

function MovieModal({
  movieDetails,
  isLoading,
  error,
  onClose,
  isFavorite,
  isWatched,
  onToggleFavorite,
  onToggleWatched,
}) {
  // When true, the trailer fills the whole modal (wireframe 4).
  const [isTrailerExpanded, setIsTrailerExpanded] = useState(false);

  // Escape collapses an expanded trailer first, otherwise closes the modal.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      if (isTrailerExpanded) {
        setIsTrailerExpanded(false);
      } else {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isTrailerExpanded]);

  // Clicking the dark overlay (but not the modal body) closes the modal.
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const backdropUrl = movieDetails?.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${movieDetails.backdrop_path}`
    : null;

  const releaseDate = movieDetails?.release_date
    ? new Date(movieDetails.release_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';

  const formatRuntime = (totalMinutes) => {
    if (!totalMinutes) return 'Unknown';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) return `${minutes} min`;
    return `${hours} hr ${minutes} min`;
  };

  const runtime = formatRuntime(movieDetails?.runtime);

  // Circular progress ring for the rating (score out of 10).
  const rating = movieDetails?.vote_average ?? 0;
  const ringRadius = 18;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - rating / 10);

  const trailer =
    movieDetails?.videos?.results?.find(
      (v) => v.site === 'YouTube' && v.type === 'Trailer'
    ) ||
    movieDetails?.videos?.results?.find((v) => v.site === 'YouTube');

  const thumbUrl = trailer
    ? `https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`
    : null;

  const playIcon = (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <path d="M8 5v14l11-7z" fill="currentColor" />
    </svg>
  );

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        className={`modal-content ${isTrailerExpanded ? 'expanded' : ''}`}
        role="dialog"
        aria-modal="true"
      >
        <span className="modal-hint" aria-hidden="true">
          ESCAPE
        </span>

        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {isLoading && <div className="modal-status">Loading details...</div>}

        {!isLoading && error && (
          <div className="modal-status modal-error">{error}</div>
        )}

        {!isLoading && !error && movieDetails && isTrailerExpanded && trailer && (
          <iframe
            className="modal-trailer-full"
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
            title={`${movieDetails.title} trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {!isLoading && !error && movieDetails && !isTrailerExpanded && (
          <>
            <div className="modal-hero">
              {backdropUrl && (
                <img
                  src={backdropUrl}
                  alt={`${movieDetails.title} backdrop`}
                  className="modal-backdrop"
                />
              )}

              <div className="modal-hero-content">
                <h2 className="modal-title">{movieDetails.title}</h2>

                <div className="modal-actions-row">
                  <div className="modal-actions-left">
                  <button
                    className="modal-play"
                    onClick={() => trailer && setIsTrailerExpanded(true)}
                    disabled={!trailer}
                  >
                    <span className="modal-play-icon">{playIcon}</span>
                    Play
                  </button>
                  <button
                    className="modal-watch-link"
                    onClick={onToggleWatched}
                  >
                    {isWatched ? 'Continue Watching' : 'Start Watching'}
                  </button>
                </div>

                <div className="modal-icons">
                  <button
                    type="button"
                    className={`icon-button heart-button ${isFavorite ? 'active' : ''}`}
                    onClick={onToggleFavorite}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    aria-pressed={isFavorite}
                  >
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
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
                    onClick={onToggleWatched}
                    aria-label={isWatched ? 'Mark as not watched' : 'Mark as watched'}
                    aria-pressed={isWatched}
                  >
                    {isWatched ? (
                      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
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
                      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                        <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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

            <div className="modal-body">
              <hr className="modal-divider" />

              <div className="modal-meta">
                <span>{releaseDate}</span>
                <span>•</span>
                <span>{runtime}</span>
                <span>•</span>
                <span className="modal-rating-ring">
                  <svg
                    viewBox="0 0 44 44"
                    width="44"
                    height="44"
                    aria-label={`Rating ${rating.toFixed(1)} out of 10`}
                  >
                    <circle
                      className="ring-track"
                      cx="22"
                      cy="22"
                      r={ringRadius}
                    />
                    <circle
                      className="ring-progress"
                      cx="22"
                      cy="22"
                      r={ringRadius}
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringOffset}
                    />
                    <text className="ring-star" x="22" y="23">
                      ★
                    </text>
                  </svg>
                  <span className="modal-rating-value">{rating.toFixed(1)}</span>
                </span>
              </div>

              {movieDetails.genres?.length > 0 && (
                <div className="modal-genres">
                  {movieDetails.genres.map((genre) => (
                    <span key={genre.id} className="genre-tag">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="modal-columns">
                <p className="modal-overview">
                  {movieDetails.overview || 'No overview available.'}
                </p>

                <div className="modal-trailer-col">
                  {trailer ? (
                    <button
                      type="button"
                      className="trailer-thumb"
                      onClick={() => setIsTrailerExpanded(true)}
                      style={{ backgroundImage: `url(${thumbUrl})` }}
                      aria-label="Play trailer"
                    >
                      <span className="trailer-thumb-play">{playIcon}</span>
                      <span className="trailer-thumb-label">trailer</span>
                    </button>
                  ) : (
                    <p className="modal-no-trailer">No trailer available.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MovieModal;
