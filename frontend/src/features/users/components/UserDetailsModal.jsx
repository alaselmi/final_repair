import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';

function UserDetailsModal({ user, isOpen, onClose }) {
  if (!user) {
    return null;
  }

  return (
    <Modal title="User details" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50 p-5 dark:border-slate-700/80 dark:bg-slate-900">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Account</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500 text-lg font-semibold text-white">{user.name?.charAt(0) || 'U'}</div>
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{user.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50 p-5 dark:border-slate-700/80 dark:bg-slate-900">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Role</p>
            <div className="mt-3">
              <Badge status={user.role || 'user'} />
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50 p-5 dark:border-slate-700/80 dark:bg-slate-900">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Joined</p>
            <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50 p-5 dark:border-slate-700/80 dark:bg-slate-900">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Status</p>
            <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">Active</p>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <Button type="button" variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}

export default UserDetailsModal;
