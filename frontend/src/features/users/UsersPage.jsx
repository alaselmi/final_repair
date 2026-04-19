import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import UserTable from './components/UserTable';
import UserDetailsModal from './components/UserDetailsModal';
import EditUserModal from './components/EditUserModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Pagination from '../../components/ui/Pagination';
import useUsers from './hooks/useUsers';

function UsersPage() {
  const {
    isAdmin,
    loading,
    error,
    users,
    search,
    handleSearchChange,
    roleFilter,
    handleRoleFilterChange,
    page,
    handlePageChange,
    pageSize,
    handlePageSizeChange,
    selectedUser,
    isViewOpen,
    editUser,
    isEditOpen,
    deleteTarget,
    isDeleteOpen,
    filteredUsers,
    paginatedUsers,
    totalPages,
    visibleFrom,
    visibleTo,
    totalResults,
    showPagination,
    stats,
    openUserDetails,
    openEditUser,
    openDeleteUser,
    closeModals,
    handleSave,
    handleDeleteConfirm,
  } = useUsers();

  if (!isAdmin) {
    return (
      <MainLayout>
        <section className="rounded-[2rem] border border-slate-200/80 bg-white/95 p-10 shadow-soft dark:border-slate-700/80 dark:bg-slate-950/95">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Users</h1>
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            This page is reserved for administrators. Your role does not have access to the user management panel.
          </p>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="grid gap-6 lg:grid-cols-4">
        <Card title="Total users" description="All registered workspace accounts.">
          <p className="mt-4 text-5xl font-bold text-slate-900 dark:text-slate-100">
            {loading ? <Spinner /> : stats.total}
          </p>
        </Card>
        <Card title="Admins" description="Users with full platform access.">
          <p className="mt-4 text-5xl font-bold text-slate-900 dark:text-slate-100">
            {loading ? <Spinner /> : stats.admin}
          </p>
        </Card>
        <Card title="Technicians" description="Users assigned to repair work.">
          <p className="mt-4 text-5xl font-bold text-slate-900 dark:text-slate-100">
            {loading ? <Spinner /> : stats.technician}
          </p>
        </Card>
        <Card title="Customers" description="Regular users in the platform.">
          <p className="mt-4 text-5xl font-bold text-slate-900 dark:text-slate-100">
            {loading ? <Spinner /> : stats.customer}
          </p>
        </Card>
      </section>

      <section className="rounded-[2rem] border border-slate-200/80 bg-white/95 p-8 shadow-soft dark:border-slate-700/80 dark:bg-slate-950/95">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">User directory</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Search, filter and manage your team members safely.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] xl:grid-cols-[minmax(260px,_1fr)_auto] xl:items-center">
              <Input
              name="search"
              type="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search users by name, email, or role"
            />
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={roleFilter}
                onChange={handleRoleFilterChange}
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="all">All roles</option>
                <option value="admin">Admin</option>
                <option value="technician">Technician</option>
                <option value="user">User</option>
              </select>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value={6}>6 per page</option>
                <option value={8}>8 per page</option>
                <option value={12}>12 per page</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-3xl bg-rose-50 p-6 text-sm text-rose-700 dark:bg-rose-900/20 dark:text-rose-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[2rem] border border-slate-200/80 bg-slate-50 p-8 dark:border-slate-700/80 dark:bg-slate-900/95"
              >
                <div className="h-5 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="mt-4 h-4 w-56 rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-col gap-3 rounded-[1.75rem] border border-slate-200/80 bg-slate-50 px-5 py-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Showing {visibleFrom}-{visibleTo} of {totalResults} users
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Filtered by role and search query.
                </p>
              </div>
              <p className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-500 shadow-sm dark:bg-slate-950 dark:text-slate-400">
                Last synced just now
              </p>
            </div>
            <UserTable
              users={paginatedUsers}
              onView={openUserDetails}
              onEdit={openEditUser}
              onDelete={openDeleteUser}
            />
            {!totalResults && (
              <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-300">
                No users match your current filters. Try broadening the search or resetting the role filter.
              </div>
            )}
            {showPagination && (
              <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
          </>
        )}

        <EditUserModal
          user={editUser}
          isOpen={isEditOpen}
          onClose={closeModals}
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
          onCancel={closeModals}
        />
        <UserDetailsModal
          user={selectedUser}
          isOpen={isViewOpen}
          onClose={closeModals}
        />
      </section>
    </MainLayout>
  );
}

export default UsersPage;
