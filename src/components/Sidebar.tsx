import React from 'react';
import { 
  LayoutDashboard, 
  FileEdit, 
  CloudUpload, 
  CreditCard, 
  ClipboardCheck, 
  Award, 
  Bell, 
  Settings, 
  LogOut, 
  Database,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { User, Application } from '../types';
import { IEMLogo } from './IEMLogo';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  user: User | null;
  application: Application | null;
  unreadNotifsCount: number;
  onOpenMeritList: () => void;
  onOpenDatabaseExplorer: () => void;
  onLogout: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  user,
  application,
  unreadNotifsCount,
  onOpenMeritList,
  onOpenDatabaseExplorer,
  onLogout,
  mobileOpen,
  setMobileOpen,
}) => {
  const iemLogoUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAhk-GeFs0zS-XHK3_pNbQxmaT2TKcUQhSfLrPNJpAwwmuiLTcaP9i6-FiW8cF4I740leSDyWe0Vuil2odmfLPIkJnd4R3NOFBjYfrww-y_dhdrtVF9yVus69KtP0rV7noIVq4REnrQw7V0-LdwzBCocnd5BFge_80nYtDh1RjG8IhgLPxPBWWW3t5s_FE9aD3zMj_TNG9KILh3YX3JQeD7JosJAma2W_mLRFxFLIdyIW394TlfjloqjdH77eTV9VT6aQ";

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'form', label: 'Application Form', icon: FileEdit },
    { id: 'documents', label: 'Document Upload', icon: CloudUpload },
    { id: 'payment', label: 'Fee Payment', icon: CreditCard },
    { id: 'status', label: 'Admission Status', icon: ClipboardCheck },
  ];

  const handleNav = (viewId: string) => {
    setCurrentView(viewId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          id="sidebar-backdrop"
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        id="main-sidebar"
        className={`fixed left-0 top-0 h-full w-64 bg-[#030712] border-r border-[#1E293B] flex flex-col p-4 z-50 transition-transform duration-300 ease-in-out md:translate-x-0 select-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Close Button */}
        <button 
          id="close-mobile-sidebar-btn"
          onClick={() => setMobileOpen(false)}
          className="md:hidden absolute top-4 right-4 p-1.5 text-slate-400 hover:bg-slate-800 rounded-lg"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand & Logo */}
        <div className="mb-5 pt-1 px-1">
          <div className="flex items-center gap-3">
            <IEMLogo size="md" variant="icon" />
            <div className="min-w-0">
              <h1 className="font-headline font-semibold text-base text-[#F8FAFC] leading-tight tracking-tight">
                IEM_PORTAL
              </h1>
              <p className="text-[10px] font-mono text-teal-400 tracking-wider uppercase mt-0.5">ADM_CORE v2026</p>
            </div>
          </div>
        </div>

        {/* User Status Card */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0F172A] border border-[#1E293B] mb-5">
          <img 
            src={user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBdgDcW0tVbFbIuOWUVdbU8cYPLCHGs6Enk-tp5dwoWiQpulHBGDQ0ChR4bY97svyjwKzN9QolMlzSHo4nCVS1YOhe_2Z588RSMBWXrNrZlKKHeW32K7HHX7APn0BaBw8MkLrSX32IjzZEfYZ-ydgxsr5VgVDQAu_CwyzBiZf65M3JFIOObFqioMGrvf6X7VUX1YqeD_yu_9NQkCKHA-HN_FGII2yB7LV_W0iL6V4g_WSC8QFoYDhLu"} 
            alt="Applicant" 
            className="w-8 h-8 rounded-md object-cover border border-[#1E293B]"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-medium text-slate-200 truncate">
                {user?.name || 'Candidate'}
              </p>
              {user?.role === 'admin' && (
                <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[9px] font-mono font-bold px-1 rounded">ADMIN</span>
              )}
            </div>
            <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
              {user?.applicationId || application?.id || 'IEM-2024-001'}
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-2 px-2 font-bold">
          Portal Control
        </div>
        <nav className="flex-1 overflow-y-auto space-y-1 pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}-btn`}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-xs transition-all ${
                  isActive
                    ? 'bg-[#1E293B] text-[#2DD4BF] font-medium'
                    : 'text-slate-400 hover:bg-[#0F172A] hover:text-slate-200'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#2DD4BF]' : 'bg-slate-700'}`} />
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#2DD4BF]' : 'text-slate-500'}`} />
                <span className="truncate flex-1">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* View Merit List CTA Button */}
        <div className="pt-3 pb-2">
          <button
            id="sidebar-view-merit-list-btn"
            onClick={() => {
              onOpenMeritList();
              setMobileOpen(false);
            }}
            className="w-full bg-[#2DD4BF] hover:bg-teal-400 text-[#020617] text-xs font-bold py-2 px-3 rounded-md transition-all flex items-center justify-center gap-2 shadow-sm shadow-teal-500/10 cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-[#020617]" />
            <span>Merit Rank List</span>
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-[#1E293B] space-y-1 text-xs">
          {/* Live Database Explorer Trigger */}
          <button
            id="sidebar-database-explorer-btn"
            onClick={() => {
              onOpenDatabaseExplorer();
              setMobileOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-slate-400 hover:bg-[#0F172A] hover:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-mono text-[11px] text-slate-300">Database Engine</span>
            </div>
            <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
              ONLINE
            </span>
          </button>

          {/* Notifications */}
          <button
            id="sidebar-notifications-btn"
            onClick={() => handleNav('notifications')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-slate-400 hover:bg-[#0F172A] hover:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs">Notifications</span>
            </div>
            {unreadNotifsCount > 0 && (
              <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold px-1.5 rounded-full">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <button
            id="sidebar-settings-btn"
            onClick={() => handleNav('settings')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-slate-400 hover:bg-[#0F172A] hover:text-slate-200 transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs">Settings</span>
          </button>

          {/* Logout */}
          <button
            id="sidebar-logout-btn"
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-xs">Terminate Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};
