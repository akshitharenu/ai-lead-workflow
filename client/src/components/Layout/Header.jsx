import React from 'react';
import { Zap, Bell, Search, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-800">
          Lead<span className="text-brand-600">Flow</span>
        </span>
        <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase">v1.0</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search leads..." 
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-64"
          />
        </div>
        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="h-8 w-px bg-slate-200 mx-2" />
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-none">Admin User</p>
            <p className="text-xs text-slate-500 mt-1">Enterprise Plan</p>
          </div>
          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
