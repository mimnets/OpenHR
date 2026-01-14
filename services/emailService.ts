
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

  saveToOutbox(email: SentEmail) {
    const outbox = this.getOutbox();
    outbox.unshift(email);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(outbox.slice(0, 50)));
  },

  async getExpressRelayUrl() {
    const config = await hrService.getConfig();
    let url = config.smtp?.relayUrl || '';
    return url.replace(/\/+$/, '');
  },

  /**
   * Direct Browser-to-Resend delivery. 
   * Bypasses Express/Supabase entirely.
   */
  async sendViaDirectResend(payload: any, type: 'ALERT' | 'REPORT') {
    const config = await hrService.getConfig();
    const apiKey = config.smtp?.resendApiKey;
    const fromName = config.smtp?.fromName || 'OpenHR';

    if (!apiKey) throw new Error("Resend API Key is missing. Add it in Settings > Communication.");

    const subject = type === 'REPORT' 
      ? `[OpenHR] ${payload.reportType} System Report`
      : `[OpenHR] Leave Status: ${payload.status}`;

    const body = type === 'REPORT'
      ? `<h2>System Report: ${payload.reportType}</h2><p>The requested data is attached below as JSON (Previewing ${payload.reportData?.length || 0} rows).</p><pre>${JSON.stringify(payload.reportData, null, 2).slice(0, 5000)}...</pre>`
      : `<h2>Leave Update</h2><p>Dear ${payload.employeeName}, your ${payload.leaveType} leave request has been <b>${payload.status}</b>.</p><p>Remarks: ${payload.approverRemarks || 'None'}</p>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: `${fromName} <onboarding@resend.dev>`, // Resend requires this for free tier
        to: [payload.recipientEmail || payload.employeeEmail],
        subject: subject,
        html: body
      })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Resend API Error: ${res.status}`);
    }

    return await res.json();
  },

  async sendViaExpress(payload: any, endpoint: '/alerts/send-email' | '/reports/send-email') {
    const config = await hrService.getConfig();
    
    // Check if we should use direct mode instead
    if (config.smtp?.useDirectResend) {
      return this.sendViaDirectResend(payload, endpoint.includes('report') ? 'REPORT' : 'ALERT');
    }

    const baseUrl = await this.getExpressRelayUrl();
    if (!baseUrl) throw new Error("Express Email Server URL not configured.");

    let fullUrl = baseUrl;
    const hasApi = baseUrl.toLowerCase().endsWith('/api');
    
    if (endpoint === '/alerts/send-email') {
      fullUrl = hasApi ? `${baseUrl}/alerts/send-email` : `${baseUrl}/api/alerts/send-email`;
    } else if (endpoint === '/reports/send-email') {
      fullUrl = hasApi ? `${baseUrl}/reports/send-email` : `${baseUrl}/api/reports/send-email`;
    }

    fullUrl = fullUrl.replace(/([^:]\/)\/+/g, "$1");

    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 413) throw new Error("Payload Too Large. Increase server limit.");
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Remote Server Error: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error(`[OpenHR] Relay Error:`, error);
      throw error;
    }
  },

  async testConnection() {
    const config = await hrService.getConfig();
    if (config.smtp?.useDirectResend) {
      return { success: true, message: "Direct Cloud Mode active. No relay needed." };
    }
    
    const baseUrl = await this.getExpressRelayUrl();
    if (!baseUrl) return { success: false, error: "Express URL missing." };

    try {
      const testUrl = baseUrl.endsWith('/api') ? `${baseUrl}/test` : `${baseUrl}/api/test`;
      const res = await fetch(testUrl.replace(/([^:]\/)\/+/g, "$1"), { method: 'GET' });
      if (res.ok) return { success: true, message: "Express Server Online" };
      return { success: false, error: `Server returned status ${res.status}` };
    } catch (e: any) {
      return { success: false, error: "Connection failed. Ensure server is running." };
    }
  },

  async sendReport(recipientEmail: string, reportName: string, filters: any = {}) {
    const payload = {
      reportId: `REP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      recipientEmail: recipientEmail,
      reportType: reportName,
      reportData: filters.data || filters
    };
    return await this.sendViaExpress(payload, '/reports/send-email');
  },

  async sendLeaveStatusAlert(request: LeaveRequest, employee: Employee) {
    const payload = {
      employeeName: employee.name,
      employeeEmail: employee.email,
      leaveType: request.type,
      startDate: request.startDate,
      endDate: request.endDate,
      status: request.status,
      approverRemarks: request.approverRemarks || request.managerRemarks || ''
    };
    return await this.sendViaExpress(payload, '/alerts/send-email');
  }
};
