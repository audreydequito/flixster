import './SearchBar.css';

function SearchBar({ searchQuery, onSearchChange, onSearch, onClear }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search movies..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
        <button type="button" className="clear-button" onClick={onClear}>
          Now Playing
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
