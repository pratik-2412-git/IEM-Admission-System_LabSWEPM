import React, { useState } from 'react';
import { User, Application } from '../types';
import { User as UserIcon, Lock, Bell, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SettingsViewProps {
  user: User | null;
  application: Application | null;
  onUpdateUser: (updated: Partial<User>) => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  application,
  onUpdateUser,
}) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdateUser({ name, email });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[800px] mx-auto pb-12 text-[#1e1c17] transition-colors duration-300">
      <div className="animate-fade-up">
        <h1 className="font-headline text-2xl md:text-3xl font-semibold text-[#33253c] tracking-tight">
          Applicant Settings
        </h1>
        <p className="text-xs text-[#4a454c] mt-1">
          Manage candidate profile credentials, communication channels, and notification settings.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 animate-fade-up stagger-1">
        {/* Profile Details */}
        <div className="bg-white/95 backdrop-blur-xs border border-[#ded9cf] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
          <h3 className="font-headline text-sm font-semibold text-[#33253c] pb-2 border-b border-[#ded9cf] flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-[#33253c]" />
            Account Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1e1c17] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#ded9cf] focus:border-[#33253c] bg-[#fcfaf2] text-[#1e1c17] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1e1c17] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#ded9cf] bg-[#f0eee6] text-[#7b776d] outline-none cursor-not-allowed text-xs"
              />
            </div>
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="bg-white/95 backdrop-blur-xs border border-[#ded9cf] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
          <h3 className="font-headline text-sm font-semibold text-[#33253c] pb-2 border-b border-[#ded9cf] flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#33253c]" />
            Notifications &amp; Alerts
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 bg-[#f9f6ed] rounded-lg border border-[#ded9cf] cursor-pointer">
              <div>
                <p className="font-semibold text-[#1e1c17]">Email Notifications</p>
                <p className="text-[#4a454c] text-[11px]">Receive seat allotment status and counseling alerts via email</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded accent-[#33253c] border-[#ded9cf] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-[#f9f6ed] rounded-lg border border-[#ded9cf] cursor-pointer">
              <div>
                <p className="font-semibold text-[#1e1c17]">SMS Verification Alerts</p>
                <p className="text-[#4a454c] text-[11px]">Get instant SMS updates regarding document scrutiny and fee verification</p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 rounded accent-[#33253c] border-[#ded9cf] cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Settings updated successfully!
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="ml-auto px-6 py-2.5 rounded-lg bg-[#33253c] hover:bg-[#4a3b53] text-white text-xs font-semibold shadow-sm cursor-pointer transition-colors"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
};
