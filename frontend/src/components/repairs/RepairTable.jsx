import StatusBadge from './StatusBadge';
import Skeleton from '../ui/Skeleton';

function RepairTable({ repairs, loading }) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-soft dark:border-slate-700/80 dark:bg-slate-950/95">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left">
            <thead className="bg-slate-950/5 text-sm uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">Repair</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-t border-slate-200/70 dark:border-slate-700">
                  <td className="px-6 py-6">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="mt-3 h-4 w-64" />
                  </td>
                  <td className="px-6 py-6">
                    <Skeleton className="h-5 w-32" />
                  </td>
                  <td className="px-6 py-6">
                    <Skeleton className="h-5 w-24" />
                  </td>
                  <td className="px-6 py-6">
                    <Skeleton className="h-8 w-24 rounded-2xl" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!repairs.length) {
    return <p className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-300">No repairs found.</p>;
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-soft dark:border-slate-700/80 dark:bg-slate-950/95">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-left">
          <thead className="bg-slate-950/5 text-sm uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4">Repair</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700 dark:text-slate-200">
            {repairs.map((repair) => (
              <tr key={repair.id} className="border-t border-slate-200/70 transition duration-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900/80">
                <td className="px-6 py-5">
                  <div className="font-semibold text-slate-900 dark:text-white">{repair.title || 'Repair request'}</div>
                  <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{repair.description || 'No description'}</div>
                </td>
                <td className="px-6 py-5 text-slate-600 dark:text-slate-300">{repair.client_name || repair.client || 'Unknown'}</td>
                <td className="px-6 py-5 text-slate-600 dark:text-slate-300">{new Date(repair.created_at || repair.date || Date.now()).toLocaleDateString()}</td>
                <td className="px-6 py-5">
                  <StatusBadge status={repair.status || 'pending'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RepairTable;
