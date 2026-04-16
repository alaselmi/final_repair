function Modal({ title, isOpen, onClose, children, footer }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 px-4 py-6 sm:items-center">
      <div className="absolute inset-0 animate-modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-950 animate-modal-enter transition-all duration-300">
        <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-5 dark:border-slate-800">
          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
        {footer && <div className="border-t border-slate-200/80 px-6 py-4 dark:border-slate-800">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
