import { useEffect, useState } from 'react';
import './Hero.css';
import { StarIcon, PlayIcon, HeartIcon } from './icons';

const SLIDE_MS = 20000;

function Hero({ movies, onMovieClick, isSearching, favoriteIds, onToggleFavorite }) {
  const [current, setCurrent] = useState(0);
  // Keys the crossfade animation so it replays on every slide change.
  const [animKey, setAnimKey] = useState(0);

  const count = movies?.length ?? 0;

  // Clamp the index if the list shrinks/changes underneath us.
  useEffect(() => {
    if (current > count - 1) setCurrent(0);
  }, [count, current]);

  // Auto-advance through the carousel, unless the user prefers reduced motion.
  useEffect(() => {
    if (count <= 1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % count);
      setAnimKey((k) => k + 1);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [count]);

  const goTo = (i) => {
    setCurrent(i);
    setAnimKey((k) => k + 1);
  };

  // While searching (or before the first load), fall back to the plain banner.
  if (isSearching || count === 0) {
    return (
      <section className="hero">
        <div className="hero-inner hero-fallback">
          <div className="hero-content">
            <h2 className="hero-title">{isSearching ? 'Search Results' : 'Now Playing'}</h2>
            <p className="hero-overview">
              {isSearching ? 'Browse your matches below.' : 'The latest movies, ready to browse.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const movie = movies[Math.min(current, count - 1)];
  const isFavorite = favoriteIds?.has(movie.id) ?? false;
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;
  const year = movie.release_date ? movie.release_date.slice(0, 4) : null;

  return (
    <section className="hero">
      <div className="hero-inner hero-featured">
        {/* Backdrop layer: keyed so it crossfades + restarts Ken Burns per slide */}
        <div
          key={`bg-${animKey}`}
          className="hero-bg"
          style={backdropUrl ? { backgroundImage: `url(${backdropUrl})` } : undefined}
        />

        <div key={`content-${animKey}`} className="hero-content">
          <p className="hero-eyebrow">Featured</p>

          <p className="hero-meta">
            <span className="hero-rating">
              <StarIcon className="star-icon" /> {movie.vote_average.toFixed(1)}
            </span>
            {year && <span className="hero-meta-sep">•</span>}
            {year && <span>{year}</span>}
          </p>

          <h1 className="hero-title">{movie.title}</h1>

          <p className="hero-overview">{movie.overview}</p>

          <div className="hero-actions">
            <button
              type="button"
              className="hero-btn hero-btn-primary"
              onClick={() => onMovieClick(movie)}
            >
              <PlayIcon size={18} />
              Watch
            </button>
            <button
              type="button"
              className={`hero-btn hero-btn-secondary ${isFavorite ? 'active' : ''}`}
              onClick={() => onToggleFavorite(movie)}
              aria-pressed={isFavorite}
            >
              <HeartIcon size={18} filled={isFavorite} />
              {isFavorite ? 'In List' : 'Add List'}
            </button>
          </div>

          {count > 1 && (
            <div className="hero-dots" role="tablist" aria-label="Featured movies">
              {movies.map((m, i) => (
                <button
                  key={m.id}
                  type="button"
                  className={`hero-dot ${i === current ? 'active' : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Show ${m.title}`}
                  aria-selected={i === current}
                  role="tab"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;
