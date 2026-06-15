import './SearchBar.css';
import { SearchIcon, CloseIcon } from './icons';

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
          {searchQuery && (
            <button
              type="button"
              className="search-clear"
              onClick={onClear}
              aria-label="Clear search"
            >
              <CloseIcon size={16} />
            </button>
          )}
        </span>
      </form>
    </div>
  );
}

export default SearchBar;
