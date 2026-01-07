
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CalendarDays, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  ChevronRight,
  UserCheck,
  Bell,
  Check,
  X,
  ArrowUpRight,
  Play,
  LogOut,
  Zap
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { hrService } from '../services/hrService';
import { LeaveRequest, Attendance } from '../types';

interface DashboardProps {
  user: any;
  onNavigate: (path: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const isAdmin = user.role === 'ADMIN' || user.role === 'HR';
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeShift, setActiveShift] = useState<Attendance | undefined>(undefined);

  useEffect(() => {
    setActiveShift(hrService.getActiveAttendance(user.id));

    if (isAdmin) {
      const leaves = hrService.getLeaves().filter(l => l.status === 'PENDING');
      setPendingLeaves(leaves.length > 0 ? leaves : [
        { id: 'l1', employeeName: 'Rahat Mahmud', type: 'ANNUAL', startDate: '2024-10-20', endDate: '2024-10-22', totalDays: 3, reason: 'Family event', status: 'PENDING', appliedDate: '2024-10-14', employeeId: 'EMP002' },
        { id: 'l2', employeeName: 'Sumaiya Akter', type: 'SICK', startDate: '2024-10-15', endDate: '2024-10-15', totalDays: 1, reason: 'Doctor appointment', status: 'PENDING', appliedDate: '2024-10-14', employeeId: 'EMP003' }
      ] as any);

      setNotifications([
        { id: 1, text: '3 employees late more than 15 mins today', type: 'late', time: '10:00 AM' },
        { id: 2, text: 'NID document for Tanvir Hassan expiring soon', type: 'expiry', time: 'Yesterday' }
      ]);
    }
  }, [isAdmin, user.id]);

  const handleApprove = (id: string) => {
    hrService.updateLeaveStatus(id, 'APPROVED');
    setPendingLeaves(prev => prev.filter(l => l.id !== id));
    alert('Request Approved');
  };

  const handleReject = (id: string) => {
    hrService.updateLeaveStatus(id, 'REJECTED');
    setPendingLeaves(prev => prev.filter(l => l.id !== id));
    alert('Request Rejected');
  };

  // Mock data for charts
  const attendanceData = [
    { name: 'Sun', present: 450, absent: 50 },
    { name: 'Mon', present: 480, absent: 20 },
    { name: 'Tue', present: 475, absent: 25 },
    { name: 'Wed', present: 470, absent: 30 },
    { name: 'Thu', present: 460, absent: 40 },
  ];

  const leaveData = [
    { name: 'Annual', value: 400 },
    { name: 'Sick', value: 300 },
    { name: 'Casual', value: 300 },
  ];
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b'];

  if (!isAdmin) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back, {user.name}</h1>
            <p className="text-slate-500 font-medium tracking-tight">Here's your personal HR overview for today</p>
          </div>
          
          {/* Quick Start Floating/Header Action for Employees */}
          <div className="flex-shrink-0">
             <button 
              onClick={() => onNavigate('attendance')}
              className={`flex items-center gap-3 px-6 py-4 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95 group border-2 ${
                activeShift 
                ? 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100' 
                : 'bg-indigo-600 border-indigo-700 text-white hover:bg-indigo-700 shadow-indigo-200'
              }`}
            >
              <div className={`p-2 rounded-full ${activeShift ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-indigo-600'}`}>
                {activeShift ? <LogOut size={16} /> : <Play size={16} />}
              </div>
              <div className="text-left leading-tight">
                <p className="opacity-70 text-[10px]">Quick Action</p>
                <p className="text-sm">{activeShift ? 'End Session' : 'Punch In Now'}</p>
              </div>
            </button>
          </div>
        </header>

