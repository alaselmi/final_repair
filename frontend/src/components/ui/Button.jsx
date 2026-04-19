function Button({ children, className = '', variant = 'primary', fullWidth = false, ...props }) {
  const baseStyles = 'inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

  const variants = {
    primary: 'bg-sky-600 text-white shadow-sky-500/20 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400',
    secondary: 'bg-slate-100 text-slate-900 shadow-slate-200/60 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:shadow-slate-950/40 dark:hover:bg-slate-700',
    danger: 'bg-rose-500 text-white shadow-rose-500/20 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
