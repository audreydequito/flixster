import { useEffect, useState } from 'react';
import './MovieModal.css';
import { HeartIcon, EyeIcon, EyeOffIcon, CloseIcon, PlayIcon } from './icons';

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
          <CloseIcon />
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
                    <span className="modal-play-icon">
                      <PlayIcon size={16} />
                    </span>
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
                    <HeartIcon size={22} filled={isFavorite} />
                  </button>

                  <button
                    type="button"
                    className={`icon-button eye-button ${isWatched ? 'active' : ''}`}
                    onClick={onToggleWatched}
                    aria-label={isWatched ? 'Mark as not watched' : 'Mark as watched'}
                    aria-pressed={isWatched}
                  >
                    {isWatched ? <EyeIcon size={22} /> : <EyeOffIcon size={22} />}
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
                    <path
                      className="ring-star"
                      d="M22 14.5l1.84 3.73 4.12.6-2.98 2.9.7 4.1L22 27.9l-3.68 1.93.7-4.1-2.98-2.9 4.12-.6L22 14.5z"
                    />
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
                      <span className="trailer-thumb-play">
                        <PlayIcon size={44} />
                      </span>
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
