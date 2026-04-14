import { memo } from 'react';

function Pagination({ page, totalPages, onPageChange, disabled }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      {Array.from({ length: totalPages }).map((_, index) => {
        const pageNumber = index + 1;
        return (
          <button
            key={pageNumber}
            className={pageNumber === page ? 'active' : ''}
            onClick={() => onPageChange(pageNumber)}
            disabled={disabled}
            type="button"
          >
            {pageNumber}
          </button>
        );
      })}
    </div>
  );
}
export default memo(Pagination);