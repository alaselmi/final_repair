import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import RepairTable from '../components/repairs/RepairTable';
import RepairFilters from '../components/repairs/RepairFilters';
import RepairPagination from '../components/repairs/RepairPagination';
import CreateRepairModal from '../components/repairs/CreateRepairModal';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import ToastContainer from '../components/ui/ToastContainer';
import useRepairs from '../hooks/useRepairs';
import useToast from '../hooks/useToast';

function RepairsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast, clearToast } = useToast();
  const {
    pageRepairs,
    loading,
    error,
    page,
    totalPages,
    pageSize,
    setPage,
    setPageSize,
    totalItems,
    stats,
    refreshRepairs,
    filters,
    setFilters,
    lastUpdated
  } = useRepairs();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 xl:flex-row">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <Topbar onSearch={(value) => setFilters((prev) => ({ ...prev, query: value }))} onCreate={() => setIsModalOpen(true)} />

          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card title="Repair volume" description="Snapshot of your current work queue.">
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                      <Skeleton className="h-5 w-24" />
                      <div className="mt-4 h-10 w-full rounded-3xl bg-slate-200 dark:bg-slate-800" />
                    </div>
                  ))
                ) : (
                  [
                    { label: 'Total', value: totalItems },
                    { label: 'Pending', value: stats.pending },
                    { label: 'In progress', value: stats.inProgress }
                  ].map((item) => (
                    <div key={item.label} className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{item.label}</p>
                      <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{item.value}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>
            <Card title="Actions" description="Designed for quick status updates.">
              <div className="mt-6 space-y-4 text-sm text-slate-500 dark:text-slate-400">
                <p>Use the modal form to add quick repairs without leaving the list.</p>
                <p>Polling keeps your view fresh with simulated real-time updates.</p>
                <p>Pagination keeps large repair lists clean and easy to scan.</p>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  Add repair
                </button>
                <button
                  type="button"
                  onClick={refreshRepairs}
                  className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Refresh now
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Last update: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Loading...'}</p>
            </Card>
          </section>

          <section className="rounded-[2rem] border border-slate-200/80 bg-white/95 p-8 shadow-soft dark:border-slate-700/80 dark:bg-slate-950/95">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Repairs list</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Search, filter and review repair jobs with confidence.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 dark:bg-sky-500/15 dark:text-sky-200">Showing {Math.min(pageRepairs.length, totalItems)} of {totalItems}</span>
                <select
                  value={pageSize}
                  onChange={(event) => setPageSize(Number(event.target.value))}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value={8}>8 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={16}>16 per page</option>
                </select>
              </div>
            </div>
            <RepairFilters
              filters={filters}
              onFilterChange={(status) => setFilters((prev) => ({ ...prev, status }))}
              onSearchChange={(query) => setFilters((prev) => ({ ...prev, query }))}
            />
            <div className="mt-6">
              <RepairTable repairs={pageRepairs} loading={loading} />
              {!loading && !pageRepairs.length && (
                <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  No repairs match the current filters.
                </div>
              )}
            </div>
            {!loading && totalPages > 1 && (
              <div className="mt-8">
                <RepairPagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
            {error && <div className="mt-6 rounded-3xl bg-rose-50 p-6 text-sm text-rose-700 dark:bg-rose-900/20 dark:text-rose-200">{error}</div>}
          </section>
        </main>
      </div>
      <CreateRepairModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ToastContainer message={toast.message} type={toast.type} onClose={clearToast} />
    </div>
  );
}

export default RepairsPage;
