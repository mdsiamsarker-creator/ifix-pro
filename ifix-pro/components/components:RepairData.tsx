
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { RepairRecord } from '../types';
import { ArrowLeft, Smartphone, PieChart, Activity, TrendingUp, Download, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RepairDataProps {
  onBack: () => void;
}

const RepairData: React.FC<RepairDataProps> = ({ onBack }) => {
  // Fix: Records must be managed via state as storageService.getRecords() returns a Promise
  const [records, setRecords] = useState<RepairRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const rec = await storageService.getRecords();
      setRecords(rec);
      setLoading(false);
    };
    loadData();
  }, []);

  const techStats = records.reduce((acc: any, r) => {
    acc[r.technician] = (acc[r.technician] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(techStats).map(([name, count]) => ({
    name,
    count
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  const stats = [
    { label: 'Total Units', value: records.length, icon: <Smartphone className="w-5 h-5" />, color: 'bg-blue-500' },
    { label: 'Completion Rate', value: `${records.length ? Math.round((records.filter(r => r.status !== 'Pending' && r.status !== 'Rejected').length / records.length) * 100) : 0}%`, icon: <TrendingUp className="w-5 h-5" />, color: 'bg-emerald-500' },
    { label: 'Daily Average', value: Math.round(records.length / 7) || records.length, icon: <Activity className="w-5 h-5" />, color: 'bg-purple-500' },
  ];

  const exportCSV = () => {
    const headers = ['IMEI', 'Model', 'Technician', 'Service', 'Status', 'Date'];
    const rows = records.map(r => [
      r.imei,
      r.device.model,
      r.technician,
      r.services.join(';'),
      r.status,
      new Date(r.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `warehouse_data_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

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
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Gate Repair Data</h1>
            <p className="text-slate-500">Warehouse performance and inventory stats</p>
          </div>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
            <div className={`${stat.color} p-4 rounded-2xl text-white`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-500" />
            Repairs per Technician
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold mb-8">Quick Summary</h2>
          <div className="space-y-6">
            {Object.entries(techStats).sort((a:any, b:any) => b[1] - a[1]).map(([name, count], i) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400">
                    {i + 1}
                  </div>
                  <span className="font-semibold text-slate-700">{name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: `${(Number(count) / records.length) * 100}%` }}
                    />
                  </div>
                  <span className="font-bold text-slate-900 w-8 text-right">{String(count)}</span>
                </div>
              </div>
            ))}
            {Object.keys(techStats).length === 0 && (
              <p className="text-center text-slate-400 py-12">No data available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairData;
