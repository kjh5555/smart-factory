import { Equipment, Status, OperationStatus } from "@prisma/client";

export interface LocationType {
  id: string;
  name: string;
  floor: number;
  zone: string;
  description?: string;
}

export interface EquipmentType {
  id: string;
  name: string;
}

export interface EquipmentWithRelations extends Omit<Equipment, 'location' | 'type'> {
  type: EquipmentType;
  location: LocationType;
  operationStatus: OperationStatus;
}

export interface EquipmentStats {
  total: number;
  active: number;
  needsMaintenance: number;
  operating: number;
  standby: number;
}

export interface EquipmentResponse {
  equipments: EquipmentWithRelations[];
  stats: EquipmentStats;
}

export type { Status, OperationStatus }; 