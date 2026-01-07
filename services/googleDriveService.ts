
/**
 * Google Drive Integration Service
 * Handles OAuth2 and File Uploads to Google Drive
 */

const CLIENT_ID = '879929245496-dc5pdfgbvt38ueotp4u52eh52pbffn8o.apps.googleusercontent.com'; // User needs to replace this
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

let accessToken: string | null = null;

export const googleDriveService = {
  /**
   * Initialize and request token from Google
   */
  async connect(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (response: any) => {
            if (response.error) {
              reject(response);
            }
            accessToken = response.access_token;
            localStorage.setItem('google_drive_token', accessToken!);
            resolve(accessToken!);
          },
        });
        client.requestAccessToken();
      } catch (err) {
        reject(err);
      }
    });
  },

  disconnect() {
    accessToken = null;
    localStorage.removeItem('google_drive_token');
  },

  isConnected() {
    return !!localStorage.getItem('google_drive_token');
  },

  getAccessToken() {
    return accessToken || localStorage.getItem('google_drive_token');
  },

  /**
   * Upload a JSON blob to Google Drive
   */
  async uploadFile(content: string, filename: string) {
    const token = this.getAccessToken();
    if (!token) throw new Error('Not connected to Google');

    const metadata = {
      name: filename,
      mimeType: 'application/json',
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([content], { type: 'application/json' }));

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to upload to Google Drive');
    }

    return await response.json();
  },

  /**
   * List JSON backup files from Drive
   */
  async listBackups() {
    const token = this.getAccessToken();
    if (!token) throw new Error('Not connected to Google');

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=mimeType='application/json' and trashed=false&fields=files(id, name, createdTime)`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch file list');
    const data = await response.json();
    return data.files as { id: string; name: string; createdTime: string }[];
  },

  /**
   * Download a specific file content
   */
  async downloadFile(fileId: string): Promise<string> {
    const token = this.getAccessToken();
    if (!token) throw new Error('Not connected to Google');

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Failed to download file');
    return await response.text();
  }
};
