function Modal({ title, isOpen, onClose, children, footer, size = 'md' }) {
  if (!isOpen) {
    return null;
  }

  const sizes = {
    sm: 'max-w-xl',
    md: 'max-w-3xl',
    lg: 'max-w-5xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-950/70 px-4 py-6 text-center sm:items-center">
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 inline-block w-full text-left align-middle">
        <div className={`mx-auto w-full ${sizes[size]} transform overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-900/10 transition duration-300 ease-out dark:bg-slate-950`} role="dialog" aria-modal="true">
          <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-5 dark:border-slate-800">
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
          <div className="px-6 py-6">{children}</div>
          {footer && <div className="border-t border-slate-200/80 px-6 py-4 dark:border-slate-800">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

export default Modal;
