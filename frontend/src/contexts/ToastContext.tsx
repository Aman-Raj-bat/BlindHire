import React, { createContext, useCallback, useContext, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type Toast = { id: string; type: ToastType; title: string; message?: string };
type ToastContextType = { addToast: (type: ToastType, title: string, message?: string) => void; removeToast: (id: string) => void };
const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const removeToast = useCallback((id: string) => setToasts((previous) => previous.filter((toast) => toast.id !== id)), []);
  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((previous) => [...previous, { id, type, title, message }]);
    window.setTimeout(() => setToasts((previous) => previous.filter((toast) => toast.id !== id)), 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-md flex-col gap-2 px-4" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => {
          const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? XCircle : toast.type === 'warning' ? AlertTriangle : Info;
          return <div key={toast.id} className="pointer-events-auto flex items-start gap-3 rounded-lg border border-[#252d4b] bg-[#0d1125] p-4 text-[#fffdf8] shadow-[0_20px_60px_rgba(17,22,43,0.22)]" role={toast.type === 'error' ? 'alert' : 'status'}><Icon size={19} className={toast.type === 'success' ? 'text-[#c8ef83]' : toast.type === 'error' ? 'text-[#ff7352]' : toast.type === 'warning' ? 'text-[#ffc25d]' : 'text-[#86d8ef]'} aria-hidden="true" /><div className="min-w-0 flex-1"><p className="text-sm font-bold">{toast.title}</p>{toast.message && <p className="mt-1 break-words text-xs leading-5 text-[#aab2ca]">{toast.message}</p>}</div><button type="button" className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-[#aab2ca] hover:bg-[#ffffff14] hover:text-[#fffdf8]" onClick={() => removeToast(toast.id)} aria-label={`Dismiss ${toast.title} notification`}><X size={15} aria-hidden="true" /></button></div>;
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}
