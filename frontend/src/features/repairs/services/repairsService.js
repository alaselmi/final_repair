import { get, post } from "../../../shared/services/api";
export async function fetchRepairs() {
  const response = await get('/repairs');
  return response?.repairs ?? [];
}

export async function createRepair(payload) {
  const response = await post('/repairs', payload);
  return response?.repair ?? response;
}

export async function fetchRepairStats() {
  try {
    return get('/repairs/stats');
  } catch {
    const repairs = await fetchRepairs();
    const counts = repairs.reduce(
      (acc, item) => {
        const status = item.status?.toLowerCase() || 'pending';
        if (status.includes('done')) acc.completed += 1;
        else if (status.includes('progress')) acc.inProgress += 1;
        else acc.pending += 1;
        return acc;
      },
      { total: repairs.length, pending: 0, inProgress: 0, completed: 0 }
    );
    return counts;
  }
}
