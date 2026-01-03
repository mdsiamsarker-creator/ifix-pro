
import React, { useState } from 'react';
import { MasterDevice } from '../types';
import { storageService } from '../services/storageService';
import { ArrowLeft, Table, Trash2, CheckCircle, Smartphone, AlertCircle, Loader2 } from 'lucide-react';

interface BulkUploadProps {
  onBack: () => void;
}

const BulkUpload: React.FC<BulkUploadProps> = ({ onBack }) => {
  const [inputText, setInputText] = useState('');
  const [parsedDevices, setParsedDevices] = useState<MasterDevice[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleParse = (text: string) => {
    setInputText(text);
    const lines = text.split('\n');
    const devices: MasterDevice[] = lines
      .map(line => {
        const parts = line.split(/\t|,|;| {2,}/).map(p => p.trim());
        if (parts.length >= 4) {
          return {
            imei: parts[0],
            model: parts[1],
            capacity: parts[2],
            color: parts[3]
          };
        }
        return null;
      })
      .filter((d): d is MasterDevice => d !== null && d.imei.length > 5);
    
    setParsedDevices(devices);
  };

  const handleSave = async () => {
    if (parsedDevices.length === 0) return;
    setIsSaving(true);
    await storageService.saveMasterDevices(parsedDevices);
    setIsSaving(false);
    setIsSuccess(true);
    setInputText('');
    setParsedDevices([]);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Buy a phone (Bulk Upload)</h1>
          <p className="text-slate-500 font-medium font-mono uppercase text-xs tracking-widest mt-1">Cloud Sync Enabled</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-900">
              <Table className="w-5 h-5" />
              Excel Data Input
            </h3>
            <textarea
              className="w-full h-80 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
              placeholder="Paste columns from Excel here...&#10;Ex: 351234567890123	iPhone 14 Pro	128GB	Deep Purple"
              value={inputText}
              onChange={(e) => handleParse(e.target.value)}
            />
            
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => handleParse('')}
                className="flex-1 flex items-center justify-center gap-2 p-4 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all"
              >
                <Trash2 className="w-5 h-5" />
                Clear
              </button>
              <button
                onClick={handleSave}
                disabled={parsedDevices.length === 0 || isSaving}
                className="flex-[2] flex items-center justify-center gap-2 p-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                {isSaving ? 'Uploading...' : `Upload ${parsedDevices.length} to Cloud`}
              </button>
            </div>
          </div>

          {isSuccess && (
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-emerald-700 font-bold flex items-center gap-3 animate-slideUp">
              <CheckCircle className="w-6 h-6" />
              Global Inventory Updated!
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-900">
            <Smartphone className="w-5 h-5" />
            Verification Preview ({parsedDevices.length})
          </h3>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[480px]">
            {parsedDevices.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-sm border border-slate-100 animate-slideUp" style={{animationDelay: `${i * 30}ms`}}>
                <div>
                  <p className="font-bold text-slate-900">{d.model} <span className="text-slate-400 font-normal">({d.capacity})</span></p>
                  <p className="text-xs font-mono text-slate-500">{d.imei}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-white border border-slate-200 rounded-md font-medium text-slate-600">
                  {d.color}
                </span>
              </div>
            ))}
            {parsedDevices.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-50">
                <AlertCircle className="w-12 h-12 text-slate-300" />
                <p className="text-slate-400 text-sm">
                  Ready for new stock data...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;
