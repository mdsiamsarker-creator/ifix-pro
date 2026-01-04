import React, { useState } from 'react';
import { Page } from './types';
import Dashboard from './components/Dashboard';
import RepairRequest from './components/RepairRequest';
import RepairReceive from './components/RepairReceive';
import RepairHistory from './components/RepairHistory';
import RepairData from './components/RepairData';
import BulkUpload from './components/BulkUpload';
import Inventory from './components/Inventory';
import Settings from './components/Settings';
import { Smartphone, LayoutGrid, Package, Settings as SettingsIcon, BarChart3, History, ClipboardList, PackageCheck } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);

  const navigate = (page: Page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard onNavigate={navigate} />;
      case Page.RepairRequest:
        return <RepairRequest onBack={() => navigate(Page.Dashboard)} />;
      case Page.RepairReceive:
        return <RepairReceive onBack={() => navigate(Page.Dashboard)} />;
      case Page.RepairHistory:
        return <RepairHistory onBack={() => navigate(Page.Dashboard)} />;
      case Page.RepairData:
        return <RepairData onBack={() => navigate(Page.Dashboard)} />;
      case Page.BulkUpload:
        return <BulkUpload onBack={() => navigate(Page.Dashboard)} />;
      case Page.Inventory:
        return <Inventory onBack={() => navigate(Page.Dashboard)} />;
      case Page.Settings:
        return <Settings onBack={() => navigate(Page.Dashboard)} />;
      default:
        return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 font-sans flex flex-col">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(Page.Dashboard)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="bg-slate-900 p-1.5 rounded-lg text-white shadow-lg shadow-slate-200">
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900 uppercase">
              iFix <span className="text-blue-600">Pro</span>
            </span>
          </button>
          
          <div className="hidden lg:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <button 
              onClick={() => navigate(Page.Dashboard)}
              className={`flex items-center gap-2 ${currentPage === Page.Dashboard ? 'text-blue-600' : 'hover:text-slate-900'} transition-colors`}
            >
              <LayoutGrid className="w-4 h-4" />
              Overview
            </button>
            <button 
              onClick={() => navigate(Page.Inventory)}
              className={`flex items-center gap-2 ${currentPage === Page.Inventory ? 'text-blue-600' : 'hover:text-slate-900'} transition-colors`}
            >
              <Package className="w-4 h-4" />
              Inventory
            </button>
            <button 
              onClick={() => navigate(Page.Settings)}
              className={`flex items-center gap-2 ${currentPage === Page.Settings ? 'text-blue-600' : 'hover:text-slate-900'} transition-colors`}
            >
              <SettingsIcon className="w-4 h-4" />
              Config
            </button>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2 text-emerald-500">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              Warehouse Live
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8 md:py-10">
        {renderPage()}
      </main>

      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50">
        <button onClick={() => navigate(Page.Dashboard)} className={`p-2 ${currentPage === Page.Dashboard ? 'text-blue-600' : 'text-slate-400'}`}>
          <LayoutGrid className="w-6 h-6" />
        </button>
        <button onClick={() => navigate(Page.RepairRequest)} className={`p-2 ${currentPage === Page.RepairRequest ? 'text-blue-600' : 'text-slate-400'}`}>
          <ClipboardList className="w-6 h-6" />
        </button>
        <button onClick={() => navigate(Page.RepairReceive)} className={`p-2 ${currentPage === Page.RepairReceive ? 'text-blue-600' : 'text-slate-400'}`}>
          <PackageCheck className="w-6 h-6" />
        </button>
        <button onClick={() => navigate(Page.Inventory)} className={`p-2 ${currentPage === Page.Inventory ? 'text-blue-600' : 'text-slate-400'}`}>
          <Package className="w-6 h-6" />
        </button>
      </div>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200 mt-20 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 opacity-30 grayscale">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            <span className="font-black text-[10px] tracking-[0.2em] uppercase text-slate-600">iFix-Pro Global Warehouse Suite v3.0</span>
          </div>
          <div className="text-[10px] font-bold text-slate-500">
            SECURE CLOUD SYNC ACTIVE
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
