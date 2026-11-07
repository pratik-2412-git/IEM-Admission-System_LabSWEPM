import React from 'react';
import { 
  LayoutDashboard, 
  FileEdit, 
  CloudUpload, 
  CreditCard, 
  ClipboardCheck, 
  Award, 
  Database,
  X,
  CheckCircle2,
  Clock
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

  // Real backend submission state check
  const isSubmitted = Boolean(
    application &&
    application.status !== 'draft' &&
    ['submitted', 'under_review', 'correction_required', 'resubmitted', 'approved', 'rejected', 'seat_allotted', 'admission_confirmed'].includes(application.status)
  );

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'form', label: 'Application Form', icon: FileEdit },
    { id: 'documents', label: 'Document Upload', icon: CloudUpload },
    { id: 'payment', label: 'Fee Payment', icon: CreditCard },
    { id: 'status', label: 'Submit Application', icon: ClipboardCheck },
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
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SideNavBar Container */}
      <nav 
        id="main-sidebar"
        className={`fixed left-0 top-0 h-full w-64 bg-[#f9f6ed] border-r border-[#ded9cf] flex flex-col p-4 z-50 shadow-xs md:translate-x-0 select-none ${
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
        <div className="flex items-center gap-3 mb-6 pt-1">
          <div className="bg-white p-1 rounded-xl border border-[#ded9cf]/70 shadow-xs shrink-0">
            <img 
              alt="IEM Official Logo" 
              className="h-14 w-auto object-contain" 
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
            const isSubmitItem = item.id === 'status';

            return (
              <button
                key={item.id}
                id={`nav-${item.id}-btn`}
                onClick={() => handleNav(item.id)}
                className={`w-full group flex items-center justify-between p-3 rounded-xl text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#e7dcea]/80 text-[#33253c] font-semibold shadow-xs border border-[#e7dcea]'
                    : 'text-[#4a454c] hover:text-[#33253c] hover:bg-[#eae6da]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon 
                    className={`w-5 h-5 shrink-0 ${
                      isActive ? 'text-[#33253c]' : 'text-[#4a454c] group-hover:text-[#33253c]'
                    }`} 
                  />
                  <span className="text-xs font-semibold tracking-wide truncate">
                    {item.label}
                  </span>
                </div>

                {/* Submission Indicator: Green Tick if submitted; pending indicator if incomplete */}
                {isSubmitItem && (
                  isSubmitted ? (
                    <span 
                      id="nav-submit-green-tick" 
                      title="Application Successfully Submitted" 
                      className="inline-flex items-center justify-center text-emerald-600 shrink-0 ml-2"
                    >
                      <CheckCircle2 className="w-4 h-4 fill-emerald-100 text-emerald-600 stroke-[2.5]" />
                    </span>
                  ) : (
                    <span 
                      id="nav-submit-pending-dot"
                      title="Pending Submission" 
                      className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-medium shrink-0 ml-2"
                    >
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Pending</span>
                    </span>
                  )
                )}
              </button>
            );
          })}
        </div>

        {/* Primary CTA Button: View Merit List */}
        <div className="my-4">
          <button
            id="sidebar-view-merit-list-btn"
            onClick={() => {
              onOpenMeritList();
              setMobileOpen(false);
            }}
            className="w-full py-2.5 bg-[#33253c] text-white font-semibold text-xs rounded-lg hover:bg-[#4a3b53] shadow-xs flex items-center justify-center gap-2 cursor-pointer"
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
            className="w-full group flex items-center justify-between p-2.5 text-[#4a454c] hover:text-[#33253c] hover:bg-[#eae6da] rounded-xl cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-[#63603c]" />
              <span className="font-semibold text-xs">Relational DB</span>
            </div>
            <span className="text-[10px] bg-[#f0eee6] px-1.5 py-0.5 rounded text-[#63603c] font-mono">Live</span>
          </button>

          {/* Quick Logout */}
          <button
            id="sidebar-logout-btn"
            onClick={onLogout}
            className="w-full p-2.5 text-[#ba1a1a] hover:bg-red-50 rounded-xl font-semibold text-left flex items-center justify-between cursor-pointer"
          >
            <span>Sign Out</span>
            <span className="text-[10px] font-normal text-[#7b776d]">Safe Exit</span>
          </button>
        </div>
      </nav>
    </>
  );
};
