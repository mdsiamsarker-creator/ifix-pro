import React, { useEffect, useState } from 'react';
import { Page, RepairRecord } from '../types';
import { 
  ClipboardList, 
  PackageCheck, 
  History, 
  BarChart3,
  Smartphone,
  Clock,
  AlertCircle,
  ShoppingCart,
  Loader2,
  Box,
  Settings
} from 'lucide-react';
import { storageService } from '../services/storageService';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [records, setRecords] = useState<RepairRecord[]>([]);
  const [stockCount, setStockCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [rec, stock] = await Promise.all([
        storageService.getRecords(),
        storageService.getMasterInventory()
      ]);
      setRecords(rec);
      setStockCount(stock.length);
      setLoading(false);
    };
    loadData();
  }, []);

  const pending = records.filter(r => r.status === 'Pending').length;

  const menuItems = [
    { 
      id: Page.BulkUpload, 
      label: 'Buy a phone', 
      icon: <ShoppingCart className="w-8 h-8" />, 
      color: 'bg-indigo-600', 
      desc: 'Bulk upload stock from Excel' 
    },
    { 
      id: Page.RepairRequest, 
      label: 'Repair Request', 
      icon: <ClipboardList className="w-8 h-8" />, 
      color: 'bg-blue-500', 
      desc: 'Assign units to technicians' 
    },
    { 
      id: Page.RepairReceive, 
      label: 'Repair Receive', 
      icon: <PackageCheck className="w-8 h-8" />, 
      color: 'bg-emerald-500', 
      desc: 'Scan units back into stock' 
    },
    { 
      id: Page.Inventory, 
      label: 'Parts Inventory', 
      icon: <Box className="w-8 h-8" />, 
      color: 'bg-rose-500', 
      desc: 'Track screens, batteries & more' 
    },
    { 
      id: Page.RepairHistory, 
      label: 'Trace Repair', 
      icon: <History className="w-8 h-8" />, 
      color: 'bg-amber-500', 
      desc: 'Search device repair lifecycle' 
    },
    { 
      id: Page.RepairData, 
      label: 'Repair Data', 
      icon: <BarChart3 className="w-8 h-8" />, 
      color: 'bg-purple-500', 
      desc: 'Warehouse analytics & reports' 
    },
    { 
      id: Page.Settings, 
      label: 'Settings', 
      icon: <Settings className="w-8 h-8" />, 
      color: 'bg-slate-600', 
      desc: 'Manage staff & services' 
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium tracking-wide">Connecting to Warehouse Cloud...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Warehouse Dashboard</h1>
          <p className="text-slate-500">Inventory Status & Live Operations</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Total Stock</p>
              <p className="text-xl font-bold text-indigo-600">{stockCount}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-rose-100 rounded-xl text-rose-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Waitlist</p>
              <p className="text-xl font-bold text-rose-600">{pending}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="group relative flex flex-col items-start p-6 bg-white rounded-3xl shadow-sm border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all text-left overflow-hidden"
          >
            <div className={`${item.color} p-4 rounded-2xl text-white mb-6 group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{item.label}</h3>
            <p className="text-slate-400 text-xs font-medium leading-relaxed">{item.desc}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          Live Activity Feed
        </h2>
        <div className="space-y-3">
          {records.slice(0, 5).map((record, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-slideUp" style={{animationDelay: `${i * 100}ms`}}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-bold text-slate-400 border border-slate-100 shadow-sm">
                  {record.imei.slice(-2)}
                </div>
                <div>
                  <p className="font-bold text-slate-900 leading-none mb-1">{record.device.model} <span className="text-slate-400 font-medium">({record.imei})</span></p>
                  <p className="text-xs text-slate-500 font-medium">{record.technician} • {record.services.join(', ')}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                  record.status === 'Pending' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                  record.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                }`}>
                  {record.status}
                </span>
                <p className="text-[10px] text-slate-400 mt-1 font-bold">{new Date(record.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
          {records.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Waiting for incoming repairs...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
