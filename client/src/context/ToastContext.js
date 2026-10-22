import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

// Small pop-up messages ("toasts") that replace the browser's alert() boxes.
//
//   const toast = useToast();
//   toast.success('Post deleted');
//   toast.error('Could not delete the post');
//   toast.info('Log in to like this post');

const ToastContext = createContext(null);

const LOOKS = {
  success: { Icon: FaCheckCircle, bar: 'border-teal-500', icon: 'text-teal-500' },
  error: { Icon: FaExclamationCircle, bar: 'border-red-500', icon: 'text-red-500' },
  info: { Icon: FaInfoCircle, bar: 'border-brand-500', icon: 'text-brand-500' },
};

const MAX_VISIBLE = 4;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (type, message, duration) => {
      const id = ++nextId.current;
      // Keep only the newest few so a burst of errors never covers the page
      setToasts((current) => [...current.slice(-(MAX_VISIBLE - 1)), { id, type, message }]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  // useMemo keeps this object identical between renders, so components that
  // call useToast() don't re-render (or re-run effects) every time a toast appears.
  const toast = useMemo(
    () => ({
      success: (message) => show('success', message, 4000),
      error: (message) => show('error', message, 6000),
      info: (message) => show('info', message, 4000),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="fixed z-50 bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 sm:w-96 flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map(({ id, type, message }) => {
          const { Icon, bar, icon } = LOOKS[type];
          return (
            <div
              key={id}
              role={type === 'error' ? 'alert' : 'status'}
              className={`pointer-events-auto flex items-start gap-3 bg-white rounded-lg shadow-lg border border-gray-100 border-l-4 ${bar} px-4 py-3`}
            >
              <Icon className={`${icon} mt-0.5 shrink-0`} />
              <p className="text-sm text-gray-700 flex-1 break-words">{message}</p>
              <button
                onClick={() => dismiss(id)}
                aria-label="Dismiss message"
                className="text-gray-300 hover:text-gray-500 shrink-0"
              >
                <FaTimes />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};
