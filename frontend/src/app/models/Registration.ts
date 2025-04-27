export interface Registration {
  expanded: boolean;
  registrationId: number;
  studentNumber: string;
  roomNumber: string;
  checkInDate?: string;
  checkOutDate?: string;
}

export interface RegistrationDTO {
  registrationId?: number;
  studentNumber: string;
  roomNumber: string;
  checkInDate?: string;
  checkOutDate?: string;
  expanded: boolean;
}
