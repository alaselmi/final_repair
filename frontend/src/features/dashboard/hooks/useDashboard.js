import useRepairs from '../../repairs/hooks/useRepairs';

/**
 * Dashboard hook - wraps repairs state
 * Isolates dashboard from direct repairs feature dependency
 */
export default function useDashboard() {
  const repairs = useRepairs();

  return {
    stats: repairs.stats,
    loading: repairs.loading,
    error: repairs.error,
  };
}
