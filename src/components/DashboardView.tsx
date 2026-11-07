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
  AlertCircle,
  AlertTriangle,
  XCircle
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
  // Dynamic Stage Calculations based on real database state:
  // Stage 1: Registration is complete once user account exists and is verified
  const isStage1Registration = Boolean(user && user.id);

  // Stage 2: Form Entry is complete ONLY after formal application submission (not draft!)
  const isStage2FormSubmitted = Boolean(
    application &&
    application.status !== 'draft' &&
    (application.submittedAt || ['submitted', 'under_review', 'correction_required', 'resubmitted', 'approved', 'seat_allotted', 'admission_confirmed'].includes(application.status))
  );

  // Stage 3: Verification is complete only after admin verification/approval
  const isStage3Verified = Boolean(
    application &&
    ['approved', 'seat_allotted', 'admission_confirmed'].includes(application.status) &&
    (!documents.length || documents.every(d => d.status === 'approved' || d.status === 'verified'))
  );

  // Stage 4: Merit Rank is recorded
  const isStage4MeritRank = Boolean(meritItem && meritItem.rank > 0);

  // Stage 5: Seat Allotment is recorded
  const isStage5SeatAllotted = Boolean(
    (application && ['seat_allotted', 'admission_confirmed'].includes(application.status)) ||
    (meritItem && meritItem.allottedSeat)
  );

  // Document scrutiny & correction requirement: only true if documents actually require correction
  const docsRequiringCorrection = documents.filter(
    d => d.status === 'correction_required' || d.status === 'rejected'
  );
  const isCorrectionRequired = docsRequiringCorrection.length > 0;
  const isRejected = application?.status === 'rejected';
  const isPaid = payments.some(p => p.status === 'paid' || p.status === 'success');

  // Overall status label & colors
  const getStageStatus = () => {
    if (isRejected) return { label: 'APPLICATION REJECTED', color: 'bg-red-50 text-red-800 border-red-200' };
    if (isCorrectionRequired) return { label: 'ACTION REQUIRED: CORRECTION', color: 'bg-red-50 text-red-800 border-red-200' };
    if (application?.status === 'admission_confirmed') return { label: 'ADMISSION CONFIRMED', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    if (isStage5SeatAllotted) return { label: 'SEAT ALLOTTED', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    if (isStage4MeritRank) return { label: `MERIT RANK #${meritItem?.rank}`, color: 'bg-[#e7dcea] text-[#33253c] border-[#e7dcea]' };
    if (isStage3Verified) return { label: 'CREDENTIALS APPROVED', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    if (application?.status === 'resubmitted') return { label: 'RESUBMITTED (UNDER REVIEW)', color: 'bg-amber-50 text-amber-800 border-amber-200' };
    if (isStage2FormSubmitted) return { label: 'UNDER ADMISSION SCRUTINY', color: 'bg-amber-50 text-amber-800 border-amber-200' };
    return { label: 'DRAFT (ACTION REQUIRED)', color: 'bg-amber-50 text-amber-800 border-amber-200' };
  };

  const statusInfo = getStageStatus();

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto text-[#1e1c17]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="font-headline text-2xl md:text-3xl font-semibold text-[#33253c] tracking-tight">
            Application Overview
          </h1>
          <p className="text-xs text-[#4a454c] mt-0.5">
            Real-time status tracking for {user?.name} • Session 2026-2027
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f9f6ed] border border-[#ded9cf] rounded-lg">
            <span className="text-xs text-[#4a454c] font-medium">Application ID:</span>
            <span className="text-xs font-semibold font-mono text-[#33253c]">
              {application?.id || user?.applicationId || 'IEM-2026-001'}
            </span>
          </div>
        </div>
      </div>

      {/* CORRECTION REQUIRED ALERT CALLOUT - ONLY DISPLAYED WHEN DOCUMENTS REQUIRE ACTION */}
      {isCorrectionRequired && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-xl text-red-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Action Required: {docsRequiringCorrection.length} Document{docsRequiringCorrection.length > 1 ? 's' : ''} Require Correction</h4>
              <p className="mt-0.5 text-red-800">
                The admissions committee requires re-upload for: <span className="font-semibold">{docsRequiringCorrection.map(d => d.title).join(', ')}</span>.
              </p>
              {docsRequiringCorrection[0]?.adminRemarks && (
                <p className="mt-1 text-red-700 italic">
                  Committee Remark: &ldquo;{docsRequiringCorrection[0].adminRemarks}&rdquo;
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => onNavigate('documents')}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-semibold shrink-0 cursor-pointer"
          >
            Fix Documents Now
          </button>
        </div>
      )}

      {/* APPLICATION REJECTED NOTICE */}
      {isRejected && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-xl text-red-900 text-xs flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Application Unsuccessful</h4>
            <p className="mt-0.5 text-red-800">
              {application?.adminRemarks || 'Your application does not meet the necessary criteria for the selected counseling round.'}
            </p>
          </div>
        </div>
      )}

      {/* DYNAMIC 5-STAGE ADMISSION LIFECYCLE STEPPER */}
      <section 
        id="admission-progress-stepper"
        className="bg-white border border-[#ded9cf] rounded-xl p-6 shadow-xs"
      >
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#ded9cf]">
          <span className="text-xs font-semibold text-[#33253c] uppercase tracking-wider">
            Admission Lifecycle Stages
          </span>
          <span className="text-xs text-[#4a454c] font-medium bg-[#f0eee6] px-2.5 py-0.5 rounded-full">
            {isStage5SeatAllotted 
              ? 'Stage 5 of 5: Allotted' 
              : isStage4MeritRank
              ? 'Stage 4 of 5: Merit Ranked'
              : isStage3Verified
              ? 'Stage 3 of 5: Verified'
              : isStage2FormSubmitted
              ? 'Stage 2 of 5: Form Submitted'
              : 'Stage 1 of 5: Registered'}
          </span>
        </div>

        <div className="relative flex justify-between items-center w-full max-w-4xl mx-auto px-4">
          {/* Static Track Line */}
          <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-[#eae6da] -translate-y-1/2 z-0" />
          
          {/* Dynamic Fill Line */}
          <div 
            className="absolute top-1/2 left-8 h-0.5 bg-[#33253c] -translate-y-1/2 z-0" 
            style={{ 
              width: isStage5SeatAllotted ? '92%' : isStage4MeritRank ? '72%' : isStage3Verified ? '50%' : isStage2FormSubmitted ? '25%' : '0%' 
            }}
          />

          {/* Step 1: Registration */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-[#fdfbf5] ${
              isStage1Registration ? 'bg-[#33253c] text-white shadow-xs' : 'bg-[#f0eee6] text-[#7b776d]'
            }`}>
              {isStage1Registration ? <Check className="w-4 h-4 stroke-[2.5]" /> : '01'}
            </div>
            <span className="text-xs font-semibold text-[#33253c] whitespace-nowrap">01 Registration</span>
          </div>

          {/* Step 2: Form Entry */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-[#fdfbf5] ${
              isStage2FormSubmitted 
                ? 'bg-[#33253c] text-white shadow-xs' 
                : 'bg-[#fdfbf5] border-2 border-[#ded9cf] text-[#7b776d]'
            }`}>
              {isStage2FormSubmitted ? (
                <Check className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <span>02</span>
              )}
            </div>
            <span className={`text-xs whitespace-nowrap ${
              isStage2FormSubmitted ? 'font-semibold text-[#33253c]' : 'text-[#7b776d]'
            }`}>
              02 Form Entry
            </span>
          </div>

          {/* Step 3: Verification */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-[#fdfbf5] ${
              isStage3Verified 
                ? 'bg-[#33253c] text-white shadow-xs' 
                : isCorrectionRequired
                ? 'bg-red-600 text-white'
                : 'bg-[#fdfbf5] border-2 border-[#ded9cf] text-[#7b776d]'
            }`}>
              {isStage3Verified ? (
                <Check className="w-4 h-4 stroke-[2.5]" />
              ) : isCorrectionRequired ? (
                <span>!</span>
              ) : isStage2FormSubmitted ? (
                <Hourglass className="w-3.5 h-3.5 text-[#33253c]" />
              ) : (
                <span>03</span>
              )}
            </div>
            <span className={`text-xs whitespace-nowrap ${
              isStage3Verified ? 'font-semibold text-[#33253c]' : isCorrectionRequired ? 'text-red-700 font-semibold' : 'text-[#7b776d]'
            }`}>
              03 Verification
            </span>
          </div>

          {/* Step 4: Merit Rank */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-[#fdfbf5] ${
              isStage4MeritRank 
                ? 'bg-[#33253c] text-white shadow-xs' 
                : 'bg-[#fdfbf5] border-2 border-[#ded9cf] text-[#7b776d]'
            }`}>
              {isStage4MeritRank ? <Check className="w-4 h-4 stroke-[2.5]" /> : <span>04</span>}
            </div>
            <span className={`text-xs whitespace-nowrap ${
              isStage4MeritRank ? 'font-semibold text-[#33253c]' : 'text-[#7b776d]'
            }`}>
              04 Merit Rank
            </span>
          </div>

          {/* Step 5: Seat Allotment */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-[#fdfbf5] ${
              isStage5SeatAllotted 
                ? 'bg-[#33253c] text-white shadow-xs' 
                : 'bg-[#fdfbf5] border-2 border-[#ded9cf] text-[#7b776d]'
            }`}>
              {isStage5SeatAllotted ? <Check className="w-4 h-4 stroke-[2.5]" /> : <span>05</span>}
            </div>
            <span className={`text-xs whitespace-nowrap ${
              isStage5SeatAllotted ? 'font-semibold text-[#33253c]' : 'text-[#7b776d]'
            }`}>
              05 Allotment
            </span>
          </div>
        </div>
      </section>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Pipeline Directives */}
        <div className="lg:col-span-2 bg-white border border-[#ded9cf] rounded-xl flex flex-col justify-between overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-[#ded9cf] flex justify-between items-center bg-[#f9f6ed]/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#33253c]">
              Admission Directive &amp; Next Action
            </span>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>

          <div className="p-6">
            <p className="text-sm text-[#1e1c17] leading-relaxed mb-6">
              {isStage5SeatAllotted ? (
                <>
                  🎉 <strong className="text-[#33253c]">Seat Formally Allotted:</strong> You have been allocated a verified seat in <strong className="text-[#33253c] font-semibold">{application?.course.primaryCourse}</strong>. Complete the fee payment to confirm admission and unlock your Provisional Allotment Letter.
                </>
              ) : isStage4MeritRank ? (
                <>
                  Your credentials have qualified for round 1 counseling. Your official institutional ranking is <strong className="text-[#33253c]">Rank #{meritItem?.rank}</strong> with a score of <strong>{meritItem?.meritScore}%</strong>. Seat allocations are being processed by the dean.
                </>
              ) : isStage3Verified ? (
                <>
                  All uploaded certificates and marksheets have been <strong className="text-emerald-700">verified and approved</strong> by the admissions scrutiny cell. Your application has been forwarded to merit ranking.
                </>
              ) : isStage2FormSubmitted ? (
                <>
                  Your application is formally submitted. Central admissions staff are currently scrutinizing your uploaded documents. Any remarks or correction requests will appear here.
                </>
              ) : (
                <>
                  Your candidate profile is verified. Please complete your application details and upload mandatory documents to submit your application for scrutiny.
                </>
              )}
            </p>

            {/* Directive Action Box */}
            <div className="bg-[#f9f6ed] border border-[#ded9cf] p-4 rounded-xl flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-[#e7dcea] text-[#33253c] shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#33253c] uppercase tracking-wide">Next Step Recommendation</p>
                <p className="text-xs text-[#4a454c] mt-1 leading-relaxed">
                  {isStage5SeatAllotted && !isPaid
                    ? 'Navigate to Fee Payment to complete your seat acceptance fee payment.'
                    : isStage5SeatAllotted && isPaid
                    ? 'Download your Provisional Allotment Letter and attend physical document verification.'
                    : isCorrectionRequired
                    ? 'Upload the requested corrected certificates in the Document Upload tab.'
                    : !isStage2FormSubmitted
                    ? 'Open the Application Form tab to complete personal and academic entry.'
                    : 'Awaiting completion of admissions committee document verification.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Artifacts & Exports */}
        <div className="bg-white border border-[#ded9cf] rounded-xl flex flex-col overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-[#ded9cf] bg-[#f9f6ed]/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#33253c]">
              Artifacts &amp; Official Records
            </span>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between">
            <ul className="space-y-2.5">
              {/* Application Summary */}
              <li>
                <button
                  onClick={onOpenReceipt}
                  className="w-full flex items-center gap-3 p-2.5 bg-[#f9f6ed] hover:bg-[#f0eee6] border border-[#ded9cf] rounded-lg text-left group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#ded9cf] flex items-center justify-center text-[#33253c]">
                    <Download className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1e1c17] block">Application Summary</span>
                    <span className="text-[11px] text-[#4a454c]">PDF submission record</span>
                  </div>
                </button>
              </li>

              {/* Fee Receipt */}
              <li>
                <button
                  onClick={onOpenInvoice}
                  disabled={!isPaid}
                  className={`w-full flex items-center gap-3 p-2.5 border rounded-lg text-left transition-colors ${
                    isPaid
                      ? 'bg-[#f9f6ed] hover:bg-[#f0eee6] border-[#ded9cf] cursor-pointer'
                      : 'bg-[#f9f6ed]/50 border-dashed border-[#ded9cf] opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#ded9cf] flex items-center justify-center text-[#33253c]">
                    <Receipt className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1e1c17]">Fee Payment Receipt</span>
                    <span className="text-[11px] text-[#4a454c] block">
                      {isPaid ? 'Payment Confirmed (PAID - ₹0.00)' : 'Locked pending fee payment'}
                    </span>
                  </div>
                </button>
              </li>

              {/* Allotment Letter */}
              <li>
                {isStage5SeatAllotted ? (
                  <button
                    onClick={onOpenAllotmentLetter}
                    className="w-full flex items-center gap-3 p-2.5 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 rounded-lg text-left cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                      <Unlock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block">Provisional Allotment Letter</span>
                      <span className="text-[11px] text-emerald-700">Official institutional offer decree</span>
                    </div>
                  </button>
                ) : (
                  <div 
                    className="flex items-center gap-3 p-2.5 bg-[#f9f6ed]/60 border border-[#ded9cf] border-dashed rounded-lg opacity-60 cursor-not-allowed"
                    title="Unlocked only after an official seat is allotted by the Dean"
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

        {/* Card 3: Recent Activity Stream */}
        <div className="lg:col-span-3 bg-white border border-[#ded9cf] rounded-xl overflow-hidden shadow-xs">
          <div className="px-6 py-3.5 border-b border-[#ded9cf] bg-[#f9f6ed]/60 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#33253c]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#33253c]">
                Admissions Notification Stream
              </span>
            </div>
            <button
              onClick={() => onNavigate('notifications')}
              className="text-xs font-semibold text-[#33253c] hover:underline cursor-pointer"
            >
              View All ({notifications.length})
            </button>
          </div>

          <div className="p-6 space-y-3">
            {notifications.length === 0 ? (
              <p className="text-xs text-[#7b776d] py-2">No activity notifications yet.</p>
            ) : (
              notifications.slice(0, 3).map((notif) => (
                <div 
                  key={notif.id}
                  className="flex gap-4 p-3.5 border-l-3 border-[#33253c] bg-[#f9f6ed] border-y border-r border-[#ded9cf] rounded-r-lg"
                >
                  <div className="text-emerald-700 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-semibold text-[#1e1c17]">{notif.title}</p>
                      <span className="text-[11px] text-[#4a454c]">
                        {new Date(notif.createdAt || notif.timestamp || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-[#4a454c] mt-0.5">{notif.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
