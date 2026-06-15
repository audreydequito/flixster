import './SearchBar.css';
import { SearchIcon } from './icons';

function SearchBar({ searchQuery, onSearchChange, onSearch, onClear }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <span className="search-input-wrap">
          <span className="search-icon" aria-hidden="true">
            <SearchIcon size={16} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search movies..."
            className="search-input"
          />
        </span>
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
