function Button({ children, className = '', variant = 'primary', ...props }) {
  const styles = {
    primary: 'bg-sky-600 text-white shadow-sky-500/20 hover:bg-sky-700',
    secondary: 'bg-slate-100 text-slate-900 shadow-slate-200/60 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:shadow-slate-950/40 dark:hover:bg-slate-700',
    danger: 'bg-rose-500 text-white shadow-rose-500/20 hover:bg-rose-600'
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition duration-300 ease-out ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
