
import { Employee, Attendance, LeaveRequest, User, Holiday, AppConfig, LeaveWorkflow, LeaveBalance, Role } from '../types';
import { DEPARTMENTS, DESIGNATIONS, BD_HOLIDAYS, DEFAULT_CONFIG } from '../constants.tsx';

const STORAGE_KEYS = {
  EMPLOYEES: 'hr_employees',
  ATTENDANCE: 'hr_attendance',
  LEAVES: 'hr_leaves',
  BALANCES: 'hr_balances',
  CURRENT_USER: 'hr_current_user',
  DEPARTMENTS: 'hr_departments',
  DESIGNATIONS: 'hr_designations',
  HOLIDAYS: 'hr_holidays',
  CONFIG: 'hr_config',
  WORKFLOWS: 'hr_workflows',
};

type ChangeListener = () => void;
const listeners: Set<ChangeListener> = new Set();

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP001',
    name: 'Admin User',
    email: 'admin@probashi.com',
    username: 'admin',
    role: 'ADMIN',
    department: 'Human Resources',
    designation: 'HR Director',
    joiningDate: '2022-01-01',
    mobile: '01711000000',
    emergencyContact: '01711999999',
    salary: 150000,
    status: 'ACTIVE',
    employmentType: 'PERMANENT',
    location: 'Dhaka',
    avatar: 'https://picsum.photos/seed/admin/200',
    nid: '1234567890',
    password: '123',
    workType: 'OFFICE'
  },
  {
    id: 'EMP002',
    name: 'Anisur Rahman',
    email: 'anis@probashi.com',
    username: 'anis',
    role: 'EMPLOYEE',
    department: 'Engineering',
    designation: 'Senior Developer',
    joiningDate: '2023-03-15',
    mobile: '01711222333',
    emergencyContact: '01711444555',
    salary: 85000,
    status: 'ACTIVE',
    employmentType: 'PERMANENT',
    location: 'Dhaka',
    avatar: 'https://picsum.photos/seed/anis/200',
    nid: '0987654321',
    lineManagerId: 'EMP001',
    password: '123',
    workType: 'OFFICE'
  }
];

