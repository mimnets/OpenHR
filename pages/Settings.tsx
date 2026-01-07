
import React, { useState } from 'react';
import { 
  Building2, 
  ShieldAlert, 
  Cloud, 
  Bell, 
  Globe, 
  Database,
  CheckCircle,
  User as UserIcon,
  Save,
  Mail,
  Phone
} from 'lucide-react';
import { hrService } from '../services/hrService';

const Settings: React.FC = () => {
  const currentUser = hrService.getCurrentUser();
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    mobile: (currentUser as any)?.mobile || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Personal & System Settings</h1>
        <p className="text-sm text-slate-500">Manage your profile and organization configurations</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          
          {/* Personal Profile (Newly Working) */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
              <UserIcon className="text-blue-500" /> Personal Account
            </h3>
            <form onSubmit={handleProfileSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" 
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="email" 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" 
                      value={profileData.mobile}
                      onChange={(e) => setProfileData({...profileData, mobile: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Role / Designation</label>
                  <input 
                    type="text" 
                    disabled
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-sm cursor-not-allowed" 
                    value={`${currentUser?.role} - ${currentUser?.designation}`}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                {saveStatus ? (
                  <p className="text-sm font-bold text-emerald-600 animate-in fade-in">{saveStatus}</p>
                ) : <div />}
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:bg-blue-400"
                >
                  {isSaving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>

          {/* Company Settings (Admin Only) */}
          {['ADMIN', 'HR'].includes(currentUser?.role || '') && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                <Building2 className="text-blue-500" /> Company Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Legal Entity Name</label>
                  <input type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl" defaultValue="Probashi Solutions Ltd." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Trade License / BIN</label>
                  <input type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl" defaultValue="BD-9988-7766-55" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cloud & Backup Sidebar */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
              <Cloud className="text-blue-400" /> Cloud Backup
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Connected Account</p>
                  <p className="text-sm font-semibold truncate max-w-[140px]">{currentUser?.email}</p>
                </div>
              </div>
              
              <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-900/50 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                <Database size={20} /> Backup to Drive
              </button>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 justify-center">
                <CheckCircle size={12} className="text-emerald-500" /> Last Backup: 2 hours ago
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
