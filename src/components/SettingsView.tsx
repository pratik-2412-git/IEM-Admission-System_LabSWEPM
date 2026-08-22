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
    <div className="space-y-6 max-w-[800px] mx-auto pb-12 text-[#F8FAFC]">
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Account Registry</span>
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-[#F8FAFC] tracking-tight mt-0.5">
          Applicant Settings
        </h2>
        <p className="font-body text-xs md:text-sm text-slate-400 mt-1">
          Manage candidate profile credentials, communication channels, and security settings.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Details */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-headline text-sm font-semibold text-[#F8FAFC] pb-2 border-b border-[#1E293B] flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-teal-400" />
            Account Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#1E293B] focus:border-teal-400 bg-[#030712] text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#1E293B] bg-slate-900/60 text-slate-400 outline-none cursor-not-allowed font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-headline text-sm font-semibold text-[#F8FAFC] pb-2 border-b border-[#1E293B] flex items-center gap-2">
            <Bell className="w-4 h-4 text-teal-400" />
            Notifications &amp; Alerts
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 bg-[#030712] rounded-lg border border-[#1E293B] cursor-pointer">
              <div>
                <p className="font-medium text-slate-200">Email Notifications</p>
                <p className="text-slate-400 text-[11px]">Receive seat allotment status and exam alerts via email</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded accent-teal-400 bg-slate-900 border-[#1E293B]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-[#030712] rounded-lg border border-[#1E293B] cursor-pointer">
              <div>
                <p className="font-medium text-slate-200">SMS Verification Alerts</p>
                <p className="text-slate-400 text-[11px]">Get instant SMS updates on document verification</p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 rounded accent-teal-400 bg-slate-900 border-[#1E293B]"
              />
            </label>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs text-teal-400 font-mono font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Settings updated successfully!
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="ml-auto px-6 py-2.5 rounded-lg bg-[#2DD4BF] hover:bg-teal-400 text-[#020617] text-xs font-bold shadow-sm shadow-teal-500/10 cursor-pointer transition-colors"
          >
            {saving ? 'SAVING...' : 'SAVE_PREFERENCES'}
          </button>
        </div>
      </form>
    </div>
  );
};
