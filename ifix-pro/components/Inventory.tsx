import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../types';
import { storageService } from '../services/storageService';
import { ArrowLeft, Plus, Package, AlertTriangle, Search, Loader2, Filter } from 'lucide-react';

interface InventoryProps {
  onBack: () => void;
}

const Inventory: React.FC<InventoryProps> = ({ onBack }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  useEffect(() => {
    const loadInventory = async () => {
      const data = await storageService.getPartsInventory();
      // If no data, provide sample for UI demonstration
      if (data.length === 0) {
        setItems([
          { id: '1', name: 'iPhone 14 Pro Screen (Original)', model: '14 Pro', quantity: 12, minThreshold: 5, category: 'Screen' },
          { id: '2', name: 'iPhone 13 Battery (OEM)', model: '13', quantity: 3, minThreshold: 10, category: 'Battery' },
          { id: '3', name: 'Lightning Connector Flex', model: '12', quantity: 0, minThreshold: 5, category: 'Small Parts' },
        ]);
      } else {
        setItems(data);
      }
      setLoading(false);
    };
    loadInventory();
  }, []);

  const filteredItems = items.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || i.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= 0) return { label: 'OUT OF STOCK', color: 'text-red-600 bg-red-50 border-red-100' };
    if (item.quantity <= item.minThreshold) return { label: 'LOW STOCK', color: 'text-amber-600 bg-amber-50 border-amber-100' };
    return { label: 'STABLE', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Scanning Warehouse Shelves...</p>
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
            <h1 className="text-3xl font-bold text-slate-900">Warehouse Inventory</h1>
            <p className="text-slate-500 font-medium tracking-tight">Spare Parts & Components Management</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
          <Plus className="w-5 h-5" />
          Restock / Add New
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by part name or device model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          {['All', 'Screen', 'Battery', 'Small Parts', 'Tools'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-5 py-3 rounded-xl font-bold text-xs whitespace-nowrap transition-all border ${
                categoryFilter === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const status = getStockStatus(item);
          return (
            <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <Package className="w-8 h-8" />
                </div>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border ${status.color}`}>
                  {status.label}
                </span>
              </div>
              
              <div className="space-y-1">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{item.category}</p>
                <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                <p className="text-sm text-slate-500 font-medium">Compatible: {item.model}</p>
              </div>

              <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Current Count</p>
                  <p className="text-3xl font-black text-slate-900">{item.quantity}</p>
                </div>
                {item.quantity <= item.minThreshold && (
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 text-amber-500 mb-1">
                      <AlertTriangle className="w-5 h-5 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-tighter">Reorder Required</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">Min Threshold: {item.minThreshold}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-32 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <Package className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-400 tracking-tight uppercase">No Components Match Search</h3>
            <p className="text-slate-400 mt-2">Adjust your filters or add a new part to inventory.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
