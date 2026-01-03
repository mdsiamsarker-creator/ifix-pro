
import React, { useState, useRef } from 'react';
import { TECHNICIANS, RepairStatus, RepairRecord } from '../types';
import { ArrowLeft, ScanLine, Smartphone, AlertCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { storageService } from '../services/storageService';

interface RepairReceiveProps {
  onBack: () => void;
}

const RepairReceive: React.FC<RepairReceiveProps> = ({ onBack }) => {
  const [selectedTech, setSelectedTech] = useState<string>('');
  const [isRejected, setIsRejected] = useState<boolean>(false);
  const [imeiInput, setImeiInput] = useState<string>('');
  const [lastProcessed, setLastProcessed] = useState<{record: RepairRecord; message: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const imeiInputRef = useRef<HTMLInputElement>(null);

  const calculateDefaultStatus = (service: string): RepairStatus => {
    switch (service.toLowerCase()) {
      case 'rework': return 'Reworked';
      case 'opening': return 'Opened';
      case 'closing': return 'Closed';
      case 'checking': return 'Checked';
      default: return 'Repaired';
    }
  };

  const handleReceive = async () => {
    setError(null);
    setLastProcessed(null);

    if (!selectedTech) {
      setError("Please select a technician first.");
      return;
    }

    const imei = imeiInput.trim();
    if (!imei) return;

    setIsLoading(true);
    const record = await storageService.getPendingByIMEIAndTech(imei, selectedTech);

    if (!record) {
      setError(`No pending repair found for IMEI ${imei} assigned to ${selectedTech}.`);
      setImeiInput('');
      setIsLoading(false);
      return;
    }

    let finalStatus: RepairStatus;
    if (isRejected) {
      finalStatus = 'Rejected';
    } else {
      finalStatus = calculateDefaultStatus(record.services[0]);
    }

    const updatedRecord: RepairRecord = {
      ...record,
      status: finalStatus,
      receivedAt: Date.now()
    };

    await storageService.updateRecord(updatedRecord);
    setLastProcessed({ 
      record: updatedRecord, 
      message: `Sync success: Status updated to ${finalStatus}`
    });
    setImeiInput('');
    setIsLoading(false);
    imeiInputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleReceive();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-emerald-900">Repair Receive Center</h1>
      </header>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Select Technician</label>
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
            >
              <option value="">-- Choose technician --</option>
              {TECHNICIANS.map(tech => (
                <option key={tech.id} value={tech.name}>{tech.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Action Type</label>
            <div className="flex items-center gap-4 h-[60px]">
              <label className="flex-1 flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={!isRejected}
                  onChange={() => setIsRejected(false)}
                  className="w-5 h-5 rounded-full border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-bold text-slate-700">Receive</span>
              </label>
              <label className="flex-1 flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-red-50 hover:border-red-200 transition-colors">
                <input
                  type="checkbox"
                  checked={isRejected}
                  onChange={() => setIsRejected(true)}
                  className="w-5 h-5 rounded-full border-slate-300 text-red-600 focus:ring-red-500"
                />
                <span className="font-bold text-slate-700 text-red-600">Reject</span>
              </label>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-emerald-500" /> : <ScanLine className="w-6 h-6" />}
          </div>
          <input
            ref={imeiInputRef}
            type="text"
            placeholder="Scan IMEI to sync status..."
            value={imeiInput}
            onChange={(e) => setImeiInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="w-full pl-14 pr-4 py-6 bg-slate-900 text-white font-mono text-xl placeholder:text-slate-500 rounded-2xl outline-none ring-offset-2 ring-emerald-500 focus:ring-2 transition-all disabled:opacity-50"
          />
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        {lastProcessed && (
          <div className={`p-6 rounded-2xl border flex items-center justify-between animate-slideUp ${
            lastProcessed.record.status === 'Rejected' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
          }`}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold">{lastProcessed.record.device.model} ({lastProcessed.record.imei})</p>
                <p className="text-sm opacity-80">{lastProcessed.message}</p>
              </div>
            </div>
            {lastProcessed.record.status === 'Rejected' ? <XCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepairReceive;
