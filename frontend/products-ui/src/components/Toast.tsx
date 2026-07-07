import { useEffect } from 'react';

export type ToastType = 'success' | 'error';

export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

const AUTO_DISMISS_MS = 4000;

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function Toast({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className={`toast toast-${toast.type}`} role="alert">
      <span>{toast.message}</span>
      <button type="button" className="toast-close" onClick={() => onDismiss(toast.id)} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
