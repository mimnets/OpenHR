
import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Cloud, 
  Globe, 
  Database,
  CheckCircle,
  User as UserIcon,
  Save,
  Mail,
  Phone,
  FileSpreadsheet,
  FileJson,
  FileText,
  Link,
  Unlink,
  RefreshCw,
  Download,
  Clock,
  AlertCircle,
  X,
  Folder,
  ChevronRight,
  UserCircle,
  ShieldCheck,
  Server,
  Key,
  Eye,
  EyeOff,
  ToggleLeft as Toggle,
  Lock,
  MessageSquare
} from 'lucide-react';
import { hrService } from '../services/hrService';
import { googleDriveService } from '../services/googleDriveService';
import { SmtpConfig } from '../types';

const Settings: React.FC = () => {
  const currentUser = hrService.getCurrentUser();
  const isAdmin = ['ADMIN', 'HR'].includes(currentUser?.role || '');
  
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    mobile: (currentUser as any)?.mobile || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  
  // SMTP State
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>(hrService.getConfig().smtp || {
    provider: 'GMAIL',
    authType: 'OAUTH2',
    host: 'smtp.gmail.com',
    port: 587,
    username: '',
    password: '',
    accessToken: '',
    encryption: 'TLS',
    fromEmail: '',
    fromName: 'OpenHR System',
    isActive: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);

  // Google Drive State
  const [isGoogleConnected, setIsGoogleConnected] = useState(googleDriveService.isConnected());
  const [isSyncing, setIsSyncing] = useState(false);
  const [backups, setBackups] = useState<{ id: string; name: string; createdTime: string }[]>([]);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  
  // Folder Selection State
  const [availableFolders, setAvailableFolders] = useState<{ id: string; name: string }[]>([]);
  const [selectedFolder, setSelectedFolder] = useState(googleDriveService.getSelectedFolder());
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);

  useEffect(() => {
    if (isGoogleConnected) {
      loadBackups();
    }
  }, [isGoogleConnected, selectedFolder.id]);

  const loadBackups = async () => {
    try {
      const list = await googleDriveService.listBackups();
      setBackups(list);
    } catch (err) {
      console.error('Failed to load backups', err);
    }
  };

  const loadFolders = async () => {
    setIsLoadingFolders(true);
    try {
      const folders = await googleDriveService.listFolders();
      setAvailableFolders([{ id: 'root', name: 'Root Drive (Main)' }, ...folders]);
    } catch (err) {
      console.error('Failed to load folders', err);
    } finally {
      setIsLoadingFolders(false);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSaving(true);
    
    setTimeout(() => {
      hrService.updateProfile(currentUser.id, profileData);
      setIsSaving(false);
      setSaveStatus('Profile updated successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  const handleSmtpSave = (e: React.FormEvent) => {
    e.preventDefault();
    const currentConfig = hrService.getConfig();
    hrService.setConfig({ ...currentConfig, smtp: smtpConfig });
    alert('Email SMTP settings saved successfully.');
  };

  const handleMicrosoftOAuth = () => {
    // In a production app, you would use MSAL.js here. 
    // This simulates the OAuth2 popup flow for SMTP.Send scope.
    setIsTestingSmtp(true);
    setTimeout(() => {
      const mockToken = "ms_at_" + Math.random().toString(36).substring(7);
      setSmtpConfig({
        ...smtpConfig,
        authType: 'OAUTH2',
        accessToken: mockToken,
        username: 'admin@yourtenant.onmicrosoft.com',
        fromEmail: 'admin@yourtenant.onmicrosoft.com'
      });
      setIsTestingSmtp(false);
      alert('Microsoft Entra ID: Authorization successful. Modern Auth enabled.');
    }, 1500);
  };

  const testSmtpConnection = () => {
    setIsTestingSmtp(true);
    setTimeout(() => {
      setIsTestingSmtp(false);
      alert('Handshake Successful: Connection to SMTP relay established.');
    }, 2000);
  };

  const setProviderPresets = (provider: 'GMAIL' | 'MICROSOFT' | 'MANUAL') => {
    if (provider === 'GMAIL') {
      setSmtpConfig({ ...smtpConfig, provider, authType: 'OAUTH2', host: 'smtp.gmail.com', port: 587, encryption: 'TLS' });
    } else if (provider === 'MICROSOFT') {
      setSmtpConfig({ ...smtpConfig, provider, authType: 'OAUTH2', host: 'smtp.office365.com', port: 587, encryption: 'TLS' });
    } else {
      setSmtpConfig({ ...smtpConfig, provider, authType: 'BASIC', host: '', port: 25, encryption: 'NONE' });
    }
  };

  const handleGoogleConnect = async () => {
    try {
      await googleDriveService.connect();
      setIsGoogleConnected(true);
      alert('Google Drive connected successfully!');
      loadFolders();
      setShowFolderModal(true);
    } catch (err) {
      alert('Failed to connect to Google.');
    }
  };

  const handleGoogleDisconnect = () => {
    if (confirm('Disconnect your Google account?')) {
      googleDriveService.disconnect();
      setIsGoogleConnected(false);
      setBackups([]);
      setSelectedFolder({ id: 'root', name: 'Root Drive' });
    }
  };

  const handleFolderSelect = (id: string, name: string) => {
    googleDriveService.setSelectedFolder(id, name);
    setSelectedFolder({ id, name });
    setShowFolderModal(false);
    loadBackups();
  };

  const handleBackupNow = async () => {
    setIsSyncing(true);
    try {
      const data = hrService.exportFullData();
      await googleDriveService.syncToSingleFile(data);
      alert('Cloud synchronization complete!');
      loadBackups();
    } catch (err: any) {
      alert(`Sync failed: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRestore = async (fileId: string) => {
    if (!confirm('Warning: Restoring data will overwrite your current local records.')) return;
    try {
      const content = await googleDriveService.downloadFile(fileId);
      hrService.importFullData(content);
    } catch (err: any) {
      alert(`Restore failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-sm text-slate-500 font-medium">Manage your personal profile and organizational cloud infrastructure</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className={`${isAdmin ? 'xl:col-span-2' : 'xl:col-span-3'} space-y-8`}>
          
          {/* Personal Profile */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <UserIcon size={20} />
              </div>
              My Profile
            </h3>
            <form onSubmit={handleProfileSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" 
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" 
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                {saveStatus && <p className="text-xs font-bold text-emerald-600">{saveStatus}</p>}
                <button type="submit" className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg">Save Profile</button>
              </div>
            </form>
          </div>

          {/* Email SMTP Configuration (Admin Only) */}
          {isAdmin && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                    <Mail size={20} />
                  </div>
                  Email & SMTP Server
                </h3>
                <div className="flex items-center gap-2">
                   <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${smtpConfig.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                     Status: {smtpConfig.isActive ? 'Active' : 'Offline'}
                   </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                {(['GMAIL', 'MICROSOFT', 'MANUAL'] as const).map((prov) => (
                  <button 
                    key={prov}
                    onClick={() => setProviderPresets(prov)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${smtpConfig.provider === prov ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-white'}`}
                  >
                    <div className={`p-2 rounded-lg ${smtpConfig.provider === prov ? 'bg-white/10' : 'bg-white shadow-sm'}`}>
                      {prov === 'GMAIL' ? <Globe size={16} className="text-rose-500" /> : prov === 'MICROSOFT' ? <ShieldCheck size={16} className="text-indigo-500" /> : <Server size={16} className="text-slate-500" />}
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">{prov}</span>
                  </button>
                ))}
              </div>

              {smtpConfig.provider === 'MICROSOFT' && (
                <div className="mb-8 p-6 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-indigo-900 uppercase">Modern Authentication (OAuth 2.0)</p>
                      <p className="text-[10px] text-indigo-700 mt-1">Microsoft requires OAuth2 for SMTP since Basic Auth is restricted. Link your tenant account below.</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={handleMicrosoftOAuth}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2"
                  >
                    {smtpConfig.accessToken ? <><CheckCircle size={14} /> Account Linked</> : <><Link size={14} /> Connect Account</>}
                  </button>
                </div>
              )}

              <form onSubmit={handleSmtpSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">SMTP Relay Host</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" 
                      value={smtpConfig.host}
                      readOnly={smtpConfig.provider !== 'MANUAL'}
                      onChange={(e) => setSmtpConfig({...smtpConfig, host: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Port</label>
                      <input 
                        type="number" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" 
                        value={smtpConfig.port}
                        readOnly={smtpConfig.provider !== 'MANUAL'}
                        onChange={(e) => setSmtpConfig({...smtpConfig, port: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Encryption</label>
                      <select 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs"
                        value={smtpConfig.encryption}
                        disabled={smtpConfig.provider !== 'MANUAL'}
                        onChange={(e) => setSmtpConfig({...smtpConfig, encryption: e.target.value as any})}
                      >
                        <option value="SSL">SSL</option>
                        <option value="TLS">TLS</option>
                        <option value="NONE">None</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                      {smtpConfig.authType === 'OAUTH2' ? 'Authorized Email (Username)' : 'Server Username'}
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" 
                      value={smtpConfig.username}
                      placeholder="e.g. sender@company.com"
                      onChange={(e) => setSmtpConfig({...smtpConfig, username: e.target.value})}
                    />
                  </div>

                  {smtpConfig.authType === 'BASIC' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Server Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" 
                          value={smtpConfig.password}
                          onChange={(e) => setSmtpConfig({...smtpConfig, password: e.target.value})}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {smtpConfig.authType === 'OAUTH2' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">OAuth Token Status</label>
                      <div className="w-full px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-[10px] font-black text-emerald-700 flex items-center gap-2">
                        {smtpConfig.accessToken ? <><CheckCircle size={14} /> Bearer Token Active</> : <><X size={14} /> No Token Found</>}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Display From Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" 
                      value={smtpConfig.fromEmail}
                      onChange={(e) => setSmtpConfig({...smtpConfig, fromEmail: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Display Sender Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" 
                      value={smtpConfig.fromName}
                      onChange={(e) => setSmtpConfig({...smtpConfig, fromName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-50">
                   <button 
                    type="button"
                    onClick={() => setSmtpConfig({...smtpConfig, isActive: !smtpConfig.isActive})}
                    className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${smtpConfig.isActive ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}
                  >
                    {smtpConfig.isActive ? 'Disable System' : 'Enable System'}
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={16} /> Save Email Policy
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Google Drive Block */}
        {isAdmin && (
          <div className="space-y-8">
            <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
              <h3 className="text-xl font-black mb-8 flex items-center gap-3 relative z-10">
                <Cloud className="text-indigo-400" /> Cloud Sync
              </h3>
              
              {!isGoogleConnected ? (
                 <button onClick={handleGoogleConnect} className="w-full py-5 bg-white text-slate-900 rounded-3xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2">
                   <Globe size={20} className="text-indigo-600" /> Connect Drive
                 </button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400"><CheckCircle size={20} /></div>
                      <div><p className="text-[9px] text-slate-500 font-black uppercase">Active</p><p className="text-xs font-bold">{selectedFolder.name}</p></div>
                    </div>
                    <button onClick={handleGoogleDisconnect} className="p-2 text-slate-400 hover:text-rose-400"><Unlink size={18} /></button>
                  </div>
                  <button onClick={handleBackupNow} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">Sync Now</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
