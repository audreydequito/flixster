import './MovieListSkeleton.css';

// Placeholder grid shown while the initial movie list loads. Mirrors the
// .movie-list grid so the layout doesn't jump when real cards arrive.
function MovieListSkeleton({ count = 12 }) {
  return (
    <div className="movie-list skeleton-list" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-poster" />
          <div className="skeleton-line skeleton-line-title" />
          <div className="skeleton-line skeleton-line-sub" />
        </div>
      ))}
    </div>
  );
}

export default MovieListSkeleton;
