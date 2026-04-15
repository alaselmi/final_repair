import { useEffect } from 'react';

function ToastContainer({ message, type = 'info', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 3600);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const variants = {
    info: 'bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100',
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white'
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-[1.75rem] p-4 shadow-soft ${variants[type]}`}>
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium">{message}</p>
        <button type="button" onClick={onClose} className="text-white/80 hover:text-white">
          ✕
        </button>
      </div>
    </div>
  );
}

export default ToastContainer;
