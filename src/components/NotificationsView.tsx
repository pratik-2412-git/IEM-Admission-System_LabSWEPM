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
        return <CreditCard className="w-4 h-4 text-[#33253c]" />;
      case 'documents':
        return <UploadCloud className="w-4 h-4 text-[#33253c]" />;
      case 'merit':
        return <Sparkles className="w-4 h-4 text-[#33253c]" />;
      default:
        return <Bell className="w-4 h-4 text-[#33253c]" />;
    }
  };

  return (
    <div className="space-y-6 max-w-[900px] mx-auto pb-12 text-[#1e1c17] transition-colors duration-300">
      <div className="flex justify-between items-end animate-fade-up">
        <div>
          <h1 className="font-headline text-2xl md:text-3xl font-semibold text-[#33253c] tracking-tight">
            Notifications &amp; Activity
          </h1>
          <p className="text-xs text-[#4a454c] mt-1">
            Real-time updates regarding admissions scrutiny, merit rankings, and transactional milestones.
          </p>
        </div>

        {notifications.some(n => !n.read) && (
          <button
            onClick={onMarkAllRead}
            className="text-xs font-semibold text-[#33253c] hover:underline cursor-pointer"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3 animate-fade-up stagger-1">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => onMarkAsRead(notif.id)}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
              notif.read
                ? 'bg-white/95 border-[#ded9cf]'
                : 'bg-[#f9f6ed] border-[#ded9cf] shadow-[0_4px_24px_rgba(0,0,0,0.02)]'
            }`}
          >
            <div className="p-2.5 bg-white rounded-lg border border-[#ded9cf] shrink-0 mt-0.5 shadow-2xs">
              {getIcon(notif.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="font-headline font-semibold text-xs text-[#1e1c17]">
                  {notif.title}
                </h4>
                <span className="text-[11px] text-[#4a454c]">
                  {new Date(notif.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-[#4a454c] mt-1 leading-relaxed">
                {notif.message}
              </p>
            </div>

            {!notif.read && (
              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1.5 ring-4 ring-emerald-100" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
