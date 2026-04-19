import Button from '../../../components/ui/Button';

function RepairPagination({ page, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-300">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-slate-900 dark:text-slate-100">Page</span>
        <div className="flex flex-wrap gap-2">
          {pages.map((pageNumber) => (
            <Button
              key={pageNumber}
              type="button"
              variant={pageNumber === page ? 'primary' : 'ghost'}
              className="px-3 py-2 min-w-[2.25rem]"
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          ))}
        </div>
      </div>
      <span className="text-sm text-slate-500 dark:text-slate-400">{totalPages} pages</span>
    </div>
  );
}

export default RepairPagination;
