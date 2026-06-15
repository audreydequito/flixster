import './Header.css';
import SearchBar from './SearchBar';

function Header({ searchQuery, onSearchChange, onSearch, onClear, onMenuClick }) {
  return (
    <header className="App-header">
      <div className="nav-brand">
        <div className="brand-logo">🎬</div>
        <div className="brand-text">
          <h1 className="brand-name">flixster</h1>
          <p className="tagline">browse whats playing</p>
        </div>
      </div>

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSearch={onSearch}
        onClear={onClear}
      />

      <button
        type="button"
        className="nav-menu"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        ☰
      </button>
    </header>
  );
}

export default Header;
