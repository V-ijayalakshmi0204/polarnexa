import React from 'react';
import { useMission } from '../context/MissionContext';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export const NotificationBanner: React.FC = () => {
  const { activeNotification, clearNotification } = useMission();

  if (!activeNotification) return null;

  const icons = {
    info: <Info className="w-4 h-4 text-cyan-700 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />,
    alert: <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />,
    success: <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />,
  };

  const borders = {
    info: 'bg-cyan-50 border-cyan-200 text-cyan-950',
    warning: 'bg-amber-50 border-amber-200 text-amber-950',
    alert: 'bg-rose-50 border-rose-200 text-rose-950',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-950',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className={`p-4 rounded border shadow-lg flex items-start justify-between gap-3 ${borders[activeNotification.type]}`}>
        <div className="flex items-start gap-3 min-w-0">
          {icons[activeNotification.type]}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider">{activeNotification.title}</div>
            <p className="text-xs mt-0.5 leading-relaxed opacity-90">{activeNotification.message}</p>
          </div>
        </div>
        <button
          onClick={clearNotification}
          className="p-1 rounded hover:bg-black/5 transition-colors shrink-0 text-slate-500 hover:text-slate-800"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
