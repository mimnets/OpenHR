
import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Mail, 
  FileText, 
  Calendar, 
  Filter, 
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { DEPARTMENTS } from '../constants.tsx';

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState('ATTENDANCE');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAction = (action: 'DOWNLOAD' | 'EMAIL') => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert(action === 'DOWNLOAD' ? 'Report downloaded successfully to your local storage.' : 'Report sent to HR Director email (admin@openhr.com)');
    }, 2000);
  };

  const reportOptions = [
    { id: 'ATTENDANCE', label: 'Daily Attendance Status', icon: FileText, color: 'bg-emerald-500' },
    { id: 'LATE', label: 'Late Arrival Trends', icon: Clock, color: 'bg-amber-500' },
    { id: 'LEAVE', label: 'Leave & Absence Audit', icon: Calendar, color: 'bg-indigo-500' },
    { id: 'PAYROLL', label: 'Payroll Variance Report', icon: TrendingUp, color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Organization Analytics</h1>
        <p className="text-slate-500 font-medium">Export and distribute compliance-ready reports</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <Filter className="text-indigo-500" /> Report Generation Parameters
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Select Report Category</p>
                <div className="space-y-2">
                  {reportOptions.map((opt) => (
                    <button 
                      key={opt.id}
                      onClick={() => setReportType(opt.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all ${reportType === opt.id ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <div className={`p-2 rounded-lg ${reportType === opt.id ? 'bg-white/10' : opt.color + ' text-white'}`}>
                        <opt.icon size={18} />
                      </div>
                      <span className="font-bold text-sm">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Organization Filter</p>
                  <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none">
                    <option>Entire Organization (All Branches)</option>
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Date Range</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" className="p-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" />
                    <input type="date" className="p-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-50">
              <button 
                onClick={() => handleAction('DOWNLOAD')}
                disabled={isGenerating}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                {isGenerating ? 'Processing...' : <><Download size={18} /> Download Excel</>}
              </button>
              <button 
                onClick={() => handleAction('EMAIL')}
                disabled={isGenerating}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {isGenerating ? 'Sending...' : <><Mail size={18} /> Send via Email</>}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
              <BarChart3 className="text-indigo-400" /> Recent Exports
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Monthly_Late_Audit.xlsx', date: '2h ago', size: '2.4MB' },
                { name: 'Leave_Summary_Q3.pdf', date: 'Yesterday', size: '1.1MB' },
                { name: 'Dhaka_Office_Daily_Attendance.csv', date: 'Oct 14', size: '154KB' }
              ].map((file, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate pr-2">{file.name}</p>
                    <p className="text-[10px] font-black uppercase text-slate-500 mt-1">{file.date} • {file.size}</p>
                  </div>
                  <Download size={16} className="text-indigo-400 shrink-0 cursor-pointer" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-start gap-4">
             <div className="p-2 bg-white rounded-xl shadow-sm"><CheckCircle2 className="text-emerald-500" /></div>
             <div>
               <p className="text-sm font-black text-emerald-900 tracking-tight">System Compliance Check</p>
               <p className="text-xs text-emerald-700 font-medium leading-relaxed mt-1">All reports generated are compliant with BD Labor Code 2006 formatting requirements.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
