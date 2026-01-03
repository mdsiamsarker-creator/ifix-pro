
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

export interface Technician {
  id: string;
  name: string;
}

export const TECHNICIANS: Technician[] = [
  { id: '1', name: 'Ali+Ahmad' },
  { id: '2', name: 'Erfan' },
  { id: '3', name: 'Mehdi+Riduan' },
  { id: '4', name: 'Delwar' },
  { id: '5', name: 'Waqas' },
  { id: '6', name: 'Rabbi' },
  { id: '7', name: 'Yasin' },
  { id: '8', name: 'Glass team' },
  { id: '9', name: 'Plolish team' }
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
  'Logic Board Service'
];

export enum Page {
  Dashboard = 'DASHBOARD',
  RepairRequest = 'REPAIR_REQUEST',
  RepairReceive = 'REPAIR_RECEIVE',
  RepairHistory = 'REPAIR_HISTORY',
  RepairData = 'REPAIR_DATA',
  BulkUpload = 'BULK_UPLOAD'
}
