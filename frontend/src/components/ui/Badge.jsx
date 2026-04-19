function Badge({ children, status = 'pending', className = '' }) {
  const normalized = status.toString().toLowerCase();
  const variants = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-200',
    'in progress': 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-200',
    done: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200',
    completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200',
    admin: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-200',
    technician: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200',
    user: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-200',
    guest: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${variants[normalized] || variants.neutral} ${className}`}>
      {children || status}
    </span>
  );
}

export default Badge;
