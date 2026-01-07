
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  CalendarDays, 
  BarChart3, 
  Settings, 
  LogOut,
  ShieldCheck,
  Globe,
  Network
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  role: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate, onLogout, role }) => {
  const isAdmin = role === 'ADMIN' || role === 'HR';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
    { id: 'employees', label: 'Employees', icon: Users, roles: ['ADMIN', 'HR'] },
    { id: 'organization', label: 'Organization', icon: Network, roles: ['ADMIN', 'HR'] },
    { id: 'attendance', label: 'Attendance', icon: Clock, roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
    { id: 'leave', label: 'Leave', icon: CalendarDays, roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
    { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['ADMIN', 'HR'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-64 bg-slate-900 h-screen flex flex-col text-white shadow-xl relative z-50">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Globe size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">OpenHR</h1>
          <p className="text-xs text-slate-400">Enterprise HRMS</p>
        </div>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto no-scrollbar">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentPath === item.id 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
            {item.id === 'dashboard' && currentPath !== 'dashboard' && (
              <div className="ml-auto w-2 h-2 rounded-full bg-indigo-500"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 p-3 rounded-xl mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Compliance Active</span>
          </div>
          <p className="text-[10px] text-slate-500">v2.4.1 (BD Labor Code 2006)</p>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-rose-900/40 rounded-lg transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
