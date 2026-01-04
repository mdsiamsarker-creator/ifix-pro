export type RepairStatus = 'Pending' | 'Reworked' | 'Opened' | 'Closed' | 'Checked' | 'Repaired' | 'Rejected';

export interface DeviceInfo {
  model: string;
  capacity: string;
  color: string;
}

export interface MasterDevice extends DeviceInfo {
  imei: string;
}

export interface RepairRecord {
  id: string;
  referenceNo: string;
  technician: string;
  imei: string;
  services: string[];
  status: RepairStatus;
  device: DeviceInfo;
  createdAt: number;
  receivedAt?: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  model: string;
  quantity: number;
  minThreshold: number;
  category: 'Screen' | 'Battery' | 'Housing' | 'Small Parts' | 'Tools';
}

export interface Technician {
  id: string;
  name: string;
  team: string;
}

export const TECHNICIANS: Technician[] = [
  { id: '1', name: 'Ali+Ahmad', team: 'Main' },
  { id: '2', name: 'Erfan', team: 'Main' },
  { id: '3', name: 'Mehdi+Riduan', team: 'Support' },
  { id: '4', name: 'Delwar', team: 'Main' },
  { id: '5', name: 'Waqas', team: 'Micro-soldering' },
  { id: '6', name: 'Rabbi', team: 'Support' },
  { id: '7', name: 'Yasin', team: 'Support' },
  { id: '8', name: 'Glass team', team: 'Refurbishment' },
  { id: '9', name: 'Plolish team', team: 'Refurbishment' }
];

export const SERVICES = [
  'Opening',
  'Closing',
  'Checking',
  'Rework',
  'Screen Replacement',
  'Battery Replacement',
  'Charging Port Fix',
  'Camera Repair',
  'Logic Board Service',
  'Glass Refurbishment',
  'Back Glass Laser'
];

export enum Page {
  Dashboard = 'DASHBOARD',
  RepairRequest = 'REPAIR_REQUEST',
  RepairReceive = 'REPAIR_RECEIVE',
  RepairHistory = 'REPAIR_HISTORY',
  RepairData = 'REPAIR_DATA',
  BulkUpload = 'BULK_UPLOAD',
  Inventory = 'INVENTORY',
  Settings = 'SETTINGS'
}
