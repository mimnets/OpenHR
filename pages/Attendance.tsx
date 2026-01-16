// Add React to the import list to resolve namespace errors
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  MapPin, 
  Clock, 
  X, 
  LogOut, 
  RefreshCw, 
  History, 
  ShieldCheck, 
  CameraOff, 
  Activity, 
  Loader2,
  ChevronRight,
  TrendingUp,
  CalendarCheck,
  UserMinus,
  Briefcase,
  Search,
  Edit2,
  Trash2,
  Save,
  Camera,
  Filter,
  Building2,
  Building
} from 'lucide-react';
import { hrService } from '../services/hrService';
import { OFFICE_LOCATIONS } from '../constants.tsx';
import { Attendance as AttendanceType, LeaveRequest, AppConfig } from '../types';

const Attendance: React.FC<{ user: any }> = ({ user }) => {
  const isAdmin = user.role === 'ADMIN' || user.role === 'HR';
  const [currentTab, setCurrentTab] = useState<'STATION' | 'ACTIVITY'>(isAdmin ? 'ACTIVITY' : 'STATION');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [status, setStatus] = useState<'idle' | 'pushed' | 'loading'>('idle');
  const [activeRecord, setActiveRecord] = useState<AttendanceType | undefined>(undefined);
  const [allAttendance, setAllAttendance] = useState<AttendanceType[]>([]);
  const [userLeaves, setUserLeaves] = useState<LeaveRequest[]>([]);
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [remarks, setRemarks] = useState('');
  const [dutyType, setDutyType] = useState<'OFFICE' | 'FACTORY'>('OFFICE');
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);
  const [previewSelfie, setPreviewSelfie] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  // Admin Search/Edit states
  const [adminSearch, setAdminSearch] = useState('');
  const [editingRecord, setEditingRecord] = useState<AttendanceType | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const refreshData = useCallback(async () => {
    try {
      const [active, allAtt, allLeaves, config] = await Promise.all([
        hrService.getActiveAttendance(user.id),
        hrService.getAttendance(),
        hrService.getLeaves(),
        hrService.getConfig()
      ]);
      
      setActiveRecord(active);
      setAllAttendance(allAtt);
      setUserLeaves(allLeaves.filter(l => l.employeeId === user.id));
      setAppConfig(config);
      setDataError(null);
    } catch (e: any) {
      setDataError('Failed to sync records');
    }
  }, [user.id]);

  const analytics = useMemo(() => {
    const userRecords = allAttendance.filter(a => a.employeeId === user.id);
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyRecords = userRecords.filter(a => {
      const d = new Date(a.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    return {
      present: monthlyRecords.filter(a => a.status === 'PRESENT').length,
      late: monthlyRecords.filter(a => a.status === 'LATE').length,
      absent: monthlyRecords.filter(a => a.status === 'ABSENT').length,
      pendingLeaves: userLeaves.filter(l => l.status.startsWith('PENDING')).length,
      totalLeavesThisYear: userLeaves.filter(l => l.status === 'APPROVED' && new Date(l.startDate).getFullYear() === currentYear).reduce((acc, l) => acc + l.totalDays, 0),
      lastThreeDays: userRecords.slice(0, 3),
      personalHistory: userRecords.sort((a,b) => b.date.localeCompare(a.date))
    };
  }, [allAttendance, userLeaves, user.id]);

  const filteredAttendance = useMemo(() => {
    if (!isAdmin) return analytics.personalHistory;
    return allAttendance
      .filter(a => 
        (a.employeeName || '').toLowerCase().includes(adminSearch.toLowerCase()) ||
        (a.employeeId || '').toLowerCase().includes(adminSearch.toLowerCase()) ||
        (a.date || '').includes(adminSearch)
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [allAttendance, adminSearch, isAdmin, analytics.personalHistory]);

  const initCamera = useCallback(async () => {
    try {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } } 
      });
      streamRef.current = stream;
      setCameraEnabled(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.warn("Video playback blocked", e));
        }
      }, 300);
    } catch (err: any) {
      setCameraError("Camera access required.");
      setCameraEnabled(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("No GPS");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        let matchedOffice = "Field Area";
        for (const office of OFFICE_LOCATIONS) {
           if (Math.abs(office.lat - lat) < 0.05 && Math.abs(office.lng - lng) < 0.05) {
              matchedOffice = office.name;
              break;
           }
        }
        setLocation({ lat, lng, address: matchedOffice });
        setLocationError(null);
      },
      () => setLocationError("GPS Signal Lost"),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const initData = async () => {
      setIsInitialLoading(true);
      await refreshData();
      detectLocation();
      if (currentTab === 'STATION') await initCamera();
      setIsInitialLoading(false);
    };
    initData();
    return () => { clearInterval(timer); stopCamera(); };
  }, [refreshData, detectLocation]);

  useEffect(() => {
    if (currentTab === 'STATION') initCamera();
    else stopCamera();
  }, [currentTab, initCamera, stopCamera]);

  const handlePunch = async () => {
    if (!location) { detectLocation(); return; }
    if (status === 'loading') return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!video || !canvas) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.translate(canvas.width, 0);
    ctx?.scale(-1, 1);
    ctx?.drawImage(video, 0, 0);
    const selfieData = canvas.toDataURL('image/jpeg', 0.9);

    setStatus('loading');
    try {
      const punchTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      
      if (activeRecord) {
        await hrService.updateAttendance(activeRecord.id, { checkOut: punchTime, remarks });
      } else {
        // LATE LOGIC:
        // Factory Duty is exempt from Late policy.
        // Office Duty uses lateGracePeriod (Defaulting to 5 mins as requested).
        let punchStatus: AttendanceType['status'] = 'PRESENT';
        
        if (dutyType === 'OFFICE' && appConfig) {
          const [pH, pM] = punchTime.split(':').map(Number);
          const [sH, sM] = appConfig.officeStartTime.split(':').map(Number);
          const punchTotal = pH * 60 + pM;
          const startTotal = sH * 60 + sM;
          const grace = 5; // User specifically asked for 5 minute count
          
          if (punchTotal > (startTotal + grace)) {
            punchStatus = 'LATE';
          }
        }

        const finalRemarks = dutyType === 'FACTORY' 
          ? `[FACTORY VISIT: ${remarks}]` 
          : remarks;

        await hrService.saveAttendance({
          id: '', employeeId: user.id, employeeName: user.name, date: new Date().toISOString().split('T')[0],
          checkIn: punchTime, status: punchStatus, location, selfie: selfieData, remarks: finalRemarks
        });
      }
      await refreshData();
      setRemarks('');
      setStatus('pushed');
      setTimeout(() => setStatus('idle'), 2500);
    } catch (err: any) {
      setDataError(err.message);
      setStatus('idle');
    }
  };

  const handleAdminUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    setStatus('loading');
    try {
      await hrService.updateAttendance(editingRecord.id, editingRecord);
      await refreshData();
      setEditingRecord(null);
    } finally {
      setStatus('idle');
    }
  };

  const handleAdminDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this attendance record?")) return;
    try {
      await hrService.deleteAttendance(id);
      await refreshData();
    } catch (e) { alert("Failed to delete."); }
  };

  const getStatusBadge = (s: AttendanceType['status']) => {
    const map: any = {
      'LATE': 'bg-amber-100 text-amber-700',
      'EARLY_OUT': 'bg-rose-100 text-rose-700',
      'PRESENT': 'bg-emerald-100 text-emerald-700',
      'ABSENT': 'bg-slate-100 text-slate-500',
      'LEAVE': 'bg-indigo-100 text-indigo-700'
    };
    return <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${map[s] || 'bg-slate-100 text-slate-500'}`}>{s}</span>;
  };

  if (isInitialLoading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;

  return (
    <div className="h-full flex flex-col space-y-3 animate-in fade-in duration-500 overflow-hidden">
      <div className="flex p-1 bg-white border border-slate-100 rounded-xl shadow-sm self-center">
        <button 
          onClick={() => setCurrentTab('STATION')} 
          className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${currentTab === 'STATION' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}
        >
          <Camera size={12} /> Station
        </button>
        <button 
          onClick={() => setCurrentTab('ACTIVITY')} 
          className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${currentTab === 'ACTIVITY' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}
        >
          <Activity size={12} /> {isAdmin ? 'Organization' : 'Activity'}
        </button>
      </div>

      {currentTab === 'STATION' ? (
        <div className="flex-1 flex flex-col max-w-lg mx-auto w-full space-y-3 min-h-0 pt-1">
          {/* Duty Type Selector */}
          {!activeRecord && (
            <div className="flex gap-2 p-1 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <button 
                onClick={() => setDutyType('OFFICE')}
                className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${dutyType === 'OFFICE' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-400'}`}
              >
                <Building size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Office Duty</span>
              </button>
              <button 
                onClick={() => setDutyType('FACTORY')}
                className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${dutyType === 'FACTORY' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-50 text-slate-400'}`}
              >
                <Building2 size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Factory Duty</span>
              </button>
            </div>
          )}

          <div className={`relative flex-1 rounded-[2rem] overflow-hidden border-[4px] shadow-lg transition-all duration-1000 ${activeRecord ? 'border-emerald-500/10 bg-emerald-950' : 'border-white bg-slate-900'} max-h-[48vh] sm:max-h-[50vh]`}>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
              <div className="bg-black/40 backdrop-blur-lg border border-white/5 px-4 py-1.5 rounded-xl text-white text-center">
                <p className="text-[7px] font-black uppercase tracking-[0.2em] opacity-40">Standard Time</p>
                <p className="text-lg font-black tabular-nums">{currentTime.toLocaleTimeString('en-US', { hour12: false })}</p>
              </div>
            </div>

            {cameraEnabled ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white/40">
                <CameraOff size={32} className="mb-2 opacity-20" />
                <p className="font-black uppercase tracking-widest text-[9px] mb-4">{cameraError || 'Camera Offline'}</p>
                <button onClick={initCamera} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-black uppercase tracking-widest text-[9px]">Enable Camera</button>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
            
            {status === 'loading' && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-white">
                <RefreshCw className="animate-spin mb-2 text-indigo-400" size={32} />
                <p className="font-black uppercase tracking-widest text-[9px]">Verifying...</p>
              </div>
            )}
            
            <div className="absolute bottom-4 left-3 right-3 flex items-center justify-between pointer-events-none gap-2">
              <div className="bg-black/30 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-full text-white">
                 <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest">
                   <MapPin size={10} className={location ? 'text-emerald-400' : 'text-rose-400'} />
                   <span className="truncate max-w-[70px]">{location ? location.address : 'GPS Linking...'}</span>
                 </div>
              </div>
              <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 px-3 py-1.5 rounded-full text-emerald-400 flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest">
                <ShieldCheck size={10} /> Verified
              </div>
            </div>
          </div>

          <div className="space-y-2 bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-md">
            <input 
              type="text"
              placeholder={dutyType === 'FACTORY' ? "Enter Factory Name / Purpose (Required)" : "Session notes (Optional)"}
              className={`w-full px-4 py-3 bg-slate-50 border rounded-lg text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-100 transition-all ${dutyType === 'FACTORY' ? 'border-amber-200' : 'border-slate-200'}`}
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
            />
            <button 
              onClick={handlePunch}
              disabled={!location || status !== 'idle' || !cameraEnabled || (dutyType === 'FACTORY' && !remarks && !activeRecord)}
              className={`w-full py-4 rounded-lg font-black uppercase tracking-[0.1em] text-[11px] shadow-lg transition-all active:scale-[0.97] flex items-center justify-center gap-2 ${
                activeRecord ? 'bg-rose-600 text-white' : dutyType === 'FACTORY' ? 'bg-amber-600 text-white' : 'bg-indigo-600 text-white'
              }`}
            >
              {activeRecord ? <LogOut size={14}/> : <CalendarCheck size={14}/>}
              {activeRecord ? 'End Session' : dutyType === 'FACTORY' ? 'Start Factory Visit' : 'Clock In Now'}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto no-scrollbar space-y-5 animate-in slide-in-from-bottom-8 duration-700">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm col-span-2 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><CalendarCheck size={18} /></div>
                <span className="text-[7px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Monthly</span>
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900 tabular-nums">{analytics.present}</h4>
                <p className="text-[7px] text-slate-400 font-bold uppercase mt-0.5">Days Logged</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg w-fit mb-2"><Clock size={18} /></div>
              <div>
                <h4 className="text-lg font-black text-slate-900 tabular-nums">{analytics.late}</h4>
                <p className="text-[7px] text-slate-400 font-black uppercase">Late</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg w-fit mb-2"><UserMinus size={18} /></div>
              <div>
                <h4 className="text-lg font-black text-slate-900 tabular-nums">{analytics.absent}</h4>
                <p className="text-[7px] text-slate-400 font-black uppercase">Absent</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-between col-span-2">
              <div className="flex justify-between items-start mb-3">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Briefcase size={18} /></div>
                <span className="text-[7px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Leaves</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                   <h4 className="text-lg font-black text-slate-900 tabular-nums">{analytics.totalLeavesThisYear}</h4>
                   <p className="text-[7px] text-slate-400 font-black uppercase tracking-tight">Approved</p>
                </div>
                <div>
                   <h4 className="text-lg font-black text-slate-900 tabular-nums">{analytics.pendingLeaves}</h4>
                   <p className="text-[7px] text-slate-400 font-black uppercase tracking-tight">Pending</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <History size={18} className="text-indigo-600" /> {isAdmin ? 'Organization Audit' : 'My Audit'}
                </h3>
                {isAdmin && (
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Search employee name, ID or date..."
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold outline-none"
                      value={adminSearch}
                      onChange={e => setAdminSearch(e.target.value)}
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                {filteredAttendance.map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl group hover:bg-white hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white shadow-sm overflow-hidden flex items-center justify-center cursor-zoom-in" onClick={() => h.selfie && setPreviewSelfie(h.selfie)}>
                        {h.selfie ? <img src={h.selfie} className="w-full h-full object-cover" /> : <Clock size={14} className="text-slate-200" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <p className="text-xs font-black text-slate-900 tabular-nums">{new Date(h.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                           {isAdmin && <span className="text-[8px] font-black text-indigo-500 uppercase tracking-tight bg-indigo-50 px-1.5 py-0.5 rounded-md">{h.employeeName}</span>}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[8px] font-bold text-slate-400 uppercase tracking-tight">
                          {h.checkIn} — {h.checkOut || <span className="text-indigo-600 animate-pulse">Live</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(h.status)}
                      {isAdmin && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => setEditingRecord(h)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={12}/></button>
                           <button onClick={() => handleAdminDelete(h.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={12}/></button>
                        </div>
                      )}
                      <ChevronRight size={14} className="text-slate-300" />
                    </div>
                  </div>
                ))}
                {filteredAttendance.length === 0 && (
                  <div className="py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">
                    No matching records found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal for Admin */}
      {editingRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[160] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in">
             <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
                <h3 className="text-sm font-black uppercase tracking-widest">Adjust Session</h3>
                <button onClick={() => setEditingRecord(null)}><X size={24}/></button>
             </div>
             <form onSubmit={handleAdminUpdate} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Check In</label>
                    <input type="time" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" value={editingRecord.checkIn} onChange={e => setEditingRecord({...editingRecord, checkIn: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Check Out</label>
                    <input type="time" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" value={editingRecord.checkOut} onChange={e => setEditingRecord({...editingRecord, checkOut: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Date</label>
                  <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" value={editingRecord.date} onChange={e => setEditingRecord({...editingRecord, date: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Status</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" value={editingRecord.status} onChange={e => setEditingRecord({...editingRecord, status: e.target.value as any})}>
                    <option value="PRESENT">Present</option>
                    <option value="LATE">Late</option>
                    <option value="ABSENT">Absent</option>
                    <option value="EARLY_OUT">Early Out</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setEditingRecord(null)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest">Cancel</button>
                  <button type="submit" disabled={status === 'loading'} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                    {status === 'loading' ? <RefreshCw className="animate-spin" size={14}/> : <Save size={14}/>} Commit Edit
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {previewSelfie && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl z-[150] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300" onClick={() => setPreviewSelfie(null)}>
           <div className="max-w-md w-full aspect-square rounded-[2rem] overflow-hidden border-4 border-white/5 shadow-2xl relative">
              <img src={previewSelfie} className="w-full h-full object-cover scale-x-[-1]" />
              <button className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-white hover:text-black transition-all" onClick={() => setPreviewSelfie(null)}>
                <X size={16} />
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;