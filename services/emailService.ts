
import { hrService } from './hrService';
import { Employee, LeaveRequest, SentEmail } from '../types';

const STORAGE_KEY = 'hr_sent_emails';

export const emailService = {
  getOutbox(): SentEmail[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  },

  clearOutbox() {
    localStorage.setItem(STORAGE_KEY, '[]');
  },

  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    const config = hrService.getConfig().smtp;
    const outbox = this.getOutbox();
    
    const newEmail: SentEmail = {
      id: Math.random().toString(36).substring(7),
      to,
      subject,
      body,
      sentAt: new Date().toISOString(),
      status: (config && config.isActive) ? 'SENT' : 'FAILED',
      provider: config?.provider || 'NONE'
    };

    outbox.unshift(newEmail);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(outbox.slice(0, 50))); // Keep last 50

    if (!config || !config.isActive) {
      console.warn('Email Dispatcher: SMTP is not active. Email moved to Failed Outbox.');
      return false;
    }

    console.group(`%c📧 Outgoing Email: ${subject}`, 'color: #4f46e5; font-weight: bold;');
    console.log(`To: ${to}`);
    console.log(`Body: ${body}`);
    console.groupEnd();

    return true;
  },

  async sendWelcomeEmail(employee: Employee) {
    const subject = `Welcome to OpenHR - Login Credentials`;
    const body = `Hello ${employee.name},\n\nYour account is active.\nUsername: ${employee.username}\nPassword: ${employee.password || '123'}`;
    return this.sendEmail(employee.email, subject, body);
  },

  async sendLeaveStatusAlert(request: LeaveRequest, employee: Employee) {
    const subject = `Leave Request ${request.status}`;
    const body = `Hello ${employee.name},\n\nYour leave for ${request.startDate} is ${request.status}.`;
    return this.sendEmail(employee.email, subject, body);
  },

  async sendPasswordReset(email: string) {
    const subject = `Password Reset Request`;
    const body = `Your temporary password reset key is: ${Math.random().toString(36).substring(7).toUpperCase()}`;
    return this.sendEmail(email, subject, body);
  },

  async sendReport(to: string, reportName: string) {
    const subject = `Report: ${reportName}`;
    const body = `The requested ${reportName} is attached.`;
    return this.sendEmail(to, subject, body);
  }
};
