import React, { useState } from 'react';
import useLeads from '../../hooks/useLeads';
import { MoreHorizontal, ChevronRight, Filter } from 'lucide-react';
import { clsx } from 'clsx';

const CRMTable = () => {
  const [tierFilter, setTierFilter] = useState('');
  const { data, isLoading } = useLeads({ tier: tierFilter });

  const getTierClass = (tier) => {
    switch (tier) {
      case 'hot': return 'badge-hot';
      case 'warm': return 'badge-warm';
      case 'cold': return 'badge-cold';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex gap-2">
        <button 
          onClick={() => setTierFilter('')}
          className={clsx("btn btn-secondary px-3 py-1.5 text-xs", !tierFilter && "bg-slate-200")}
        >
          All
        </button>
        {['hot', 'warm', 'cold'].map(t => (
          <button 
            key={t}
            onClick={() => setTierFilter(t)}
            className={clsx("btn btn-secondary px-3 py-1.5 text-xs uppercase", tierFilter === t && "bg-slate-200")}
          >
            {t}
          </button>
        ))}
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Score</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tier</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Queue</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
            <th className="px-6 py-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {isLoading ? (
            <tr>
              <td colSpan="7" className="px-6 py-10 text-center text-slate-400 text-sm italic">Loading leads...</td>
            </tr>
          ) : data?.leads.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-10 text-center text-slate-400 text-sm italic">No leads found</td>
            </tr>
          ) : (
            data?.leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800 text-sm">{lead.name}</span>
                    <span className="text-xs text-slate-400">{lead.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-700">{lead.company}</span>
                    <span className="text-xs text-slate-400">{lead.role || 'No Role'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                    {lead.score}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={clsx("badge", getTierClass(lead.tier))}>
                    {lead.tier}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-700">{lead.routing_queue}</span>
                    <span className="text-[10px] text-brand-600 uppercase font-bold tracking-tighter">SLA: {lead.routing_sla}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CRMTable;
