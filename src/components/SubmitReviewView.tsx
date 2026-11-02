import React, { useState } from 'react';
import { 
  CheckCircle2, 
  FileText, 
  User, 
  GraduationCap, 
  CreditCard, 
  ShieldCheck, 
  ArrowLeft, 
  Send,
  Download,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Application, DocumentItem, PaymentRecord } from '../types';

interface SubmitReviewViewProps {
  application: Application | null;
  documents: DocumentItem[];
  payments: PaymentRecord[];
  onSubmitApplication: () => Promise<void>;
  onPreviousStep: () => void;
  onGoToDashboard: () => void;
  onOpenReceipt: () => void;
  onStepClick?: (stepNumber: 1 | 2 | 3 | 4) => void;
}

export const SubmitReviewView: React.FC<SubmitReviewViewProps> = ({
  application,
  documents,
  payments,
  onSubmitApplication,
  onPreviousStep,
  onGoToDashboard,
  onOpenReceipt,
  onStepClick,
}) => {
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(application?.status !== 'draft');

  const paymentRecord = payments.find(p => p.status === 'success');

  const handleSubmit = async () => {
    if (!agreed) return;
    setSubmitting(true);
    try {
      await onSubmitApplication();
      setIsSubmitted(true);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#33253c', '#4a3b53', '#e7dcea', '#059669'],
        });
      } catch (e) {}
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 text-[#1e1c17] transition-colors duration-300">
      {/* Header & Stepper */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-headline text-2xl md:text-3xl font-semibold text-[#33253c] tracking-tight">
              Application Review &amp; Attestation
            </h1>
            <p className="text-xs text-[#4a454c] mt-0.5">Final verification before irreversible submission to admissions registry</p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f9f6ed] border border-[#ded9cf] rounded-full text-xs text-[#4a454c] font-medium shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Final Declaration</span>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-between relative px-2 py-1">
          <div className="absolute left-6 right-6 top-5 h-0.5 bg-[#eae6da] z-0"></div>
          <div className="animated-progress-bar absolute left-6 top-5 h-0.5 bg-[#33253c] z-0 w-[100%]"></div>

          {/* Step 1 */}
          <div 
            onClick={() => onStepClick?.(1)}
            className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-md ring-4 ring-[#fdfbf5]">
              ✓
            </div>
            <span className="text-xs font-semibold text-[#33253c]">Profile</span>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => onStepClick?.(2)}
            className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-md ring-4 ring-[#fdfbf5]">
              ✓
            </div>
            <span className="text-xs font-semibold text-[#33253c]">Documents</span>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => onStepClick?.(3)}
            className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-md ring-4 ring-[#fdfbf5]">
              ✓
            </div>
            <span className="text-xs font-semibold text-[#33253c]">Payment</span>
          </div>

          {/* Step 4 (Active) */}
          <div 
            onClick={() => onStepClick?.(4)}
            className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#33253c] text-white flex items-center justify-center font-bold text-xs shadow-md ring-4 ring-[#fdfbf5]">
              4
            </div>
            <span className="text-xs font-semibold text-[#33253c]">Submit</span>
          </div>
        </div>
      </div>

      {isSubmitted ? (
        <div className="bg-white/95 backdrop-blur-xs border border-emerald-200 rounded-xl p-8 text-center space-y-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] animate-fade-up">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="font-headline text-2xl font-semibold text-[#33253c]">
              Application Officially Submitted!
            </h2>
            <p className="text-xs md:text-sm text-[#4a454c] max-w-md mx-auto mt-1">
              Your application <strong className="text-[#33253c] font-semibold">{application?.id}</strong> is locked and registered in the institutional admissions verification queue.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenReceipt}
              className="px-5 py-2.5 rounded-lg border border-[#33253c] text-[#33253c] hover:bg-[#f1ebdb] text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4 text-[#33253c]" />
              <span>Download PDF Summary</span>
            </button>
            <button
              onClick={onGoToDashboard}
              className="px-6 py-2.5 rounded-lg bg-[#33253c] hover:bg-[#4a3b53] text-white text-xs font-semibold shadow-sm cursor-pointer transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-up stagger-1">
          {/* Card: Profile Summary */}
          <div className="bg-white/95 backdrop-blur-xs border border-[#ded9cf] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <h3 className="font-headline text-sm font-semibold text-[#33253c] pb-3 border-b border-[#ded9cf] flex items-center gap-2">
              <User className="w-4 h-4 text-[#33253c]" />
              Personal &amp; Contact Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4">
              <div>
                <span className="text-[#4a454c] block text-[11px] font-medium uppercase">Legal Full Name:</span>
                <span className="font-semibold text-[#1e1c17] text-sm">{application?.personal.fullName}</span>
              </div>
              <div>
                <span className="text-[#4a454c] block text-[11px] font-medium uppercase">Date of Birth:</span>
                <span className="font-semibold text-[#1e1c17]">{application?.personal.dob}</span>
              </div>
              <div>
                <span className="text-[#4a454c] block text-[11px] font-medium uppercase">Email Address:</span>
                <span className="font-semibold text-[#1e1c17]">{application?.personal.email}</span>
              </div>
              <div>
                <span className="text-[#4a454c] block text-[11px] font-medium uppercase">Contact Phone:</span>
                <span className="font-semibold text-[#1e1c17]">{application?.personal.phone}</span>
              </div>
            </div>
          </div>

          {/* Card: Academic & Program */}
          <div className="bg-white/95 backdrop-blur-xs border border-[#ded9cf] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <h3 className="font-headline text-sm font-semibold text-[#33253c] pb-3 border-b border-[#ded9cf] flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#33253c]" />
              Academic Background &amp; Program Choice
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4">
              <div>
                <span className="text-[#4a454c] block text-[11px] font-medium uppercase">Previous Institution:</span>
                <span className="font-semibold text-[#1e1c17]">{application?.academic.previousInstitution}</span>
              </div>
              <div>
                <span className="text-[#4a454c] block text-[11px] font-medium uppercase">Passing Year &amp; Aggregate:</span>
                <span className="font-semibold text-[#1e1c17]">
                  {application?.academic.yearOfPassing} ({application?.academic.percentageCgpa}% Score)
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="text-[#4a454c] block text-[11px] font-medium uppercase">Selected Primary Program:</span>
                <span className="font-bold text-[#33253c] text-sm">{application?.course.primaryCourse}</span>
              </div>
            </div>
          </div>

          {/* Card: Documents & Payment Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/95 backdrop-blur-xs border border-[#ded9cf] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <h3 className="font-headline text-sm font-semibold text-[#33253c] pb-3 border-b border-[#ded9cf] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#33253c]" />
                Uploaded Documents ({documents.length})
              </h3>
              <ul className="divide-y divide-[#ded9cf] text-xs pt-2">
                {documents.map((d) => (
                  <li key={d.id} className="py-2.5 flex justify-between items-center">
                    <span className="font-medium text-[#1e1c17]">{d.title}</span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      {d.status.toUpperCase()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/95 backdrop-blur-xs border border-[#ded9cf] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <h3 className="font-headline text-sm font-semibold text-[#33253c] pb-3 border-b border-[#ded9cf] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#33253c]" />
                Application Fee Verification
              </h3>
              <div className="pt-3 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#4a454c]">Status:</span>
                  <span className="font-bold text-emerald-700">PAID &amp; VERIFIED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4a454c]">Transaction Reference:</span>
                  <span className="text-[#1e1c17] font-mono">{paymentRecord?.transactionId || 'TXN987654321'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4a454c]">Amount:</span>
                  <span className="font-bold text-[#1e1c17]">${paymentRecord?.amount || 50}.00 USD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Declaration */}
          <div className="bg-[#f9f6ed] border border-[#ded9cf] rounded-xl p-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                id="declaration-checkbox"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-[#33253c] border-[#ded9cf] cursor-pointer"
              />
              <span className="text-xs text-[#1e1c17] leading-relaxed">
                I hereby declare that all particulars stated in this application form and attached certificates are true, correct, and complete to the best of my knowledge. I agree to abide by the admission regulations of IEM Kolkata.
              </span>
            </label>
          </div>

          {/* Footer Navigation */}
          <div className="pt-4 flex justify-between items-center border-t border-[#ded9cf]">
            <button
              type="button"
              onClick={onPreviousStep}
              className="border border-[#33253c] text-[#33253c] hover:bg-[#f1ebdb] text-xs font-semibold py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Payment</span>
            </button>

            <button
              id="final-submit-btn"
              type="button"
              disabled={!agreed || submitting}
              onClick={handleSubmit}
              className="bg-[#33253c] hover:bg-[#4a3b53] text-white text-xs font-semibold py-2.5 px-8 rounded-lg transition-colors shadow-sm flex items-center gap-2 disabled:opacity-40 cursor-pointer group"
            >
              {submitting ? (
                <span>SUBMITTING APPLICATION...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
