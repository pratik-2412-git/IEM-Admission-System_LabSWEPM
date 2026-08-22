import React from 'react';
import { Bell, CheckCircle2, UploadCloud, CreditCard, Sparkles, Clock, Check } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllRead,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="w-4 h-4 text-teal-400" />;
      case 'documents':
        return <UploadCloud className="w-4 h-4 text-teal-400" />;
      case 'merit':
        return <Sparkles className="w-4 h-4 text-teal-400" />;
      default:
        return <Bell className="w-4 h-4 text-teal-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-[900px] mx-auto pb-12 text-[#F8FAFC]">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">System Dispatch</span>
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-[#F8FAFC] tracking-tight mt-0.5">
            Notifications
          </h2>
          <p className="font-body text-xs md:text-sm text-slate-400 mt-1">
            Real-time telemetry and updates regarding admissions scrutiny, merit rankings, and transactional states.
          </p>
        </div>

        {notifications.some(n => !n.read) && (
          <button
            onClick={onMarkAllRead}
            className="text-xs font-mono font-medium text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
          >
            MARK_ALL_READ
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => onMarkAsRead(notif.id)}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
              notif.read
                ? 'bg-[#0F172A] border-[#1E293B]'
                : 'bg-[#0F172A] border-teal-500/30 shadow-sm'
            }`}
          >
            <div className="p-2.5 bg-[#030712] rounded-lg border border-[#1E293B] shrink-0 mt-0.5">
              {getIcon(notif.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="font-headline font-semibold text-xs text-[#F8FAFC]">
                  {notif.title}
                </h4>
                <span className="text-[10px] font-mono text-slate-400">
                  {new Date(notif.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {notif.message}
              </p>
            </div>

            {!notif.read && (
              <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0 mt-1.5 ring-2 ring-teal-400/20" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
