import {ChairType, Condition} from './Enums';

export interface Chair {
  serialNumber: number;
  condition: Condition;
  type: ChairType;
  roomNumber: string;
  expanded?: boolean;
}

export interface ChairDTO {
  serialNumber?: number; // Опціонально, бо не завжди потрібен при оновленні
  conditionId: number;
  typeId: number;
  roomNumber: string;
}
