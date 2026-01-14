import { Employee, Attendance, LeaveRequest, User, AppConfig, Holiday, LeaveWorkflow, LeaveBalance } from '../types';
import { DEFAULT_CONFIG, BD_HOLIDAYS } from '../constants.tsx';
import { pb, isPocketBaseConfigured } from './pocketbase';

const subscribers: Set<() => void> = new Set();

// Helper to strip system fields and frontend-only fields that PocketBase rejects
const cleanPayload = (data: any) => {
  const systemFields = [
    'id', 'created', 'updated', 'collectionId', 'collectionName', 
    'expand', 'username', 'verified', 'emailVisibility',
    'lineManagerId', 'employeeId' // Remove camelCase mapped fields
  ];
  const cleaned = { ...data };
  systemFields.forEach(field => delete cleaned[field]);
  return cleaned;
};

// Converts DataURL to Blob for PocketBase file uploads
const dataURLtoBlob = (dataurl: string) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

// Helper to convert object to FormData for PocketBase
const toFormData = (data: any, fileName: string = 'file.jpg') => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    const value = data[key];
    // Check if the value is a base64/dataURL string for file fields
    if (typeof value === 'string' && value.startsWith('data:')) {
      formData.append(key, dataURLtoBlob(value), fileName);
    } else if (value !== null && value !== undefined) {
      // Append non-file fields as strings
      formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
    }
  });
  return formData;
};

// Internal helper for settings collection (singleton-like patterns)
const upsertSetting = async (key: string, value: any) => {
  if (!pb || !isPocketBaseConfigured()) return;
  try {
    const record = await pb.collection('settings').getFirstListItem(`key = "${key}"`);
    await pb.collection('settings').update(record.id, { value });
  } catch (e) {
    // If doesn't exist, create it
    await pb.collection('settings').create({ key, value });
  }
};

const getSetting = async (key: string, defaultValue: any) => {
  if (!pb || !isPocketBaseConfigured()) return defaultValue;
  try {
    const record = await pb.collection('settings').getFirstListItem(`key = "${key}"`);
    return record.value;
  } catch (e) {
    return defaultValue;
  }
};

// Helper to parse location string from DB
const parseLocation = (locStr: string): Attendance['location'] => {
  if (!locStr) return { lat: 0, lng: 0, address: 'Unknown' };
  try {
    // If it's stored as "lat, lng"
    if (locStr.includes(',')) {
      const parts = locStr.split(',').map(p => p.trim());
      return {
        lat: parseFloat(parts[0]) || 0,
        lng: parseFloat(parts[1]) || 0,
        address: parts.length > 2 ? parts.slice(2).join(', ') : 'GPS Coordinates'
      };
    }
    // Fallback if it's just a name
    return { lat: 0, lng: 0, address: locStr };
  } catch (e) {
    return { lat: 0, lng: 0, address: locStr };
  }
};

