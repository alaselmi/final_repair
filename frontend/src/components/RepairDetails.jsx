import { useEffect, useState } from 'react';
import { getRepairById, updateRepairStatus, getErrorMessage } from '../api';
import useToast from '../hooks/useToast';
import hasRole from '../utils/hasRole';
import useRepairCache from '../context/RepairCacheContext';

const STATUS_OPTIONS = [
  'Pending',
  'In Progress',
  'Ready',
  'Delivered',
  'Completed',
];

export default function RepairDetails({ repairId, role, onClose, onUpdated }) {
  const [repair, setRepair] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();
  const { fetchRepairDetailsCached, updateCacheAfterStatusChange, invalidateDetailCache } = useRepairCache();

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const response = await fetchRepairDetailsCached(getRepairById, repairId, {
          staleWhileRevalidate: true,
        });
        if (!mounted) {
          return;
        }

        const currentRepair = response.data?.repair || response.data;
        setRepair(currentRepair);
        setStatus(currentRepair?.status || 'Pending');
      } catch (fetchError) {
        if (!mounted) {
          return;
        }
        addToast(getErrorMessage(fetchError), 'error');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [fetchRepairDetailsCached, repairId, addToast]);

  const handleUpdateStatus = async () => {
    if (!repair) {
      return;
    }

    const previousStatus = repair.status;
    setRepair({ ...repair, status });
    setSaving(true);

    try {
      await updateRepairStatus(repairId, status);
      updateCacheAfterStatusChange(repairId, status);
      invalidateDetailCache(repairId);
      addToast('Status updated', 'success');
      onUpdated({ id: repairId, status });
    } catch (fetchError) {
      setRepair({ ...repair, status: previousStatus });
      addToast(getErrorMessage(fetchError), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="card modal-card centered">
          Loading repair details…
        </div>
      </div>
    );
  }

  if (!repair) {
    return (
      <div className="modal-overlay">
        <div className="card modal-card empty-state-card">
          <p>Unable to display repair details at this time.</p>
          <button className="secondary" type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  const activeIndex = STATUS_OPTIONS.findIndex((option) => option === repair.status);

  return (
    <div className="modal-overlay">
      <div className="card modal-card">
        <div className="toolbar">
          <h2>Repair #{repair.id}</h2>
          <button className="secondary" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="timeline">
          {STATUS_OPTIONS.map((option, index) => {
            const completed = index < activeIndex;
            const active = index === activeIndex;
            return (
              <div
                key={option}
                className={`timeline-step ${completed ? 'completed' : ''} ${active ? 'active' : ''}`}>
                <div className="timeline-marker">{index + 1}</div>
                <div className="timeline-label">{option}</div>
              </div>
            );
          })}
        </div>

        <div className="card" style={{ marginTop: '16px' }}>
          <p>
            <strong>Device:</strong> {repair.device_type}
          </p>
          <p>
            <strong>Brand:</strong> {repair.brand}
          </p>
          <p>
            <strong>Problem:</strong> {repair.problem_description}
          </p>
          <p>
            <strong>Estimated price:</strong> ${Number(repair.estimated_price).toFixed(2)}
          </p>
          <p>
            <strong>Status:</strong> {repair.status}
          </p>
          <p>
            <strong>Customer:</strong> {repair.customer_name} ({repair.customer_email})
          </p>
          <p>
            <strong>Created:</strong> {new Date(repair.created_at).toLocaleString()}
          </p>
        </div>

        {hasRole({ role }, 'admin') && (
          <div className="card" style={{ marginTop: '16px' }}>
            <label>
              Update status
              <select value={status} onChange={(event) => setStatus(event.target.value)} disabled={saving}>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <button className="primary" type="button" onClick={handleUpdateStatus} disabled={saving}>
              {saving ? 'Saving…' : 'Save status'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
