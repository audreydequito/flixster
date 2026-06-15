import { useEffect } from 'react';
import './MovieModal.css';

function MovieModal({ movieDetails, isLoading, error, onClose }) {
  // Close on Escape key.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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

  const trailer =
    movieDetails?.videos?.results?.find(
      (v) => v.site === 'YouTube' && v.type === 'Trailer'
    ) ||
    movieDetails?.videos?.results?.find((v) => v.site === 'YouTube');

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" role="dialog" aria-modal="true">
        <span className="modal-hint" aria-hidden="true">
          ESC
        </span>

        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {isLoading && (
          <div className="modal-status">Loading details...</div>
        )}

        {!isLoading && error && (
          <div className="modal-status modal-error">{error}</div>
        )}

        {!isLoading && !error && movieDetails && (
          <>
            {backdropUrl && (
              <img
                src={backdropUrl}
                alt={`${movieDetails.title} backdrop`}
                className="modal-backdrop"
              />
            )}

            <div className="modal-body">
              <h2 className="modal-title">{movieDetails.title}</h2>

              <div className="modal-meta">
                <span>{releaseDate}</span>
                <span>•</span>
                <span>{runtime}</span>
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

              <p className="modal-overview">
                {movieDetails.overview || 'No overview available.'}
              </p>

              <div className="modal-trailer-section">
                <h3 className="modal-trailer-heading">Trailer</h3>
                {trailer ? (
                  <iframe
                    className="modal-trailer"
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title={`${movieDetails.title} trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <p className="modal-no-trailer">No trailer available.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MovieModal;
