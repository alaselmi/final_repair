function RepairPagination({ page, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-300">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-slate-900 dark:text-slate-100">Page</span>
        <div className="flex flex-wrap gap-2">
          {pages.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={`rounded-2xl px-3 py-2 transition ${pageNumber === page ? 'bg-sky-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800'}`}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      </div>
      <span className="text-sm text-slate-500 dark:text-slate-400">{totalPages} pages</span>
    </div>
  );
}

export default RepairPagination;
