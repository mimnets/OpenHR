import React, { useState, useEffect } from 'react';
import { 
  Network, Globe, Database, User, ArrowLeft, Save, RefreshCw, Server, Activity, Clock, Timer, UserCircle, Mail, Phone, Briefcase, CreditCard, Hash, UserCheck, Send
} from 'lucide-react';
import { hrService } from '../services/hrService';
import { updatePocketBaseConfig, getPocketBaseConfig } from '../services/pocketbase';
import { User as UserType, AppConfig, Employee } from '../types';

interface SettingsProps {
  user: UserType;
  onBack?: () => void;
}

type SettingsTab = 'PROFILE' | 'GENERAL' | 'INFRASTRUCTURE';

const Settings: React.FC<SettingsProps> = ({ user, onBack }) => {
  const isAdmin = user.role === 'ADMIN' || user.role === 'HR';
  const [activeTab, setActiveTab] = useState<SettingsTab>('PROFILE');
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [profile, setProfile] = useState<Partial<Employee> & { managerName?: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  
  const [pbConfig, setPbConfig] = useState(getPocketBaseConfig());
  const [testingBackend, setTestingBackend] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [appConfig, employees] = await Promise.all([
          hrService.getConfig(),
          hrService.getEmployees()
        ]);
        setConfig(appConfig);
        
        const myData = employees.find(e => e.id === user.id);
        if (myData) {
          setProfile(myData);
        } else {
          setProfile({
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            designation: user.designation,
            employeeId: user.employeeId,
            managerName: 'Not Assigned'
          } as any);
        }
      } catch (err) {
        console.error("Settings load failed:", err);
      }
    };
    load();
  }, [user.id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (activeTab === 'PROFILE' && profile) {
        await hrService.updateProfile(user.id, profile);
        alert('Personal profile updated successfully.');
      } else if (activeTab === 'GENERAL' && config) {
        await hrService.setConfig(config);
        alert('System policies updated.');
      } else if (activeTab === 'INFRASTRUCTURE') {
        updatePocketBaseConfig(pbConfig, false);
        alert('Database configuration saved.');
      }
      window.location.reload();
    } catch (e) {
      alert('Operation failed. Check server connection.');
    } finally {
      setIsSaving(false);
    }
  };

  const testEmailConnection = async () => {
    setIsTestingEmail(true);
    try {
        await hrService.sendCustomEmail({
            recipientEmail: user.email,
            subject: "PocketBase SMTP Test Result",
            html: `<h3>System Test Successful</h3><p>This email proves your PocketBase SMTP and JS Hooks are correctly linked. Sent at: ${new Date().toLocaleString()}</p>`
        });
        alert("Success: A test record was created in 'reports_queue'. If you don't receive an email within 2 minutes, check your PocketBase Mail Settings dashboard.");
    } catch (e) {
        alert("Failed: Could not queue email. Check if the 'reports_queue' collection exists.");
    } finally {
        setIsTestingEmail(false);
    }
  };

  const testBackend = async () => {
    setTestingBackend(true);
    const result = await hrService.testPocketBaseConnection(pbConfig.url);
    if (result.success) alert("SUCCESS: " + result.message);
    else alert("ERROR: " + (result.error || "Unknown"));
    setTestingBackend(false);
  };

  if (!config || !profile) return (
    <div className="h-64 flex items-center justify-center">
      <RefreshCw className="animate-spin text-indigo-500" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {onBack && <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><ArrowLeft size={20} /></button>}
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account & System</h1>
            <p className="text-slate-500 font-medium">Manage your identity and organization preferences</p>
          </div>
        </div>
        <div className="flex p-1 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <button onClick={() => setActiveTab('PROFILE')} className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'PROFILE' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>My Profile</button>
          {isAdmin && (
            <>
              <button onClick={() => setActiveTab('GENERAL')} className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'GENERAL' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>Policies</button>
              <button onClick={() => setActiveTab('INFRASTRUCTURE')} className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'INFRASTRUCTURE' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>Infrastructure</button>
            </>
          )}
        </div>
      </header>

      <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-8`}>
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'PROFILE' && (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 space-y-8 animate-in slide-in-from-left-4">
              <div className="flex items-center gap-4 border-b border-slate-50 pb-8">
                <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 font-black text-2xl uppercase relative overflow-hidden">
                   {profile.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" /> : profile.name?.[0]}
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-900">{profile.name}</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{profile.designation} • {profile.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Official Employee ID</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input type="text" readOnly className="w-full pl-12 pr-4 py-4 bg-slate-100 border border-slate-200 rounded-2xl font-black text-sm text-slate-500 cursor-not-allowed" value={profile.employeeId || 'Not Assigned'} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Reporting To</label>
                  <div className="relative">
                    <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input type="text" readOnly className="w-full pl-12 pr-4 py-4 bg-slate-100 border border-slate-200 rounded-2xl font-black text-sm text-slate-500 cursor-not-allowed" value={profile.managerName || 'No Direct Manager'} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" value={profile.name || ''} onChange={e => setProfile({...profile, name: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input type="email" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" value={profile.email || ''} onChange={e => setProfile({...profile, email: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'GENERAL' && isAdmin && (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 space-y-12 animate-in slide-in-from-left-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={14} className="text-indigo-600" /> Fixed Shift Hours</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase px-1">Office Start</label><input type="time" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs" value={config.officeStartTime} onChange={e => setConfig({...config, officeStartTime: e.target.value})} /></div>
                    <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase px-1">Office End</label><input type="time" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs" value={config.officeEndTime} onChange={e => setConfig({...config, officeEndTime: e.target.value})} /></div>
                  </div>
                </div>
                <div className="space-y-6">
                   <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Mail size={14} className="text-indigo-600" /> Communication Diagnostic</h4>
                   <button onClick={testEmailConnection} disabled={isTestingEmail} className="w-full py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all">
                      {isTestingEmail ? <RefreshCw className="animate-spin" size={14}/> : <Send size={14}/>} Test SMTP Delivery
                   </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'INFRASTRUCTURE' && isAdmin && (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 space-y-8 animate-in slide-in-from-right-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2"><Server className="text-indigo-600" /> Backend Infrastructure</h3>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">PocketBase SDK</span>
              </div>
              <div className="space-y-4">
                <input type="text" placeholder="http://192.168.x.x:8090" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" value={pbConfig.url} onChange={e => setPbConfig({...pbConfig, url: e.target.value})} />
                <button onClick={testBackend} disabled={testingBackend} className="w-full py-4 bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2">
                  {testingBackend ? <RefreshCw className="animate-spin" size={14} /> : <Activity size={14} />} Verify Connection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button onClick={handleSave} disabled={isSaving} className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl transition-all flex items-center gap-3">
          {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />} 
          {activeTab === 'PROFILE' ? 'Update My Info' : 'Commit Changes'}
        </button>
      </div>
    </div>
  );
};

export default Settings;