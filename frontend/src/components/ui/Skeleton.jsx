function Skeleton({ className = 'h-4 w-full', ...props }) {
  return <span className={`block animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800 ${className}`} {...props} />;
}

export default Skeleton;
