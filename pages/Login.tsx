
import React, { useState } from 'react';
import { Globe, ShieldCheck, Mail, Lock, ArrowRight, X, AlertCircle, RefreshCw, Settings, Database, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { hrService } from '../services/hrService';
import { isPocketBaseConfigured } from '../services/pocketbase';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
  onEnterSetup?: () => void;
  initError?: string | null;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onEnterSetup, initError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [roleMode, setRoleMode] = useState<'ADMIN' | 'EMPLOYEE'>('EMPLOYEE');
  const [error, setError] = useState(initError || '');
  const [isLoading, setIsLoading] = useState(false);
  
  const isConfigured = isPocketBaseConfigured();

  const handleReset = () => {
    if (confirm("Reset connection settings? This will clear the PocketBase URL configuration.")) {
      localStorage.removeItem('pocketbase_config');
      window.location.reload();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) {
      setError(`CRITICAL: PocketBase is not configured.`);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const result = await hrService.login(email, password);
      if (result.user) {
        if (roleMode === 'ADMIN' && !['ADMIN', 'HR'].includes(result.user.role)) {
          setError('Access Denied. Administrator privileges required.');
        } else {
          onLoginSuccess(result.user);
        }
      } else {
        setError(result.error || 'Verification Failed.');
      }
    } catch (err: any) {
      setError(`System Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 overflow-hidden relative">
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] relative items-center justify-center p-20">
        <div className="absolute top-10 left-10 flex items-center gap-2 text-white/80">
          <Globe size={24} className="text-indigo-500" />
          <span className="font-bold text-xl tracking-tight text-white">OpenHR</span>
        </div>
        <div className="space-y-8 max-w-md">
          <h1 className="text-5xl font-black text-white leading-tight">Secure Workforce Intelligence.</h1>
          <p className="text-slate-400 text-lg font-medium">Enterprise HRMS using PocketBase for private database persistence.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        <div className="absolute bottom-6 right-6 flex items-center gap-4">
          <button onClick={handleReset} className="p-4 bg-white border border-slate-100 text-slate-400 hover:text-rose-600 rounded-2xl shadow-sm transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <RotateCcw size={18} /> Reset Config
          </button>
          <button onClick={onEnterSetup} className="p-4 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 rounded-2xl shadow-sm transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <Settings size={18} /> System Setup
          </button>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Portal</h2>
            <div className="flex items-center gap-2 text-slate-500 font-medium justify-center sm:justify-start">
              <Database size={14} className="text-indigo-500" />
              <span className={isConfigured ? 'text-emerald-600 font-bold' : 'text-rose-500 font-black'}>
                PocketBase {isConfigured ? 'Active' : 'Missing'}
              </span>
            </div>
          </div>

          <div className="flex p-1.5 bg-slate-100 rounded-2xl">
            <button onClick={() => setRoleMode('EMPLOYEE')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${roleMode === 'EMPLOYEE' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Employee</button>
            <button onClick={() => setRoleMode('ADMIN')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${roleMode === 'ADMIN' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Admin</button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="email" required className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold shadow-sm outline-none" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@org.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type={showPassword ? "text" : "password"} required className="w-full pl-12 pr-12 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold shadow-sm outline-none" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-xl flex items-start gap-3 border border-rose-100 animate-in shake">
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full py-5 bg-[#0f172a] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50">
              {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>
          
          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Bangladesh Labor Code Compliant (v2.5.0-PB)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
