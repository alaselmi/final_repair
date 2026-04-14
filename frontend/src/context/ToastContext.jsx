import { createContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    const toast = { id, message, type };
    setToasts((current) => [...current, toast]);
    setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  };

  const value = useMemo(
    () => ({ toasts, addToast, removeToast }),
    [toasts]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export default ToastContext;
