import { memo } from 'react';

function highlightMatch(text, query) {
  if (!query || !text) {
    return text;
  }

  const terms = query.trim().split(/\s+/).filter(Boolean);
  const regex = new RegExp(`(${terms.map((term) => term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})`, 'i');
  const parts = String(text).split(new RegExp(regex.source, 'gi'));

  return parts.map((part, index) => {
    const isMatch = regex.test(part);
    return isMatch ? (
      <span key={index} className="highlighted-text">
        {part}
      </span>
    ) : (
      <span key={index}>{part}</span>
    )
  );
}

function RepairTable({ repairs, loading, onRowSelect, search }) {
  const canShowEmpty = !loading && repairs.length === 0;
  const hasSearch = Boolean(search?.trim());

  if (loading) {
    return (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Device</th>
              <th>Brand</th>
              <th>Status</th>
              <th>Customer</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="skeleton-row">
                {Array.from({ length: 6 }).map((__, cellIndex) => (
                  <td key={cellIndex}>
                    <div className="skeleton" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (repairs.length === 0) {
    return (
      <div className="empty-state-card">
        <h3>No repairs available</h3>
        <p>
          {search
            ? 'No repairs match your search or selected filters. Try broadening the search or clearing the status filter.'
            : 'There are no repair requests yet. Create your first repair to get started.'}
        </p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Device</th>
            <th>Brand</th>
            <th>Status</th>
            <th>Customer</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {repairs.map((repair) => (
            <tr key={repair.id} onClick={() => onRowSelect(repair.id)}>
              <td data-label="ID">{repair.id}</td>
              <td data-label="Device">{highlightMatch(repair.device_type, search)}</td>
              <td data-label="Brand">{highlightMatch(repair.brand, search)}</td>
              <td data-label="Status">{highlightMatch(repair.status, search)}</td>
              <td data-label="Customer">{highlightMatch(repair.customer_name, search)}</td>
              <td data-label="Created">{new Date(repair.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default memo(RepairTable);
