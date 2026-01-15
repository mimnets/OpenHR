import { hrService } from './hrService';
import { Employee, LeaveRequest, SentEmail, Attendance } from '../types';

const STORAGE_KEY = 'hr_sent_emails';

export const emailService = {
  getOutbox(): SentEmail[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  },

  clearOutbox() {
    localStorage.setItem(STORAGE_KEY, '[]');
  },

  saveToOutbox(email: SentEmail) {
    const outbox = this.getOutbox();
    outbox.unshift(email);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(outbox.slice(0, 50)));
  },

  async sendDailyAttendanceSummary(recipientEmail: string, attendance: Attendance[]) {
    const rows = attendance.map(a => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${a.employeeName}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${a.checkIn || '--:--'}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${a.checkOut || '--:--'}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${a.status}</td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; padding: 20px; background: #ffffff; border: 1px solid #eee; border-radius: 12px;">
        <h2 style="color: #4f46e5; margin-bottom: 5px;">Daily Attendance Summary</h2>
        <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">Organization: OpenHR • Date: ${new Date().toLocaleDateString()}</p>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f8fafc;">
              <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: left; font-size: 12px; text-transform: uppercase;">Employee</th>
              <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: left; font-size: 12px; text-transform: uppercase;">Clock In</th>
              <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: left; font-size: 12px; text-transform: uppercase;">Clock Out</th>
              <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: left; font-size: 12px; text-transform: uppercase;">Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 15px;">
            Sent automatically by OpenHR System.
        </p>
      </div>
    `;

    try {
        await hrService.sendCustomEmail({ 
            recipientEmail, 
            subject: `Daily Attendance Summary - ${new Date().toLocaleDateString()}`,
            html 
        });
        
        this.saveToOutbox({
            id: Date.now().toString(),
            to: recipientEmail,
            subject: 'Daily Attendance Summary',
            body: html,
            sentAt: new Date().toISOString(),
            status: 'SENT',
            provider: 'PocketBase Hook'
        });
        return { success: true };
    } catch (err) {
        console.error("Report Sending Failed: ", err);
        throw err;
    }
  },

  async sendLeaveStatusAlert(request: LeaveRequest, employee: Employee) {
    // Leave status alerts are now handled by PocketBase JS Hooks (onRecordAfterUpdate).
    // No manual trigger required from frontend.
    console.log("Email Notification: Handled by PocketBase Backend Hooks for Leave request " + request.id);
    return { backendHandled: true };
  }
};