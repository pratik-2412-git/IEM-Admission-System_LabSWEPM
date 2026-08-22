import React from 'react';
import { 
  Check, 
  Hourglass, 
  Info, 
  Download, 
  Receipt, 
  Lock, 
  Unlock,
  CheckCircle, 
  UploadCloud, 
  Bell, 
  ArrowRight,
  Sparkles,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { User, Application, DocumentItem, PaymentRecord, MeritItem, NotificationItem } from '../types';

interface DashboardViewProps {
  user: User | null;
  application: Application | null;
  documents: DocumentItem[];
  payments: PaymentRecord[];
  meritItem?: MeritItem | null;
  notifications: NotificationItem[];
  onNavigate: (view: string) => void;
  onOpenReceipt: () => void;
  onOpenInvoice: () => void;
  onOpenAllotmentLetter: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  application,
  documents,
  payments,
  meritItem,
  notifications,
  onNavigate,
  onOpenReceipt,
  onOpenInvoice,
  onOpenAllotmentLetter,
}) => {
  const verifiedCount = documents.filter(d => d.status === 'verified').length;
  const isDocsVerified = verifiedCount >= 2 || application?.status === 'docs_verified' || application?.status === 'merit_qualified' || application?.status === 'seat_allotted';
  const isPaid = payments.some(p => p.status === 'success');
  const isSeatAllotted = application?.status === 'seat_allotted' || meritItem?.status === 'Allotted';

  // Calculate current stage
  const getStageStatus = () => {
    if (isSeatAllotted) return { label: 'SEAT_ALLOTTED', color: 'bg-teal-500/10 text-teal-400 border-teal-500/30' };
    if (application?.status === 'merit_qualified') return { label: 'MERIT_QUALIFIED', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' };
    if (isDocsVerified) return { label: 'DOCS_VERIFIED', color: 'bg-teal-500/10 text-teal-400 border-teal-500/30' };
    if (application?.status === 'under_review') return { label: 'UNDER_REVIEW', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    return { label: 'IN_PROGRESS', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
  };

  const statusInfo = getStageStatus();

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto text-[#F8FAFC]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">System Status</span>
          <h2 className="font-headline text-2xl font-bold text-[#F8FAFC] tracking-tight mt-0.5">
            Application Overview
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-[#1E293B] rounded">
            <span className="text-[10px] font-mono text-slate-400">ID:</span>
            <span className="text-xs font-mono text-teal-400">{application?.id || 'IEM-2024-001'}</span>
          </div>
        </div>
      </div>

      {/* Admission Progress Stepper */}
      <section 
        id="admission-progress-stepper"
        className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#1E293B]">
          <span className="text-xs font-bold tracking-wider text-slate-300 uppercase font-mono">Admission Lifecycle</span>
          <span className="text-[11px] font-mono text-teal-400">Phase 3 of 5</span>
        </div>

        <div className="relative flex justify-between items-center w-full max-w-4xl mx-auto px-4">
          {/* Background Track Line */}
          <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-slate-800 -translate-y-1/2 z-0" />
          
          {/* Active Fill Line */}
          <div 
            className="absolute top-1/2 left-8 h-[2px] bg-[#2DD4BF] -translate-y-1/2 z-0 transition-all duration-500 shadow-sm shadow-teal-500/50" 
            style={{ 
              width: isSeatAllotted ? '92%' : isDocsVerified ? '50%' : '25%' 
            }}
          />

          {/* Step 1: Registration */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-[#2DD4BF] text-[#020617] flex items-center justify-center font-bold shadow-sm shadow-teal-500/20">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="text-[11px] font-mono font-medium text-slate-200 whitespace-nowrap">01 Registration</span>
          </div>

          {/* Step 2: Form Submitted */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-[#2DD4BF] text-[#020617] flex items-center justify-center font-bold shadow-sm shadow-teal-500/20">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="text-[11px] font-mono font-medium text-slate-200 whitespace-nowrap">02 Form Entry</span>
          </div>

          {/* Step 3: Docs Verified */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-7 h-7 rounded-sm flex items-center justify-center border transition-all ${
              isDocsVerified 
                ? 'bg-[#2DD4BF] text-[#020617] border-[#2DD4BF] font-bold' 
                : 'bg-slate-900 text-teal-400 border-teal-500/50 animate-pulse'
            }`}>
              {isDocsVerified ? (
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              ) : (
                <Hourglass className="w-3.5 h-3.5 text-teal-400" />
              )}
            </div>
            <span className={`text-[11px] font-mono whitespace-nowrap ${
              isDocsVerified ? 'font-medium text-slate-200' : 'font-bold text-teal-400'
            }`}>
              03 Verification
            </span>
          </div>

          {/* Step 4: Merit List */}
          <div className={`relative z-10 flex flex-col items-center gap-2 ${
            meritItem || isDocsVerified ? 'opacity-100' : 'opacity-40'
          }`}>
            <div className={`w-7 h-7 rounded-sm flex items-center justify-center border ${
              meritItem 
                ? 'bg-[#2DD4BF] text-[#020617] border-[#2DD4BF] font-bold' 
                : 'bg-slate-900 text-slate-500 border-slate-700'
            }`}>
              {meritItem ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <span className="text-[11px] font-mono">04</span>}
            </div>
            <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">04 Merit Rank</span>
          </div>

          {/* Step 5: Seat Allotment */}
          <div className={`relative z-10 flex flex-col items-center gap-2 ${
            isSeatAllotted ? 'opacity-100' : 'opacity-40'
          }`}>
            <div className={`w-7 h-7 rounded-sm flex items-center justify-center border ${
              isSeatAllotted 
                ? 'bg-[#2DD4BF] text-[#020617] border-[#2DD4BF] font-bold' 
                : 'bg-slate-900 text-slate-500 border-slate-700'
            }`}>
              {isSeatAllotted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <span className="text-[11px] font-mono">05</span>}
            </div>
            <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">05 Allotment</span>
          </div>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Current Status Card (2 Columns wide) */}
        <div 
          id="current-status-card"
          className="lg:col-span-2 bg-[#0F172A] border border-[#1E293B] rounded-xl flex flex-col justify-between overflow-hidden shadow-sm"
        >
          <div className="px-6 py-4 border-b border-[#1E293B] flex justify-between items-center bg-slate-900/40">
            <span className="text-xs font-bold font-mono tracking-wider uppercase text-slate-300">
              Admission Pipeline State
            </span>
            <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>

          <div className="p-6">
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {isSeatAllotted ? (
                <>
                  🎉 <strong className="text-white">Seat Confirmed:</strong> You have been officially allotted a seat in <strong className="text-teal-400 font-mono">{application?.course.primaryCourse || 'B.Tech CSE'}</strong> at the IEM Main Campus. Your Provisional Allotment Letter is available below.
                </>
              ) : isDocsVerified ? (
                <>
                  Your submitted credentials and uploaded marksheet documents have been <strong className="text-teal-400">verified</strong> by the central admissions scrutinizer. Institutional merit rankings are now computed.
                </>
              ) : (
                <>
                  Your application forms and fee payment have been safely written to the admission database. Document scrutiny is underway with average processing latency of 1-2 cycles.
                </>
              )}
            </p>

            {/* Next Action Required Callout Box */}
            <div className="bg-slate-900/70 border border-[#1E293B] p-4 rounded-lg flex items-start gap-3">
              <div className="p-1.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wide">Next Action Directive</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {isSeatAllotted
                    ? 'Accept your seat allotment and proceed with reporting to the IEM Admissions Office.'
                    : isDocsVerified
                    ? 'Review your position on the institutional Merit List and monitor Round 1 counseling allocations.'
                    : 'Please allow document verification to complete before institutional merit list compilation.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Quick Links Card (1 Column wide) */}
        <div 
          id="quick-links-card"
          className="bg-[#0F172A] border border-[#1E293B] rounded-xl flex flex-col overflow-hidden shadow-sm"
        >
          <div className="px-6 py-4 border-b border-[#1E293B] bg-slate-900/40">
            <span className="text-xs font-bold font-mono tracking-wider uppercase text-slate-300">
              Artifacts &amp; Exports
            </span>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between">
            <ul className="space-y-2.5">
              <li>
                <button
                  id="quick-link-receipt-btn"
                  onClick={onOpenReceipt}
                  className="w-full flex items-center gap-3 p-2.5 bg-slate-900/60 hover:bg-slate-800 border border-[#1E293B] rounded-lg transition-colors text-left group"
                >
                  <div className="w-8 h-8 rounded bg-[#030712] border border-[#1E293B] flex items-center justify-center text-teal-400 group-hover:border-teal-500/40 transition-colors">
                    <Download className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-200 block">Application Summary</span>
                    <span className="text-[10px] font-mono text-slate-500">PDF submission record</span>
                  </div>
                </button>
              </li>

              <li>
                <button
                  id="quick-link-invoice-btn"
                  onClick={onOpenInvoice}
                  className="w-full flex items-center gap-3 p-2.5 bg-slate-900/60 hover:bg-slate-800 border border-[#1E293B] rounded-lg transition-colors text-left group"
                >
                  <div className="w-8 h-8 rounded bg-[#030712] border border-[#1E293B] flex items-center justify-center text-teal-400 group-hover:border-teal-500/40 transition-colors">
                    <Receipt className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-200">Fee Tax Invoice</span>
                    <span className="text-[10px] font-mono text-slate-500 block">TXN987654321 ($50.00)</span>
                  </div>
                </button>
              </li>

              <li>
                {isSeatAllotted ? (
                  <button
                    id="quick-link-allotment-btn"
                    onClick={onOpenAllotmentLetter}
                    className="w-full flex items-center gap-3 p-2.5 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 rounded-lg transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
                      <Unlock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-teal-300 block">Allotment Letter</span>
                      <span className="text-[10px] font-mono text-teal-400">Official offer decree</span>
                    </div>
                  </button>
                ) : (
                  <div 
                    className="flex items-center gap-3 p-2.5 bg-slate-900/30 border border-[#1E293B] border-dashed rounded-lg opacity-50 cursor-not-allowed"
                    title="Unlocked after Merit List seat allocation"
                  >
                    <div className="w-8 h-8 rounded bg-slate-950 flex items-center justify-center text-slate-600">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-400 block">Allotment Letter</span>
                      <span className="text-[10px] font-mono text-slate-600">Locked pending seat allotment</span>
                    </div>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>

        {/* Card 3: Recent Notifications Feed (Full Width / 3 Columns) */}
        <div 
          id="recent-notifications-card"
          className="lg:col-span-3 bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden shadow-sm"
        >
          <div className="px-6 py-3.5 border-b border-[#1E293B] bg-slate-900/40 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold font-mono tracking-wider uppercase text-slate-300">
                Audit &amp; System Stream
              </span>
            </div>
            <button
              onClick={() => onNavigate('notifications')}
              className="text-xs font-mono text-teal-400 hover:text-teal-300 hover:underline"
            >
              [VIEW_ALL]
            </button>
          </div>

          <div className="p-6 space-y-3">
            {/* Notification Item 1: Payment */}
            <div className="flex gap-4 p-3.5 border-l-2 border-teal-400 bg-slate-900/60 border-y border-r border-[#1E293B] rounded-r-lg">
              <div className="text-teal-400 mt-0.5">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-medium text-slate-200">Fee Payment Committed</p>
                  <span className="text-[10px] font-mono text-slate-500">2h ago</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Application processing fee of $50.00 USD registered. TXN: <span className="font-mono text-teal-400">TXN987654321</span>.
                </p>
              </div>
            </div>

            {/* Notification Item 2: Docs Uploaded */}
            <div className="flex gap-4 p-3.5 border-l-2 border-slate-700 bg-slate-900/40 border-y border-r border-[#1E293B] rounded-r-lg">
              <div className="text-slate-500 mt-0.5">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-medium text-slate-200">Document Upload Ingested</p>
                  <span className="text-[10px] font-mono text-slate-500">1d ago</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  High School Transcripts and ID Proof staged for central registrar scrutiny.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
