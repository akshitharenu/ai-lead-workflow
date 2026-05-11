import React from 'react';
import { Flame, Sun, Snowflake } from 'lucide-react';

const SAMPLES = [
  {
    id: 'hot',
    label: 'Hot Lead',
    icon: Flame,
    color: 'text-red-600',
    data: {
      name: 'Sarah Connor',
      email: 's.connor@sky-net.io',
      company: 'Resistance Tech',
      role: 'Operations Director',
      message: 'We need to upgrade our enterprise security pipeline immediately. We have a budget of $50k and need to start next week. Can we jump on a demo today?'
    }
  },
  {
    id: 'warm',
    label: 'Warm Lead',
    icon: Sun,
    color: 'text-orange-500',
    data: {
      name: 'Michael Scott',
      email: 'michael.s@dunder-mifflin.com',
      company: 'Dunder Mifflin',
      role: 'Regional Manager',
      message: 'I heard about your AI automation. We use a lot of paper and maybe this can help us save some time? Id like to learn more about the pricing for mid-sized teams.'
    }
  },
  {
    id: 'cold',
    label: 'Cold Lead',
    icon: Snowflake,
    color: 'text-blue-500',
    data: {
      name: 'Toby Flenderson',
      email: 'toby.f@hr-central.co',
      company: 'HR Solutions',
      role: 'HR Specialist',
      message: 'Just browsing. Not sure if we need this yet but keep me in the loop.'
    }
  }
];

const SampleLoader = ({ onLoad }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {SAMPLES.map((sample) => (
        <button
          key={sample.id}
          type="button"
          onClick={() => onLoad(sample.data)}
          className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white border border-slate-200 hover:border-brand-500 transition-colors group"
        >
          <sample.icon className={`w-4 h-4 ${sample.color} group-hover:scale-110 transition-transform`} />
          <span className="text-[10px] font-medium text-slate-600">{sample.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SampleLoader;
