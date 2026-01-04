
import React, { useEffect, useState } from 'react';
import { Page, RepairRecord } from '../types';
import { 
  ClipboardList, 
  PackageCheck, 
  History, 
  BarChart3,
  Smartphone,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShoppingCart,
  Loader2
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
  const completed = records.filter(r => r.status !== 'Pending' && r.status !== 'Rejected').length;

  const menuItems = [
    { 
      id: Page.BulkUpload, 
      label: 'Buy a phone', 
      icon: <ShoppingCart className="w-8 h-8" />, 
      color: 'bg-indigo-600', 
      desc: 'Bulk upload stock (Model, GB, Color) from Excel' 
    },
    { 
      id: Page.RepairRequest, 
      label: 'Repair Request', 
      icon: <ClipboardList className="w-8 h-8" />, 
      color: 'bg-blue-500', 
      desc: 'Create new repair requests for technicians' 
    },
    { 
      id: Page.RepairReceive, 
      label: 'Repair Receive', 
      icon: <PackageCheck className="w-8 h-8" />, 
      color: 'bg-emerald-500', 
      desc: 'Mark repairs as received and update status' 
    },
    { 
      id: Page.RepairHistory, 
      label: 'Trace Repair History', 
      icon: <History className="w-8 h-8" />, 
      color: 'bg-amber-500', 
      desc: 'Search and track device repair timelines' 
    },
    { 
      id: Page.RepairData, 
      label: 'Get Repair Data', 
      icon: <BarChart3 className="w-8 h-8" />, 
      color: 'bg-purple-500', 
      desc: 'View warehouse analytics and reports' 
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Syncing with Warehouse Cloud...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Warehouse Dashboard</h1>
          <p className="text-slate-500">Real-time inventory monitoring</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Stock Items</p>
              <p className="text-xl font-bold">{stockCount}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending</p>
              <p className="text-xl font-bold">{pending}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="group relative flex flex-col items-start p-6 bg-white rounded-3xl shadow-sm border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all text-left overflow-hidden"
          >
            <div className={`${item.color} p-4 rounded-2xl text-white mb-6 group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{item.label}</h3>
            <p className="text-slate-500 text-sm">{item.desc}</p>
            <div className="absolute top-0 right-0 p-4 text-slate-100 group-hover:text-slate-200 transition-colors">
              <Smartphone className="w-16 h-16 opacity-10" />
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          Live Activity Feed
        </h2>
        <div className="space-y-4">
          {records.slice(0, 5).map((record, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl animate-slideUp" style={{animationDelay: `${i * 100}ms`}}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-slate-400 border border-slate-200">
                  {record.imei.slice(-2)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{record.device.model} <span className="text-slate-400 font-normal">({record.imei})</span></p>
                  <p className="text-sm text-slate-500">{record.technician} • {record.services.join(', ')}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  record.status === 'Pending' ? 'bg-blue-100 text-blue-600' :
                  record.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {record.status}
                </span>
                <p className="text-xs text-slate-400 mt-1">{new Date(record.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
          {records.length === 0 && (
            <p className="text-center py-12 text-slate-400">No activity logged in the system yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
