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

  const getStageStatus = () => {
    if (isSeatAllotted) return { label: 'SEAT ALLOTTED', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    if (application?.status === 'merit_qualified') return { label: 'MERIT QUALIFIED', color: 'bg-[#e7dcea] text-[#33253c] border-[#e7dcea]' };
    if (isDocsVerified) return { label: 'DOCS VERIFIED', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    if (application?.status === 'under_review') return { label: 'UNDER REVIEW', color: 'bg-amber-50 text-amber-800 border-amber-200' };
    return { label: 'IN PROGRESS', color: 'bg-amber-50 text-amber-800 border-amber-200' };
  };

  const statusInfo = getStageStatus();

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto text-[#1e1c17] transition-colors duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 animate-fade-up">
        <div>
          <h1 className="font-headline text-2xl md:text-3xl font-semibold text-[#33253c] tracking-tight">
            Application Overview
          </h1>
          <p className="text-xs text-[#4a454c] mt-0.5">Monitor your admission journey, milestones, and status</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f9f6ed] border border-[#ded9cf] rounded-lg">
            <span className="text-xs text-[#4a454c] font-medium">Application ID:</span>
            <span className="text-xs font-semibold text-[#33253c]">{application?.id || 'IEM-2026-001'}</span>
          </div>
        </div>
      </div>

      {/* Admission Progress Stepper */}
      <section 
        id="admission-progress-stepper"
        className="bg-white/95 backdrop-blur-xs border border-[#ded9cf] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] animate-fade-up stagger-1"
      >
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#ded9cf]">
          <span className="text-xs font-semibold text-[#33253c] uppercase tracking-wider">
            Admission Lifecycle
          </span>
          <span className="text-xs text-[#4a454c] font-medium bg-[#f0eee6] px-2.5 py-0.5 rounded-full">
            {isSeatAllotted ? 'Phase 5 of 5: Complete' : isDocsVerified ? 'Phase 3 of 5: Verified' : 'Phase 2 of 5: In Review'}
          </span>
        </div>

        <div className="relative flex justify-between items-center w-full max-w-4xl mx-auto px-4">
          {/* Background Track Line */}
          <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-[#eae6da] -translate-y-1/2 z-0" />
          
          {/* Active Fill Line */}
          <div 
            className="animated-progress-bar absolute top-1/2 left-8 h-0.5 bg-[#33253c] -translate-y-1/2 z-0 shadow-xs" 
            style={{ 
              width: isSeatAllotted ? '92%' : isDocsVerified ? '50%' : '25%' 
            }}
          />

          {/* Step 1: Registration */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#33253c] text-white flex items-center justify-center font-bold text-xs shadow-md ring-4 ring-[#fdfbf5]">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-xs font-semibold text-[#33253c] whitespace-nowrap">01 Registration</span>
          </div>

          {/* Step 2: Form Submitted */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#33253c] text-white flex items-center justify-center font-bold text-xs shadow-md ring-4 ring-[#fdfbf5]">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-xs font-semibold text-[#33253c] whitespace-nowrap">02 Form Entry</span>
          </div>

          {/* Step 3: Docs Verified */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ring-4 ring-[#fdfbf5] transition-all ${
              isDocsVerified 
                ? 'bg-[#33253c] text-white border-[#33253c] font-bold shadow-md' 
                : 'bg-[#fdfbf5] text-[#33253c] border-[#33253c] animate-pulse'
            }`}>
              {isDocsVerified ? (
                <Check className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <Hourglass className="w-3.5 h-3.5 text-[#33253c]" />
              )}
            </div>
            <span className={`text-xs whitespace-nowrap ${
              isDocsVerified ? 'font-semibold text-[#33253c]' : 'font-medium text-[#4a454c]'
            }`}>
              03 Verification
            </span>
          </div>

          {/* Step 4: Merit List */}
          <div className={`relative z-10 flex flex-col items-center gap-2 ${
            meritItem || isDocsVerified ? 'opacity-100' : 'opacity-50'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ring-4 ring-[#fdfbf5] ${
              meritItem 
                ? 'bg-[#33253c] text-white border-[#33253c] font-bold shadow-md' 
                : 'bg-[#fdfbf5] text-[#7b776d] border-[#ded9cf]'
            }`}>
              {meritItem ? <Check className="w-4 h-4 stroke-[2.5]" /> : <span className="text-xs font-semibold">04</span>}
            </div>
            <span className="text-xs text-[#4a454c] whitespace-nowrap">04 Merit Rank</span>
          </div>

          {/* Step 5: Seat Allotment */}
          <div className={`relative z-10 flex flex-col items-center gap-2 ${
            isSeatAllotted ? 'opacity-100' : 'opacity-50'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ring-4 ring-[#fdfbf5] ${
              isSeatAllotted 
                ? 'bg-[#33253c] text-white border-[#33253c] font-bold shadow-md' 
                : 'bg-[#fdfbf5] text-[#7b776d] border-[#ded9cf]'
            }`}>
              {isSeatAllotted ? <Check className="w-4 h-4 stroke-[2.5]" /> : <span className="text-xs font-semibold">05</span>}
            </div>
            <span className="text-xs text-[#4a454c] whitespace-nowrap">05 Allotment</span>
          </div>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-up stagger-2">
        {/* Card 1: Current Status Card (2 Columns wide) */}
        <div 
          id="current-status-card"
          className="lg:col-span-2 bg-white/95 backdrop-blur-xs border border-[#ded9cf] rounded-xl flex flex-col justify-between overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
        >
          <div className="px-6 py-4 border-b border-[#ded9cf] flex justify-between items-center bg-[#f9f6ed]/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#33253c]">
              Admission Pipeline State
            </span>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>

          <div className="p-6">
            <p className="text-sm text-[#1e1c17] leading-relaxed mb-6">
              {isSeatAllotted ? (
                <>
                  🎉 <strong className="text-[#33253c]">Seat Confirmed:</strong> You have been officially allotted a seat in <strong className="text-[#33253c] font-semibold">{application?.course.primaryCourse || 'B.Tech CSE'}</strong> at the IEM Main Campus. Your Provisional Allotment Letter is available below.
                </>
              ) : isDocsVerified ? (
                <>
                  Your submitted credentials and uploaded marksheet documents have been <strong className="text-emerald-700">verified</strong> by the central admissions scrutinizer. Institutional merit rankings are now computed.
                </>
              ) : (
                <>
                  Your application forms and fee payment have been safely registered. Document scrutiny is currently underway with an average processing time of 1-2 business cycles.
                </>
              )}
            </p>

            {/* Next Action Required Callout Box */}
            <div className="bg-[#f9f6ed] border border-[#ded9cf] p-4 rounded-xl flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-[#e7dcea] text-[#33253c] shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#33253c] uppercase tracking-wide">Next Action Directive</p>
                <p className="text-xs text-[#4a454c] mt-1 leading-relaxed">
                  {isSeatAllotted
                    ? 'Download your Provisional Allotment Letter and complete in-person verification at the IEM Admissions Office.'
                    : isDocsVerified
                    ? 'Review your rank on the institutional Merit List and monitor upcoming counseling seat rounds.'
                    : 'Please allow document verification to complete before institutional merit list compilation.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Quick Links Card (1 Column wide) */}
        <div 
          id="quick-links-card"
          className="bg-white/95 backdrop-blur-xs border border-[#ded9cf] rounded-xl flex flex-col overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
        >
          <div className="px-6 py-4 border-b border-[#ded9cf] bg-[#f9f6ed]/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#33253c]">
              Artifacts &amp; Exports
            </span>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between">
            <ul className="space-y-2.5">
              <li>
                <button
                  id="quick-link-receipt-btn"
                  onClick={onOpenReceipt}
                  className="w-full flex items-center gap-3 p-2.5 bg-[#f9f6ed] hover:bg-[#f0eee6] border border-[#ded9cf] rounded-lg transition-colors text-left group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#ded9cf] flex items-center justify-center text-[#33253c] group-hover:bg-[#33253c] group-hover:text-white transition-colors">
                    <Download className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1e1c17] block">Application Summary</span>
                    <span className="text-[11px] text-[#4a454c]">PDF submission record</span>
                  </div>
                </button>
              </li>

              <li>
                <button
                  id="quick-link-invoice-btn"
                  onClick={onOpenInvoice}
                  className="w-full flex items-center gap-3 p-2.5 bg-[#f9f6ed] hover:bg-[#f0eee6] border border-[#ded9cf] rounded-lg transition-colors text-left group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#ded9cf] flex items-center justify-center text-[#33253c] group-hover:bg-[#33253c] group-hover:text-white transition-colors">
                    <Receipt className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1e1c17]">Fee Tax Invoice</span>
                    <span className="text-[11px] text-[#4a454c] block">TXN987654321 ($50.00)</span>
                  </div>
                </button>
              </li>

              <li>
                {isSeatAllotted ? (
                  <button
                    id="quick-link-allotment-btn"
                    onClick={onOpenAllotmentLetter}
                    className="w-full flex items-center gap-3 p-2.5 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 rounded-lg transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                      <Unlock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block">Allotment Letter</span>
                      <span className="text-[11px] text-emerald-700">Official offer decree</span>
                    </div>
                  </button>
                ) : (
                  <div 
                    className="flex items-center gap-3 p-2.5 bg-[#f9f6ed]/60 border border-[#ded9cf] border-dashed rounded-lg opacity-60 cursor-not-allowed"
                    title="Unlocked after Merit List seat allocation"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#eae8e0] flex items-center justify-center text-[#7b776d]">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-[#4a454c] block">Allotment Letter</span>
                      <span className="text-[11px] text-[#7b776d]">Locked pending seat allotment</span>
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
          className="lg:col-span-3 bg-white/95 backdrop-blur-xs border border-[#ded9cf] rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
        >
          <div className="px-6 py-3.5 border-b border-[#ded9cf] bg-[#f9f6ed]/60 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#33253c]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#33253c]">
                Audit &amp; System Stream
              </span>
            </div>
            <button
              onClick={() => onNavigate('notifications')}
              className="text-xs font-semibold text-[#33253c] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="p-6 space-y-3">
            {/* Notification Item 1: Payment */}
            <div className="flex gap-4 p-3.5 border-l-3 border-[#33253c] bg-[#f9f6ed] border-y border-r border-[#ded9cf] rounded-r-lg">
              <div className="text-emerald-700 mt-0.5">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-semibold text-[#1e1c17]">Fee Payment Committed</p>
                  <span className="text-[11px] text-[#4a454c]">2h ago</span>
                </div>
                <p className="text-xs text-[#4a454c] mt-0.5">
                  Application processing fee of $50.00 USD registered. Reference: <span className="font-mono text-[#33253c] font-medium">TXN987654321</span>.
                </p>
              </div>
            </div>

            {/* Notification Item 2: Docs Uploaded */}
            <div className="flex gap-4 p-3.5 border-l-3 border-[#7b776d] bg-[#f9f6ed] border-y border-r border-[#ded9cf] rounded-r-lg">
              <div className="text-[#63603c] mt-0.5">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-semibold text-[#1e1c17]">Document Upload Ingested</p>
                  <span className="text-[11px] text-[#4a454c]">1d ago</span>
                </div>
                <p className="text-xs text-[#4a454c] mt-0.5">
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
