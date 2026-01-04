import { createClient } from '@supabase/supabase-js';
import { RepairRecord, MasterDevice, DeviceInfo, InventoryItem } from "../types";

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Initialize Supabase only if credentials are present
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const storageService = {
  getRecords: async (): Promise<RepairRecord[]> => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('repair_records')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(r => ({
        id: r.id,
        referenceNo: r.reference_no,
        technician: r.technician,
        imei: r.imei,
        services: r.services,
        status: r.status,
        device: r.device,
        createdAt: r.created_at,
        receivedAt: r.received_at
      }));
    } catch (error) {
      console.error("Error fetching records:", error);
      return [];
    }
  },

  saveRecord: async (record: RepairRecord) => {
    if (!supabase) return;
    const { data: existing } = await supabase
      .from('repair_records')
      .select('*')
      .eq('imei', record.imei)
      .eq('technician', record.technician)
      .eq('status', 'Pending')
      .maybeSingle();

    if (existing) {
      const updatedServices = Array.from(new Set([...existing.services, ...record.services]));
      await supabase
        .from('repair_records')
        .update({ services: updatedServices })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('repair_records')
        .insert([{
          reference_no: record.referenceNo,
          technician: record.technician,
          imei: record.imei,
          services: record.services,
          status: record.status,
          device: record.device,
          created_at: record.createdAt
        }]);
    }
  },

  updateRecord: async (updatedRecord: RepairRecord) => {
    if (!supabase) return;
    await supabase
      .from('repair_records')
      .update({ 
        status: updatedRecord.status, 
        received_at: updatedRecord.receivedAt 
      })
      .eq('id', updatedRecord.id);
  },

  getPendingByIMEIAndTech: async (imei: string, technician: string): Promise<RepairRecord | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('repair_records')
      .select('*')
      .eq('imei', imei)
      .eq('technician', technician)
      .eq('status', 'Pending')
      .maybeSingle();
    
    if (error || !data) return null;
    
    return {
      id: data.id,
      referenceNo: data.reference_no,
      technician: data.technician,
      imei: data.imei,
      services: data.services,
      status: data.status,
      device: data.device,
      createdAt: data.created_at,
      receivedAt: data.received_at
    };
  },

  saveMasterDevices: async (devices: MasterDevice[]) => {
    if (!supabase) return;
    await supabase
      .from('master_inventory')
      .upsert(devices.map(d => ({
        imei: d.imei,
        model: d.model,
        capacity: d.capacity,
        color: d.color
      })), { onConflict: 'imei' });
  },

  getMasterInventory: async (): Promise<MasterDevice[]> => {
    if (!supabase) return [];
    const { data } = await supabase.from('master_inventory').select('*');
    return data || [];
  },

  lookupDeviceInfo: async (imei: string): Promise<DeviceInfo | null> => {
    if (!supabase) return null;
    const { data } = await supabase
      .from('master_inventory')
      .select('model, capacity, color')
      .eq('imei', imei)
      .maybeSingle();
    return data;
  },

  getPartsInventory: async (): Promise<InventoryItem[]> => {
    if (!supabase) return [];
    try {
      const { data } = await supabase.from('parts_inventory').select('*');
      return data || [];
    } catch {
      return [];
    }
  },

  updatePartQuantity: async (partId: string, quantity: number) => {
    if (!supabase) return;
    await supabase
      .from('parts_inventory')
      .update({ quantity })
      .eq('id', partId);
  },

  addPart: async (part: Omit<InventoryItem, 'id'>) => {
    if (!supabase) return;
    await supabase.from('parts_inventory').insert([part]);
  }
};
