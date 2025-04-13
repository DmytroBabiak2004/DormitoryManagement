import {TableType, Condition} from './Enums';

export interface Table {
  serialNumber: number;
  condition: Condition;
  type: TableType;
  roomNumber: string;
  expanded?: boolean;
}

export interface TableDTO {
  serialNumber?: number; // Опціонально, бо не завжди потрібен при оновленні
  conditionId: number;
  typeId: number;
  roomNumber: string;
}
