
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  UserPlus, 
  Upload, 
  X, 
  Camera, 
  Key, 
  Edit, 
  Trash2,
  Save,
  ShieldCheck,
  CreditCard,
  Briefcase,
  Mail,
  RefreshCw,
  Lock,
  Globe,
  MapPin
} from 'lucide-react';
import { hrService } from '../services/hrService';
import { emailService } from '../services/emailService';
import { Employee } from '../types';

const EmployeeDirectory: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [depts, setDepts] = useState<string[]>([]);
  const [desigs, setDesigs] = useState<string[]>([]);

  const fetchEmployees = () => {
    setEmployees(hrService.getEmployees());
  };

  useEffect(() => {
    fetchEmployees();
    setDepts(hrService.getDepartments());
    setDesigs(hrService.getDesignations());
  }, []);
  
  const initialNewEmpState = {
    name: '',
    email: '',
    username: '',
    password: '',
    id: '',
    nid: '',
    role: 'EMPLOYEE' as any,
    department: '',
    designation: '',
    avatar: '',
    joiningDate: new Date().toISOString().split('T')[0],
    mobile: '',
    emergencyContact: '',
    salary: 0,
    status: 'ACTIVE' as any,
    employmentType: 'PERMANENT' as any,
    location: 'Dhaka',
    workType: 'OFFICE' as any
  };

  const [formState, setFormState] = useState(initialNewEmpState);

  const filtered = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState({ ...formState, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormState({
      ...initialNewEmpState,
      id: `EMP${Math.floor(Math.random() * 900) + 100}`,
      department: depts[0] || '',
      designation: desigs[0] || ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingId(emp.id);
    setFormState({
      ...initialNewEmpState,
      ...emp,
      salary: emp.salary || 0,
      password: emp.password || '',
      workType: emp.workType || 'OFFICE'
    } as any);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      hrService.deleteEmployee(id);
      fetchEmployees();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAvatar = formState.avatar || `https://picsum.photos/seed/${formState.name}/200`;
    
    if (editingId) {
      hrService.updateProfile(editingId, {
        ...formState,
        avatar: finalAvatar
      } as any);
    } else {
      const newEmp: Employee = {
        ...formState,
        avatar: finalAvatar
      } as any;
      hrService.addEmployee(newEmp);
      
      // Auto-trigger welcome email
      if (hrService.getConfig().smtp?.isActive) {
        await emailService.sendWelcomeEmail(newEmp);
      }
    }
    fetchEmployees();
    setShowModal(false);
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormState({...formState, password: pass});
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Employee Directory</h1>
          <p className="text-sm text-slate-500 font-medium tracking-tight">Managing {employees.length} active personnel</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 shadow-md transition-all"
          >
            <UserPlus size={16} /> Add Employee
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, ID or department..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((emp) => (
          <div key={emp.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all group relative">
            <div className="flex items-start gap-4">
              <img src={emp.avatar || `https://ui-avatars.com/api/?name=${emp.name}`} className="w-16 h-16 rounded-2xl object-cover bg-slate-100" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-900 truncate">{emp.name}</h3>
                  <div className="flex gap-1">
                    <button onClick={() => handleOpenEdit(emp)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg transition-all"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(emp.id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-all"><Trash2 size={14} /></button>
                  </div>
                </div>
                <p className="text-[10px] font-black text-indigo-600 uppercase mt-0.5">{emp.designation}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${emp.workType === 'FIELD' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                    {emp.workType === 'FIELD' ? 'Flexible (Field)' : 'Fixed (Office)'}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <p className="text-[9px] text-slate-400 uppercase font-black">Employee ID</p>
                <p className="text-sm font-black text-slate-700">{emp.id}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <p className="text-[9px] text-slate-400 uppercase font-black">Department</p>
                <p className="text-[11px] font-black text-slate-700 uppercase truncate">{emp.department}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-black uppercase tracking-tight">{editingId ? 'Modify Profile' : 'New Onboarding'}</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="hover:bg-white/10 p-2 rounded-xl"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[85vh] overflow-y-auto no-scrollbar">
              <div className="flex flex-col md:flex-row gap-8 items-center pb-8 border-b border-slate-100">
                <div className="w-32 h-32 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  {formState.avatar ? <img src={formState.avatar} className="w-full h-full object-cover" /> : <Camera size={40} className="text-slate-400" />}
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase px-1">Full Employee Name</label>
                    <input type="text" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase px-1">Identity ID</label>
                    <input type="text" readOnly={!!editingId} className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none ${editingId ? 'text-slate-400' : ''}`} value={formState.id} onChange={e => !editingId && setFormState({...formState, id: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase px-1">Work Type (Attendance Rules)</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={formState.workType} onChange={e => setFormState({...formState, workType: e.target.value as any})}>
                    <option value="OFFICE">Office (Fixed Shift)</option>
                    <option value="FIELD">Field (Flexible/Factory)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase px-1">Account Role</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={formState.role} onChange={e => setFormState({...formState, role: e.target.value as any})}>
                    <option value="EMPLOYEE">Employee</option>
                    <option value="MANAGER">Manager</option>
                    <option value="HR">HR Specialist</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase px-1">Department</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={formState.department} onChange={e => setFormState({...formState, department: e.target.value})}>
                    {depts.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1 lg:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase px-1">Designation</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={formState.designation} onChange={e => setFormState({...formState, designation: e.target.value})}>
                    {desigs.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase px-1">Monthly Salary (BDT)</label>
                  <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={formState.salary} onChange={e => setFormState({...formState, salary: parseInt(e.target.value) || 0})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase px-1">Work Email</label>
                  <input type="email" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={formState.email} onChange={e => setFormState({...formState, email: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase px-1">Username</label>
                  <input type="text" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={formState.username} onChange={e => setFormState({...formState, username: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase px-1">Password</label>
                  <div className="relative">
                    <input type="text" placeholder="Set or regenerate" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm outline-none" value={formState.password} onChange={e => setFormState({...formState, password: e.target.value})} />
                    <button type="button" onClick={generatePassword} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600"><RefreshCw size={16} /></button>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black uppercase text-xs">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg flex items-center justify-center gap-2"><Save size={18} /> {editingId ? 'Save Profile' : 'Complete Onboarding'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDirectory;
