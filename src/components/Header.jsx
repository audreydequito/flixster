import './Header.css';
import SearchBar from './SearchBar';
import SortControl from './SortControl';
import { SunburstIcon, MenuIcon } from './icons';

function Header({
  searchQuery,
  onSearchChange,
  onSearch,
  onClear,
  onMenuClick,
  sortOption,
  onSortChange,
}) {
  return (
    <header className="App-header">
      <div className="header-inner">
        <div className="nav-brand">
          <div className="brand-logo">
            <SunburstIcon size={40} />
          </div>
          <div className="brand-text">
            <h1 className="brand-name">Lumière</h1>
            <p className="tagline">where every frame finds the light</p>
          </div>
        </div>

        <div className="nav-controls">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onSearch={onSearch}
            onClear={onClear}
          />
          <SortControl sortOption={sortOption} onSortChange={onSortChange} />
        </div>

        <button
          type="button"
          className="nav-menu"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <MenuIcon size={26} />
        </button>
      </div>
    </header>
  );
}

export default Header;
