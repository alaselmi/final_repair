import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import useRepairs from '../hooks/useRepairs';

function DashboardPage() {
  const { stats, loading } = useRepairs();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <Topbar />
          <section className="grid gap-6 lg:grid-cols-4">
            <Card title="Total repairs" description="All current requests.">
              <p className="mt-4 text-5xl font-bold text-slate-900 dark:text-slate-100">{loading ? <Spinner /> : stats.total}</p>
            </Card>
            <Card title="Pending" description="Items waiting action.">
              <p className="mt-4 text-5xl font-bold text-slate-900 dark:text-slate-100">{loading ? <Spinner /> : stats.pending}</p>
            </Card>
            <Card title="In progress" description="Work currently underway.">
              <p className="mt-4 text-5xl font-bold text-slate-900 dark:text-slate-100">{loading ? <Spinner /> : stats.inProgress}</p>
            </Card>
            <Card title="Completed" description="Repairs finished successfully.">
              <p className="mt-4 text-5xl font-bold text-slate-900 dark:text-slate-100">{loading ? <Spinner /> : stats.completed}</p>
            </Card>
          </section>

          <section className="rounded-[2rem] border border-slate-200/80 bg-white/95 p-8 shadow-soft dark:border-slate-700/80 dark:bg-slate-950/95">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Activity summary</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Real-time repair metrics powered by shared app state.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-6 dark:border-slate-700/80 dark:bg-slate-900/95">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Completed</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{loading ? <Spinner /> : stats.completed}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Repair jobs closed this period.</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-6 dark:border-slate-700/80 dark:bg-slate-900/95">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Backlog</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{loading ? <Spinner /> : stats.pending}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Requests waiting review.</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-6 dark:border-slate-700/80 dark:bg-slate-900/95">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">In progress</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{loading ? <Spinner /> : stats.inProgress}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Repair jobs currently active.</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;
