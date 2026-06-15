import './SortControl.css';

function SortControl({ sortOption, onSortChange }) {
  return (
    <div className="sort-control">
      <label htmlFor="sort-select" className="sort-label">
        Sort:
      </label>
      <select
        id="sort-select"
        className="sort-select"
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="default">Sort by...</option>
        <option value="title">Title (A-Z)</option>
        <option value="release_date">Release Date (Newest)</option>
        <option value="vote_average">Vote Average (Highest)</option>
      </select>
    </div>
  );
}

export default SortControl;
