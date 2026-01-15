import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, Calendar, Clock, RefreshCw, User as UserIcon, Search, FileSpreadsheet, MapPin, AlertTriangle, Layout, CheckCircle2, CheckCircle, Settings2, Mail
} from 'lucide-react';
import { hrService } from '../services/hrService';
import { emailService } from '../services/emailService';
import { DEPARTMENTS } from '../constants.tsx';
import { User, Employee, Attendance, LeaveRequest } from '../types';

interface ReportsProps {
  user: User;
}

const Reports: React.FC<ReportsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'GENERATOR' | 'CONFIG'>('GENERATOR');
  const [reportType, setReportType] = useState('ATTENDANCE');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState('Entire Organization');
  const [employeeFilter, setEmployeeFilter] = useState('All Employees');
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);

  const [enabledColumns, setEnabledColumns] = useState<Record<string, boolean>>({
    'Employee_ID': true, 'Name': true, 'Date': true, 'Status_Type': true,
    'Check_In': true, 'Check_Out': true, 'Location': true, 'Latitude': true, 'Longitude': true, 'Remarks': true
  });

  const columnOptions = [
    { key: 'Employee_ID', label: 'Employee ID', icon: UserIcon },
    { key: 'Name', label: 'Full Name', icon: Layout },
    { key: 'Date', label: 'Entry Date', icon: Calendar },
    { key: 'Status_Type', label: 'Status', icon: CheckCircle2 },
    { key: 'Check_In', label: 'Clock In', icon: Clock },
    { key: 'Check_Out', label: 'Clock Out', icon: Clock },
    { key: 'Location', label: 'GPS Address', icon: MapPin },
    { key: 'Latitude', label: 'Latitude', icon: Search },
    { key: 'Longitude', label: 'Longitude', icon: Search },
    { key: 'Remarks', label: 'Notes', icon: FileText },
  ];

  useEffect(() => {
    const loadData = async () => {
      const [emps, atts, lvs] = await Promise.all([
        hrService.getEmployees(), hrService.getAttendance(), hrService.getLeaves()
      ]);
      setEmployees(emps); setAttendance(atts); setLeaves(lvs);
    };
    loadData();
  }, [user.id]);

  const reportData = useMemo(() => {
    let filtered: any[] = [];
    if (['ATTENDANCE', 'LATE', 'ABSENT'].includes(reportType)) {
      filtered = attendance.filter(a => {
        const isWithinDate = a.date >= startDate && a.date <= endDate;
        const emp = employees.find(e => e.id === a.employeeId);
        const isMatchingDept = departmentFilter === 'Entire Organization' || emp?.department === departmentFilter;
        const isMatchingEmp = employeeFilter === 'All Employees' || a.employeeId === employeeFilter;
        return isWithinDate && isMatchingDept && isMatchingEmp;
      });
      if (reportType === 'LATE') filtered = filtered.filter(a => a.status === 'LATE');
      if (reportType === 'ABSENT') filtered = filtered.filter(a => a.status === 'ABSENT');
    } else if (reportType === 'LEAVE') {
      filtered = leaves.filter(l => {
        const isWithinDate = l.startDate >= startDate && l.startDate <= endDate;
        const emp = employees.find(e => e.id === l.employeeId);
        const isMatchingDept = departmentFilter === 'Entire Organization' || emp?.department === departmentFilter;
        const isMatchingEmp = employeeFilter === 'All Employees' || l.employeeId === employeeFilter;
        return isWithinDate && isMatchingDept && isMatchingEmp;
      });
    }
    return filtered;
  }, [reportType, startDate, endDate, departmentFilter, employeeFilter, attendance, employees, leaves]);

  const downloadCSV = () => {
    if (reportData.length === 0) { alert("No data to export."); return; }
    setIsGenerating(true);
    setTimeout(() => {
      const cleanData = reportData.map((row: any) => {
        const fullRow: any = {
          Employee_ID: row.employeeId || row.id || 'N/A',
          Name: row.employeeName || row.name || 'N/A',
          Date: row.date || row.startDate || 'N/A',
          Status_Type: row.status || row.type || 'N/A',
          Check_In: row.checkIn || 'N/A',
          Check_Out: row.checkOut || 'N/A',
          Location: row.location?.address || 'N/A',
          Latitude: row.location?.lat || 'N/A',
          Longitude: row.location?.lng || 'N/A',
          Remarks: row.remarks || row.reason || ''
        };
        const filteredRow: any = {};
        Object.keys(enabledColumns).forEach(col => { if (enabledColumns[col]) filteredRow[col] = fullRow[col]; });
        return filteredRow;
      });
      const headers = Object.keys(cleanData[0]).join(",");
      const rows = cleanData.map(obj => Object.values(obj).map(val => `"${String(val).replace(/"/g, '""')}"`).join(","));
      const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers + "\n" + rows.join("\n");
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", `OpenHR_${reportType}_Export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsGenerating(false);
    }, 500);
  };

  const handleEmailSummary = async () => {
    if (reportData.length === 0) return;
    setIsEmailing(true);
    try {
      // Find today's attendance only for a daily summary
      const today = new Date().toISOString().split('T')[0];
      const todayAtt = attendance.filter(a => a.date === today);
      
      const config = await hrService.getConfig();
      const target = config.defaultReportRecipient || user.email;
      
      await emailService.sendDailyAttendanceSummary(target, todayAtt);
      alert(`Daily summary emailed to ${target}.`);
    } catch (err) {
      alert("Failed to send email summary. Verify SMTP settings.");
    } finally {
      setIsEmailing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div><h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Data Exports</h1><p className="text-slate-500 font-medium">Generate system-wide audit logs and summaries</p></div>
        <div className="flex p-1 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <button onClick={() => setActiveTab('GENERATOR')} className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'GENERATOR' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Generator</button>
          <button onClick={() => setActiveTab('CONFIG')} className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'CONFIG' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Columns</button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          {activeTab === 'GENERATOR' ? (
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">1. Report Category</p>
                  <div className="space-y-3">
                    {['ATTENDANCE', 'ABSENT', 'LATE', 'LEAVE'].map((id) => (
                      <button key={id} onClick={() => setReportType(id)} className={`w-full flex items-center gap-4 p-5 rounded-3xl border transition-all ${reportType === id ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white border-slate-100 hover:bg-slate-50'}`}>
                        <div className={`p-2.5 rounded-xl ${reportType === id ? 'bg-white/10' : 'bg-indigo-500 text-white'}`}><FileText size={20} /></div>
                        <span className="font-bold text-sm uppercase tracking-tight">{id} Report</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">2. Range & Filter</p>
                    <div className="flex gap-2">
                       <input type="date" className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold" value={startDate} onChange={e => setStartDate(e.target.value)} />
                       <input type="date" className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                    <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs" value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)}>
                        <option>Entire Organization</option>
                        {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                     </select>
                  </div>
                  <div className="pt-4">
                    <button onClick={handleEmailSummary} disabled={isEmailing} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                       {isEmailing ? <RefreshCw className="animate-spin" size={16}/> : <Mail size={16}/>} Email Today's Summary
                    </button>
                  </div>
                </div>
              </div>
              <div className="pt-10 border-t border-slate-50 mt-10">
                <button onClick={downloadCSV} disabled={isGenerating || reportData.length === 0} className="w-full flex items-center justify-center gap-3 py-5 bg-indigo-600 text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-700 transition-all">
                  {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <FileSpreadsheet size={18} />} Generate & Download Export
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 md:p-12">
              <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3"><Settings2 className="text-indigo-500" /> Export Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {columnOptions.map((col) => (
                  <button key={col.key} onClick={() => setEnabledColumns(p => ({...p, [col.key]: !p[col.key]}))} className={`flex items-center justify-between p-5 rounded-3xl border transition-all ${enabledColumns[col.key] ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                    <div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${enabledColumns[col.key] ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-400'}`}><col.icon size={16} /></div><span className="text-[10px] font-black uppercase tracking-tight">{col.label}</span></div>
                    {enabledColumns[col.key] && <CheckCircle size={18} className="text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="bg-[#0f172a] rounded-[3rem] p-8 text-white shadow-2xl space-y-8">
           <h3 className="text-xl font-black flex items-center gap-3"><Search className="text-indigo-400" /> Output Preview</h3>
           <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Records Found</p>
              <p className="text-4xl font-black">{reportData.length}</p>
              <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Across {departmentFilter}</p>
           </div>
           <div className="pt-4 text-center">
              <p className="text-[10px] text-slate-500 italic leading-relaxed">
                Report generation is processed locally. Large datasets will be formatted into a standard UTF-8 CSV with Excel compatibility (BOM enabled).
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;