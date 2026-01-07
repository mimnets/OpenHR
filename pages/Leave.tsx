
import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Info,
  CheckCircle,
  Clock,
  X,
  Send,
  UserCheck,
  UserX
} from 'lucide-react';
import { hrService } from '../services/hrService';

const Leave: React.FC<{ user: any }> = ({ user }) => {
  const isAdmin = user.role === 'ADMIN' || user.role === 'HR';
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ type: 'ANNUAL', start: '', end: '', reason: '' });
  const [activeTab, setActiveTab] = useState<'MY' | 'MANAGEMENT'>(isAdmin ? 'MANAGEMENT' : 'MY');

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    hrService.saveLeaveRequest({
      id: Math.random().toString(36).substr(2, 9),
      employeeId: user.id,
      employeeName: user.name,
      type: formData.type as any,
      startDate: formData.start,
      endDate: formData.end,
      totalDays: 2, // Mock calculation
      reason: formData.reason,
      status: 'PENDING',
      appliedDate: new Date().toISOString()
    });
    alert(`Application submitted for approval.`);
    setShowForm(false);
  };

  const handleAction = (id: string, action: 'APPROVED' | 'REJECTED') => {
    hrService.updateLeaveStatus(id, action);
    alert(`Request ${action.toLowerCase()} successfully.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Leave System</h1>
          <p className="text-sm text-slate-500 font-medium">Policy-driven time-off tracking for {user.department}</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <div className="flex p-1 bg-slate-100 rounded-xl mr-2">
              <button 
                onClick={() => setActiveTab('MANAGEMENT')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'MANAGEMENT' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
              >
                Management
              </button>
              <button 
                onClick={() => setActiveTab('MY')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'MY' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
              >
                My Requests
              </button>
            </div>
          )}
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Plus size={20} /> New Application
          </button>
        </div>
      </header>

      {activeTab === 'MANAGEMENT' ? (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
              <Clock className="text-amber-500" /> Pending Approval Queue
            </h3>
            <div className="space-y-4">
              {[
                { id: '1', name: 'Rahat Mahmud', type: 'Annual', date: 'Oct 20-22', days: 3, reason: 'Family event in Sylhet' },
                { id: '2', name: 'Fahim Ahmed', type: 'Sick', date: 'Oct 15', days: 1, reason: 'Medical appointment' }
              ].map((req, i) => (
                <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-white hover:shadow-md transition-all">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center font-bold text-blue-600 uppercase">{req.name[0]}</div>
                    <div>
                      <h4 className="font-bold text-slate-900">{req.name}</h4>
                      <p className="text-xs font-bold text-slate-400 uppercase">{req.type} Leave • {req.date} ({req.days} Days)</p>
                      <p className="text-xs text-slate-500 mt-1 italic">"{req.reason}"</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleAction(req.id, 'REJECTED')} className="p-2 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"><UserX size={20} /></button>
                    <button onClick={() => handleAction(req.id, 'APPROVED')} className="p-2 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"><UserCheck size={20} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                <Clock className="text-blue-500" /> My Application History
              </h3>
              <div className="space-y-4">
                {[
                  { type: 'Casual Leave', dates: 'Oct 18 - Oct 19', days: 2, status: 'PENDING' },
                  { type: 'Annual Leave', dates: 'Sep 10 - Sep 15', days: 5, status: 'APPROVED' },
                ].map((req, i) => (
                  <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}><Calendar size={20} /></div>
                      <div>
                        <h4 className="font-bold text-slate-900">{req.type}</h4>
                        <p className="text-xs font-bold text-slate-500 uppercase">{req.dates} • {req.days} Days</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${req.status === 'APPROVED' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>{req.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
             <h3 className="text-xl font-black mb-4 flex items-center gap-2"><Info size={24} className="text-blue-400" /> Policy Rules</h3>
             <ul className="space-y-4 text-xs font-bold uppercase text-slate-400">
               <li className="flex gap-2"><CheckCircle size={16} className="text-emerald-500" /> Annual: 14 Days (Statutory)</li>
               <li className="flex gap-2"><CheckCircle size={16} className="text-emerald-500" /> Casual: 10 Days</li>
               <li className="flex gap-2"><CheckCircle size={16} className="text-emerald-500" /> Sick: 14 Days</li>
             </ul>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-blue-600 p-6 flex justify-between items-center text-white">
              <h3 className="text-xl font-black uppercase tracking-tight">Leave Application</h3>
              <button onClick={() => setShowForm(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmitLeave} className="p-8 space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase">Leave Category</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                  <option value="ANNUAL">Annual Leave</option>
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Sick Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="date" required className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" onChange={e => setFormData({...formData, start: e.target.value})} />
                <input type="date" required className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" onChange={e => setFormData({...formData, end: e.target.value})} />
              </div>
              <textarea placeholder="Briefly state the reason..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold h-24 resize-none" onChange={e => setFormData({...formData, reason: e.target.value})}></textarea>
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 flex justify-center items-center gap-2">
                <Send size={18} /> Submit for Approval
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leave;
