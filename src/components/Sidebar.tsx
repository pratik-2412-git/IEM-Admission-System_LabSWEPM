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
  X
} from 'lucide-react';
import { User, Application } from '../types';

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
  const iemOfficialLogo = "https://lh3.googleusercontent.com/aida-public/AB6AXuBXCqal3brEWgJu24gqxVle37bNvDpDuIEUfEZYRV4FYs0dlpkmH3uKTfEK_PlG4dNcEfNkaX8MIB67bI_XdC5zL-r9GzELtdc6D1Tu2KsOigW4GrmF83xJuIOh_EN8EKIdAW7SafuRgN3Wg8JKTDoY00y3m-yWnGfZ4UJUGVGtFxBFmzGTs3B78JMmO4Wtim7XT74_Mo0DCA_iL_EiZHuePIbRFxiaQBNn_YV5RhM_otmGQmotXyKxsyIYqTPZCv-J_A";

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
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SideNavBar Container */}
      <nav 
        id="main-sidebar"
        className={`fixed left-0 top-0 h-full w-64 bg-[#f9f6ed] border-r border-[#ded9cf] flex flex-col p-4 z-50 shadow-[1px_0_10px_rgba(0,0,0,0.02)] transition-transform duration-300 ease-in-out md:translate-x-0 select-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Close Button */}
        <button 
          id="close-mobile-sidebar-btn"
          onClick={() => setMobileOpen(false)}
          className="md:hidden absolute top-4 right-4 p-1.5 text-[#4a454c] hover:bg-[#eae6da] rounded-lg cursor-pointer"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with official IEM Logo */}
        <div className="flex items-center gap-3 mb-6 pt-1 animate-fade-up">
          <div className="bg-white p-1 rounded-xl border border-[#ded9cf]/70 shadow-xs shrink-0">
            <img 
              alt="IEM Logo" 
              className="h-14 w-auto object-contain transition-transform duration-300 hover:scale-105" 
              src={iemOfficialLogo}
            />
          </div>
          <div className="min-w-0">
            <h2 className="font-headline text-base font-semibold text-[#33253c] tracking-tight leading-tight truncate">
              {user ? `Welcome, ${user.name.split(' ')[0]}` : 'Welcome, Candidate'}
            </h2>
            <p className="text-xs text-[#4a454c] font-medium truncate mt-0.5">
              ID: {user?.applicationId || application?.id || 'IEM-2026-001'}
            </p>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}-btn`}
                onClick={() => handleNav(item.id)}
                className={`w-full group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#e7dcea]/80 text-[#33253c] font-semibold shadow-xs border border-[#e7dcea]'
                    : 'text-[#4a454c] hover:text-[#33253c] hover:bg-[#eae6da] hover:translate-x-1'
                }`}
              >
                <Icon 
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-[#33253c]' : 'text-[#4a454c] group-hover:text-[#33253c]'
                  }`} 
                />
                <span className="text-xs font-semibold tracking-wide truncate">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Primary CTA Button: View Merit List */}
        <div className="my-4 animate-fade-up">
          <button
            id="sidebar-view-merit-list-btn"
            onClick={() => {
              onOpenMeritList();
              setMobileOpen(false);
            }}
            className="w-full py-2.5 bg-[#33253c] text-white font-semibold text-xs rounded-lg hover:bg-[#4a3b53] transition-all duration-200 shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>View Merit List</span>
          </button>
        </div>

        {/* Footer Navigation */}
        <div className="space-y-1 border-t border-[#ded9cf] pt-3 text-xs">
          {/* Database Explorer */}
          <button
            id="sidebar-database-explorer-btn"
            onClick={() => {
              onOpenDatabaseExplorer();
              setMobileOpen(false);
            }}
            className="w-full group flex items-center justify-between p-2.5 text-[#4a454c] hover:text-[#33253c] hover:bg-[#eae6da] rounded-xl transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-[#63603c]" />
              <span className="font-semibold text-xs">Database Engine</span>
            </div>
            <span className="bg-emerald-600/10 text-emerald-800 border border-emerald-600/20 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
              LIVE
            </span>
          </button>

          {/* Notifications */}
          <button
            id="sidebar-notifications-btn"
            onClick={() => handleNav('notifications')}
            className={`w-full group flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
              currentView === 'notifications' 
                ? 'bg-[#e7dcea]/70 text-[#33253c] font-semibold' 
                : 'text-[#4a454c] hover:text-[#33253c] hover:bg-[#eae6da]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-[#4a454c] group-hover:text-[#33253c]" />
              <span className="font-semibold text-xs">Notifications</span>
            </div>
            {unreadNotifsCount > 0 && (
              <span className="bg-[#ba1a1a] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <button
            id="sidebar-settings-btn"
            onClick={() => handleNav('settings')}
            className={`w-full group flex items-center gap-2.5 p-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
              currentView === 'settings' 
                ? 'bg-[#e7dcea]/70 text-[#33253c] font-semibold' 
                : 'text-[#4a454c] hover:text-[#33253c] hover:bg-[#eae6da]'
            }`}
          >
            <Settings className="w-4 h-4 text-[#4a454c] group-hover:text-[#33253c]" />
            <span className="font-semibold text-xs">Settings</span>
          </button>

          {/* Logout */}
          <button
            id="sidebar-logout-btn"
            onClick={onLogout}
            className="w-full group flex items-center gap-2.5 p-2.5 text-[#ba1a1a] hover:bg-red-50 rounded-xl transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-[#ba1a1a]" />
            <span className="font-semibold text-xs">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
};
