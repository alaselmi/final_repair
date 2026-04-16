import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import UserTable from '../components/users/UserTable';
import UserDetailsModal from '../components/users/UserDetailsModal';
import EditUserModal from '../components/users/EditUserModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Pagination from '../components/ui/Pagination';
import useAuth from '../hooks/useAuth';
import { deleteUser, fetchUsers, updateUser } from '../services/userService';

function UsersPage() {
  const auth = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (auth.user?.role !== 'admin') {
      setLoading(false);
      return;
    }

    async function loadUsers() {
      setLoading(true);
      setError('');

      try {
        const data = await fetchUsers();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Unable to load users.');
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [auth.user?.role]);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        query === '' ||
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.role?.toLowerCase().includes(query);
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [roleFilter, search, users]);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, page, pageSize]);

  const visibleFrom = filteredUsers.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const visibleTo = Math.min(filteredUsers.length, page * pageSize);

  async function handleSave(updated) {
    setError('');

    try {
      const saved = await updateUser(updated.id, updated);
      setUsers((current) => current.map((user) => (user.id === saved.id ? saved : user)));
    } catch (err) {
      setError(err.message || 'Unable to update user.');
    } finally {
      setIsEditOpen(false);
      setEditUser(null);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) {
      return;
    }

    setError('');
    try {
      await deleteUser(deleteTarget.id);
      setUsers((current) => current.filter((user) => user.id !== deleteTarget.id));
      setDeleteTarget(null);
      setIsDeleteOpen(false);
    } catch (err) {
      setError(err.message || 'Unable to delete user.');
    }
  }

  const adminCount = useMemo(() => users.filter((user) => user.role === 'admin').length, [users]);
  const technicianCount = useMemo(() => users.filter((user) => user.role === 'technician').length, [users]);
  const userCount = useMemo(() => users.filter((user) => user.role === 'user').length, [users]);

  if (auth.user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <Sidebar />
          <main className="flex-1 space-y-6">
            <Topbar />
            <section className="rounded-[2rem] border border-slate-200/80 bg-white/95 p-10 shadow-soft dark:border-slate-700/80 dark:bg-slate-950/95">
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Users</h1>
              <p className="mt-4 text-slate-500 dark:text-slate-400">This page is reserved for administrators. Your role does not have access to the user management panel.</p>
            </section>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 xl:flex-row">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <Topbar />

          <section className="grid gap-6 lg:grid-cols-4">
            <Card title="Total users" description="All registered workspace accounts.">
              <p className="mt-4 text-5xl font-bold text-slate-900 dark:text-slate-100">{loading ? <Spinner /> : users.length}</p>
            </Card>
            <Card title="Admins" description="Users with full platform access.">
              <p className="mt-4 text-5xl font-bold text-slate-900 dark:text-slate-100">{loading ? <Spinner /> : adminCount}</p>
            </Card>
            <Card title="Technicians" description="Users assigned to repair work.">
              <p className="mt-4 text-5xl font-bold text-slate-900 dark:text-slate-100">{loading ? <Spinner /> : technicianCount}</p>
            </Card>
            <Card title="Customers" description="Regular users in the platform.">
              <p className="mt-4 text-5xl font-bold text-slate-900 dark:text-slate-100">{loading ? <Spinner /> : userCount}</p>
            </Card>
          </section>

          <section className="rounded-[2rem] border border-slate-200/80 bg-white/95 p-8 shadow-soft dark:border-slate-700/80 dark:bg-slate-950/95">
            <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">User directory</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Search, filter and manage your team members safely.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] xl:grid-cols-[minmax(260px,_1fr)_auto] xl:items-center">
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search users by name, email, or role"
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={roleFilter}
                    onChange={(event) => setRoleFilter(event.target.value)}
                    className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value="all">All roles</option>
                    <option value="admin">Admin</option>
                    <option value="technician">Technician</option>
                    <option value="user">User</option>
                  </select>
                  <select
                    value={pageSize}
                    onChange={(event) => setPageSize(Number(event.target.value))}
                    className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value={6}>6 per page</option>
                    <option value={8}>8 per page</option>
                    <option value={12}>12 per page</option>
                  </select>
                </div>
              </div>
            </div>

            {error && <div className="rounded-3xl bg-rose-50 p-6 text-sm text-rose-700 dark:bg-rose-900/20 dark:text-rose-200">{error}</div>}

            {loading ? (
              <div className="grid gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="rounded-[2rem] border border-slate-200/80 bg-slate-50 p-8 dark:border-slate-700/80 dark:bg-slate-900/95">
                    <div className="h-5 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="mt-4 h-4 w-56 rounded-full bg-slate-200 dark:bg-slate-800" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="mb-5 flex flex-col gap-3 rounded-[1.75rem] border border-slate-200/80 bg-slate-50 px-5 py-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Showing {visibleFrom}-{visibleTo} of {filteredUsers.length} users</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Filtered by role and search query.</p>
                  </div>
                  <p className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-500 shadow-sm dark:bg-slate-950 dark:text-slate-400">Last synced just now</p>
                </div>
                <UserTable
                  users={paginatedUsers}
                  onView={(user) => {
                    setSelectedUser(user);
                    setIsViewOpen(true);
                  }}
                  onEdit={(user) => {
                    setEditUser(user);
                    setIsEditOpen(true);
                  }}
                  onDelete={(user) => {
                    setDeleteTarget(user);
                    setIsDeleteOpen(true);
                  }}
                />
                {!filteredUsers.length && (
                  <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-300">
                    No users match your current filters. Try broadening the search or resetting the role filter.
                  </div>
                )}
                {filteredUsers.length > pageSize && (
                  <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                )}
              </>
            )}

            <EditUserModal
              user={editUser}
              isOpen={isEditOpen}
              onClose={() => setIsEditOpen(false)}
              onSave={handleSave}
            />
            <ConfirmDialog
              title="Delete user"
              message={
                deleteTarget
                  ? `Are you sure you want to remove ${deleteTarget.name}? This action cannot be undone.`
                  : 'Are you sure you want to remove this user?'
              }
              isOpen={isDeleteOpen}
              onConfirm={handleDeleteConfirm}
              onCancel={() => setIsDeleteOpen(false)}
            />
            <UserDetailsModal
              user={selectedUser}
              isOpen={isViewOpen}
              onClose={() => setIsViewOpen(false)}
            />
          </section>
        </main>
      </div>
    </div>
  );
}

export default UsersPage;
