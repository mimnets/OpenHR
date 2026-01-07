
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
  History
} from 'lucide-react';
import { hrService } from '../services/hrService';
import { DEPARTMENTS, OFFICE_LOCATIONS } from '../constants.tsx';
import { Attendance as AttendanceType } from '../types';

const Attendance: React.FC<{ user: any }> = ({ user }) => {
  const isAdmin = user.role === 'ADMIN' || user.role === 'HR';
  const [currentTime, setCurrentTime] = useState(new Date());
  const [status, setStatus] = useState<'idle' | 'pushed' | 'loading' | 'camera' | 'preparing'>('idle');
  const [activeRecord, setActiveRecord] = useState<AttendanceType | undefined>(undefined);
  const [todayHistory, setTodayHistory] = useState<AttendanceType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [remarks, setRemarks] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    refreshData();
    detectLocation();
    
    return () => {
      clearInterval(timer);
      stopCamera();
    };
  }, [user.id]);

  const refreshData = () => {
    setActiveRecord(hrService.getActiveAttendance(user.id));
    setTodayHistory(hrService.getTodayAttendance(user.id));
  };

  useEffect(() => {
    if (status === 'camera' && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [status]);

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          
          let matchedOffice = "Authorized Zone";
          for (const office of OFFICE_LOCATIONS) {
             if (Math.abs(office.lat - lat) < 0.05 && Math.abs(office.lng - lng) < 0.05) {
                matchedOffice = office.name;
                break;
             }
          }

          setLocation({
            lat,
            lng,
            address: matchedOffice
          });
        },
        (err) => {
          console.error("Location access denied", err);
          setLocation(null);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      streamRef.current = stream;
      setStatus('camera');
    } catch (err) {
      alert("Camera permission denied. Please enable camera access to verify identity.");
      console.error(err);
      setStatus('preparing');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const captureSelfie = (): string | null => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
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

  const handleClockIn = () => {
    const selfieData = captureSelfie();
    if (!selfieData) {
      alert("Verification failed. Please ensure your face is visible.");
      return;
    }

    setStatus('loading');
    stopCamera();

    setTimeout(() => {
      const punchTime = new Date().toLocaleTimeString('en-US', { hour12: true });
      const newRecord: AttendanceType = {
        id: Math.random().toString(36).substr(2, 9),
        employeeId: user.id,
        employeeName: user.name,
        date: new Date().toISOString().split('T')[0],
        checkIn: punchTime,
        status: 'PRESENT',
        location: location ? { lat: location.lat, lng: location.lng, address: location.address } : undefined,
        selfie: selfieData || undefined,
        remarks: remarks || undefined
      };
      
      hrService.saveAttendance(newRecord);
      refreshData();
      setStatus('pushed');
      setRemarks('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1200);
  };

  const handleClockOut = () => {
    if (!activeRecord) return;
    
    const outTime = new Date().toLocaleTimeString('en-US', { hour12: true });
    hrService.updateAttendance(activeRecord.id, {
      checkOut: outTime,
      remarks: remarks || activeRecord.remarks
    });
    
    refreshData();
    setShowExitModal(false);
    setRemarks('');
    alert("Clock-Out recorded at " + outTime);
  };

  if (isAdmin) {
    const allAttendance = hrService.getAttendance();
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <header>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Organization Attendance</h1>
          <p className="text-slate-500 font-medium">Monitoring and compliance logs</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><UserCheck size={24} /></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Total Sessions Today</p>
              <h4 className="text-2xl font-black text-slate-900">{allAttendance.filter(a => a.date === new Date().toISOString().split('T')[0]).length}</h4>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Navigation size={24} /></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Active Now</p>
              <h4 className="text-2xl font-black text-slate-900">{allAttendance.filter(a => !a.checkOut).length}</h4>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><AlertTriangle size={24} /></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Early Exits</p>
              <h4 className="text-2xl font-black text-slate-900">{allAttendance.filter(a => !!a.remarks && !!a.checkOut).length}</h4>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search staff..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100">
                  <th className="pb-4">Employee</th>
                  <th className="pb-4 text-center">Time Log</th>
                  <th className="pb-4 text-center">Verification</th>
                  <th className="pb-4 text-right">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allAttendance.filter(r => (r.employeeName || '').toLowerCase().includes(searchTerm.toLowerCase())).reverse().map((row, i) => (
                  <tr key={i}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-slate-100 overflow-hidden bg-slate-50">
                          {row.selfie ? <img src={row.selfie} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-slate-300">{row.employeeName?.[0]}</div>}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-none">{row.employeeName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{row.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex flex-col items-center">
                         <span className="text-sm font-black text-slate-900 tabular-nums">In: {row.checkIn}</span>
                         <span className={`text-[10px] font-bold tabular-nums ${row.checkOut ? 'text-slate-400' : 'text-emerald-500 animate-pulse'}`}>{row.checkOut ? `Out: ${row.checkOut}` : 'ACTIVE SESSION'}</span>
                      </div>
                    </td>
                    <td className="py-4">
                       <div className="flex flex-col items-center">
                         <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1"><MapPin size={10}/> {row.location?.address || 'Verified'}</span>
                         <span className="text-[9px] text-slate-300 font-bold tabular-nums">{row.location?.lat.toFixed(4)}, {row.location?.lng.toFixed(4)}</span>
                       </div>
                    </td>
                    <td className="py-4 text-right max-w-[200px]">
                      {row.remarks ? <p className="text-[11px] font-medium text-slate-500 italic">"{row.remarks}"</p> : <span className="text-[10px] text-slate-300">--</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 md:p-12 text-center bg-gradient-to-br from-slate-900 to-indigo-900 text-white relative">
          <div className="absolute top-4 right-4 bg-white/10 px-3 py-1 rounded-full flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
            Biometric Link Active
          </div>
          <p className="text-indigo-300 font-bold tracking-widest uppercase text-xs mb-3">Organization Time</p>
          <h2 className="text-6xl md:text-7xl font-black mb-4 tracking-tighter tabular-nums">
            {currentTime.toLocaleTimeString('en-US', { hour12: false })}
          </h2>
          <p className="text-indigo-200/60 font-medium text-sm">
            {currentTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="p-8 md:p-12 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border ${location ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600 animate-pulse'}`}>
                    <Navigation size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center justify-between">
                      Location Lock
                      <button onClick={detectLocation} className="hover:text-indigo-600 transition-colors"><RefreshCw size={12}/></button>
                    </p>
                    <p className={`text-lg font-black uppercase tracking-tight ${location ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {location ? 'READY' : 'SCANNING...'}
                    </p>
                    <div className="mt-1 flex flex-col">
                      <p className="text-sm font-bold text-slate-900">{location ? location.address : 'Verifying Geofence...'}</p>
                      {location && <p className="text-[10px] font-medium text-slate-400 tabular-nums">LOC: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-4">
                   <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Today's Activity History</p>
                      <History size={14} className="text-slate-300" />
                   </div>
                   <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
                      {todayHistory.length === 0 ? (
                        <p className="text-center py-4 text-xs font-bold text-slate-300 italic uppercase">No logs for today</p>
                      ) : todayHistory.map((h, i) => (
                        <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                           <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                              <span className="text-[11px] font-bold text-slate-700">In: {h.checkIn}</span>
                           </div>
                           <span className={`text-[11px] font-black tabular-nums ${h.checkOut ? 'text-slate-400' : 'text-emerald-500 animate-pulse'}`}>
                             {h.checkOut ? `Out: ${h.checkOut}` : 'ACTIVE'}
                           </span>
                        </div>
                      ))}
                   </div>
                   {activeRecord && (
                      <button 
                        onClick={() => { setShowExitModal(true); setRemarks(''); }}
                        className="w-full py-4 bg-indigo-50 text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100 flex items-center justify-center gap-2"
                      >
                        <LogOut size={16} /> End Session / Clock Out
                      </button>
                   )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-[48px] border-2 border-dashed border-slate-200 relative overflow-hidden min-h-[400px]">
              {status === 'loading' ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs font-black text-indigo-600 uppercase animate-pulse">Hashing Biometric...</p>
                </div>
              ) : status === 'pushed' ? (
                <div className="text-center animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl">
                    <CheckCircle2 size={48} className="text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Clock-In Saved</h3>
                  <p className="text-xs text-slate-500 font-bold mt-2">Multiple sessions allowed</p>
                </div>
              ) : status === 'preparing' ? (
                <div className="w-full space-y-6 animate-in fade-in">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <MessageSquare size={12} className="text-slate-400" />
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Optional Entry Remarks</label>
                    </div>
                    <textarea 
                      placeholder="e.g. Starting site visit, returning from client meeting..."
                      className="w-full p-5 bg-white border border-slate-200 rounded-[32px] text-sm font-bold min-h-[140px] outline-none shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                      value={remarks}
                      onChange={e => setRemarks(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-4">
                     <button onClick={() => setStatus('idle')} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100">Back</button>
                     <button 
                       onClick={startCamera} 
                       disabled={!location}
                       className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-2"
                     >
                       <Camera size={16} /> Open Camera
                     </button>
                  </div>
                </div>
              ) : status === 'camera' ? (
                <div className="w-full space-y-6 animate-in fade-in">
                  <div className="relative w-full aspect-video bg-black rounded-[40px] overflow-hidden border-4 border-indigo-600 shadow-2xl">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                    <div className="absolute inset-0 border-[30px] border-black/30 pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 border-2 border-white/40 rounded-full pointer-events-none border-dashed animate-pulse"></div>
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="flex gap-4">
                    <button onClick={() => { stopCamera(); setStatus('preparing'); }} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase text-slate-500"><X size={18} className="mx-auto"/></button>
                    <button onClick={handleClockIn} className="flex-[3] py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Verify & Punch In</button>
                  </div>
                </div>
              ) : activeRecord ? (
                <div className="text-center space-y-6 animate-in slide-in-from-top-4">
                  <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl relative">
                    <UserCheck size={64} className="text-emerald-500" />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                       <span className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-black text-slate-900 uppercase tracking-tighter">Session Active</p>
                    <div className="px-4 py-2 bg-emerald-100/50 rounded-full border border-emerald-100 flex items-center gap-2">
                       <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                       <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">In Progress since {activeRecord.checkIn}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-8">
                  <div className="relative">
                    <div className="absolute -inset-8 bg-indigo-100 rounded-full animate-ping opacity-20"></div>
                    <button 
                      onClick={() => setStatus('preparing')}
                      className="w-48 h-48 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl flex flex-col items-center justify-center gap-3 active:scale-95 transition-all ring-[18px] ring-indigo-50 z-10 relative group"
                    >
                      <Clock size={56} className="group-hover:rotate-12 transition-transform" />
                      <span className="font-black uppercase tracking-widest text-xs">Start Session</span>
                    </button>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity & Geofence Sync</p>
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">Tap to clock in for duty</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showExitModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[48px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-slate-100">
            <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <LogOut size={24} className="text-indigo-400" />
                <h3 className="text-xl font-black uppercase tracking-tight">Clock Out</h3>
              </div>
              <button onClick={() => setShowExitModal(false)} className="p-2 hover:bg-white/10 rounded-xl"><X size={24} /></button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Sign-out</p>
                  <p className="text-2xl font-black text-slate-900 tabular-nums">{currentTime.toLocaleTimeString()}</p>
                </div>
                <div className="h-10 w-px bg-slate-200"></div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Time</p>
                  <p className="text-lg font-bold text-slate-600 tabular-nums">{activeRecord?.checkIn}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <MessageSquare size={12} className="text-slate-400" />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Summary / Remarks</label>
                </div>
                <textarea 
                  placeholder="Summarize activities or state reason for ending session..."
                  className="w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-bold min-h-[140px] outline-none shadow-inner focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <button onClick={() => setShowExitModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                <button 
                  onClick={handleClockOut}
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  Verify & End Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
