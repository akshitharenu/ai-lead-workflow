import React from 'react';
import { Zap, ShieldCheck, Database, Target, MessageSquare, ArrowRight } from 'lucide-react';

const Automation = () => {
  const steps = [
    {
      title: 'Lead Validation',
      description: 'Checks email format, required fields, and basic spam filtering.',
      icon: ShieldCheck,
      status: 'Active',
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Data Enrichment',
      description: 'Retrieves company info, industry, and social profiles via AI search.',
      icon: Database,
      status: 'Active',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Intent Scoring',
      description: 'Uses LLM to analyze the message and assign Hot/Warm/Cold tiers.',
      icon: Target,
      status: 'Active',
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      title: 'AI Response Generation',
      description: 'Drafts a personalized reply based on the leads intent and profile.',
      icon: MessageSquare,
      status: 'Active',
      color: 'text-brand-600',
      bg: 'bg-brand-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Workflow Automation</h1>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-100">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          System Live
        </div>
      </div>

      <p className="text-slate-500 max-w-2xl">
        Your AI pipeline is configured to automatically process every incoming lead through the following sequence. 
        Each step uses specialized AI modules to ensure maximum conversion.
      </p>

      <div className="grid grid-cols-1 gap-4">
        {steps.map((step, index) => (
          <div key={step.title} className="card p-5 flex items-center gap-6 hover:border-brand-300 transition-colors">
            <div className={`p-4 rounded-xl ${step.bg}`}>
              <step.icon className={`w-6 h-6 ${step.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-slate-800">{step.title}</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">Step {index + 1}</span>
              </div>
              <p className="text-sm text-slate-500">{step.description}</p>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                <p className="text-sm font-semibold text-green-600">{step.status}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300" />
            </div>
          </div>
        ))}
      </div>

      <div className="card p-8 bg-brand-900 text-white overflow-hidden relative">
        <div className="relative z-10 space-y-4">
          <h2 className="text-xl font-bold">Custom Automation Rules</h2>
          <p className="text-brand-100 text-sm max-w-md">
            Want to add custom routing or third-party CRM integrations? 
            You can configure advanced conditional logic in the next update.
          </p>
          <button className="bg-white text-brand-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-50 transition-colors">
            Request Custom Module
          </button>
        </div>
        <Zap className="absolute -right-8 -bottom-8 w-48 h-48 text-white opacity-5" />
      </div>
    </div>
  );
};

export default Automation;
