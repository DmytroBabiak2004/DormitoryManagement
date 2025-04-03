import { Condition, ChairType } from "./Enums";

export interface Chair {
  expanded: boolean;
  serialNumber: number;
  condition: Condition;
  type: ChairType;
  roomNumber: string;
}
