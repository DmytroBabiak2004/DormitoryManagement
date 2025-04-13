import {Condition, MattressType} from './Enums';

export interface Mattress {
  serialNumber: number;
  condition: Condition;
  type: MattressType;
  studentNumber: string;
  expanded?: boolean;
}

export interface MattressDTO {
  serialNumber?: number; // Опціонально, бо не завжди потрібен при оновленні
  conditionId: number;
  typeId: number;
  studentNumber: string;
}
