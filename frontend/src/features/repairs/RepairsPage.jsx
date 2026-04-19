import MainLayout from '../../components/layout/MainLayout';
import RepairTable from './components/RepairTable';
import RepairFilters from './components/RepairFilters';
import RepairPagination from './components/RepairPagination';
import CreateRepairModal from './components/CreateRepairModal';
import EmptyState from './components/EmptyState';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ToastContainer from '../../components/ui/ToastContainer';
import useRepairs from './hooks/useRepairs';
import useToast from '../../hooks/useToast';

function RepairsPage() {
  const { toast, clearToast } = useToast();
  const {
    pageRepairs,
    loading,
    error,
    page,
    totalPages,
    pageSize,
    totalItems,
    stats,
    refreshRepairs,
    retryLoad,
    filters,
    setQuery,
    setStatus,
    createRepair,
    lastUpdated,
    handlePageSizeChange,
    handlePageChange,
    visibleCount,
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
  } = useRepairs();

  return (
    <MainLayout topbarProps={{ onSearch: setQuery, onCreate: openCreateModal }}>
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
                { label: 'In progress', value: stats.inProgress },
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
            <p>Filters are saved so you can pick up where you left off.</p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="primary" onClick={openCreateModal} className="w-full sm:w-auto">
              Add repair
            </Button>
            <Button type="button" variant="secondary" onClick={refreshRepairs} className="w-full sm:w-auto">
              Refresh now
            </Button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Last update: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Loading...'}
          </p>
        </Card>
      </section>

      <section className="rounded-[2rem] border border-slate-200/80 bg-white/95 p-8 shadow-soft dark:border-slate-700/80 dark:bg-slate-950/95">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Repairs list</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Search, filter and review repair jobs with confidence.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 dark:bg-sky-500/15 dark:text-sky-200">
              Showing {visibleCount} of {totalItems}
            </span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value={8}>8 per page</option>
              <option value={12}>12 per page</option>
              <option value={16}>16 per page</option>
            </select>
          </div>
        </div>

        <RepairFilters filters={filters} onFilterChange={setStatus} onSearchChange={setQuery} />

        <div className="mt-6">
          <RepairTable repairs={pageRepairs} loading={loading} />

          {!loading && !pageRepairs.length && !error && (
            <div className="mt-6">
              <EmptyState
                title="No repairs found"
                description="Try a broader search, adjust the status filter, or reset filters to see more results."
                actionLabel="Reset filters"
                onAction={() => {
                  setStatus('all');
                  setQuery('');
                }}
              />
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-3xl border border-rose-200/80 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-900/10 dark:text-rose-200">
              <p className="text-base font-semibold">Unable to load repairs</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{error}</p>
              <Button type="button" variant="secondary" onClick={retryLoad} className="mt-4">
                Retry
              </Button>
            </div>
          )}
        </div>

        {!loading && totalPages > 1 && (
          <div className="mt-8">
            <RepairPagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </section>

      <CreateRepairModal isOpen={isCreateModalOpen} onClose={closeCreateModal} createRepair={createRepair} />
      <ToastContainer message={toast.message} type={toast.type} onClose={clearToast} />
    </MainLayout>
  );
}

export default RepairsPage;
