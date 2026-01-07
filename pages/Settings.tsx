
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
  UserCircle
} from 'lucide-react';
import { hrService } from '../services/hrService';
import { googleDriveService } from '../services/googleDriveService';

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

  const handleGoogleConnect = async () => {
    try {
      await googleDriveService.connect();
      setIsGoogleConnected(true);
      alert('Google Drive connected successfully!');
      loadFolders();
      setShowFolderModal(true);
    } catch (err) {
      alert('Failed to connect to Google. Ensure you have a valid Client ID configured.');
    }
  };

  const handleGoogleDisconnect = () => {
    if (confirm('Disconnect your Google account? Automatic cloud sync will be disabled.')) {
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
    if (!confirm('Warning: Restoring data will overwrite your current local records. Are you sure?')) return;
    try {
      const content = await googleDriveService.downloadFile(fileId);
      hrService.importFullData(content);
    } catch (err: any) {
      alert(`Restore failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-sm font-bold transition-all" 
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="email" 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-sm font-bold transition-all" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-sm font-bold transition-all" 
                      value={profileData.mobile}
                      onChange={(e) => setProfileData({...profileData, mobile: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Access Tier</label>
                  <input 
                    type="text" 
                    disabled
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 text-sm font-bold cursor-not-allowed" 
                    value={`${currentUser?.role} - ${currentUser?.designation}`}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                {saveStatus ? (
                  <p className="text-xs font-bold text-emerald-600 animate-in fade-in">{saveStatus}</p>
                ) : <div />}
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Processing...' : <><Save size={16} /> Update Account</>}
                </button>
              </div>
            </form>
          </div>

          {/* Company Settings (Admin Only) */}
          {isAdmin && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 animate-in slide-in-from-bottom-2">
              <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Building2 size={20} />
                </div>
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Legal Corporate Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" defaultValue="OpenHR Solutions Ltd." />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tax / BIN Identification</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" defaultValue="BD-9988-7766-55" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Google Drive & Cloud Infrastructure (Admin Only) */}
        {isAdmin && (
          <div className="space-y-8 animate-in slide-in-from-right-4">
            <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              
              <h3 className="text-xl font-black mb-8 flex items-center gap-3 relative z-10">
                <Cloud className="text-indigo-400" /> Cloud Sync Engine
              </h3>
              
              <div className="space-y-8 relative z-10">
                {!isGoogleConnected ? (
                   <div className="space-y-6">
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                         <p className="text-xs text-slate-400 leading-relaxed">
                            Connect your Google Drive to enable automatic organizational synchronization and secure cloud storage.
                         </p>
                      </div>
                      <button 
                        onClick={handleGoogleConnect}
                        className="w-full py-5 bg-white text-slate-900 rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Globe size={20} className="text-indigo-600" /> Connect Google Account
                      </button>
                   </div>
                ) : (
                   <div className="space-y-6">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                                <CheckCircle size={20} />
                              </div>
                              <div>
                                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest leading-none mb-1">Authenticated</p>
                                <p className="text-xs font-bold">Google Cloud Active</p>
                              </div>
                          </div>
                          <button onClick={handleGoogleDisconnect} title="Change Account / Disconnect" className="p-2 bg-white/5 hover:bg-rose-500/20 rounded-xl text-slate-400 hover:text-rose-400 transition-all">
                            <Unlink size={18} />
                          </button>
                        </div>

                        <button 
                          onClick={() => { loadFolders(); setShowFolderModal(true); }}
                          className="flex items-center justify-between w-full p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-left"
                        >
                          <div className="flex items-center gap-3">
                            <Folder size={18} className="text-indigo-400" />
                            <div>
                              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Target Folder</p>
                              <p className="text-xs font-bold truncate max-w-[120px]">{selectedFolder.name}</p>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-slate-600" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                         <button 
                           onClick={handleBackupNow}
                           disabled={isSyncing}
                           className="flex flex-col items-center gap-2 p-5 bg-indigo-600 rounded-3xl font-black uppercase tracking-widest text-[9px] hover:bg-indigo-700 transition-all disabled:opacity-50"
                         >
                            {isSyncing ? <RefreshCw className="animate-spin" size={20} /> : <RefreshCw size={20} />}
                            Sync Now
                         </button>
                         <button 
                           onClick={() => setShowRestoreModal(true)}
                           className="flex flex-col items-center gap-2 p-5 bg-white/5 border border-white/10 rounded-3xl font-black uppercase tracking-widest text-[9px] hover:bg-white/10 transition-all"
                         >
                            <Download size={20} className="text-indigo-400" />
                            Restore
                         </button>
                      </div>

                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span>Folder Backups</span>
                            <button onClick={loadBackups} className="text-indigo-400 hover:underline">Refresh</button>
                         </div>
                         <div className="space-y-2 max-h-32 overflow-y-auto no-scrollbar">
                            {backups.slice(0, 3).map(b => (
                               <div key={b.id} className="flex items-center justify-between text-xs">
                                  <span className="truncate pr-2 opacity-80">{b.name}</span>
                                  <span className="text-[9px] text-slate-500 whitespace-nowrap">{new Date(b.createdTime).toLocaleDateString()}</span>
                               </div>
                            ))}
                            {backups.length === 0 && <p className="text-[10px] text-slate-600 italic">No sync file found in folder.</p>}
                         </div>
                      </div>
                   </div>
                )}
                
                <div className="flex items-center gap-2 text-[10px] text-slate-500 justify-center">
                  <div className={`w-2 h-2 rounded-full ${isGoogleConnected ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`}></div>
                  {isGoogleConnected ? 'Live Connection Established' : 'Cloud Engine Offline'}
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-200">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Security Integrity</p>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Only you have access to your Google Drive data. Selecting a specific folder organizes your backups and keeps your Drive clean.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Restore Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
             <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400"><Download size={24}/></div>
                   <h3 className="text-xl font-black uppercase tracking-tight">Cloud Data Restore</h3>
                </div>
                <button onClick={() => setShowRestoreModal(false)} className="hover:bg-white/10 p-2 rounded-xl transition-all"><X size={28} /></button>
             </div>
             
             <div className="p-8 space-y-6">
                <div className="p-5 bg-rose-50 border border-rose-100 rounded-3xl flex items-start gap-4">
                   <AlertCircle className="text-rose-600 shrink-0 mt-1" size={20} />
                   <p className="text-xs font-bold text-rose-800 leading-relaxed uppercase">
                      CRITICAL: Restoring from a backup will replace ALL current data on this device with the cloud version. 
                   </p>
                </div>

                <div className="space-y-3">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Source: {selectedFolder.name}</p>
                   <div className="space-y-2 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                      {backups.map((b) => (
                         <div key={b.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all">
                            <div className="flex items-center gap-3">
                               <FileJson className="text-indigo-400" size={18} />
                               <div>
                                  <p className="text-sm font-bold text-slate-900">{b.name}</p>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                     <Clock size={10} /> {new Date(b.createdTime).toLocaleString()}
                                  </p>
                               </div>
                            </div>
                            <button 
                               onClick={() => handleRestore(b.id)}
                               className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-all active:scale-95"
                            >
                               Restore
                            </button>
                         </div>
                      ))}
                      {backups.length === 0 && (
                         <div className="py-12 text-center text-slate-300">
                            <Cloud size={48} className="mx-auto mb-2 opacity-20" />
                            <p className="text-xs font-black uppercase">No sync file in this folder</p>
                         </div>
                      )}
                   </div>
                </div>

                <button 
                  onClick={() => setShowRestoreModal(false)}
                  className="w-full py-4 bg-slate-100 text-slate-700 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Folder Selection Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[115] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-300">
             <div className="bg-indigo-600 p-8 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white/20 rounded-xl"><Folder size={24}/></div>
                   <h3 className="text-xl font-black uppercase tracking-tight">Select Sync Folder</h3>
                </div>
                <button onClick={() => setShowFolderModal(false)} className="hover:bg-white/10 p-2 rounded-xl transition-all"><X size={28} /></button>
             </div>
             
             <div className="p-8 space-y-6">
                <p className="text-xs font-medium text-slate-500 leading-relaxed italic">
                  Choose which folder to use for automatic organization synchronization. Root Drive is used by default.
                </p>

                <div className="space-y-2">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Available Folders</p>
                   <div className="space-y-1.5 max-h-[300px] overflow-y-auto no-scrollbar">
                      {isLoadingFolders ? (
                         <div className="py-12 flex flex-col items-center justify-center gap-4">
                            <RefreshCw className="animate-spin text-indigo-600" size={32} />
                            <p className="text-[10px] font-black text-slate-400 uppercase">Fetching Drive Map...</p>
                         </div>
                      ) : (
                        availableFolders.map((f) => (
                          <button 
                            key={f.id} 
                            onClick={() => handleFolderSelect(f.id, f.name)}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${selectedFolder.id === f.id ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-white hover:border-indigo-100 hover:shadow-sm'}`}
                          >
                            <div className="flex items-center gap-3">
                               <Folder size={18} className={selectedFolder.id === f.id ? 'text-indigo-600' : 'text-slate-400'} />
                               <span className="text-sm font-bold">{f.name}</span>
                            </div>
                            {selectedFolder.id === f.id && <CheckCircle size={16} className="text-indigo-600" />}
                          </button>
                        ))
                      )}
                   </div>
                </div>

                <div className="pt-4 border-t border-slate-50">
                  <button 
                    onClick={() => setShowFolderModal(false)}
                    className="w-full py-4 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-xl"
                  >
                    Confirm Selection
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
