import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useApp();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast) return null;

  const styles = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200',
      text: 'text-emerald-800',
      icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: <Info className="h-5 w-5 text-blue-600" />,
    }
  };

  const currentStyle = styles[toast.type] || styles.info;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-fade-in">
      <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${currentStyle.bg} ${currentStyle.text}`}>
        <div className="shrink-0 mt-0.5">{currentStyle.icon}</div>
        <div className="flex-1 text-sm font-medium leading-normal pr-2">
          {toast.message}
        </div>
        <button
          onClick={hideToast}
          className="shrink-0 text-slate-400 hover:text-slate-600 rounded-lg p-0.5 hover:bg-black/5 transition-colors"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
