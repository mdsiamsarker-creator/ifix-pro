
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { RepairRecord } from '../types';
import { ArrowLeft, Search, Smartphone, Calendar, User, Tag, Loader2 } from 'lucide-react';

interface RepairHistoryProps {
  onBack: () => void;
}

const RepairHistory: React.FC<RepairHistoryProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [records, setRecords] = useState<RepairRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storageService.getRecords().then(data => {
      setRecords(data);
      setLoading(false);
    });
  }, []);
  
  const filteredRecords = records.filter(r => 
    r.imei.includes(searchTerm) || 
    r.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.device.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Trace Repair History</h1>
          <p className="text-slate-500">Searching global warehouse records</p>
        </div>
      </header>

      <div className="relative group max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
        <input
          type="text"
          placeholder="Enter IMEI or Technician Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none ring-amber-500 focus:ring-2 transition-all shadow-sm"
        />
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecords.map((record) => (
            <div key={record.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all animate-slideUp">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{record.device.model}</h3>
                    <p className="text-sm font-mono text-slate-500">{record.imei}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  record.status === 'Pending' ? 'bg-blue-100 text-blue-600' :
                  record.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {record.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{record.technician}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="col-span-2 flex items-center gap-2 text-sm text-slate-600">
                  <Tag className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{record.services.join(', ')}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">REF: {record.referenceNo}</span>
                {record.receivedAt && (
                  <span className="text-emerald-600 font-bold">
                    Received: {new Date(record.receivedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
          {filteredRecords.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">No records found for your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RepairHistory;