export const hrService = {
  subscribe(callback: () => void) {
    subscribers.add(callback);
    return () => { subscribers.delete(callback); };
  },

  notify() {
    subscribers.forEach(cb => cb());
  },

  async login(email: string, pass: string): Promise<{ user: User | null; error?: string }> {
    if (!isPocketBaseConfigured() || !pb) {
      return { user: null, error: "PocketBase is not configured." };
    }

    try {
      const authData = await pb.collection('users').authWithPassword(email, pass);
      
      const rawRole = authData.record.role || 'EMPLOYEE';
      const normalizedRole = rawRole.toString().toUpperCase() as any;

      const userObj: User = {
        id: authData.record.id,
        employeeId: authData.record.employee_id || authData.record.id,
        email: authData.record.email,
        name: authData.record.name || 'User',
        role: normalizedRole,
        department: authData.record.department || 'Unassigned',
        designation: authData.record.designation || 'Staff',
        avatar: authData.record.avatar ? pb.files.getUrl(authData.record, authData.record.avatar) : undefined
      };
      return { user: userObj };
    } catch (err: any) {
      return { user: null, error: err.message || "PocketBase Login Failed" };
    }
  },

  async logout() {
    if (pb) pb.authStore.clear();
    this.notify();
  },

  async getEmployees(): Promise<Employee[]> {
    if (pb && isPocketBaseConfigured()) {
      try {
        const records = await pb.collection('users').getFullList({
          sort: '-created',
        });
        
        return records.map(r => ({
          ...r,
          id: r.id,
          employeeId: r.employee_id || r.id,
          lineManagerId: r.line_manager_id || undefined, 
          name: r.name || 'No Name',
          email: r.email,
          role: (r.role || 'EMPLOYEE').toString().toUpperCase(),
          department: r.department || 'Unassigned',
          designation: r.designation || 'Staff',
          avatar: r.avatar ? pb.files.getUrl(r, r.avatar) : undefined
        })) as any;
      } catch (e: any) {
        console.error("PocketBase Error in getEmployees:", e.data || e);
      }
    }
    return [];
  },

  async addEmployee(emp: Partial<Employee>) {
    if (pb && isPocketBaseConfigured()) {
      try {
        const payload = {
          ...emp,
          role: (emp.role || 'EMPLOYEE').toUpperCase(),
          employee_id: emp.employeeId, 
          line_manager_id: emp.lineManagerId || null, 
          password: emp.password || 'OpenHR@123',
          passwordConfirm: emp.password || 'OpenHR@123',
          emailVisibility: true,
        };
        
        const cleaned = cleanPayload(payload);

        if (payload.avatar && payload.avatar.startsWith('data:')) {
          await pb.collection('users').create(toFormData(cleaned, 'avatar.jpg'));
        } else {
          await pb.collection('users').create(cleaned);
        }
        this.notify();
      } catch (e: any) {
        console.error("Add employee failed:", e.data || e);
        throw new Error(e.message || "Failed to create record.");
      }
    }
  },

  async deleteEmployee(id: string) {
    if (pb && isPocketBaseConfigured()) {
      await pb.collection('users').delete(id);
      this.notify();
    }
  },

  async updateProfile(id: string, updates: Partial<Employee>) {
    if (pb && isPocketBaseConfigured()) {
      try {
        const pbData: any = cleanPayload(updates);
        
        if (updates.role) pbData.role = updates.role.toUpperCase();
        if (updates.employeeId !== undefined) pbData.employee_id = updates.employeeId;
        if (updates.lineManagerId !== undefined) {
          pbData.line_manager_id = updates.lineManagerId || null; 
        }
        
        if (!pbData.password) delete pbData.password;
        delete pbData.emailVisibility;

        if (updates.avatar && updates.avatar.startsWith('data:')) {
          await pb.collection('users').update(id, toFormData(pbData, 'avatar.jpg'));
        } else {
          if (pbData.avatar && pbData.avatar.startsWith('http')) delete pbData.avatar;
          await pb.collection('users').update(id, pbData);
        }
        this.notify();
      } catch (e: any) {
        console.error("PocketBase Update Error:", e.data || e);
        throw e;
      }
    }
  },

  // Attendance Methods
  async getAttendance(): Promise<Attendance[]> {
    if (!pb || !isPocketBaseConfigured()) return [];
    try {
      const records = await pb.collection('attendance').getFullList({ sort: '-date' });
      return records.map(r => ({
        ...r,
        checkIn: r.check_in,
        checkOut: r.check_out,
        employeeName: r.employee_name,
        employeeId: r.employee_id,
        location: parseLocation(r.location),
        selfie: r.selfie ? pb.files.getUrl(r, r.selfie) : undefined
      })) as any;
    } catch (e) {
      return [];
    }
  },

  async getTodayAttendance(employeeId: string): Promise<Attendance[]> {
    const today = new Date().toISOString().split('T')[0];
    if (!pb || !isPocketBaseConfigured()) return [];
    try {
      const records = await pb.collection('attendance').getFullList({
        filter: `employee_id = "${employeeId}" && date = "${today}"`,
        sort: '-created'
      });
      return records.map(r => ({
        ...r,
        checkIn: r.check_in,
        checkOut: r.check_out,
        employeeName: r.employee_name,
        employeeId: r.employee_id,
        location: parseLocation(r.location),
        selfie: r.selfie ? pb.files.getUrl(r, r.selfie) : undefined
      })) as any;
    } catch (e) {
      return [];
    }
  },

  async getActiveAttendance(employeeId: string): Promise<Attendance | undefined> {
    if (!pb || !isPocketBaseConfigured()) return undefined;
    try {
      const record = await pb.collection('attendance').getFirstListItem(`employee_id = "${employeeId}" && check_out = ""`);
      return {
        ...record,
        checkIn: record.check_in,
        checkOut: record.check_out,
        employeeName: record.employee_name,
        employeeId: record.employee_id,
        location: parseLocation(record.location),
        selfie: record.selfie ? pb.files.getUrl(record, record.selfie) : undefined
      } as any;
    } catch (e) {
      return undefined;
    }
  },

  async saveAttendance(data: Attendance) {
    if (!pb || !isPocketBaseConfigured()) return;
    try {
      // Build coordinates string: "latitude, longitude"
      const coordinates = data.location 
        ? `${data.location.lat}, ${data.location.lng}` 
        : "0, 0";

      const payload: any = {
        employee_id: data.employeeId,
        employee_name: data.employeeName || "Unknown",
        date: data.date,
        check_in: data.checkIn,
        check_out: data.checkOut || "",
        status: data.status,
        remarks: data.remarks || "",
        location: coordinates // Storing raw coordinates as requested
      };

      if (data.selfie) {
        payload.selfie = data.selfie;
      }

      // Convert to FormData to handle the selfie file correctly
      const formData = toFormData(payload, `selfie_${data.employeeId}_${Date.now()}.jpg`);
      
      await pb.collection('attendance').create(formData);
      this.notify();
    } catch (err: any) {
      console.error("Attendance verification/save failed:", err.data || err);
      throw err;
    }
  },

  async updateAttendance(id: string, data: Partial<Attendance>) {
    if (!pb || !isPocketBaseConfigured()) return;
    try {
      const pbUpdates: any = {};
      if (data.checkIn !== undefined) pbUpdates.check_in = data.checkIn;
      if (data.checkOut !== undefined) pbUpdates.check_out = data.checkOut;
      if (data.remarks !== undefined) pbUpdates.remarks = data.remarks;
      if (data.status !== undefined) pbUpdates.status = data.status;
      
      // If updating with a file (not common for update but supported)
      if (data.selfie && data.selfie.startsWith('data:')) {
        const formData = toFormData(pbUpdates, 'update.jpg');
        formData.append('selfie', dataURLtoBlob(data.selfie), 'selfie.jpg');
        await pb.collection('attendance').update(id, formData);
      } else {
        await pb.collection('attendance').update(id, pbUpdates);
      }
      this.notify();
    } catch (err: any) {
      console.error("Attendance update failed:", err.data || err);
    }
  },

  async autoCheckOutStaleSessions() {
    if (!pb || !isPocketBaseConfigured()) return 0;
    try {
      const stale = await pb.collection('attendance').getFullList({
        filter: 'check_out = "" && created < @now' 
      });
      for (const s of stale) {
        await pb.collection('attendance').update(s.id, { check_out: '23:59', remarks: 'Auto Clock-out' });
      }
      return stale.length;
    } catch (e) {
      return 0;
    }
  },

  // Leave Methods
  async getLeaves(): Promise<LeaveRequest[]> {
    if (!pb || !isPocketBaseConfigured()) return [];
    try {
      const records = await pb.collection('leaves').getFullList({ sort: '-applied_date' });
      return records.map(r => ({ 
        ...r, 
        startDate: r.start_date,
        endDate: r.end_date,
        totalDays: r.total_days,
        appliedDate: r.applied_date,
        approverRemarks: r.approver_remarks,
        managerRemarks: r.manager_remarks,
        employeeId: r.employee_id, 
        employeeName: r.employee_name,
        lineManagerId: r.line_manager_id || undefined
      })) as any;
    } catch (e: any) {
      console.error("PocketBase getLeaves failed.", e.data || e);
      return [];
    }
  },

  async getLeaveBalance(employeeId: string): Promise<LeaveBalance> {
    const defaults = { ANNUAL: 20, CASUAL: 10, SICK: 14 };
    const leaves = await this.getLeaves();
    const approved = leaves.filter(l => l.employeeId === employeeId && l.status === 'APPROVED');
    
    approved.forEach(l => {
      if (l.type in defaults) {
        (defaults as any)[l.type] -= l.totalDays;
      }
    });
    
    return { employeeId, ...defaults };
  },

  async saveLeaveRequest(data: LeaveRequest) {
    if (!pb || !isPocketBaseConfigured()) return;
    try {
      const payload = { 
        ...data, 
        employee_id: data.employeeId, 
        employee_name: data.employeeName, 
        applied_date: data.appliedDate,
        start_date: data.startDate,
        end_date: data.endDate,
        // Fix: Changed data.total_days to data.totalDays to match LeaveRequest interface
        total_days: data.totalDays,
        line_manager_id: data.lineManagerId || null 
      };
      await pb.collection('leaves').create(cleanPayload(payload));
      this.notify();
    } catch (e: any) {
      console.error("Save leave request failed:", e.data || e);
      throw e;
    }
  },

  async modifyLeaveRequest(id: string, updates: Partial<LeaveRequest>) {
    if (!pb || !isPocketBaseConfigured()) return;
    const pbUpdates: any = cleanPayload(updates);
    if (updates.startDate) pbUpdates.start_date = updates.startDate;
    if (updates.endDate) pbUpdates.end_date = updates.endDate;
    if (updates.totalDays) pbUpdates.total_days = updates.totalDays;
    await pb.collection('leaves').update(id, pbUpdates);
    this.notify();
  },

  async updateLeaveStatus(id: string, status: 'APPROVED' | 'REJECTED', remarks: string, role: string) {
    if (!pb || !isPocketBaseConfigured()) return;
    try {
      const request = await pb.collection('leaves').getOne(id);
      let newStatus: LeaveRequest['status'] = status;
      
      if (status === 'APPROVED' && request.status === 'PENDING_MANAGER') {
        newStatus = 'PENDING_HR'; 
      }
      
      const update: any = { status: newStatus };
      if (role === 'MANAGER') update.manager_remarks = remarks;
      else update.approver_remarks = remarks;
      
      await pb.collection('leaves').update(id, update);
      this.notify();
    } catch (e) {
      console.error("Leave status update failed", e);
    }
  },

  // Organization & Config Methods via Settings Collection
  async getConfig(): Promise<AppConfig> {
    return await getSetting('app_config', DEFAULT_CONFIG);
  },

  async setConfig(config: AppConfig) {
    await upsertSetting('app_config', config);
    this.notify();
  },

  async getDepartments(): Promise<string[]> {
    return await getSetting('departments', ["Engineering", "HR", "Sales", "Operations"]);
  },

  async setDepartments(list: string[]) {
    await upsertSetting('departments', list);
    this.notify();
  },

  async getDesignations(): Promise<string[]> {
    return await getSetting('designations', ["Developer", "Manager", "HR Executive"]);
  },

  async setDesignations(list: string[]) {
    await upsertSetting('designations', list);
    this.notify();
  },

  async getHolidays(): Promise<Holiday[]> {
    return await getSetting('holidays', BD_HOLIDAYS);
  },

  async setHolidays(list: Holiday[]) {
    await upsertSetting('holidays', list);
    this.notify();
  },

  async getWorkflows(): Promise<LeaveWorkflow[]> {
    return await getSetting('workflows', []);
  },

  async setWorkflows(list: LeaveWorkflow[]) {
    await upsertSetting('workflows', list);
    this.notify();
  },

  isManagerOfSomeone(managerId: string, employees: Employee[]): boolean {
    return employees.some(e => e.lineManagerId === managerId);
  },

  async testPocketBaseConnection(url: string) {
    try {
      const res = await fetch(`${url}/api/health`);
      if (res.ok) return { success: true, message: "Healthy" };
      return { success: false, error: "Unreachable" };
    } catch (e) {
      return { success: false, error: "Network Error" };
    }
  },

  async finalizePasswordReset(token: string, pass: string) {
    if (!pb) return false;
    try {
      await pb.collection('users').confirmPasswordReset(token, pass, pass);
      return true;
    } catch (e) {
      return false;
    }
  }
};