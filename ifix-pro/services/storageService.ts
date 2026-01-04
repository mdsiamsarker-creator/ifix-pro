
import { createClient } from '@supabase/supabase-js';
import { RepairRecord, MasterDevice, DeviceInfo } from "../types";

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// If URL or Key is missing, the client will fail, but we prevent app crash here
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const storageService = {
  getRecords: async (): Promise<RepairRecord[]> => {
    const { data, error } = await supabase
      .from('repair_records')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching records:", error);
      return [];
    }
    return data || [];
  },

  saveRecord: async (record: RepairRecord) => {
    // Check if a pending record already exists to avoid duplicates
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
          id: record.id,
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
    const { error } = await supabase
      .from('repair_records')
      .update({ 
        status: updatedRecord.status, 
        received_at: updatedRecord.receivedAt 
      })
      .eq('id', updatedRecord.id);
    
    if (error) console.error("Error updating record:", error);
  },

  getPendingByIMEIAndTech: async (imei: string, technician: string): Promise<RepairRecord | null> => {
    const { data, error } = await supabase
      .from('repair_records')
      .select('*')
      .eq('imei', imei)
      .eq('technician', technician)
      .eq('status', 'Pending')
      .maybeSingle();
    
    if (error) return null;
    return data;
  },

  saveMasterDevices: async (devices: MasterDevice[]) => {
    const { error } = await supabase
      .from('master_inventory')
      .upsert(devices.map(d => ({
        imei: d.imei,
        model: d.model,
        capacity: d.capacity,
        color: d.color
      })), { onConflict: 'imei' });
    
    if (error) console.error("Error saving master devices:", error);
  },

  getMasterInventory: async (): Promise<MasterDevice[]> => {
    const { data, error } = await supabase
      .from('master_inventory')
      .select('*');
    
    if (error) return [];
    return data || [];
  },

  lookupDeviceInfo: async (imei: string): Promise<DeviceInfo | null> => {
    const { data, error } = await supabase
      .from('master_inventory')
      .select('model, capacity, color')
      .eq('imei', imei)
      .maybeSingle();
    
    if (error || !data) return null;
    return data;
  }
};
