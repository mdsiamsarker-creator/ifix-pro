
import React, { useState, useEffect, useRef } from 'react';
import { TECHNICIANS, SERVICES, DeviceInfo, RepairRecord } from '../types';
import { ChevronRight, ArrowLeft, Loader2, ScanLine, Smartphone, CheckCircle2, AlertCircle } from 'lucide-react';
import { storageService } from '../services/storageService';

interface RepairRequestProps {
  onBack: () => void;
}

const RepairRequest: React.FC<RepairRequestProps> = ({ onBack }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTech, setSelectedTech] = useState<string>('');
  const [referenceNo, setReferenceNo] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>(SERVICES[0]);
  const [imeiInput, setImeiInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<{imei: string; device: DeviceInfo} | null>(null);

  const imeiInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 2 && imeiInputRef.current) {
      imeiInputRef.current.focus();
    }
  }, [step]);

  const handleNextStep = () => {
    if (!selectedTech) return;
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const ref = `${selectedTech.replace(/\s+/g, '')}-${dateStr}`;
    setReferenceNo(ref);
    setStep(2);
  };

  const processIMEI = async (imei: string) => {
    const cleanImei = imei.trim();
    if (!cleanImei) return;
    
    setError(null);
    setIsLoading(true);
    
    try {
      // Lookup device in Master Inventory - Added await to resolve the promise before use
      const device = await storageService.lookupDeviceInfo(cleanImei);
      
      if (!device) {
        setError(`IMEI ${cleanImei} not found in master inventory. Use 'Buy a phone' to add it.`);
        setImeiInput('');
        return;
      }

      const newRecord: RepairRecord = {
        id: crypto.randomUUID(),
        referenceNo,
        technician: selectedTech,
        imei: cleanImei,
        services: [selectedService],
        status: 'Pending',
        device,
        createdAt: Date.now()
      };
      
      await storageService.saveRecord(newRecord);
      setLastSaved({ imei: cleanImei, device });
      setImeiInput('');
    } catch (err) {
      console.error(err);
      setError("System error during processing.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processIMEI(imeiInput);
    }
  };

  if (step === 1) {
    return (
      <div className="max-w-xl mx-auto space-y-8 animate-fadeIn">
        <header className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">New Repair Request</h1>
        </header>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Select Technician</label>
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none appearance-none"
            >
              <option value="">-- Choose a technician --</option>
              {TECHNICIANS.map(tech => (
                <option key={tech.id} value={tech.name}>{tech.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleNextStep}
            disabled={!selectedTech}
            className="w-full flex items-center justify-center gap-2 p-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all"
          >
            Create Request / Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setStep(1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Batch Entry</h1>
            <p className="text-slate-500 font-medium">Ref: <span className="text-blue-600 font-mono">{referenceNo}</span></p>
          </div>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-xl text-blue-700 font-semibold text-sm">
          {selectedTech}
        </div>
      </header>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Service / Issue</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            >
              {SERVICES.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
            <p className="text-xs text-slate-400 italic">Service will persist until you change it</p>
          </div>

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ScanLine className="w-6 h-6" />}
            </div>
            <input
              ref={imeiInputRef}
              type="text"
              placeholder="Scan or Type IMEI and press Enter"
              value={imeiInput}
              onChange={(e) => setImeiInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="w-full pl-14 pr-4 py-6 bg-slate-900 text-white font-mono text-xl placeholder:text-slate-500 rounded-2xl outline-none ring-offset-2 ring-blue-500 focus:ring-2 transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-600 flex items-center gap-3 animate-shake">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        {lastSaved && (
          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-center justify-between animate-slideUp">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl text-emerald-600 shadow-sm">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-emerald-800 font-bold">{lastSaved.device.model}</p>
                <p className="text-emerald-600 text-sm">{lastSaved.device.capacity} • {lastSaved.device.color} • {lastSaved.imei}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              Saved
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
        >
          Finished Working
        </button>
      </div>
    </div>
  );
};

export default RepairRequest;
