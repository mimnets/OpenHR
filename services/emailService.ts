
import { hrService } from './hrService';
import { Employee, LeaveRequest, SmtpConfig } from '../types';

export const emailService = {
  /**
   * Simulates sending an email. Supports both Basic Auth and XOAUTH2.
   */
  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    const config = hrService.getConfig().smtp;
    
    if (!config || !config.isActive) {
      console.warn('Email Dispatcher: SMTP is not configured or inactive.');
      return false;
    }

    console.group(`%c📧 Outgoing Email: ${subject}`, 'color: #4f46e5; font-weight: bold; font-size: 12px;');
    console.log(`%cTo: %c${to}`, 'font-weight: bold;', 'color: #1e293b;');
    console.log(`%cFrom: %c"${config.fromName}" <${config.fromEmail}>`, 'font-weight: bold;', 'color: #1e293b;');
    
    if (config.authType === 'OAUTH2') {
      console.log(`%cAuthentication: %cXOAUTH2 (Modern Auth)`, 'font-weight: bold;', 'color: #10b981;');
      console.log(`%cBearer Token: %c${config.accessToken?.substring(0, 15)}...`, 'font-weight: bold;', 'color: #64748b;');
    } else {
      console.log(`%cAuthentication: %cBasic Auth (Legacy)`, 'font-weight: bold;', 'color: #f59e0b;');
    }

    console.log(`%cSMTP Relay: %c${config.host}:${config.port}`, 'font-weight: bold;', 'color: #64748b;');
    console.log(`%cBody Content:`, 'font-weight: bold;');
    console.log(body);
    console.groupEnd();

    return true;
  },

  async sendWelcomeEmail(employee: Employee) {
    const subject = `Welcome to OpenHR - Your Login Credentials`;
    const body = `
      Hello ${employee.name},
      
      Your account has been successfully created.
      
      Username: ${employee.username}
      Password: ${employee.password || '123'}
      
      Please login at: ${window.location.origin}
    `;
    return this.sendEmail(employee.email, subject, body);
  },

  async sendLeaveStatusAlert(request: LeaveRequest, employee: Employee) {
    const subject = `Leave Request ${request.status === 'APPROVED' ? 'Approved' : 'Rejected'}`;
    const body = `
      Hello ${employee.name},
      
      Your leave request for ${request.startDate} has been ${request.status}.
    `;
    return this.sendEmail(employee.email, subject, body);
  },

  async sendPasswordReset(email: string) {
    const subject = `Password Reset Request`;
    const body = `You requested a password reset. Your temporary key is: ${Math.random().toString(36).substring(7).toUpperCase()}`;
    return this.sendEmail(email, subject, body);
  },

  async sendReport(to: string, reportName: string) {
    const subject = `Organization Report: ${reportName}`;
    const body = `Attached is the ${reportName} generated on ${new Date().toLocaleString()}.`;
    return this.sendEmail(to, subject, body);
  }
};
