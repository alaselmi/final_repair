import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';

function UserTable({ users, onView, onEdit, onDelete }) {
  if (!users.length) {
    return <p className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-300">No users found.</p>;
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-soft dark:border-slate-700/80 dark:bg-slate-950/95">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-left">
          <thead className="bg-slate-950/5 text-sm uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700 dark:text-slate-200">
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-200/70 transition duration-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900/80">
                <td className="px-6 py-5 font-semibold text-slate-900 dark:text-white">{user.name}</td>
                <td className="px-6 py-5 text-slate-600 dark:text-slate-300">{user.email}</td>
                <td className="px-6 py-5">
                  <Badge status={user.role || 'user'} />
                </td>
                <td className="px-6 py-5 text-slate-600 dark:text-slate-300">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="ghost" className="px-4 py-2" onClick={() => onView?.(user)}>
                      View
                    </Button>
                    <Button type="button" variant="secondary" className="px-4 py-2" onClick={() => onEdit?.(user)}>
                      Edit
                    </Button>
                    <Button type="button" variant="danger" className="px-4 py-2" onClick={() => onDelete?.(user)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserTable;
