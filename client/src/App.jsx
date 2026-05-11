import React, { useState } from 'react';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import LeadForm from './components/LeadForm/LeadForm';
import PipelineView from './components/Pipeline/PipelineView';
import ActivityLog from './components/ActivityLog/ActivityLog';
import ResultPanel from './components/ResultPanel/ResultPanel';
import CRMTable from './components/CRMTable/CRMTable';
import Analytics from './components/Views/Analytics';
import Automation from './components/Views/Automation';
import Settings from './components/Views/Settings';
import usePipeline from './hooks/usePipeline';

const App = () => {
  const { run, stages, logs, result, status, reset } = usePipeline();
  const [activeTab, setActiveTab] = useState('log');
  const [activePage, setActivePage] = useState('dashboard');

  const renderContent = () => {
    switch (activePage) {
      case 'analytics':
        return <Analytics />;
      case 'automations':
        return <Automation />;
      case 'settings':
        return <Settings />;
      case 'leads':
        return (
          <div className="card">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">Complete Lead Inventory</h2>
            </div>
            <CRMTable />
          </div>
        );
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            {/* Top Grid: Form, Pipeline, Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left: Lead Form */}
              <div className="lg:col-span-3 space-y-6">
                <LeadForm onRun={run} isRunning={status === 'running'} />
              </div>

              {/* Center: Pipeline Visualization */}
              <div className="lg:col-span-4">
                <PipelineView stages={stages} currentStatus={status} />
              </div>

              {/* Right: Activity & Results */}
              <div className="lg:col-span-5 flex flex-col h-[600px]">
                <div className="card flex-1 flex flex-col">
                  <div className="flex border-b border-slate-200">
                    <button
                      onClick={() => setActiveTab('log')}
                      className={`px-6 py-3 font-medium text-sm transition-colors ${
                        activeTab === 'log' 
                          ? 'text-brand-600 border-b-2 border-brand-600' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Activity Log
                    </button>
                    <button
                      onClick={() => setActiveTab('result')}
                      className={`px-6 py-3 font-medium text-sm transition-colors ${
                        activeTab === 'result' 
                          ? 'text-brand-600 border-b-2 border-brand-600' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Result
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-hidden relative">
                    {activeTab === 'log' ? (
                      <ActivityLog logs={logs} />
                    ) : (
                      <ResultPanel result={result} status={status} onReset={reset} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: CRM Table (Recent) */}
            <div className="card">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="font-semibold text-slate-800">Recent Leads (CRM)</h2>
              </div>
              <CRMTable />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage={activePage} onPageChange={setActivePage} />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="max-w-[1600px] mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