        {/* Highlighted Status Area */}
        {activeShift && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex items-center justify-between shadow-sm animate-in slide-in-from-top-2">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                  <UserCheck size={24} />
               </div>
               <div>
                 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Shift in Progress</p>
                 <h4 className="text-lg font-black text-slate-900 leading-none mt-1">Clocked in at {activeShift.checkIn}</h4>
               </div>
            </div>
            <button 
              onClick={() => onNavigate('attendance')}
              className="text-xs font-black uppercase tracking-widest text-emerald-600 hover:underline flex items-center gap-1"
            >
              Manage Session <ArrowUpRight size={14} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard title="Leave Balance" value="14 Days" icon={CalendarDays} color="bg-indigo-600" subtitle="Available Annual Leave" />
          <DashboardCard title="Attendance" value="98%" icon={Clock} color="bg-emerald-600" subtitle="Month-to-date rate" />
          <DashboardCard title="Next Holiday" value="Victory Day" icon={Calendar} color="bg-rose-600" subtitle="Dec 16, 2024" />
          <DashboardCard title="Recent Activity" value="3 Approval" icon={TrendingUp} color="bg-amber-600" subtitle="Requests pending" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="text-indigo-600" /> Recent Attendance History
            </h3>
            <div className="space-y-4">
              {[
                { date: 'Oct 14, 2024', status: 'PRESENT', in: '08:58 AM', out: '05:30 PM' },
                { date: 'Oct 13, 2024', status: 'PRESENT', in: '09:02 AM', out: '05:35 PM' },
                { date: 'Oct 10, 2024', status: 'PRESENT', in: '08:55 AM', out: '06:00 PM' },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{row.date}</p>
                    <p className="text-xs text-slate-500 font-medium">In: {row.in} • Out: {row.out}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest rounded-lg">{row.status}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => onNavigate('attendance')}
              className="w-full mt-6 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 border border-slate-100 transition-all flex items-center justify-center gap-2"
            >
              View Full Logs <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
             <h3 className="text-xl font-black mb-4 flex items-center gap-2"><Zap className="text-indigo-400" size={20} /> Announcements</h3>
             <div className="space-y-6">
               <div className="border-l-2 border-indigo-500 pl-4 py-1">
                 <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Oct 12</p>
                 <p className="text-sm font-bold mt-1 leading-relaxed">Winter office timing will start from Nov 1st.</p>
               </div>
               <div className="border-l-2 border-slate-700 pl-4 py-1">
                 <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Oct 05</p>
                 <p className="text-sm font-bold mt-1 leading-relaxed text-slate-300">New Health Insurance policy documents are available.</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Organization Overview</h1>
          <p className="text-slate-500 font-medium tracking-tight">Real-time metrics for {user.department}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="relative">
              <Bell size={20} className="text-indigo-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full ring-2 ring-white">
                {pendingLeaves.length + notifications.length}
              </span>
            </div>
            <div className="text-left leading-none pr-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Active Tasks</p>
              <p className="text-xs font-bold text-slate-900">{pendingLeaves.length} Approvals Needed</p>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-amber-50 border border-amber-100 rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-200 text-amber-700 rounded-xl">
              <AlertCircle size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Action Center</h3>
              <p className="text-xs font-medium text-amber-700">Immediate HR intervention required for these items</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingLeaves.map((leave) => (
            <div key={leave.id} className="bg-white p-5 rounded-2xl shadow-sm border border-amber-100 flex flex-col justify-between group hover:shadow-md transition-all">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded">Leave Request</span>
                  <p className="text-[10px] text-slate-400 font-bold">{new Date(leave.appliedDate).toLocaleDateString()}</p>
                </div>
                <h4 className="font-bold text-slate-900 leading-tight">{leave.employeeName}</h4>
                <p className="text-xs text-slate-500 font-medium mt-1">{leave.type} • {leave.totalDays} Days</p>
                <p className="text-[11px] text-slate-400 mt-2 line-clamp-1 italic">"{leave.reason}"</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => handleReject(leave.id)}
                  className="flex-1 py-2 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all flex items-center justify-center"
                  title="Reject"
                >
                  <X size={18} />
                </button>
                <button 
                  onClick={() => handleApprove(leave.id)}
                  className="flex-[2] py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Check size={14} /> Approve
                </button>
              </div>
            </div>
          ))}
          
          {notifications.map((notif) => (
            <div key={notif.id} className="bg-white p-5 rounded-2xl shadow-sm border border-amber-100 flex items-center justify-between group hover:shadow-md transition-all">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 leading-snug">{notif.text}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{notif.time}</p>
                </div>
              </div>
              <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                <ArrowUpRight size={18} />
              </button>
            </div>
          ))}

          {pendingLeaves.length === 0 && notifications.length === 0 && (
            <div className="col-span-full py-6 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-amber-200 rounded-3xl">
              <Check size={32} className="mb-2 text-emerald-400" />
              <p className="text-sm font-bold uppercase tracking-widest">Everything is up to date</p>
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Employees" 
          value="482" 
          icon={Users} 
          color="bg-indigo-600" 
          trend={{ value: 12, isUp: true }}
          subtitle="+4 joined this month"
        />
        <DashboardCard 
          title="On Leave" 
          value="24" 
          icon={CalendarDays} 
          color="bg-emerald-600" 
          subtitle="Employees out today"
        />
        <DashboardCard 
          title="Attendance Rate" 
          value="94.2%" 
          icon={UserCheck} 
          color="bg-amber-600" 
          trend={{ value: 0.8, isUp: false }}
          subtitle="-0.8% from last week"
        />
        <DashboardCard 
          title="Critical Alerts" 
          value="3" 
          icon={AlertCircle} 
          color="bg-rose-600" 
          subtitle="Policy violations detected"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <TrendingUp className="text-indigo-600" /> Attendance Trends (Last 5 Days)
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  cursor={{fill: '#f8fafc'}}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '12px', fontWeight: 800}} />
                <Bar dataKey="present" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Present" />
                <Bar dataKey="absent" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-black text-slate-900 mb-6">Leave Distribution</h3>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leaveData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {leaveData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[idx]}}></div>
                  <span className="text-xs font-bold text-slate-600">{item.name}</span>
                </div>
                <span className="text-xs font-black text-slate-900">{item.value} days</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl overflow-hidden relative cursor-pointer" onClick={() => onNavigate('organization')}>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
            <Calendar size={40} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black mb-2 tracking-tight">Upcoming Holiday: Bengali New Year</h3>
            <p className="text-slate-400 font-medium leading-relaxed max-w-2xl">
              Pohela Boishakh (April 14) is approaching. The office will remain closed. System will automatically mark attendance as "HOLIDAY" for all active personnel.
            </p>
          </div>
          <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all flex items-center gap-2">
            View Calendar <ChevronRight size={18} />
          </button>
        </div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Dashboard;
