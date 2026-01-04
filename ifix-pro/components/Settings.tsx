import React from 'react';
import { ArrowLeft, Users, Wrench, Shield, ChevronRight, PlusCircle, Database, Bell } from 'lucide-react';
import { TECHNICIANS, SERVICES } from '../types';

interface SettingsProps {
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Warehouse Config</h1>
          <p className="text-slate-500 font-medium tracking-tight">Personnel & Operations Management</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <aside className="lg:col-span-4 space-y-3">
          {[
            { id: 'staff', label: 'Technicians & Teams', icon: <Users className="w-5 h-5" />, active: true },
            { id: 'services', label: 'Service Catalog', icon: <Wrench className="w-5 h-5" /> },
            { id: 'database', label: 'Cloud Sync Status', icon: <Database className="w-5 h-5" /> },
            { id: 'security', label: 'Access Control', icon: <Shield className="w-5 h-5" /> },
            { id: 'alerts', label: 'System Alerts', icon: <Bell className="w-5 h-5" /> },
          ].map(item => (
            <button
              key={item.id}
              className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all border ${
                item.active 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`${item.active ? 'text-blue-400' : 'text-slate-400'}`}>
                  {item.icon}
                </div>
                <span className="font-bold">{item.label}</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${item.active ? 'text-slate-400' : 'text-slate-200'}`} />
            </button>
          ))}
        </aside>

        <main className="lg:col-span-8 space-y-8">
          <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Staff Directory
              </h2>
              <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline">
                <PlusCircle className="w-4 h-4" /> Add New Staff
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TECHNICIANS.map(tech => (
                <div key={tech.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-blue-600 shadow-sm border border-slate-100 uppercase">
                    {tech.name.split(' ')[0][0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{tech.name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tech.team} Team</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-8">
              <Wrench className="w-5 h-5 text-amber-500" />
              Standard Service List
            </h2>
            <div className="flex flex-wrap gap-2">
              {SERVICES.map(service => (
                <div key={service} className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-600 hover:border-amber-300 hover:text-amber-600 transition-all cursor-default">
                  {service}
                </div>
              ))}
              <button className="px-4 py-2 border border-dashed border-slate-300 rounded-xl text-slate-400 text-xs font-bold hover:bg-slate-50 transition-all">
                + Add Custom Service
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Settings;
