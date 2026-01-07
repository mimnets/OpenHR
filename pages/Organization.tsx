
import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Briefcase, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Save, 
  Building2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Users,
  Settings,
  Workflow,
  ArrowRight,
  UserCheck,
  Clock
} from 'lucide-react';
import { hrService } from '../services/hrService';
import { Holiday, AppConfig, LeaveWorkflow, Employee } from '../types';

type OrgTab = 'STRUCTURE' | 'PLACEMENT' | 'TERMS' | 'WORKFLOW' | 'HOLIDAYS';

const Organization: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OrgTab>('STRUCTURE');
  
  // Data State
  const [departments, setDepartments] = useState<string[]>([]);
  const [designations, setDesignations] = useState<string[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [config, setConfig] = useState<AppConfig>(hrService.getConfig());
  const [workflows, setWorkflows] = useState<LeaveWorkflow[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Editing State
  const [isEditingDept, setIsEditingDept] = useState<number | null>(null);
  const [isEditingDesig, setIsEditingDesig] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    setDepartments(hrService.getDepartments());
    setDesignations(hrService.getDesignations());
    setHolidays(hrService.getHolidays());
    setWorkflows(hrService.getWorkflows());
    setEmployees(hrService.getEmployees());
  }, []);

  // Shared Handlers
  const handleSaveConfig = () => {
    hrService.setConfig(config);
    alert('Employment terms updated successfully.');
  };

  const handleUpdateLineManager = (empId: string, managerId: string) => {
    hrService.updateProfile(empId, { lineManagerId: managerId });
    setEmployees(hrService.getEmployees());
  };

  const handleAddHoliday = (name: string, date: string, type: any) => {
    const newHolidays = [...holidays, { id: Math.random().toString(), name, date, type, isGovernment: true }];
    setHolidays(newHolidays);
    hrService.setHolidays(newHolidays);
    setShowAddForm(false);
  };

  const renderStructure = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Network size={20} />
            <h3 className="text-sm font-black uppercase">Departments</h3>
          </div>
          <button onClick={() => { setInputValue(''); setShowAddForm(true); }} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"><Plus size={18} /></button>
        </div>
        <div className="p-6 space-y-2">
          {departments.map((dept, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-white hover:shadow-md transition-all">
              <span className="font-bold text-slate-800">{dept}</span>
              <button onClick={() => {
                const updated = departments.filter((_, idx) => idx !== i);
                setDepartments(updated);
                hrService.setDepartments(updated);
              }} className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 bg-indigo-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Briefcase size={20} />
            <h3 className="text-sm font-black uppercase">Designations</h3>
          </div>
          <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"><Plus size={18} /></button>
        </div>
        <div className="p-6 space-y-2">
          {designations.map((des, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-white hover:shadow-md transition-all">
              <span className="font-bold text-slate-800">{des}</span>
              <button onClick={() => {
                const updated = designations.filter((_, idx) => idx !== i);
                setDesignations(updated);
                hrService.setDesignations(updated);
              }} className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderPlacement = () => (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-8">
      <div>
        <h3 className="text-xl font-black text-slate-900 mb-2">Reporting & Placements</h3>
        <p className="text-sm text-slate-500">Configure Line Managers and departmental placements for employees</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100">
              <th className="pb-4">Employee</th>
              <th className="pb-4">Department</th>
              <th className="pb-4">Line Manager</th>
              <th className="pb-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <img src={emp.avatar} className="w-8 h-8 rounded-lg" />
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-none">{emp.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{emp.designation}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold uppercase">{emp.department}</span>
                </td>
                <td className="py-4">
                  <select 
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
                    value={emp.lineManagerId || ''}
                    onChange={(e) => handleUpdateLineManager(emp.id, e.target.value)}
                  >
                    <option value="">No Manager</option>
                    {employees.filter(m => m.id !== emp.id).map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </td>
                <td className="py-4 text-right">
                  <button className="text-indigo-600 font-black text-[10px] uppercase hover:underline">View History</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTerms = () => (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-slate-900">Employment Terms & Workdays</h3>
          <p className="text-sm text-slate-500">Organization-wide policies for working hours and days</p>
        </div>
        <button 
          onClick={handleSaveConfig}
          className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest"
        >
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Calendar size={14} className="text-indigo-600" /> Standard Working Days
          </h4>
          <div className="flex flex-wrap gap-2">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
              const isActive = config.workingDays.includes(day);
              return (
                <button 
                  key={day}
                  onClick={() => {
                    const next = isActive 
                      ? config.workingDays.filter(d => d !== day)
                      : [...config.workingDays, day];
                    setConfig({...config, workingDays: next});
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    isActive ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-400 border-slate-100'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Clock size={14} className="text-indigo-600" /> Shift & General Timing
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Office Start</label>
              <input type="time" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl" defaultValue="09:00" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Office End</label>
              <input type="time" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl" defaultValue="17:00" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkflow = () => (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-8">
      <div>
        <h3 className="text-xl font-black text-slate-900 mb-2">Leave Approval Workflows</h3>
        <p className="text-sm text-slate-500">Define routing for leave requests on a per-department basis</p>
      </div>

      <div className="space-y-4">
        {workflows.map((wf, i) => (
          <div key={i} className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                <Workflow size={24} />
              </div>
              <div>
                <h4 className="font-black text-slate-900 uppercase tracking-tight">{wf.department}</h4>
                <p className="text-xs text-slate-500 font-medium">Standard Leave Routing Policy</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <label className="text-[9px] font-black text-slate-400 uppercase mb-1">Approver Type</label>
                <select 
                  className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold outline-none"
                  value={wf.approverRole}
                  onChange={(e) => {
                    const next = [...workflows];
                    next[i].approverRole = e.target.value as any;
                    setWorkflows(next);
                    hrService.setWorkflows(next);
                  }}
                >
                  <option value="LINE_MANAGER">Line Manager</option>
                  <option value="HR">HR Department</option>
                  <option value="ADMIN">Company Administrator</option>
                </select>
              </div>
              <ArrowRight className="text-slate-300" />
              <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest">
                Final Decision
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHolidays = () => (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-slate-900">Organization Holiday List</h3>
          <p className="text-sm text-slate-500">Government, Religious and Special Company holidays</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-6 py-2 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest"
        >
          <Plus size={16} /> Add Holiday
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {holidays.map((h) => (
          <div key={h.id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => {
                const next = holidays.filter(item => item.id !== h.id);
                setHolidays(next);
                hrService.setHolidays(next);
              }} className="p-2 text-rose-300 hover:text-rose-600"><Trash2 size={16} /></button>
            </div>
            <p className="text-[10px] font-black text-rose-600 uppercase mb-1 tracking-widest">{h.type}</p>
            <h4 className="font-bold text-slate-900 mb-4">{h.name}</h4>
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar size={14} />
              <span className="text-xs font-black tracking-tight">{new Date(h.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Organization & Setup</h1>
          <p className="text-slate-500 font-medium">Core structural and policy configurations</p>
        </div>
      </header>

      {/* Tabs Menu */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 p-1.5 bg-white border border-slate-100 rounded-2xl shadow-sm">
        {(['STRUCTURE', 'PLACEMENT', 'TERMS', 'WORKFLOW', 'HOLIDAYS'] as OrgTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="animate-in fade-in zoom-in-95 duration-300">
        {activeTab === 'STRUCTURE' && renderStructure()}
        {activeTab === 'PLACEMENT' && renderPlacement()}
        {activeTab === 'TERMS' && renderTerms()}
        {activeTab === 'WORKFLOW' && renderWorkflow()}
        {activeTab === 'HOLIDAYS' && renderHolidays()}
      </div>

      {/* Shared Success Indicator */}
      <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-xl flex items-center gap-8">
        <div className="p-4 bg-indigo-600 rounded-2xl shadow-lg">
          <Settings size={32} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black mb-1">Global Configuration Center</h3>
          <p className="text-sm text-slate-400">All changes made in these modules are audited and synchronized with individual employee portals instantly.</p>
        </div>
        <div className="hidden md:flex flex-col items-end gap-1">
          <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-emerald-400 px-3 py-1 bg-emerald-400/10 rounded-full border border-emerald-400/20">
            <UserCheck size={12} /> Sync Active
          </span>
          <p className="text-[8px] text-slate-500 font-bold uppercase">v2.4.1 Compliant</p>
        </div>
      </div>
    </div>
  );
};

export default Organization;
