import React, { useState } from 'react';
import { Send, Terminal } from 'lucide-react';
import SampleLoader from './SampleLoader';

const LeadForm = ({ onRun, isRunning }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onRun(formData);
  };

  const handleLoadSample = (sample) => {
    setFormData(sample);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="card">
      <div className="p-4 border-b border-slate-200">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-brand-600" />
          Lead Capture Terminal
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            placeholder="e.g. Alex Rivera"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Work Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            placeholder="alex@company.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Company</label>
            <input
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="Acme Inc"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Role</label>
            <input
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="CTO"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none"
            placeholder="How can we help you?"
          />
        </div>

        <button
          type="submit"
          disabled={isRunning}
          className="btn btn-primary w-full gap-2 py-3"
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Run Pipeline
            </>
          )}
        </button>
      </form>

      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <span className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Test Scenarios</span>
        <SampleLoader onLoad={handleLoadSample} />
      </div>
    </div>
  );
};

export default LeadForm;
