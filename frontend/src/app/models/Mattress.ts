import { Condition, MattressType } from "./Enums";

export interface Mattress {
  expanded: boolean;
  serialNumber: number;
  condition: Condition;
  type: MattressType;
  studentNumber: string;
}
