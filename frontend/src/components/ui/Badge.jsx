function Badge({ children, status = 'pending' }) {
  const variants = {
    pending: 'bg-amber-100 text-amber-700',
    'in progress': 'bg-sky-100 text-sky-700',
    done: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-emerald-100 text-emerald-700'
  };

  const normalized = status.toLowerCase();
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${variants[normalized] || variants.pending}`}>
      {status}
    </span>
  );
}

export default Badge;
