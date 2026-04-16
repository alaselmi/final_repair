function Pagination({ page, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-300">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-slate-600 dark:text-slate-400">Page {page} of {totalPages}</p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            Previous
          </button>
          {pages.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                pageNumber === page
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
