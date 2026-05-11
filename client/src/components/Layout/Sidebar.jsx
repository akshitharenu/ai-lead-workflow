import React from 'react';
import { LayoutDashboard, Users, Zap, Settings, BarChart3, HelpCircle } from 'lucide-react';

const Sidebar = ({ activePage, onPageChange }) => {
  const items = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: Users, label: 'Leads', id: 'leads' },
    { icon: Zap, label: 'Automations', id: 'automations' },
    { icon: BarChart3, label: 'Analytics', id: 'analytics' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col">
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-brand-50 text-brand-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-200">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          <HelpCircle className="w-5 h-5 text-slate-400" />
          Help & Support
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
