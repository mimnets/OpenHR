
// Added React to imports to resolve namespace error
import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Search,
  UserCheck,
  Camera,
  X,
  LogOut,
  Navigation,
  RefreshCw,
  MessageSquare,
  History,
  ShieldCheck,
  CameraOff,
  Maximize2,
  AlertCircle,
  Eye,
  Activity,
  Loader2
} from 'lucide-react';
import { hrService } from '../services/hrService';
import { OFFICE_LOCATIONS } from '../constants.tsx';
import { Attendance as AttendanceType } from '../types';

const Attendance: React.FC<{ user: any }> = ({ user }) => {
  const isAdmin = user.role === 'ADMIN' || user.role === 'HR';
  const [currentTime, setCurrentTime] = useState(new Date());
  const [status, setStatus] = useState<'idle' | 'pushed' | 'loading'>('idle');
  const [activeRecord, setActiveRecord] = useState<AttendanceType | undefined>(undefined);
  const [todayHistory, setTodayHistory] = useState<AttendanceType[]>([]);
  const [allAttendance, setAllAttendance] = useState<AttendanceType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [remarks, setRemarks] = useState('');
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isReconciling, setIsReconciling] = useState(false);
  const [previewSelfie, setPreviewSelfie] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Initial data sync sequence
    const initData = async () => {
      setIsInitialLoading(true);
      try {
        await refreshData();
        detectLocation();
        await initCamera();
      } finally {
        setIsInitialLoading(false);
      }
    };

    initData();
    
    return () => {
      clearInterval(timer);
      stopCamera();
    };
  }, [user.id]);

  const refreshData = async () => {
    try {
      const active = await hrService.getActiveAttendance(user.id);
      setActiveRecord(active);
      
      const today = await hrService.getTodayAttendance(user.id);
      setTodayHistory(today);
      
      if (isAdmin) {
        const all = await hrService.getAttendance();
        setAllAttendance(all);
      }
    } catch (e) {
      console.error("Refresh failed", e);
    }
  };

  const handleReconcile = async () => {
    setIsReconciling(true);
    try {
      const count = await hrService.autoCheckOutStaleSessions();
      alert(`Reconciliation complete. ${count} session(s) automatically clocked out.`);
      await refreshData();
    } catch (e) {
      alert("Failed to reconcile sessions.");
    } finally {
      setIsReconciling(false);
    }
  };

  const initCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      streamRef.current = stream;
      setCameraEnabled(true);
      setCameraError(null);
      
      // Delay setting srcObject slightly to ensure DOM is ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Suppress AbortError which occurs when a play request is interrupted by a load request
          videoRef.current.play().catch(e => {
            if (e.name !== 'AbortError') console.error("Video play failed:", e);
          });
        }
      }, 100);
    } catch (err) {
      console.error("Camera Init Error:", err);
      setCameraError("Camera access required for verification.");
      setCameraEnabled(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
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
        },
        () => setLocation(null),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  const captureSelfie = (): string | null => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.8);
      }
    }
    return null;
  };

  const handlePunch = async () => {
    if (!location) {
      alert("Location lock required.");
      detectLocation();
      return;
    }

    if (!activeRecord && status === 'loading') return;

    const selfieData = captureSelfie();
    if (!selfieData && !activeRecord) {
      alert("Biometric verification (Selfie) required for clock-in.");
      initCamera();
      return;
    }
    
    setStatus('loading');
    try {
      const punchTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      
      if (activeRecord) {
        await hrService.updateAttendance(activeRecord.id, { 
          checkOut: punchTime, 
          remarks: remarks || activeRecord.remarks 
        });
      } else {
        const newRecord: AttendanceType = {
          id: '', 
          employeeId: user.id, 
          employeeName: user.name, 
          date: new Date().toISOString().split('T')[0],
          checkIn: punchTime, 
          status: 'PRESENT', 
          location: { lat: location.lat, lng: location.lng, address: location.address },
          selfie: selfieData || '', 
          remarks: remarks || undefined
        };
        await hrService.saveAttendance(newRecord);
      }
      
      setStatus('pushed');
      setRemarks('');
      
      if (activeRecord) setActiveRecord(undefined);
      
      await refreshData();
      setTimeout(() => setStatus('idle'), 2500);
    } catch (err: any) {
      alert("Attendance verification failed: " + err.message);
      setStatus('idle');
    }
  };

  const getStatusBadge = (status: AttendanceType['status']) => {
    switch (status) {
      case 'LATE': return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md text-[8px] font-black uppercase flex items-center gap-1"><Clock size={10} /> Late</span>;
      case 'EARLY_OUT': return <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-md text-[8px] font-black uppercase flex items-center gap-1"><AlertCircle size={10} /> Early Exit</span>;
      case 'PRESENT': return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md text-[8px] font-black uppercase flex items-center gap-1"><CheckCircle2 size={10} /> Present</span>;
      default: return <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[8px] font-black uppercase">{status}</span>;
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 text-slate-400">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
        <p className="text-xs font-black uppercase tracking-widest animate-pulse">Initializing Security Protocol...</p>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Organization Attendance Logs</h1>
            <p className="text-slate-500 font-medium tracking-tight">Monitoring compliance with shift policies and biometric verification</p>
          </div>
          <button 
            onClick={handleReconcile}
            disabled={isReconciling}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl transition-all disabled:opacity-50"
          >
            {isReconciling ? <RefreshCw size={14} className="animate-spin" /> : <Activity size={14} />}
            Force Global Reconcile
          </button>
        </header>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by staff name..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100">
                  <th className="pb-4 px-4">Employee & Verification</th>
                  <th className="pb-4 text-center">Status</th>
                  <th className="pb-4 text-center">Punch Details</th>
                  <th className="pb-4 text-center">GPS Tracking</th>
                  <th className="pb-4 text-right pr-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allAttendance.filter(r => (r.employeeName || '').toLowerCase().includes(searchTerm.toLowerCase())).map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-4">
                        <div 
                          onClick={() => row.selfie && setPreviewSelfie(row.selfie)}
                          className="w-14 h-14 rounded-xl border border-slate-100 overflow-hidden bg-slate-100 shadow-sm cursor-zoom-in group relative"
                        >
                          {row.selfie && <img src={row.selfie} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />}
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                             <Eye size={16} className="text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 leading-none">{row.employeeName}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{row.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex justify-center">{getStatusBadge(row.status)}</div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex flex-col items-center">
                         <span className="text-sm font-black text-slate-900 tabular-nums">IN: {row.checkIn}</span>
                         <span className={`text-[10px] font-bold tabular-nums mt-0.5 ${row.checkOut ? 'text-slate-400' : 'text-emerald-500 animate-pulse font-black'}`}>{row.checkOut ? `OUT: ${row.checkOut}` : 'LIVE SESSION'}</span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                       <div className="flex flex-col">
                          <p className="text-[10px] font-black text-slate-900 uppercase leading-none">{row.location?.address}</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-1 tabular-nums">
                            {row.location?.lat.toFixed(6)}, {row.location?.lng.toFixed(6)}
                          </p>
                       </div>
                    </td>
                    <td className="py-4 text-right pr-4 max-w-[200px]">
                      {row.remarks ? <p className="text-[11px] font-medium text-slate-500 italic leading-tight">"{row.remarks}"</p> : <span className="text-[10px] text-slate-300">N/A</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {previewSelfie && (
          <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[150] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
             <button onClick={() => setPreviewSelfie(null)} className="absolute top-8 right-8 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all"><X size={32}/></button>
             <div className="max-w-4xl w-full aspect-square md:aspect-video rounded-[3rem] overflow-hidden border-8 border-white/10 shadow-2xl relative">
                <img src={previewSelfie} className="w-full h-full object-cover scale-x-[-1]" />
                <div className="absolute bottom-10 left-10 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-white">
                   <p className="text-[10px] font-black uppercase tracking-widest">Biometric Identity Verification</p>
                   <p className="text-xs font-medium opacity-80">Full Resolution Capture</p>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className={`rounded-[40px] shadow-2xl overflow-hidden border transition-all duration-700 ${activeRecord ? 'border-emerald-100' : 'border-indigo-100'}`}>
        <div className={`p-10 md:p-12 text-center text-white relative transition-all duration-700 ${activeRecord ? 'bg-gradient-to-br from-emerald-900 to-slate-900' : 'bg-gradient-to-br from-slate-900 to-indigo-900'}`}>
          <div className="md:absolute md:top-6 md:left-6 mb-4 md:mb-0 inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5 backdrop-blur-md">
            <ShieldCheck size={14} className={activeRecord ? 'text-emerald-400' : 'text-indigo-400'} />
            Biometric Station
          </div>
          <h2 className="text-6xl sm:text-7xl md:text-8xl font-black mb-4 tracking-tighter tabular-nums drop-shadow-2xl">
            {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </h2>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-2 text-white/80 font-bold text-sm tracking-wide">
              <MapPin size={16} className="text-indigo-400" />
              {location ? location.address : 'Acquiring GPS Signal...'}
            </div>
            {location && (
              <p className="text-[10px] font-mono opacity-50">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
            )}
          </div>
        </div>

        <div className="p-8 md:p-12 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="relative">
                <div className={`w-full aspect-video rounded-[48px] overflow-hidden border-8 relative shadow-xl transition-all duration-500 ${activeRecord ? 'border-emerald-50 bg-emerald-100/20' : 'border-slate-50 bg-slate-100'}`}>
                  {status === 'loading' ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-20">
                      <div className={`w-12 h-12 border-4 rounded-full animate-spin ${activeRecord ? 'border-emerald-600 border-t-transparent' : 'border-indigo-600 border-t-transparent'}`}></div>
                    </div>
                  ) : status === 'pushed' ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-500 text-white z-20 animate-in zoom-in duration-300">
                      <CheckCircle2 size={64} />
                      <h3 className="text-2xl font-black uppercase tracking-tighter mt-4">Verified</h3>
                    </div>
                  ) : cameraEnabled ? (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                      <CameraOff size={48} className="text-slate-300" />
                      <button onClick={initCamera} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase">Enable Verification</button>
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              </div>
              <textarea 
                placeholder="Log activities for this session..."
                className={`w-full p-5 rounded-[32px] text-sm font-bold min-h-[120px] outline-none shadow-sm border transition-all resize-none ${activeRecord ? 'bg-emerald-50/30 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
              />
              <button 
                onClick={handlePunch}
                disabled={!location || status !== 'idle' || !cameraEnabled}
                className={`w-full py-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-sm shadow-2xl transition-all disabled:opacity-40 flex items-center justify-center gap-4 ${
                  activeRecord ? 'bg-rose-600 text-white shadow-rose-100' : 'bg-indigo-600 text-white shadow-indigo-100'
                }`}
              >
                {activeRecord ? <LogOut size={24} /> : <Camera size={24} />}
                {activeRecord ? 'Clock Out' : 'Clock In'}
              </button>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className={`p-6 rounded-[32px] border flex flex-col justify-between h-40 transition-all ${location ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100 animate-pulse'}`}>
                   <Navigation size={20} className="text-indigo-500" />
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">GPS Lock</p>
                      <p className="text-sm font-black text-slate-900 truncate leading-tight">{location ? location.address : 'Scanning...'}</p>
                   </div>
                </div>
                <div className="p-6 rounded-[32px] border bg-indigo-50 border-indigo-100 flex flex-col justify-between h-40">
                   <ShieldCheck size={20} className="text-indigo-500" />
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Biometric Status</p>
                      <p className="text-sm font-black text-slate-900 leading-tight">{cameraEnabled ? 'Live Feed Active' : 'Offline'}</p>
                   </div>
                </div>
              </div>
              <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 flex-1 overflow-hidden flex flex-col">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 mb-6">
                  <History size={20} className="text-indigo-600" /> Personal Daily Log
                </h3>
                <div className="space-y-4 overflow-y-auto pr-1 flex-1 no-scrollbar">
                   {todayHistory.length === 0 ? (
                      <div className="py-12 text-center text-slate-300">
                        <p className="text-xs font-black uppercase">No records today</p>
                      </div>
                   ) : todayHistory.map((h, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl group">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm overflow-hidden">
                               {h.selfie && <img src={h.selfie} className="w-full h-full object-cover" />}
                            </div>
                            <div>
                               <p className="text-[10px] font-bold text-slate-500">In: {h.checkIn} — {h.checkOut || 'Active'}</p>
                               <div className="mt-1">{getStatusBadge(h.status)}</div>
                            </div>
                         </div>
                         <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${h.checkOut ? 'bg-slate-200 text-slate-400' : 'bg-emerald-500 text-white animate-pulse'}`}>
                            {h.checkOut ? 'Completed' : 'Running'}
                         </div>
                      </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
