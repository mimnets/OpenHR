
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  Info,
  CheckCircle,
  Clock,
  X,
  Send,
  UserCheck,
  UserX,
  MessageCircle,
  AlertTriangle,
  ChevronRight,
  Trash2,
  Filter,
  ShieldCheck,
  ArrowRight,
  UserPen,
  Edit3,
  XCircle,
  History as HistoryIcon
} from 'lucide-react';
import { hrService } from '../services/hrService';
import { LeaveRequest, LeaveBalance, Employee } from '../types';

const Leave: React.FC<{ user: any }> = ({ user }) => {
  const isAdmin = user.role === 'ADMIN' || user.role === 'HR';
  const isManager = hrService.isManagerOfSomeone(user.id);
  
  const [showForm, setShowForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState<LeaveRequest | null>(null);
  const [showReviewModal, setShowReviewModal] = useState<LeaveRequest | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState('');
  
  const [formData, setFormData] = useState({ 
    type: 'ANNUAL', 
    start: '', 
    end: '', 
    reason: '' 
  });
  
  const [activeTab, setActiveTab] = useState<'MY' | 'MANAGEMENT'>( (isAdmin || isManager) ? 'MANAGEMENT' : 'MY');
  const [filterMode, setFilterMode] = useState<'TASKS' | 'ALL'>('TASKS');
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [balance, setBalance] = useState<LeaveBalance | null>(null);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    refreshData();
  }, [user.id]);

  const refreshData = () => {
    setLeaves(hrService.getLeaves());
    setBalance(hrService.getLeaveBalance(user.id));
    setAllEmployees(hrService.getEmployees());
  };

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diff = e.getTime() - s.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 3600 * 24)) + 1);
  };

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const days = calculateDays(formData.start, formData.end);
    
    if (editingRequest) {
      hrService.modifyLeaveRequest(editingRequest.id, {
        type: formData.type as any,
        startDate: formData.start,
        endDate: formData.end,
        totalDays: days,
        reason: formData.reason
      });
      alert('Leave record modified successfully.');
    } else {
      hrService.saveLeaveRequest({
        id: Math.random().toString(36).substr(2, 9),
        employeeId: user.id,
        employeeName: user.name,
        type: formData.type as any,
        startDate: formData.start,
        endDate: formData.end,
        totalDays: days,
        reason: formData.reason,
        status: 'PENDING_MANAGER',
        appliedDate: new Date().toISOString()
      });
      alert('Application submitted for review.');
    }
    
    refreshData();
    setShowForm(false);
    setEditingRequest(null);
    setFormData({ type: 'ANNUAL', start: '', end: '', reason: '' });
  };

  const handleAction = (request: LeaveRequest, action: 'APPROVED' | 'REJECTED') => {
    let decisionRole = user.role;
    if (request.status === 'PENDING_MANAGER' && !isAdmin) {
       decisionRole = 'MANAGER';
    }

    hrService.updateLeaveStatus(request.id, action, reviewRemarks, decisionRole);
    refreshData();
    setShowReviewModal(null);
    setReviewRemarks('');
  };

  const handleEditClick = (req: LeaveRequest) => {
    setEditingRequest(req);
    setFormData({
      type: req.type,
      start: req.startDate,
      end: req.endDate,
      reason: req.reason
    });
    setShowForm(true);
  };

  const handleDeleteRequest = (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this leave entry?')) return;
    const all = hrService.getLeaves();
    const filtered = all.filter(l => l.id !== id);
    localStorage.setItem('hr_leaves', JSON.stringify(filtered));
    refreshData();
  };

  const getFilteredLeavesForManagement = () => {
    const reportIds = allEmployees.filter(e => e.lineManagerId === user.id).map(e => e.id);
    
    if (isAdmin) {
       if (filterMode === 'ALL') return leaves;
       // HR Tasks: things that need HR audit or things they manage
       return leaves.filter(l => 
         l.status === 'PENDING_HR' || 
         (l.status === 'PENDING_MANAGER' && reportIds.includes(l.employeeId))
       );
    }
    
    if (filterMode === 'ALL') return leaves.filter(l => reportIds.includes(l.employeeId));
    return leaves.filter(l => l.status === 'PENDING_MANAGER' && reportIds.includes(l.employeeId));
  };

  const myLeaves = leaves.filter(l => l.employeeId === user.id);
  const managementLeaves = getFilteredLeavesForManagement();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Leave Management</h1>
          <p className="text-sm text-slate-500 font-medium">Organization-wide entitlement tracking and audit portal</p>
        </div>
        <div className="flex gap-2">
          {(isAdmin || isManager) && (
            <div className="flex p-1 bg-slate-100 rounded-2xl mr-2">
              <button onClick={() => setActiveTab('MANAGEMENT')} className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'MANAGEMENT' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                Review Hub
              </button>
              <button onClick={() => setActiveTab('MY')} className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'MY' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                My Portal
              </button>
            </div>
          )}
          <button onClick={() => { setEditingRequest(null); setFormData({ type: 'ANNUAL', start: '', end: '', reason: '' }); setShowForm(true); }} className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-indigo-700 transition-all">
            <Plus size={18} /> New Request
          </button>
        </div>
      </header>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Calendar size={24} /></div>
              <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Annual</span>
           </div>
           <p className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">{balance?.ANNUAL || 0} <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Days Left</span></p>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Clock size={24} /></div>
              <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Casual</span>
           </div>
           <p className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">{balance?.CASUAL || 0} <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Days Left</span></p>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl"><AlertTriangle size={24} /></div>
              <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 px-3 py-1 rounded-full">Sick</span>
           </div>
           <p className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">{balance?.SICK || 0} <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Days Left</span></p>
        </div>
      </div>

      {activeTab === 'MANAGEMENT' ? (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <Filter className="text-indigo-600" /> Administrative Queue
            </h3>
            
            <div className="flex p-1 bg-slate-100 rounded-xl">
              <button 
                onClick={() => setFilterMode('TASKS')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filterMode === 'TASKS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <CheckCircle size={14} /> My Actions
              </button>
              <button 
                onClick={() => setFilterMode('ALL')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filterMode === 'ALL' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <HistoryIcon size={14} /> All Records
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {managementLeaves.length === 0 ? (
              <div className="py-20 text-center text-slate-300">
                <p className="text-xs font-black uppercase">Queue is currently empty</p>
              </div>
            ) : managementLeaves.sort((a, b) => b.appliedDate.localeCompare(a.appliedDate)).map((req) => {
              const reportIds = allEmployees.filter(e => e.lineManagerId === user.id).map(e => e.id);
              const canActAsManager = req.status === 'PENDING_MANAGER' && reportIds.includes(req.employeeId);
              const canActAsHR = req.status === 'PENDING_HR' && isAdmin;
              const canAction = canActAsManager || canActAsHR;

              return (
                <div key={req.id} className="p-6 rounded-[32px] bg-slate-50 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white hover:shadow-xl transition-all group">
                  <div className="flex gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center font-black text-indigo-600 text-xl uppercase shrink-0">
                      {req.employeeName[0]}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-lg leading-tight">{req.employeeName}</h4>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded">{req.type}</span>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter tabular-nums">{req.startDate} — {req.endDate} ({req.totalDays} Days)</p>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                          req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 
                          req.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                          req.status === 'PENDING_HR' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                            {req.status.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {canAction ? (
                      <button onClick={() => setShowReviewModal(req)} className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg">
                        <UserCheck size={16} /> {canActAsHR ? 'HR Audit' : 'Manager Verify'}
                      </button>
                    ) : isAdmin ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleEditClick(req)} className="p-3 bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-100 rounded-2xl transition-all" title="Edit details">
                          <Edit3 size={18} />
                        </button>
                        <button onClick={() => setShowReviewModal(req)} className="p-3 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-100 rounded-2xl transition-all" title="Cancel Request">
                          <XCircle size={18} />
                        </button>
                        <button onClick={() => handleDeleteRequest(req.id)} className="p-3 bg-white text-slate-400 hover:text-rose-900 hover:bg-rose-50 border border-slate-100 rounded-2xl transition-all" title="Delete record">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${
                        req.status === 'APPROVED' ? 'bg-emerald-500 text-white' : req.status === 'REJECTED' ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {req.status.replace('_', ' ')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[40px] shadow-sm border border-slate-100 p-8">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <Clock className="text-indigo-600" /> My History
            </h3>
            <div className="space-y-4">
              {myLeaves.length === 0 ? (
                <div className="py-20 text-center text-slate-300">
                  <p className="text-xs font-black uppercase">No applications found</p>
                </div>
              ) : myLeaves.sort((a, b) => b.appliedDate.localeCompare(a.appliedDate)).map((req) => (
                <div key={req.id} className="flex flex-col p-6 rounded-[32px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                        req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 
                        req.status === 'REJECTED' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        <Calendar size={20} />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 uppercase tracking-tight">{req.type} LEAVE</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest tabular-nums">{req.startDate} — {req.endDate}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase shadow-sm ${
                      req.status === 'APPROVED' ? 'bg-emerald-500 text-white' : 
                      req.status === 'REJECTED' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4 px-2">
                     <div className={`h-1 flex-1 rounded-full ${['PENDING_MANAGER', 'PENDING_HR', 'APPROVED'].includes(req.status) ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
                     <ChevronRight size={12} className="text-slate-300" />
                     <div className={`h-1 flex-1 rounded-full ${['PENDING_HR', 'APPROVED'].includes(req.status) ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
                     <ChevronRight size={12} className="text-slate-300" />
                     <div className={`h-1 flex-1 rounded-full ${req.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                  </div>
                  
                  <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2">
                    <span>Manager Review</span>
                    <span>HR Final Audit</span>
                    <span>Complete</span>
                  </div>

                  {(req.managerRemarks || req.approverRemarks) && (
                    <div className="mt-2 space-y-2">
                      {req.managerRemarks && (
                        <div className="p-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-medium text-slate-600 flex gap-2 items-start">
                          <MessageCircle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                          <div><p className="text-[9px] font-black text-slate-400 uppercase">Manager Feedback</p>"{req.managerRemarks}"</div>
                        </div>
                      )}
                      {req.approverRemarks && (
                        <div className="p-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-medium text-slate-600 flex gap-2 items-start">
                          <ShieldCheck size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                          <div><p className="text-[9px] font-black text-slate-400 uppercase">HR Audit Notes</p>"{req.approverRemarks}"</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
             <h3 className="text-xl font-black mb-6 flex items-center gap-2 relative z-10">
               <Info size={24} className="text-indigo-400" /> Organizational Policy
             </h3>
             <div className="space-y-4 relative z-10">
               <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                 <p className="text-xs font-bold text-white mb-1">Approval Staging</p>
                 <p className="text-[10px] text-slate-400 leading-relaxed">Applications flow from Line Manager verification to HR Audit for final balance reconciliation.</p>
               </div>
               <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                 <p className="text-xs font-bold text-white mb-1">Administrative Rights</p>
                 <p className="text-[10px] text-slate-400 leading-relaxed">HR and Admins reserve the right to modify or cancel any record in accordance with operational requirements.</p>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* Review & Cancellation Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[48px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className={`p-8 flex justify-between items-center text-white ${showReviewModal.status === 'APPROVED' ? 'bg-rose-600' : isAdmin ? 'bg-indigo-600' : 'bg-slate-900'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl"><UserCheck size={20}/></div>
                <h3 className="text-xl font-black uppercase tracking-tight">
                  {showReviewModal.status === 'APPROVED' ? 'Revoke Approval' : isAdmin ? 'Administrative Action' : 'Verification'}
                </h3>
              </div>
              <button onClick={() => setShowReviewModal(null)} className="hover:bg-white/10 p-2 rounded-xl"><X size={28} /></button>
            </div>
            <div className="p-10 space-y-6 max-h-[75vh] overflow-y-auto no-scrollbar">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Applicant Profile</p>
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black uppercase">{showReviewModal.employeeName[0]}</div>
                    <div><p className="font-black text-slate-900">{showReviewModal.employeeName}</p><p className="text-xs font-bold text-slate-500">{showReviewModal.type} — {showReviewModal.totalDays} Days</p></div>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[9px] font-black text-slate-400 uppercase">Original Reason</p>
                   <p className="text-sm font-medium text-slate-600 italic">"{showReviewModal.reason}"</p>
                 </div>
              </div>

              {isAdmin && showReviewModal.status === 'PENDING_HR' && (
                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200">
                   <div className="flex items-center gap-2 mb-3">
                      <UserPen size={16} className="text-amber-600" />
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Manager Verification Note</p>
                   </div>
                   <div className="p-3 bg-white/60 rounded-xl border border-amber-100">
                      <p className="text-[11px] font-medium text-slate-700 leading-relaxed italic">
                        {showReviewModal.managerRemarks ? `"${showReviewModal.managerRemarks}"` : "Verified without additional comments."}
                      </p>
                   </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <MessageCircle size={14} className="text-indigo-600" />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Decision Remarks / Justification</label>
                </div>
                <textarea 
                  placeholder="Provide detailed feedback or reason for this administrative action..."
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-bold min-h-[100px] outline-none focus:ring-4 focus:ring-indigo-50 transition-all resize-none"
                  value={reviewRemarks}
                  onChange={e => setReviewRemarks(e.target.value)}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => handleAction(showReviewModal, 'REJECTED')} className="flex-1 py-5 bg-rose-50 text-rose-600 rounded-[32px] font-black uppercase text-[10px] tracking-widest hover:bg-rose-100 transition-all">
                  {showReviewModal.status === 'APPROVED' ? 'Confirm Revoke' : 'Decline Request'}
                </button>
                {showReviewModal.status !== 'APPROVED' && (
                  <button onClick={() => handleAction(showReviewModal, 'APPROVED')} className="flex-1 py-5 bg-indigo-600 text-white rounded-[32px] font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                    {isAdmin && showReviewModal.status === 'PENDING_HR' ? 'Final Audit Approve' : 'Verify & Forward'} <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Entry/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[48px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className={`p-8 flex justify-between items-center text-white ${editingRequest ? 'bg-slate-900' : 'bg-indigo-600'}`}>
              <div className="flex items-center gap-3">
                {editingRequest ? <Edit3 size={24} className="bg-white/20 p-1 rounded-lg" /> : <Plus size={24} className="bg-white/20 p-1 rounded-lg" />}
                <h3 className="text-xl font-black uppercase tracking-tight">{editingRequest ? 'Modify Leave Details' : 'Submit Leave Application'}</h3>
              </div>
              <button onClick={() => setShowForm(false)} className="hover:bg-white/10 p-2 rounded-xl transition-all"><X size={28} /></button>
            </div>
            <form onSubmit={handleSubmitLeave} className="p-10 space-y-8">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Entitlement Category</label>
                <select className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl font-black text-sm outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="ANNUAL">Annual Leave ({balance?.ANNUAL} Left)</option>
                  <option value="CASUAL">Casual Leave ({balance?.CASUAL} Left)</option>
                  <option value="SICK">Sick Leave ({balance?.SICK} Left)</option>
                  <option value="UNPAID">Unpaid Leave</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Commencement Date</label>
                  <input type="date" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl" value={formData.start} onChange={e => setFormData({...formData, start: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Conclusion Date</label>
                  <input type="date" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl" value={formData.end} onChange={e => setFormData({...formData, end: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Contextual Reason</label>
                <textarea placeholder="Clearly describe why this time off is being requested..." className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl font-bold text-sm h-32 resize-none outline-none" required value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}></textarea>
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-center gap-3">
                 <div className="p-2 bg-white rounded-xl shadow-sm"><Info size={20} className="text-indigo-600" /></div>
                 <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Verified Duration: {calculateDays(formData.start, formData.end)} Working Days</p>
              </div>

              <button type="submit" className={`w-full py-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-xs shadow-2xl transition-all flex items-center justify-center gap-3 ${editingRequest ? 'bg-slate-900 hover:bg-black' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                <Send size={20} /> {editingRequest ? 'Apply Administrative Update' : 'Initialize Application'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leave;
