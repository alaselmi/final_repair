function Card({ title, description, children, className = '' }) {
  return (
    <div className={`group relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/95 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/80 dark:bg-slate-950/95 ${className}`}>
      {(title || description) && (
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            {title && <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h3>}
            {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
          </div>
          <span className="inline-flex h-3 w-16 rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-slate-500" />
        </div>
      )}
      {children}
    </div>
  );
}

export default Card;
