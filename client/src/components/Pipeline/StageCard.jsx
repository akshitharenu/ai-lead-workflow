import React from 'react';
import { CheckCircle2, Circle, Clock, AlertCircle, Bot } from 'lucide-react';
import { clsx } from 'clsx';

const StageCard = ({ stage }) => {
  const { id, label, status, durationMs, ai } = stage;

  const getIcon = () => {
    switch (status) {
      case 'done': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'running': return <Clock className="w-5 h-5 text-amber-500 animate-spin" />;
      default: return <Circle className="w-5 h-5 text-slate-300" />;
    }
  };

  return (
    <div className={clsx(
      "flex items-start gap-4 transition-all duration-300",
      status === 'running' && "scale-[1.02] -translate-x-1",
      status === 'idle' && "opacity-60"
    )}>
      <div className="mt-1 relative z-10 bg-white">
        {getIcon()}
      </div>
      
      <div className={clsx(
        "flex-1 p-3 rounded-lg border transition-all",
        status === 'running' ? "bg-amber-50 border-amber-200 shadow-sm" :
        status === 'done' ? "bg-white border-slate-200 shadow-none" :
        status === 'error' ? "bg-red-50 border-red-200" : "bg-white border-transparent"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-800">{label}</span>
            {ai && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-brand-100 text-brand-700 text-[10px] font-bold rounded uppercase">
                <Bot className="w-2.5 h-2.5" /> AI
              </span>
            )}
          </div>
          {durationMs && (
            <span className="text-[10px] font-mono text-slate-400">{durationMs}ms</span>
          )}
        </div>
        
        {status === 'running' && (
          <p className="text-[10px] text-amber-600 font-medium mt-1">Processing data...</p>
        )}
        {status === 'error' && (
          <p className="text-[10px] text-red-600 font-medium mt-1">Stage failed</p>
        )}
      </div>
    </div>
  );
};

export default StageCard;
