
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
import { Database, ShieldAlert } from 'lucide-react';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isConfigured, setIsConfigured] = useState(isPocketBaseConfigured());

  // Attempt to restore session on boot
  // Fix: Ensure the destructor returns void instead of boolean from hrUnsub() to match EffectCallback requirements.
  useEffect(() => {
    if (isConfigured && pb?.authStore.isValid && pb?.authStore.model) {
      const model = pb.authStore.model;
      
      // Normalize role on restore
      const rawRole = model.role || 'EMPLOYEE';
      const normalizedRole = rawRole.toString().toUpperCase() as any;

      // Fix: Added missing required employeeId property to the User object.
      setCurrentUser({
        id: model.id,
        employeeId: model.employeeId || model.id,
        name: model.name || 'User',
        email: model.email,
        role: normalizedRole,
        department: model.department || 'Unassigned',
        designation: model.designation || 'Staff'
      });
    }

    const hrUnsub = hrService.subscribe(() => {
       if (pb?.authStore.model) {
         const m = pb.authStore.model;
         const normalized = (m.role || 'EMPLOYEE').toString().toUpperCase() as any;
         // Fix: Added missing required employeeId property to the User object.
         setCurrentUser({
            id: m.id,
            employeeId: m.employeeId || m.id,
            name: m.name || 'User',
            email: m.email,
            role: normalized,
            department: m.department || 'Unassigned',
            designation: m.designation || 'Staff'
         });
       } else {
         setCurrentUser(null);
       }
    });

    // Fix: Explicitly return a function that returns void.
    return () => { hrUnsub(); };
  }, [isConfigured]);

  const handleLogout = async () => {
    await hrService.logout();
    setCurrentUser(null);
    setCurrentPath('dashboard');
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
    <div className="flex bg-slate-50 min-h-screen">
      <div className="hidden md:block fixed h-full">
        <Sidebar 
          currentPath={currentPath} 
          onNavigate={setCurrentPath} 
          onLogout={handleLogout} 
          role={currentUser.role} 
        />
      </div>
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border bg-indigo-50 text-indigo-600 border-indigo-100">
                <Database size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">POCKETBASE</span>
              </div>
              
              {/* DEBUG BADGE: Help user see their active role */}
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                currentUser.role === 'ADMIN' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-500 border-slate-100'
              }`}>
                <ShieldAlert size={12} />
                {currentUser.role} ACCESS
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
                  className="w-10 h-10 rounded-xl bg-indigo-100 object-cover ring-2 ring-transparent hover:ring-indigo-500 transition-all" 
                  alt="Profile"
                />
              </div>
           </div>
        </header>
        <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
