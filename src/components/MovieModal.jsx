import { useEffect, useState } from 'react';
import './MovieModal.css';
import { HeartIcon, EyeIcon, EyeOffIcon, CloseIcon, PlayIcon } from './icons';

const AI_FALLBACK =
  "We couldn't generate a recommendation for this one — check out the overview above!";

// Calls OpenRouter for a short, spoiler-free watch recommendation.
// Returns the AI text on success, or the friendly fallback string on any failure.
async function getMovieInsight(title, genres, overview) {
  const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
  try {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.3-70b-instruct:free',
          messages: [
            {
              role: 'system',
              content:
                'You are an enthusiastic but honest film critic. You give quick, ' +
                'friendly watch recommendations that help a viewer decide if a movie ' +
                'fits their evening. Follow these rules strictly: respond in plain text ' +
                'with exactly 2 to 3 sentences; do not use first-person "I" statements; ' +
                'do not reveal any plot spoilers, twists, or the ending; do not compare ' +
                'to other films unless it genuinely helps orient the viewer; avoid ' +
                'generic hype phrases like "a must-see" or "a cinematic masterpiece"; ' +
                'give a take, not a plot summary. No markdown, headings, or lists.',
            },
            {
              role: 'user',
              content:
                `Write a watch recommendation for this movie.\n\n` +
                `Title: ${title}\n` +
                `Genres: ${genres || 'Unknown'}\n` +
                `Overview: ${overview || 'No overview available.'}`,
            },
          ],
        }),
      }
    );

    if (!response.ok) throw new Error(`OpenRouter error: ${response.status}`);

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error('OpenRouter returned no content');
    return text;
  } catch (error) {
    console.error('AI insight failed:', error);
    return AI_FALLBACK;
  }
}

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

  // AI "Watch Recommendation" state (Milestone 8). Lives here because the modal
  // is the only consumer; re-runs per movie so it resets naturally.
  const [aiInsight, setAiInsight] = useState(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

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

  // Fetch the AI watch recommendation once details have loaded. Keyed on the
  // movie id so opening a different movie starts fresh. `ignore` guards against
  // a slow response landing after the user has switched movies.
  useEffect(() => {
    if (!movieDetails?.id) return;

    let ignore = false;
    setAiInsight(null);
    setLoadingInsight(true);

    const genres = (movieDetails.genres || []).map((g) => g.name).join(', ');

    getMovieInsight(movieDetails.title, genres, movieDetails.overview).then(
      (text) => {
        if (ignore) return;
        setAiInsight(text);
        setLoadingInsight(false);
      }
    );

    return () => {
      ignore = true;
    };
  }, [movieDetails?.id]);

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
                  <span className="modal-watch-link">
                    {isWatched ? 'Continue Watching' : 'Start Watching'}
                  </span>
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
              <div className="modal-columns">
                <div className="modal-info-col">
                  <div className="modal-meta">
                    <span>{releaseDate}</span>
                    <span>•</span>
                    <span>{runtime}</span>
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
                          d="M22 14L23.88 19.41L29.61 19.53L25.04 22.99L26.70 28.47L22 25.20L17.30 28.47L18.96 22.99L14.39 19.53L20.12 19.41Z"
                        />
                      </svg>
                      <span className="modal-rating-value">
                        {rating.toFixed(1)}
                      </span>
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

                  <p className="modal-overview">
                    {movieDetails.overview || 'No overview available.'}
                  </p>

                  <div className="ai-insight">
                    <h3 className="ai-insight-label">AI Watch Recommendation</h3>
                    {loadingInsight ? (
                      <p className="ai-insight-loading">
                        ✨ Getting a recommendation…
                      </p>
                    ) : (
                      <p className="ai-insight-text">{aiInsight}</p>
                    )}
                  </div>
                </div>

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