export const hrService = {
  subscribe(listener: ChangeListener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  notify() {
    listeners.forEach(l => l());
  },

  initialize() {
    if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
    } else {
      const existing = this.getEmployees();
      let updated = false;
      const repaired = existing.map(emp => {
        if (!emp.password) {
          emp.password = '123';
          updated = true;
        }
        if (!emp.workType) {
          emp.workType = 'OFFICE';
          updated = true;
        }
        return emp;
      });
      if (updated) {
        localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(repaired));
      }
    }

    if (!localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) {
      localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(DEPARTMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DESIGNATIONS)) {
      localStorage.setItem(STORAGE_KEYS.DESIGNATIONS, JSON.stringify(DESIGNATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.HOLIDAYS)) {
      localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(BD_HOLIDAYS.map((h, i) => ({...h, id: `H${i}`} ))));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
    }
    if (!localStorage.getItem(STORAGE_KEYS.WORKFLOWS)) {
      const initialWorkflows: LeaveWorkflow[] = DEPARTMENTS.map(d => ({
        department: d,
        approverRole: 'LINE_MANAGER'
      }));
      localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(initialWorkflows));
    }
    this.initializeBalances();
  },

  initializeBalances() {
    if (!localStorage.getItem(STORAGE_KEYS.BALANCES)) {
      const employees = this.getEmployees();
      const balances: Record<string, LeaveBalance> = {};
      employees.forEach(emp => {
        balances[emp.id] = {
          employeeId: emp.id,
          ANNUAL: 14,
          CASUAL: 10,
          SICK: 14
        };
      });
      localStorage.setItem(STORAGE_KEYS.BALANCES, JSON.stringify(balances));
    }
  },

  exportFullData(): string {
    const exportObj: Record<string, any> = {};
    Object.values(STORAGE_KEYS).forEach(key => {
      exportObj[key] = localStorage.getItem(key);
    });
    return JSON.stringify(exportObj);
  },

  importFullData(jsonString: string) {
    try {
      const data = JSON.parse(jsonString);
      Object.keys(data).forEach(key => {
        if (data[key] !== null) {
          localStorage.setItem(key, data[key]);
        }
      });
      alert('Data imported successfully. The application will now reload.');
      window.location.reload();
    } catch (err) {
      console.error('Import Error:', err);
      throw new Error('Invalid backup file format.');
    }
  },

  login(email: string, password: string): User | null {
    const employees = this.getEmployees();
    const normalizedInput = email.trim().toLowerCase();
    const user = employees.find(e => 
      (e.email.toLowerCase() === normalizedInput || e.username?.toLowerCase() === normalizedInput) && 
      ( (e.password || '123') === password )
    );
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  getEmployees(): Employee[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.EMPLOYEES) || '[]');
  },

  addEmployee(employee: Employee) {
    const employees = this.getEmployees();
    const pwd = (employee.password && employee.password.trim().length > 0) ? employee.password : '123';
    const newEmployee = { ...employee, password: pwd, workType: employee.workType || 'OFFICE' };
    employees.push(newEmployee);
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
    const balances = this.getAllLeaveBalances();
    balances[employee.id] = {
      employeeId: employee.id,
      ANNUAL: 14,
      CASUAL: 10,
      SICK: 14
    };
    localStorage.setItem(STORAGE_KEYS.BALANCES, JSON.stringify(balances));
    this.notify();
  },

  updateProfile(userId: string, updates: Partial<Employee>) {
    const employees = this.getEmployees();
    const index = employees.findIndex(e => e.id === userId);
    if (index > -1) {
      employees[index] = { ...employees[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(employees[index]));
      }
      this.notify();
      return employees[index];
    }
    return null;
  },

  deleteEmployee(id: string) {
    const employees = this.getEmployees();
    const filtered = employees.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(filtered));
    this.notify();
  },

  getDepartments(): string[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DEPARTMENTS) || '[]');
  },

  setDepartments(depts: string[]) {
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(depts));
    this.notify();
  },

  getDesignations(): string[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DESIGNATIONS) || '[]');
  },

  setDesignations(desigs: string[]) {
    localStorage.setItem(STORAGE_KEYS.DESIGNATIONS, JSON.stringify(desigs));
    this.notify();
  },

  getConfig(): AppConfig {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG) || JSON.stringify(DEFAULT_CONFIG));
  },

  setConfig(config: AppConfig) {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    this.notify();
  },

  getHolidays(): Holiday[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.HOLIDAYS) || '[]');
  },

  setHolidays(holidays: Holiday[]) {
    localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(holidays));
    this.notify();
  },

  getWorkflows(): LeaveWorkflow[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.WORKFLOWS) || '[]');
  },

  setWorkflows(workflows: LeaveWorkflow[]) {
    localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(workflows));
    this.notify();
  },

  getAttendance(): Attendance[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || '[]');
  },

  getActiveAttendance(employeeId: string): Attendance | undefined {
    return this.getAttendance().find(a => a.employeeId === employeeId && !a.checkOut);
  },

  getTodayAttendance(employeeId: string): Attendance[] {
    const today = new Date().toISOString().split('T')[0];
    return this.getAttendance().filter(a => a.employeeId === employeeId && a.date === today);
  },

  saveAttendance(attendance: Attendance) {
    const list = this.getAttendance();
    const config = this.getConfig();
    const emp = this.getEmployees().find(e => e.id === attendance.employeeId);
    
    // Logic for LATE marking
    if (emp?.workType === 'OFFICE' && attendance.checkIn) {
      const [inH, inM] = attendance.checkIn.split(':').map(Number);
      const [offH, offM] = config.officeStartTime.split(':').map(Number);
      const inMinutes = inH * 60 + inM;
      const offMinutes = offH * 60 + offM;
      
      if (inMinutes > offMinutes + config.lateGracePeriod) {
        attendance.status = 'LATE';
      }
    }

    const index = list.findIndex(a => a.id === attendance.id);
    if (index > -1) {
      list[index] = attendance;
    } else {
      list.push(attendance);
    }
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(list));
    this.notify();
  },

  updateAttendance(id: string, updates: Partial<Attendance>) {
    const list = this.getAttendance();
    const index = list.findIndex(a => a.id === id);
    if (index > -1) {
      const current = list[index];
      const config = this.getConfig();
      const emp = this.getEmployees().find(e => e.id === current.employeeId);
      
      const updated = { ...current, ...updates };

      // Logic for EARLY_OUT marking
      if (emp?.workType === 'OFFICE' && updated.checkOut) {
        const [outH, outM] = updated.checkOut.split(':').map(Number);
        const [offEndH, offEndM] = config.officeEndTime.split(':').map(Number);
        const outMinutes = outH * 60 + outM;
        const offEndMinutes = offEndH * 60 + offEndM;
        
        if (outMinutes < offEndMinutes - config.earlyOutGracePeriod) {
          if (updated.status === 'PRESENT') {
            updated.status = 'EARLY_OUT';
          }
        }
      }

      list[index] = updated;
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(list));
      this.notify();
      return list[index];
    }
    return undefined;
  },

  getLeaves(): LeaveRequest[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LEAVES) || '[]');
  },

  saveLeaveRequest(request: LeaveRequest) {
    const list = this.getLeaves();
    request.status = 'PENDING_MANAGER';
    list.push(request);
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(list));
    this.notify();
  },

  modifyLeaveRequest(id: string, updates: Partial<LeaveRequest>) {
    const list = this.getLeaves();
    const index = list.findIndex(r => r.id === id);
    if (index > -1) {
      list[index] = { ...list[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(list));
      this.notify();
    }
  },

  updateLeaveStatus(requestId: string, status: 'APPROVED' | 'REJECTED' | 'PENDING_HR', remarks?: string, approverRole?: Role) {
    const list = this.getLeaves();
    const index = list.findIndex(r => r.id === requestId);
    if (index > -1) {
      const request = list[index];
      const isHRAdmin = approverRole === 'ADMIN' || approverRole === 'HR';
      const oldStatus = request.status;
      
      if (request.status === 'PENDING_MANAGER') {
        if (status === 'APPROVED') {
          request.status = 'PENDING_HR';
          request.managerRemarks = remarks;
        } else {
          request.status = 'REJECTED';
          request.managerRemarks = remarks;
        }
      } 
      else if (isHRAdmin) {
        if (oldStatus === 'APPROVED' && status === 'REJECTED') {
          this.addLeaveBalance(request.employeeId, request.type as any, request.totalDays);
        }
        request.status = status as any;
        request.approverRemarks = remarks;
        if (status === 'APPROVED' && oldStatus !== 'APPROVED') {
          this.deductLeaveBalance(request.employeeId, request.type as any, request.totalDays);
        }
      }
      localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(list));
      this.notify();
    }
  },

  getAllLeaveBalances(): Record<string, LeaveBalance> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BALANCES) || '{}');
  },

  getLeaveBalance(employeeId: string): LeaveBalance {
    const all = this.getAllLeaveBalances();
    return all[employeeId] || { employeeId, ANNUAL: 14, CASUAL: 10, SICK: 14 };
  },

  deductLeaveBalance(employeeId: string, type: 'ANNUAL' | 'CASUAL' | 'SICK', days: number) {
    const all = this.getAllLeaveBalances();
    if (all[employeeId]) {
      if (type === 'ANNUAL' || type === 'CASUAL' || type === 'SICK') {
        all[employeeId][type] = Math.max(0, all[employeeId][type] - days);
      }
      localStorage.setItem(STORAGE_KEYS.BALANCES, JSON.stringify(all));
      this.notify();
    }
  },

  addLeaveBalance(employeeId: string, type: 'ANNUAL' | 'CASUAL' | 'SICK', days: number) {
    const all = this.getAllLeaveBalances();
    if (all[employeeId]) {
      if (type === 'ANNUAL' || type === 'CASUAL' || type === 'SICK') {
        all[employeeId][type] += days;
      }
      localStorage.setItem(STORAGE_KEYS.BALANCES, JSON.stringify(all));
      this.notify();
    }
  },

  isManagerOfSomeone(managerId: string): boolean {
    const employees = this.getEmployees();
    return employees.some(e => e.lineManagerId === managerId);
  }
};
