
export type Role = 'ADMIN' | 'MANAGER' | 'HR' | 'EMPLOYEE';
export type WorkType = 'OFFICE' | 'FIELD';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  designation: string;
  avatar?: string;
  username?: string;
}

export interface Employee extends User {
  joiningDate: string;
  mobile: string;
  emergencyContact: string;
  salary: number;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  employmentType: 'PERMANENT' | 'CONTRACT' | 'TEMPORARY';
  location: string;
  nid?: string;
  password?: string;
  lineManagerId?: string;
  workType: WorkType; // OFFICE follows rules, FIELD is flexible
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName?: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE' | 'EARLY_OUT';
  location?: { lat: number; lng: number; address?: string };
  remarks?: string;
  selfie?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'ANNUAL' | 'CASUAL' | 'SICK' | 'MATERNITY' | 'PATERNITY' | 'EARNED' | 'UNPAID';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'PENDING_MANAGER' | 'PENDING_HR' | 'APPROVED' | 'REJECTED';
  appliedDate: string;
  approverRemarks?: string;
  managerRemarks?: string;
}

export interface LeaveBalance {
  employeeId: string;
  ANNUAL: number;
  CASUAL: number;
  SICK: number;
}

export interface LeaveWorkflow {
  department: string;
  approverRole: Role | 'LINE_MANAGER';
  autoApproveAfterDays?: number;
}

export interface Holiday {
  id: string;
  date: string;
  name: string;
  isGovernment: boolean;
  type: 'FESTIVAL' | 'ISLAMIC' | 'NATIONAL';
}

export interface AppConfig {
  companyName: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  workingDays: string[];
  officeStartTime: string; // HH:mm
  officeEndTime: string;   // HH:mm
  lateGracePeriod: number; // minutes
  earlyOutGracePeriod: number; // minutes
}
