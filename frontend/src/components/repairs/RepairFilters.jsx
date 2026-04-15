function RepairFilters({ filters, onFilterChange, onSearchChange }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
      <input
        type="search"
        value={filters.query}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search repairs by title or client"
        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition duration-300 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
      <select
        value={filters.status}
        onChange={(event) => onFilterChange(event.target.value)}
        className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition duration-300 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      >
        <option value="all">All statuses</option>
        <option value="pending">Pending</option>
        <option value="in progress">In progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  );
}

export default RepairFilters;
