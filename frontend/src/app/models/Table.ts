import { Condition, TableType } from "./Enums";

export interface Table {
  expanded: boolean;
  serialNumber: number;
  condition: Condition;
  type: TableType;
  roomNumber: string;
}
