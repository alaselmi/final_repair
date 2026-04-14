import { memo } from 'react';

function FiltersBar({
  search,
  onSearchChange,
  onSearchClear,
  status,
  onStatusChange,
  searching,
  total,
  page,
  totalPages,
}) {
  return (
    <section className="card filters-bar">
      <div className="toolbar">
        <div className="search-row">
          <label>
            Search
            <div className="search-input-row">
              <input
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search customer, device, or brand"
              />
              {search && (
                <button
                  type="button"
                  className="clear-button"
                  onClick={() => onSearchClear('')}
                >
                  ×
                </button>
              )}
            </div>
          </label>
          {searching && <div className="searching-indicator">Searching...</div>}
        </div>
        <div className="toolbar-right">
          <label>
            Filter status
            <select value={status} onChange={(event) => onStatusChange(event.target.value)}>
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <div className="meta-row">
            <span>Total repairs: {total}</span>
            <span>Page {page} / {totalPages}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(FiltersBar);
