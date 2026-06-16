import { useState, useRef, useEffect } from 'react';
import './SearchBar.css';
import { SearchIcon, CloseIcon } from './icons';

function SearchBar({ searchQuery, onSearchChange, onSearch, onClear }) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  // Focus the input as soon as the bar expands.
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const handleClear = () => {
    onClear();
    inputRef.current?.focus();
  };

  // Collapse when the user tabs/clicks away and there's nothing to keep open for.
  const handleBlur = (e) => {
    if (!searchQuery && !e.currentTarget.contains(e.relatedTarget)) {
      setOpen(false);
    }
  };

  return (
    <div className={`search-bar${open ? ' is-open' : ''}`}>
      {open ? (
        <form onSubmit={handleSubmit} onBlur={handleBlur}>
          <span className="search-input-wrap">
            <span className="search-icon" aria-hidden="true">
              <SearchIcon size={16} />
            </span>
            <input
              ref={inputRef}
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
                onClick={handleClear}
                aria-label="Clear search"
              >
                <CloseIcon size={16} />
              </button>
            )}
          </span>
        </form>
      ) : (
        <button
          type="button"
          className="search-toggle"
          onClick={() => setOpen(true)}
          aria-label="Search movies"
        >
          <SearchIcon size={20} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
