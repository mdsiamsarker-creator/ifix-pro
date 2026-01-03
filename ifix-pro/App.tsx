
import React, { useState } from 'react';
import { Page } from './types';
import Dashboard from './components/Dashboard';
import RepairRequest from './components/RepairRequest';
import RepairReceive from './components/RepairReceive';
import RepairHistory from './components/RepairHistory';
import RepairData from './components/RepairData';
import BulkUpload from './components/BulkUpload';
import { Smartphone } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard onNavigate={setCurrentPage} />;
      case Page.RepairRequest:
        return <RepairRequest onBack={() => setCurrentPage(Page.Dashboard)} />;
      case Page.RepairReceive:
        return <RepairReceive onBack={() => setCurrentPage(Page.Dashboard)} />;
      case Page.RepairHistory:
        return <RepairHistory onBack={() => setCurrentPage(Page.Dashboard)} />;
      case Page.RepairData:
        return <RepairData onBack={() => setCurrentPage(Page.Dashboard)} />;
      case Page.BulkUpload:
        return <BulkUpload onBack={() => setCurrentPage(Page.Dashboard)} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => setCurrentPage(Page.Dashboard)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <Smartphone className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 uppercase">
              iFix <span className="text-blue-600">Pro</span>
            </span>
          </button>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
            <button 
              onClick={() => setCurrentPage(Page.Dashboard)}
              className={`${currentPage === Page.Dashboard ? 'text-blue-600' : 'hover:text-slate-900'} transition-colors`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setCurrentPage(Page.BulkUpload)}
              className={`${currentPage === Page.BulkUpload ? 'text-indigo-600' : 'hover:text-slate-900'} transition-colors`}
            >
              Buy Phone
            </button>
            <button 
              onClick={() => setCurrentPage(Page.RepairHistory)}
              className={`${currentPage === Page.RepairHistory ? 'text-blue-600' : 'hover:text-slate-900'} transition-colors`}
            >
              History
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2 text-slate-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              Live Warehouse System
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        {renderPage()}
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200 mt-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 opacity-40 grayscale hover:grayscale-0 transition-all">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            <span className="font-bold text-sm tracking-widest uppercase">Warehouse Monitoring System v2.1</span>
          </div>
          <p className="text-sm font-medium">Built for Speed & Accuracy</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
