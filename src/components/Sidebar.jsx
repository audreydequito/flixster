import { useEffect, useState } from 'react';
import './Sidebar.css';
import { StarIcon, HeartIcon, EyeIcon, CloseIcon } from './icons';

function Sidebar({
  isOpen,
  onClose,
  favorites,
  watched,
  onMovieClick,
  onToggleFavorite,
  onToggleWatched,
}) {
  // Which list to show: 'favorites' or 'watched'. Tapping a nav tab filters
  // the panel down to just that list.
  const [filter, setFilter] = useState('favorites');

  // Close on Escape key (only while open).
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleRowClick = (movie) => {
    onMovieClick(movie);
    onClose();
  };

  const renderList = (movies, emptyIcon, emptyText, onRemove) => {
    if (movies.length === 0) {
      return (
        <div className="sidebar-empty">
          <span className="sidebar-empty-icon">{emptyIcon}</span>
          <p className="sidebar-empty-text">{emptyText}</p>
        </div>
      );
    }
    return (
      <ul className="sidebar-list">
        {movies.map((movie) => {
          const thumb = movie.poster_path
            ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
            : 'https://via.placeholder.com/92x138/1a1a1a/ffffff?text=No+Poster';
          return (
            <li key={movie.id} className="sidebar-row">
              <button
                type="button"
                className="sidebar-row-main"
                onClick={() => handleRowClick(movie)}
              >
                <img src={thumb} alt={`${movie.title} poster`} className="sidebar-thumb" />
                <span className="sidebar-row-text">
                  <span className="sidebar-row-title">{movie.title}</span>
                  <span className="sidebar-row-rating">
                    <StarIcon size={13} className="star-icon" />{' '}
                    {movie.vote_average.toFixed(1)}
                  </span>
                </span>
              </button>
              <button
                type="button"
                className="sidebar-remove"
                onClick={() => onRemove(movie)}
                aria-label={`Remove ${movie.title}`}
              >
                <CloseIcon size={14} />
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <>
      <div
        className={`sidebar-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-label="Favorites and watched list"
        aria-hidden={!isOpen}
      >
        <div className="sidebar-header">
          <h2 className="sidebar-heading">My Movies</h2>
          <button
            type="button"
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            type="button"
            className={`sidebar-nav-link ${filter === 'favorites' ? 'active' : ''}`}
            onClick={() => setFilter('favorites')}
            aria-pressed={filter === 'favorites'}
          >
            Favorites ({favorites.length})
          </button>
          <button
            type="button"
            className={`sidebar-nav-link ${filter === 'watched' ? 'active' : ''}`}
            onClick={() => setFilter('watched')}
            aria-pressed={filter === 'watched'}
          >
            Watched ({watched.length})
          </button>
        </nav>

        <div className="sidebar-sections">
          {filter === 'favorites' && (
            <section className="sidebar-section">
              <h3 className="sidebar-section-title">
                <HeartIcon size={18} filled className="section-heart" /> Favorites
              </h3>
              {renderList(
                favorites,
                <HeartIcon size={40} filled />,
                'No favorites yet — tap the heart on a movie to save it here.',
                onToggleFavorite
              )}
            </section>
          )}

          {filter === 'watched' && (
            <section className="sidebar-section">
              <h3 className="sidebar-section-title">
                <EyeIcon size={18} /> Watched
              </h3>
              {renderList(
                watched,
                <EyeIcon size={40} />,
                'Nothing watched yet — mark movies with the eye icon to track them.',
                onToggleWatched
              )}
            </section>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
