import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AuthContext from '../../../context/AuthContext';
import { deleteUser, fetchUsers, updateUser } from '../services/usersService';

export default function useUsers() {
  const auth = useContext(AuthContext);
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

  const handleSearchChange = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  const handleRoleFilterChange = useCallback((event) => {
    setRoleFilter(event.target.value);
  }, []);

  const handlePageSizeChange = useCallback((event) => {
    setPageSize(Number(event.target.value));
  }, []);

  const handlePageChange = useCallback((nextPage) => {
    setPage(nextPage);
  }, []);

  // const isAdmin = auth.user?.role === 'admin'; // Removed: trust backend

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setLoading(true);
      setError('');

      try {
        const data = await fetchUsers(page, pageSize);
        if (!cancelled) {
          setUsers(data.users || []);
          // Note: total is available in data.total for future pagination
        }
      } catch (err) {
        if (!cancelled) {
          if (err.message.includes('Forbidden')) {
            setError('You do not have permission to manage users');
            setUsers([]);
          } else {
            setError(err.message);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, [page, pageSize]);

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
  const totalResults = filteredUsers.length;
  const showPagination = totalResults > pageSize;

  const adminCount = useMemo(() => users.filter((user) => user.role === 'admin').length, [users]);
  const technicianCount = useMemo(() => users.filter((user) => user.role === 'technician').length, [users]);
  const userCount = useMemo(() => users.filter((user) => user.role === 'user').length, [users]);

  const stats = useMemo(
    () => ({ total: users.length, admin: adminCount, technician: technicianCount, customer: userCount }),
    [users.length, adminCount, technicianCount, userCount]
  );

  function openUserDetails(user) {
    setSelectedUser(user);
    setIsViewOpen(true);
  }

  function openEditUser(user) {
    setEditUser(user);
    setIsEditOpen(true);
  }

  function openDeleteUser(user) {
    setDeleteTarget(user);
    setIsDeleteOpen(true);
  }

  function closeModals() {
    setIsViewOpen(false);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setSelectedUser(null);
    setEditUser(null);
    setDeleteTarget(null);
  }

  async function handleSave(updatedUser) {
    setError('');

    try {
      const saved = await updateUser(updatedUser.id, updatedUser);
      setUsers((current) => current.map((user) => (user.id === saved.id ? saved : user)));
      return saved;
    } catch (err) {
      setError(err.message || 'Unable to update user.');
      throw err;
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
    } catch (err) {
      setError(err.message || 'Unable to delete user.');
      throw err;
    } finally {
      setDeleteTarget(null);
      setIsDeleteOpen(false);
    }
  }

  return {
    auth,
    isAdmin,
    users,
    loading,
    error,
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
    adminCount,
    technicianCount,
    userCount,
    openUserDetails,
    openEditUser,
    openDeleteUser,
    closeModals,
    handleSave,
    handleDeleteConfirm,
  };
}
