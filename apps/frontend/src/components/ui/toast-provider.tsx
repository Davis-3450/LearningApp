'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Toast } from './toast';

interface ToastContextType {
  showToast: (message: string, variant?: 'default' | 'destructive' | 'success') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastItem {
  id: string;
  message: string;
  variant: 'default' | 'destructive' | 'success';
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, variant: 'default' | 'destructive' | 'success' = 'default') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, message, variant };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            variant={toast.variant}
            onClose={() => removeToast(toast.id)}
          >
            {toast.message}
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  );
}