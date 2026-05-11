import React, { useEffect, useRef } from 'react';
import { clsx } from 'clsx';

const ActivityLog = ({ logs }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div 
      ref={scrollRef}
      className="absolute inset-0 overflow-y-auto bg-slate-900 p-4 font-mono text-[11px] leading-relaxed"
    >
      {logs.length === 0 ? (
        <div className="text-slate-600 italic">Waiting for pipeline execution...</div>
      ) : (
        <div className="space-y-1">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-3">
              <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
              <span className={clsx(
                "font-bold shrink-0 w-16 uppercase",
                log.level === 'error' ? "text-red-500" :
                log.level === 'warn' ? "text-amber-500" :
                log.level === 'ok' ? "text-green-500" :
                log.level === 'ai' ? "text-brand-400" : "text-slate-400"
              )}>
                {log.level}
              </span>
              <span className="text-brand-300 shrink-0">[{log.module}]</span>
              <span className="text-slate-300 break-words">{log.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
