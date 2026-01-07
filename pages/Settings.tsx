
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
  Link,
  Unlink,
  RefreshCw,
  Download,
  X,
  Folder,
  ChevronRight,
  ShieldCheck,
  Server,
  Lock,
  Eye,
  EyeOff,
  Clock,
  Trash2,
  Inbox,
  AlertCircle
} from 'lucide-react';
import { hrService } from '../services/hrService';
import { googleDriveService } from '../services/googleDriveService';
import { emailService } from '../services/emailService';
import { SmtpConfig, SentEmail } from '../types';

const Settings: React.FC = () => {
  const currentUser = hrService.getCurrentUser();
  const isAdmin = ['ADMIN', 'HR'].includes(currentUser?.role || '');
  
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    mobile: (currentUser as any)?.mobile || '',
  });
  
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>(hrService.getConfig().smtp || {
    provider: 'MICROSOFT',
    authType: 'OAUTH2',
    host: 'smtp.office365.com',
    port: 587,
    username: 'monir.it@vclbd.net',
    password: '',
    accessToken: '',
    encryption: 'TLS',
    fromEmail: 'monir.it@vclbd.net',
    fromName: 'OpenHR System',
    isActive: true
  });

  const [outbox, setOutbox] = useState<SentEmail[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setOutbox(emailService.getOutbox());
  }, []);

  const handleSmtpSave = (e: React.FormEvent) => {
    e.preventDefault();
    const currentConfig = hrService.getConfig();
    hrService.setConfig({ ...currentConfig, smtp: smtpConfig });
    alert('Email SMTP settings saved successfully.');
  };

  const handleMicrosoftOAuth = () => {
    setTimeout(() => {
      setSmtpConfig({
        ...smtpConfig,
        authType: 'OAUTH2',
        accessToken: "ms_bearer_token_" + Math.random().toString(36).substring(7),
        isActive: true
      });
    }, 1000);
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-sm text-slate-500 font-medium tracking-tight">Manage your infrastructure and communications</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          
          {isAdmin && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl">
                    <Mail size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Email & SMTP Server</h3>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-[0.1em] px-4 py-1.5 rounded-full ${smtpConfig.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  STATUS: {smtpConfig.isActive ? 'ACTIVE' : 'OFFLINE'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-10">
                <button onClick={() => setProviderPresets('GMAIL')} className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all ${smtpConfig.provider === 'GMAIL' ? 'bg-[#0f172a] text-white border-slate-900 shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}>
                  <Globe size={24} className={smtpConfig.provider === 'GMAIL' ? 'text-rose-500' : 'text-rose-500'} />
                  <span className="text-xs font-black uppercase tracking-widest">GMAIL</span>
                </button>
                <button onClick={() => setProviderPresets('MICROSOFT')} className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all ${smtpConfig.provider === 'MICROSOFT' ? 'bg-[#0f172a] text-white border-slate-900 shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}>
                  <ShieldCheck size={24} className={smtpConfig.provider === 'MICROSOFT' ? 'text-indigo-400' : 'text-indigo-400'} />
                  <span className="text-xs font-black uppercase tracking-widest">MICROSOFT</span>
                </button>
                <button onClick={() => setProviderPresets('MANUAL')} className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all ${smtpConfig.provider === 'MANUAL' ? 'bg-[#0f172a] text-white border-slate-900 shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}>
                  <Server size={24} className={smtpConfig.provider === 'MANUAL' ? 'text-slate-400' : 'text-slate-400'} />
                  <span className="text-xs font-black uppercase tracking-widest">MANUAL</span>
                </button>
              </div>

              {smtpConfig.provider === 'MICROSOFT' && (
                <div className="mb-10 p-8 bg-[#f1f5ff] border border-indigo-100 rounded-[2rem] flex items-center justify-between gap-8">
                  <div className="flex items-start gap-5">
                    <div className="p-3.5 bg-white rounded-2xl shadow-sm text-indigo-600">
                      <ShieldCheck size={28} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-indigo-900 uppercase tracking-tight">MODERN AUTHENTICATION (OAUTH 2.0)</h4>
                      <p className="text-[11px] text-indigo-700/70 mt-1 font-medium leading-relaxed max-w-sm">
                        Microsoft requires OAuth2 for SMTP since Basic Auth is restricted. Link your tenant account below.
                      </p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={handleMicrosoftOAuth}
                    className={`px-8 py-4 ${smtpConfig.accessToken ? 'bg-[#5850ec]' : 'bg-[#0f172a]'} text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl transition-all flex items-center gap-3 active:scale-95`}
                  >
                    {smtpConfig.accessToken ? <><CheckCircle size={16} /> ACCOUNT LINKED</> : <><Link size={16} /> LINK ACCOUNT</>}
                  </button>
                </div>
              )}

              <form onSubmit={handleSmtpSave} className="space-y-10">
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-12 lg:col-span-6 space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] px-1">SMTP RELAY HOST</label>
                    <input type="text" className="w-full px-6 py-4 bg-[#f8fafc] border border-slate-100 rounded-2xl font-black text-slate-900 outline-none" value={smtpConfig.host} onChange={e => setSmtpConfig({...smtpConfig, host: e.target.value})} />
                  </div>
                  <div className="col-span-6 lg:col-span-3 space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] px-1">PORT</label>
                    <input type="number" className="w-full px-6 py-4 bg-[#f8fafc] border border-slate-100 rounded-2xl font-black text-slate-900" value={smtpConfig.port} onChange={e => setSmtpConfig({...smtpConfig, port: parseInt(e.target.value)})} />
                  </div>
                  <div className="col-span-6 lg:col-span-3 space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] px-1">ENCRYPTION</label>
                    <select className="w-full px-6 py-4 bg-[#f8fafc] border border-slate-100 rounded-2xl font-black text-slate-900" value={smtpConfig.encryption} onChange={e => setSmtpConfig({...smtpConfig, encryption: e.target.value as any})}>
                      <option value="SSL">SSL</option>
                      <option value="TLS">TLS</option>
                      <option value="NONE">NONE</option>
                    </select>
                  </div>

                  <div className="col-span-12 lg:col-span-6 space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] px-1">AUTHORIZED EMAIL (USERNAME)</label>
                    <input type="text" className="w-full px-6 py-4 bg-[#f8fafc] border border-slate-100 rounded-2xl font-black text-slate-900" value={smtpConfig.username} onChange={e => setSmtpConfig({...smtpConfig, username: e.target.value})} />
                  </div>
                  <div className="col-span-12 lg:col-span-6 space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] px-1">OAUTH TOKEN STATUS</label>
                    <div className={`w-full px-6 py-4 rounded-2xl font-black flex items-center gap-3 ${smtpConfig.accessToken ? 'bg-[#f0fdf4] text-[#166534] border border-[#dcfce7]' : 'bg-slate-50 text-slate-400'}`}>
                      {smtpConfig.accessToken ? <><CheckCircle size={20} className="text-[#22c55e]" /> Bearer Token Active</> : <><X size={20} /> No Token Active</>}
                    </div>
                  </div>

                  <div className="col-span-12 lg:col-span-6 space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] px-1">DISPLAY FROM EMAIL</label>
                    <input type="email" className="w-full px-6 py-4 bg-[#f8fafc] border border-slate-100 rounded-2xl font-black text-slate-900" value={smtpConfig.fromEmail} onChange={e => setSmtpConfig({...smtpConfig, fromEmail: e.target.value})} />
                  </div>
                  <div className="col-span-12 lg:col-span-6 space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] px-1">DISPLAY SENDER NAME</label>
                    <input type="text" className="w-full px-6 py-4 bg-[#f8fafc] border border-slate-100 rounded-2xl font-black text-slate-900" value={smtpConfig.fromName} onChange={e => setSmtpConfig({...smtpConfig, fromName: e.target.value})} />
                  </div>
                </div>

                <div className="flex gap-6 pt-10 border-t border-slate-50">
                   <button 
                    type="button"
                    onClick={() => setSmtpConfig({...smtpConfig, isActive: !smtpConfig.isActive})}
                    className="px-12 py-5 bg-[#fff1f2] text-[#e11d48] rounded-2xl font-black uppercase text-[11px] tracking-[0.1em] hover:bg-rose-100 transition-all flex items-center justify-center min-w-[220px]"
                  >
                    {smtpConfig.isActive ? 'DISABLE SYSTEM' : 'ENABLE SYSTEM'}
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-5 bg-[#0f172a] text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.1em] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3"
                  >
                    <Save size={20} /> SAVE EMAIL POLICY
                  </button>
                </div>
              </form>
            </div>
          )}

          {isAdmin && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-slate-800 flex items-center gap-4">
                    <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl"><Inbox size={24} /></div>
                    System Outbox Log
                  </h3>
                  <button onClick={() => { emailService.clearOutbox(); setOutbox([]); }} className="text-[11px] font-black text-[#e11d48] uppercase tracking-widest hover:underline">CLEAR AUDIT LOG</button>
               </div>
               
               <div className="p-5 bg-[#fef2f2] border border-[#fee2e2] rounded-2xl mb-6 flex items-start gap-4">
                  <AlertCircle size={20} className="text-[#e11d48] mt-0.5 shrink-0" />
                  <p className="text-[11px] font-medium text-[#991b1b] leading-relaxed italic">
                    Note: Without a configured Backend Relay API, the system operates in simulation mode. Emails shown as "SENT" are recorded in the system audit trail but not physically dispatched to your inbox.
                  </p>
               </div>

               <div className="space-y-4 max-h-[450px] overflow-y-auto no-scrollbar">
                  {outbox.map(mail => (
                    <div key={mail.id} className="p-6 bg-[#f8fafc] border border-slate-100 rounded-3xl relative group transition-all hover:bg-white hover:shadow-xl">
                       <div className="flex justify-between items-start mb-4">
                          <div className="min-w-0">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">TO: {mail.to}</p>
                            <h4 className="text-lg font-black text-slate-900 truncate">{mail.subject}</h4>
                          </div>
                          <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full ${mail.status === 'SENT' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fee2e2] text-[#991b1b]'}`}>
                            {mail.status}
                          </span>
                       </div>
                       <p className="text-sm text-slate-600 font-medium whitespace-pre-wrap leading-relaxed">{mail.body}</p>
                       <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <Clock size={12} /> {new Date(mail.sentAt).toLocaleString()} • RELAY: {mail.provider}
                       </div>
                    </div>
                  ))}
                  {outbox.length === 0 && (
                    <div className="py-24 text-center text-slate-300">
                      <Mail size={56} className="mx-auto mb-4 opacity-10" />
                      <p className="text-xs font-black uppercase tracking-widest">No communication history</p>
                    </div>
                  )}
               </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
           <div className="bg-[#0f172a] rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl transition-transform duration-1000"></div>
              <h3 className="text-xl font-black mb-8 flex items-center gap-3 relative z-10"><Cloud className="text-indigo-400" /> Cloud Sync</h3>
              <div className="space-y-6 relative z-10">
                  <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                     <p className="text-xs text-slate-400 leading-relaxed font-medium">Automatic cloud synchronization is active and targeting your selected Drive folder.</p>
                  </div>
                  <button className="w-full py-5 bg-white text-slate-900 rounded-3xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <RefreshCw size={18} className="text-indigo-600" /> Push Sync Now
                  </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
