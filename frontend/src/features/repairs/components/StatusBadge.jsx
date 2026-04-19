import Badge from '../../../components/ui/Badge';

function StatusBadge({ status }) {
  const label = status?.toString() || 'Pending';
  return <Badge status={label} />;
}

export default StatusBadge;
