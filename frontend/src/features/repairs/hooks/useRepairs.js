import { useCallback, useEffect, useMemo, useState } from 'react';
import { createRepair as createRepairApi, fetchRepairs as fetchRepairsApi } from '../services/repairsService';

const FILTER_STORAGE_KEY = 'repairs_filters';

function useDebouncedValue(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function useRepairs() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [filters, setFilters] = useState(() => {
    if (typeof window === 'undefined') {
      return { query: '', status: 'all' };
    }

    try {
      const stored = JSON.parse(localStorage.getItem(FILTER_STORAGE_KEY));
      if (stored && typeof stored === 'object' && 'query' in stored && 'status' in stored) {
        return { query: stored.query || '', status: stored.status || 'all' };
      }
    } catch (err) {
      // ignore invalid storage content
    }

    return { query: '', status: 'all' };
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedQuery = useDebouncedValue(filters.query, 300);

  useEffect(() => {
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify({ query: filters.query, status: filters.status }));
  }, [filters.query, filters.status]);

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

  const retryLoad = useCallback(async () => {
    await loadRepairs();
  }, [loadRepairs]);

  const setQuery = useCallback((query) => {
    setFilters((prev) => ({ ...prev, query }));
  }, []);

  const setStatus = useCallback((status) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const handlePageSizeChange = useCallback((event) => {
    setPageSize(Number(event.target.value));
  }, []);

  const handlePageChange = useCallback((nextPage) => {
    setPage(nextPage);
  }, []);

  const openCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const createRepair = useCallback(
    async (payload) => {
      const created = await createRepairApi(payload);
      setRepairs((current) => [created, ...current]);
      return created;
    },
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;
    let intervalId;
    let currentInterval = 15000; // Start with 15s

    const poll = async () => {
      if (!isMounted) return;
      await loadRepairs();
      
      // Exponential backoff: 15s → 30s → 60s → 60s
      if (currentInterval < 60000) {
        currentInterval *= 2;
      }
    };

    // Initial load
    poll();

    // Set polling interval
    intervalId = window.setInterval(poll, currentInterval);

    return () => {
      isMounted = false;
      controller.abort();
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [loadRepairs]);

  useEffect(() => {
    setPage(1);
  }, [filters.query, filters.status]);

  const filteredRepairs = useMemo(() => {
    const query = debouncedQuery.toLowerCase().trim();

    return repairs.filter((repair) => {
      const title = repair.title?.toLowerCase() || '';
      const client = repair.client_name?.toLowerCase() || repair.client?.toLowerCase() || '';
      const description = repair.description?.toLowerCase() || '';
      const matchesQuery = query === '' || title.includes(query) || client.includes(query) || description.includes(query);
      const matchesStatus = filters.status === 'all' || (repair.status || 'pending').toLowerCase().includes(filters.status);
      return matchesQuery && matchesStatus;
    });
  }, [debouncedQuery, filters.status, repairs]);

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

  const visibleCount = Math.min(pageRepairs.length, totalItems);

  const stats = useMemo(
    () =>
      filteredRepairs.reduce(
        (acc, repair) => {
          const status = (repair.status || 'pending').toLowerCase();
          acc.total += 1;
          if (status.includes('done')) acc.completed += 1;
          else if (status.includes('progress')) acc.inProgress += 1;
          else acc.pending += 1;
          return acc;
        },
        { total: filteredRepairs.length, pending: 0, inProgress: 0, completed: 0 }
      ),
    [filteredRepairs]
  );

  return {
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
  };
}
