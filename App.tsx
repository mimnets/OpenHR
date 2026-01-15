import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import EmployeeDirectory from './pages/EmployeeDirectory';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import Organization from './pages/Organization';
import Login from './pages/Login';
import Setup from './pages/Setup';
import { hrService } from './services/hrService';
import { pb, isPocketBaseConfigured } from './services/pocketbase';
import { User } from './types';
import { 
  Database, 
  ShieldAlert, 
  Menu, 
  X, 
  LayoutDashboard, 
  Clock, 
  CalendarDays, 
  UserCircle 
} from 'lucide-react';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isConfigured, setIsConfigured] = useState(isPocketBaseConfigured());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isConfigured && pb?.authStore.isValid && pb?.authStore.model) {
      const model = pb.authStore.model;
      const rawRole = model.role || 'EMPLOYEE';
      const normalizedRole = rawRole.toString().toUpperCase() as any;

      setCurrentUser({
        id: model.id,
        employeeId: model.employee_id || model.id,
        name: model.name || 'User',
        email: model.email,
        role: normalizedRole,
        department: model.department || 'Unassigned',
        designation: model.designation || 'Staff',
        avatar: model.avatar ? pb.files.getURL(model, model.avatar) : undefined
      });
    }

    const hrUnsub = hrService.subscribe(() => {
       if (pb?.authStore.model) {
         const m = pb.authStore.model;
         const normalized = (m.role || 'EMPLOYEE').toString().toUpperCase() as any;
         setCurrentUser({
            id: m.id,
            employeeId: m.employee_id || m.id,
            name: m.name || 'User',
            email: m.email,
            role: normalized,
            department: m.department || 'Unassigned',
            designation: m.designation || 'Staff',
            avatar: m.avatar ? pb.files.getURL(m, m.avatar) : undefined
         });
       } else {
         setCurrentUser(null);
       }
    });

    return () => { hrUnsub(); };
  }, [isConfigured]);

  const handleLogout = async () => {
    await hrService.logout();
    setCurrentUser(null);
    setCurrentPath('dashboard');
    setIsMobileMenuOpen(false);
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setIsMobileMenuOpen(false);
  };

  if (!isConfigured) {
    return <Setup onComplete={() => setIsConfigured(true)} />;
  }

  if (!currentUser) {
    return (
      <Login 
        onLoginSuccess={(u) => setCurrentUser(u)} 
        onEnterSetup={() => setIsConfigured(false)} 
      />
    );
  }

  const renderContent = () => {
    switch (currentPath) {
      case 'dashboard': return <Dashboard user={currentUser} onNavigate={setCurrentPath} />;
      case 'profile': return <Settings user={currentUser} />;
      case 'employees': return <EmployeeDirectory />;
      case 'attendance': return <Attendance user={currentUser} />;
      case 'leave': return <Leave user={currentUser} />;
      case 'settings': return <Settings user={currentUser} />;
      case 'reports': return <Reports user={currentUser} />;
      case 'organization': return <Organization />;
      default: return <Dashboard user={currentUser} onNavigate={setCurrentPath} />;
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen relative overflow-hidden">
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop and Mobile Drawer */}
      <div className={`fixed h-full z-[70] transition-transform duration-300 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:block'}`}>
        <Sidebar 
          currentPath={currentPath} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout} 
          role={currentUser.role} 
        />
      </div>

      <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
        {/* Universal Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-2 text-slate-500 md:hidden hover:bg-slate-50 rounded-xl transition-all"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border bg-indigo-50 text-indigo-600 border-indigo-100 hidden sm:flex">
                <Database size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">POCKETBASE</span>
              </div>
              
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                currentUser.role === 'ADMIN' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-500 border-slate-100'
              }`}>
                <ShieldAlert size={12} />
                <span className="hidden xs:inline">{currentUser.role} ACCESS</span>
                <span className="xs:hidden">{currentUser.role[0]}</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-tight">{currentUser.name}</p>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{currentUser.designation}</p>
              </div>
              <div 
                className="cursor-pointer"
                onClick={() => setCurrentPath('profile')}
              >
                <img 
                  src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name}`} 
                  className="w-10 h-10 rounded-xl bg-indigo-100 object-cover ring-2 ring-transparent hover:ring-indigo-500 transition-all shadow-sm" 
                  alt="Profile"
                />
              </div>
           </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full pb-24 md:pb-10">
          {renderContent()}
        </div>

        {/* Mobile Bottom Navigation (Only for Employees/General use) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around p-4 z-50">
          <button 
            onClick={() => setCurrentPath('dashboard')}
            className={`flex flex-col items-center gap-1 transition-all ${currentPath === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <LayoutDashboard size={20} className={currentPath === 'dashboard' ? 'scale-110' : ''} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Home</span>
          </button>
          <button 
            onClick={() => setCurrentPath('attendance')}
            className={`flex flex-col items-center gap-1 transition-all ${currentPath === 'attendance' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <Clock size={20} className={currentPath === 'attendance' ? 'scale-110' : ''} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Station</span>
          </button>
          <button 
            onClick={() => setCurrentPath('leave')}
            className={`flex flex-col items-center gap-1 transition-all ${currentPath === 'leave' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <CalendarDays size={20} className={currentPath === 'leave' ? 'scale-110' : ''} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Leave</span>
          </button>
          <button 
            onClick={() => setCurrentPath('profile')}
            className={`flex flex-col items-center gap-1 transition-all ${currentPath === 'profile' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <UserCircle size={20} className={currentPath === 'profile' ? 'scale-110' : ''} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Account</span>
          </button>
        </nav>
      </main>
    </div>
  );
};

export default App;