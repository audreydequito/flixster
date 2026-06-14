import './MovieCard.css';

function MovieCard({ movie, onClick }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750/1a1a1a/ffffff?text=No+Poster';

  return (
    <div className="movie-card" onClick={onClick}>
      <img
        src={posterUrl}
        alt={`${movie.title} poster`}
        className="movie-poster"
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-rating">⭐ {movie.vote_average.toFixed(1)}</p>
      </div>
    </div>
  );
}

export default MovieCard;
