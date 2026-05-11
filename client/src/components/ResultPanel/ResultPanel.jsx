import React from 'react';
import { Mail, ShieldCheck, Zap, Info, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';

const ResultPanel = ({ result, status, onReset }) => {
  if (status === 'idle') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center text-slate-400">
        <Zap className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm font-medium">Pipeline results will appear here after execution</p>
      </div>
    );
  }

  if (status === 'running') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center p-10">
        <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-800">Analyzing Lead...</p>
        <p className="text-xs text-slate-500 mt-2">Claude 3.5 Sonnet is generating intelligence</p>
      </div>
    );
  }

  if (status === 'error' || !result) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
        <Info className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-sm font-semibold text-slate-800">Pipeline Failed</p>
        <p className="text-xs text-slate-500 mt-2">Please check the activity log for details</p>
        <button onClick={onReset} className="mt-4 text-brand-600 font-medium text-sm flex items-center gap-1">
          <RotateCcw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  const { scoring, routing, emailBody } = result;

  return (
    <div className="absolute inset-0 overflow-y-auto p-6 space-y-6 bg-white">
      {/* Scoring Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">AI Score</span>
          <span className="text-3xl font-bold text-slate-800">{scoring.score}/10</span>
        </div>
        <div className={clsx(
          "p-4 rounded-xl border text-center",
          scoring.tier === 'hot' ? "bg-red-50 border-red-100" :
          scoring.tier === 'warm' ? "bg-orange-50 border-orange-100" : "bg-blue-50 border-blue-100"
        )}>
          <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Assigned Tier</span>
          <span className={clsx(
            "text-xl font-bold uppercase",
            scoring.tier === 'hot' ? "text-red-600" :
            scoring.tier === 'warm' ? "text-orange-600" : "text-blue-600"
          )}>{scoring.tier}</span>
        </div>
      </div>

      {/* Routing Info */}
      <div className="card bg-slate-900 border-none p-4 text-white">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-brand-400" />
          <h3 className="font-semibold text-sm text-brand-100">Routing Decision</h3>
        </div>
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
          <div>
            <span className="text-slate-500 block mb-1">Queue</span>
            <span className="font-medium text-slate-200">{routing.queue}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-1">SLA</span>
            <span className="font-medium text-slate-200">{routing.sla}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-1">Priority</span>
            <span className="font-medium text-slate-200 uppercase">{routing.priority}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-1">Action</span>
            <span className="font-medium text-slate-200 uppercase">{routing.action.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* AI Intelligence */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">AI Summary</h3>
          <p className="text-sm text-slate-700 leading-relaxed italic">{scoring.summary}</p>
        </div>
        
        <div className="h-px bg-slate-100" />
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Generated Response</h3>
            <button className="text-[10px] font-bold text-brand-600 uppercase hover:underline">Copy Email</button>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 text-slate-400 mb-3 border-b border-slate-200 pb-2">
              <Mail className="w-3.5 h-3.5" />
              <span className="text-[10px]">TO: {result.email || 'Lead'}</span>
            </div>
            <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed font-sans">{emailBody}</p>
          </div>
        </div>
      </div>

      <button onClick={onReset} className="w-full btn btn-secondary gap-2 mt-4">
        <RotateCcw className="w-4 h-4" /> Process Another Lead
      </button>
    </div>
  );
};

export default ResultPanel;
