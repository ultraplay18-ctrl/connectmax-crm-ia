import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export interface ToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
  autoHideDuration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  onClose,
  autoHideDuration = 5000,
}) => {
  useEffect(() => {
    if (!autoHideDuration) return;
    const timer = setTimeout(() => {
      onClose();
    }, autoHideDuration);
    return () => clearTimeout(timer);
  }, [autoHideDuration, onClose]);

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }[type];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }[type];

  const iconColors = {
    success: 'text-emerald-600',
    error: 'text-red-600',
    info: 'text-blue-600',
  }[type];

  return (
    <div className={`flex items-center justify-between gap-3 p-4 rounded-xl border shadow-lg text-xs font-medium backdrop-blur-md transition-all duration-300 ${bgStyles}`}>
      <div className="flex items-center gap-2.5">
        <Icon size={18} className={`shrink-0 ${iconColors}`} />
        <span>{message}</span>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};
