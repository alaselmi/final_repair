import { createContext, useCallback, useContext, useRef, useState } from 'react';

const RepairCacheContext = createContext(null);

function buildCacheKey({ type = 'list', page = 1, limit = 10, status = '', search = '', id }) {
  if (type === 'detail') {
    return `detail|${id}`;
  }
  return `list|${page}|${limit}|${status}|${search}`;
}

export function RepairCacheProvider({ children }) {
  const cacheRef = useRef({});
  const inFlight = useRef({});
  const [filters, setFilters] = useState({ page: 1, limit: 10, status: '', search: '' });
  const [selectedRepairId, setSelectedRepairId] = useState(null);

  const getCacheEntry = useCallback((key) => cacheRef.current[key], []);

  const fetchCached = useCallback(async (fetcher, key, options = {}) => {
    const entry = getCacheEntry(key);

    if (entry?.response && options.staleWhileRevalidate) {
      if (!inFlight.current[key]) {
        inFlight.current[key] = fetcher()
          .then((freshResponse) => {
            cacheRef.current[key] = { response: freshResponse, timestamp: Date.now() };
            if (options.onUpdate) {
              options.onUpdate(freshResponse);
            }
            delete inFlight.current[key];
            return freshResponse;
          })
          .catch((error) => {
            delete inFlight.current[key];
            throw error;
          });
      }
      return entry.response;
    }

    if (entry?.response) {
      return entry.response;
    }

    if (inFlight.current[key]) {
      return inFlight.current[key];
    }

    const promise = fetcher()
      .then((response) => {
        cacheRef.current[key] = { response, timestamp: Date.now() };
        delete inFlight.current[key];
        return response;
      })
      .catch((error) => {
        delete inFlight.current[key];
        throw error;
      });

    inFlight.current[key] = promise;
    return promise;
  }, [getCacheEntry]);

  const fetchRepairsCached = useCallback(async (fetcher, params = {}, options = {}) => {
    const key = buildCacheKey({ type: 'list', ...params });
    return fetchCached(() => fetcher(params), key, options);
  }, [fetchCached]);

  const fetchRepairDetailsCached = useCallback(async (fetcher, id, options = {}) => {
    if (!id) {
      throw new Error('Missing repair id for detail cache');
    }
    const key = buildCacheKey({ type: 'detail', id });
    return fetchCached(() => fetcher(id), key, options);
  }, [fetchCached]);

  const invalidateListCache = useCallback(() => {
    Object.keys(cacheRef.current).forEach((key) => {
      if (key.startsWith('list|')) {
        delete cacheRef.current[key];
      }
    });
  }, []);

  const invalidateDetailCache = useCallback((id) => {
    if (id) {
      delete cacheRef.current[buildCacheKey({ type: 'detail', id })];
      return;
    }

    Object.keys(cacheRef.current).forEach((key) => {
      if (key.startsWith('detail|')) {
        delete cacheRef.current[key];
      }
    });
  }, []);

  const invalidateRepairCache = useCallback(() => {
    cacheRef.current = {};
  }, []);

  const updateCacheAfterCreate = useCallback((repair) => {
    if (!repair?.id) {
      return;
    }

    Object.entries(cacheRef.current).forEach(([key, entry]) => {
      if (!key.startsWith('list|')) {
        return;
      }

      const [, page, limit, statusFilter, searchFilter] = key.split('|');
      const lowerSearch = String(searchFilter || '').trim().toLowerCase();
      const matchesStatus = !statusFilter || String(repair.status || '').toLowerCase() === statusFilter;
      const matchesSearch =
        !lowerSearch ||
        [repair.device_type, repair.brand, repair.customer_name, repair.problem_description]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(lowerSearch);

      if (!matchesStatus || !matchesSearch) {
        return;
      }

      const repairs = entry.response?.data?.repairs;
      const meta = entry.response?.data?.meta;
      if (!Array.isArray(repairs)) {
        return;
      }

      cacheRef.current[key] = {
        ...entry,
        response: {
          ...entry.response,
          data: {
            ...entry.response.data,
            repairs: [repair, ...repairs],
            meta: {
              ...meta,
              total: (meta?.total || repairs.length) + 1,
            },
          },
        },
        timestamp: Date.now(),
      };
    });
  }, []);

  const updateCacheAfterStatusChange = useCallback((id, status) => {
    if (!id) {
      return;
    }

    Object.entries(cacheRef.current).forEach(([key, entry]) => {
      if (key.startsWith('list|') && Array.isArray(entry.response?.data?.repairs)) {
        cacheRef.current[key] = {
          ...entry,
          response: {
            ...entry.response,
            data: {
              ...entry.response.data,
              repairs: entry.response.data.repairs.map((repair) =>
                repair.id === id ? { ...repair, status } : repair
              ),
            },
          },
          timestamp: Date.now(),
        };
      }

      if (key === buildCacheKey({ type: 'detail', id })) {
        const cachedRepair = entry.response?.data?.repair;
        if (cachedRepair?.id === id) {
          cacheRef.current[key] = {
            ...entry,
            response: {
              ...entry.response,
              data: {
                ...entry.response.data,
                repair: { ...cachedRepair, status },
              },
            },
            timestamp: Date.now(),
          };
        }
      }
    });
  }, []);

  return (
    <RepairCacheContext.Provider
      value={{
        currentFilters: filters,
        setFilters,
        selectedRepairId,
        setSelectedRepairId,
        fetchRepairsCached,
        fetchRepairDetailsCached,
        invalidateRepairCache,
        invalidateListCache,
        invalidateDetailCache,
        updateCacheAfterCreate,
        updateCacheAfterStatusChange,
      }}
    >
      {children}
    </RepairCacheContext.Provider>
  );
}

export default function useRepairCache() {
  const context = useContext(RepairCacheContext);
  if (!context) {
    throw new Error('useRepairCache must be used within a RepairCacheProvider');
  }
  return context;
}
