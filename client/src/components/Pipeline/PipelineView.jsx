import React from 'react';
import StageCard from './StageCard';
import { Activity } from 'lucide-react';

const PipelineView = ({ stages, currentStatus }) => {
  return (
    <div className="card h-full flex flex-col">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-600" />
          Live Pipeline Monitor
        </h2>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            currentStatus === 'running' ? 'bg-amber-500 animate-pulse' : 
            currentStatus === 'done' ? 'bg-green-500' : 'bg-slate-300'
          }`} />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {currentStatus}
          </span>
        </div>
      </div>

      <div className="flex-1 p-6 relative overflow-y-auto">
        {/* Connection Line */}
        <div className="pipeline-connector" />
        
        <div className="space-y-6 relative z-10">
          {stages.map((stage, idx) => (
            <StageCard 
              key={stage.id} 
              stage={stage} 
              isLast={idx === stages.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PipelineView;
