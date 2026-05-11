import React from 'react';
import { Settings as SettingsIcon, Key, Globe, Bell, Shield, Save } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>
        <button className="btn btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* API Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-6 text-slate-800">
              <Key className="w-5 h-5 text-brand-600" />
              <h2 className="font-semibold">API Credentials</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">OpenAI API Key</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  value="••••••••••••••••••••••••••••••"
                  disabled
                />
                <p className="mt-1 text-xs text-slate-500">Configured via .env file</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gemini API Key</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  value="••••••••••••••••••••••••••••••"
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2 mb-6 text-slate-800">
              <Globe className="w-5 h-5 text-brand-600" />
              <h2 className="font-semibold">Webhook Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Success Webhook URL</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  placeholder="https://your-crm.com/webhooks/leads"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-6 text-slate-800">
              <Bell className="w-5 h-5 text-brand-600" />
              <h2 className="font-semibold">Notifications</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: 'New Lead Alert', enabled: true },
                { label: 'High Intent Priority', enabled: true },
                { label: 'System Errors', enabled: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${item.enabled ? 'bg-brand-600' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${item.enabled ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6 bg-slate-50 border-dashed border-2 border-slate-200">
            <div className="flex items-center gap-2 mb-2 text-slate-400">
              <Shield className="w-5 h-5" />
              <h2 className="font-semibold">Security</h2>
            </div>
            <p className="text-xs text-slate-500">
              Access logs and advanced security settings are managed by your administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
