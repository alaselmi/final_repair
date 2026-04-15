import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { fetchRepairs as fetchRepairsApi, createRepair as createRepairApi } from '../services/repairService';

const RepairsContext = createContext(null);

export function RepairsProvider({ children }) {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [filters, setFilters] = useState({ query: '', status: 'all' });
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadRepairs = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchRepairsApi();
      setRepairs(Array.isArray(data) ? data : []);
      setLastUpdated(Date.now());
    } catch (err) {
      setError(err.message || 'Unable to load repairs');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshRepairs = useCallback(async () => {
    await loadRepairs();
  }, [loadRepairs]);

  const createRepair = useCallback(
    async (payload) => {
      const created = await createRepairApi(payload);
      setRepairs((current) => [created, ...current]);
      return created;
    },
    []
  );

  useEffect(() => {
    loadRepairs();
    const interval = setInterval(() => {
      loadRepairs();
    }, 15000);

    return () => clearInterval(interval);
  }, [loadRepairs]);

  useEffect(() => {
    setPage(1);
  }, [filters.query, filters.status]);

  const filteredRepairs = useMemo(() => {
    const query = filters.query.toLowerCase().trim();
    return repairs.filter((repair) => {
      const title = repair.title?.toLowerCase() || '';
      const client = repair.client_name?.toLowerCase() || repair.client?.toLowerCase() || '';
      const description = repair.description?.toLowerCase() || '';
      const matchesQuery = query === '' || title.includes(query) || client.includes(query) || description.includes(query);
      const matchesStatus = filters.status === 'all' || (repair.status || 'pending').toLowerCase().includes(filters.status);
      return matchesQuery && matchesStatus;
    });
  }, [filters, repairs]);

  const totalItems = filteredRepairs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pageRepairs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRepairs.slice(start, start + pageSize);
  }, [filteredRepairs, page, pageSize]);

  const stats = useMemo(() => {
    return filteredRepairs.reduce(
      (acc, repair) => {
        const status = (repair.status || 'pending').toLowerCase();
        acc.total += 1;
        if (status.includes('done')) acc.completed += 1;
        else if (status.includes('progress')) acc.inProgress += 1;
        else acc.pending += 1;
        return acc;
      },
      { total: filteredRepairs.length, pending: 0, inProgress: 0, completed: 0 }
    );
  }, [filteredRepairs]);

  const value = {
    repairs,
    pageRepairs,
    filteredRepairs,
    loading,
    error,
    page,
    pageSize,
    filters,
    totalItems,
    totalPages,
    lastUpdated,
    setPage,
    setPageSize,
    setFilters,
    refreshRepairs,
    createRepair,
    loadRepairs,
    stats
  };

  return <RepairsContext.Provider value={value}>{children}</RepairsContext.Provider>;
}

export default RepairsContext;
