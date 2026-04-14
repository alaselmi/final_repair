import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CreateRepair from './CreateRepair';
import RepairDetails from './RepairDetails';
import useToast from '../hooks/useToast';
import useRepairCache from '../context/RepairCacheContext';
import DashboardLayout from './DashboardLayout';
import FiltersBar from './FiltersBar';
import AnalyticsCards from './AnalyticsCards';
import RepairTable from './RepairTable';
import Pagination from './Pagination';
import { getErrorMessage } from '../api';

const DEFAULT_PARAMS = {
  page: 1,
  limit: 10,
  status: '',
  search: '',
};

export default function DashboardPage({ user, onLogout, onFetchRepairs }) {
  const [repairs, setRepairs] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const { addToast } = useToast();
  const {
    currentFilters,
    setFilters,
    selectedRepairId,
    setSelectedRepairId,
    fetchRepairsCached,
    invalidateListCache,
    invalidateDetailCache,
    updateCacheAfterCreate,
    updateCacheAfterStatusChange,
  } = useRepairCache();
  const filters = useMemo(() => ({ ...DEFAULT_PARAMS, ...currentFilters }), [currentFilters]);
  const searching = searchTerm.trim() && searchTerm !== debouncedSearch;

  const analytics = useMemo(() => {
    const counts = { total: 0, pending: 0, inProgress: 0, completed: 0, revenue: 0 };
    counts.total = repairs.length;

    for (const repair of repairs) {
      const statusValue = String(repair.status || '').toLowerCase();
      if (statusValue === 'pending') counts.pending += 1;
      if (statusValue === 'in progress') counts.inProgress += 1;
      if (statusValue === 'completed') counts.completed += 1;
      counts.revenue += Number(repair.estimated_price || 0);
    }

    return counts;
  }, [repairs]);

  const prevAnalyticsRef = useRef(analytics);
  const [trend, setTrend] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    revenue: 0,
  });

  useEffect(() => {
    const previous = prevAnalyticsRef.current;
    setTrend({
      total: analytics.total - previous.total,
      pending: analytics.pending - previous.pending,
      inProgress: analytics.inProgress - previous.inProgress,
      completed: analytics.completed - previous.completed,
      revenue: analytics.revenue - previous.revenue,
    });
    prevAnalyticsRef.current = analytics;
  }, [analytics]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((meta.total || 0) / meta.limit)),
    [meta.limit, meta.total]
  );

  const loadRepairs = useCallback(
    async (params = filters) => {
      setLoading(true);

      try {
        const response = await fetchRepairsCached(onFetchRepairs, params, {
          staleWhileRevalidate: true,
          onUpdate: (freshResponse) => {
            setRepairs(freshResponse.data?.repairs || []);
            setMeta(
              freshResponse.meta || {
                total: 0,
                page: params.page,
                limit: params.limit,
              }
            );
          },
        });

        setRepairs(response.data?.repairs || []);
        setMeta(
          response.meta || {
            total: 0,
            page: params.page,
            limit: params.limit,
          }
        );
      } catch (fetchError) {
        addToast(getErrorMessage(fetchError), 'error');
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchRepairsCached, filters, onFetchRepairs]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      page: 1,
      search: debouncedSearch,
    }));
  }, [debouncedSearch, setFilters]);

  useEffect(() => {
    loadRepairs(filters);
  }, [filters, loadRepairs]);

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState !== 'visible' || selectedRepairId) {
        return;
      }
      loadRepairs(filters);
    };

    const interval = setInterval(refresh, 30000);
    const visibilityHandler = () => {
      if (document.visibilityState === 'visible') {
        refresh();
      }
    };

    document.addEventListener('visibilitychange', visibilityHandler);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', visibilityHandler);
    };
  }, [filters, loadRepairs, selectedRepairId]);

  const handleStatusChange = useCallback(
    (value) => {
      setFilters((current) => ({ ...current, page: 1, status: value }));
    },
    [setFilters]
  );

  const handlePageChange = useCallback(
    (page) => {
      setFilters((current) => ({ ...current, page }));
    },
    [setFilters]
  );

  const handleCreateSuccess = useCallback(
    async (repair) => {
      setShowCreate(false);
      invalidateListCache();
      const nextFilters = { ...filters, page: 1 };
      setFilters(nextFilters);
      if (repair?.id) {
        updateCacheAfterCreate(repair);
      }
      await loadRepairs(nextFilters);
    },
    [filters, invalidateListCache, loadRepairs, setFilters, updateCacheAfterCreate]
  );

  const handleRepairUpdated = useCallback(
    async (updatedRepair) => {
      setSelectedRepairId(null);
      if (updatedRepair?.id) {
        updateCacheAfterStatusChange(updatedRepair.id, updatedRepair.status);
      }
      invalidateListCache();
      invalidateDetailCache(updatedRepair?.id);
      await loadRepairs(filters);
    },
    [filters, invalidateDetailCache, invalidateListCache, loadRepairs, setSelectedRepairId, updateCacheAfterStatusChange]
  );

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchTerm('');
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await onLogout();
    } catch {
      // toast handled in AuthContext
    }
  }, [onLogout]);

  const handleRowSelect = useCallback(
    (repairId) => {
      setSelectedRepairId(repairId);
    },
    [setSelectedRepairId]
  );

  return (
    <DashboardLayout user={user} onLogout={handleLogout} onCreate={() => setShowCreate(true)}>
      <AnalyticsCards stats={analytics} trend={trend} />

      <FiltersBar
        search={searchTerm}
        onSearchChange={handleSearchChange}
        onSearchClear={handleSearchClear}
        status={filters.status}
        onStatusChange={handleStatusChange}
        searching={searching}
        total={meta.total}
        page={filters.page}
        totalPages={totalPages}
      />

      {showCreate && (
        <CreateRepair onClose={() => setShowCreate(false)} onCreated={handleCreateSuccess} />
      )}

      {selectedRepairId && (
        <RepairDetails
          repairId={selectedRepairId}
          role={user.role}
          onClose={() => setSelectedRepairId(null)}
          onUpdated={handleRepairUpdated}
        />
      )}

      <RepairTable
        repairs={repairs}
        loading={loading}
        onRowSelect={handleRowSelect}
        search={debouncedSearch}
        searching={searching}
      />

      <Pagination
        page={filters.page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        disabled={loading}
      />
    </DashboardLayout>
  );
}
