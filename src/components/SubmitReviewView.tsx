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
}

export const SubmitReviewView: React.FC<SubmitReviewViewProps> = ({
  application,
  documents,
  payments,
  onSubmitApplication,
  onPreviousStep,
  onGoToDashboard,
  onOpenReceipt,
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
        });
      } catch (e) {}
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1000px] mx-auto pb-12 text-[#F8FAFC]">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Verification &amp; Attestation [04]</span>
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-[#F8FAFC] tracking-tight mt-0.5">
          Application Review &amp; Submission
        </h2>
        <p className="font-body text-xs md:text-sm text-slate-400 mt-1">
          Final stage: Review all attested sections before irreversible submission to the admissions committee.
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-[#0F172A] border border-teal-500/30 rounded-xl p-8 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="font-headline text-2xl font-bold text-[#F8FAFC]">
              Application Officially Submitted!
            </h3>
            <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto mt-1 font-mono">
              Application <strong className="text-teal-300">{application?.id}</strong> is locked and entered into institutional verification queue.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenReceipt}
              className="px-5 py-2.5 rounded-lg border border-[#1E293B] bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono font-medium flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4 text-teal-400" />
              <span>DOWNLOAD_RECEIPT</span>
            </button>
            <button
              onClick={onGoToDashboard}
              className="px-6 py-2.5 rounded-lg bg-[#2DD4BF] hover:bg-teal-400 text-[#020617] text-xs font-bold shadow-sm shadow-teal-500/10 cursor-pointer transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Card: Profile Summary */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 shadow-sm">
            <h3 className="font-headline text-sm font-semibold text-[#F8FAFC] pb-3 border-b border-[#1E293B] flex items-center gap-2">
              <User className="w-4 h-4 text-teal-400" />
              Personal &amp; Contact Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4">
              <div>
                <span className="text-slate-400 block text-[11px] font-mono uppercase">Legal Name:</span>
                <span className="font-semibold text-slate-100 text-sm">{application?.personal.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-mono uppercase">Date of Birth:</span>
                <span className="font-medium text-slate-200 font-mono">{application?.personal.dob}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-mono uppercase">Email Address:</span>
                <span className="font-medium text-slate-200">{application?.personal.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-mono uppercase">Contact Phone:</span>
                <span className="font-medium text-slate-200 font-mono">{application?.personal.phone}</span>
              </div>
            </div>
          </div>

          {/* Card: Academic & Program */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 shadow-sm">
            <h3 className="font-headline text-sm font-semibold text-[#F8FAFC] pb-3 border-b border-[#1E293B] flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-teal-400" />
              Academic Background &amp; Program Choice
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4">
              <div>
                <span className="text-slate-400 block text-[11px] font-mono uppercase">Previous Institution:</span>
                <span className="font-semibold text-slate-100">{application?.academic.previousInstitution}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-mono uppercase">Passing Year &amp; Score:</span>
                <span className="font-semibold text-slate-200 font-mono">
                  {application?.academic.yearOfPassing} ({application?.academic.percentageCgpa}% Score)
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="text-slate-400 block text-[11px] font-mono uppercase">Selected Primary Course:</span>
                <span className="font-bold text-teal-300 text-sm font-mono">{application?.course.primaryCourse}</span>
              </div>
            </div>
          </div>

          {/* Card: Documents & Payment Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 shadow-sm">
              <h3 className="font-headline text-sm font-semibold text-[#F8FAFC] pb-3 border-b border-[#1E293B] flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-400" />
                Uploaded Documents ({documents.length})
              </h3>
              <ul className="divide-y divide-[#1E293B] text-xs pt-2">
                {documents.map((d) => (
                  <li key={d.id} className="py-2.5 flex justify-between items-center">
                    <span className="font-medium text-slate-200">{d.title}</span>
                    <span className="text-[10px] font-mono font-bold text-teal-300 bg-teal-500/20 border border-teal-500/30 px-2 py-0.5 rounded">
                      {d.status.toUpperCase()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 shadow-sm">
              <h3 className="font-headline text-sm font-semibold text-[#F8FAFC] pb-3 border-b border-[#1E293B] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-teal-400" />
                Application Fee
              </h3>
              <div className="pt-3 space-y-2.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-teal-400">PAID &amp; VERIFIED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Transaction ID:</span>
                  <span className="text-slate-200">{paymentRecord?.transactionId || 'TXN987654321'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount:</span>
                  <span className="font-bold text-slate-100">${paymentRecord?.amount || 50}.00 USD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Declaration */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                id="declaration-checkbox"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded accent-teal-400 bg-slate-900 border-[#1E293B]"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                I hereby declare that all particulars stated in this application form and attached certificates are true, correct, and complete to the best of my knowledge. I agree to abide by the admission regulations of IEM Kolkata.
              </span>
            </label>
          </div>

          {/* Footer Navigation */}
          <div className="pt-4 flex justify-between items-center border-t border-[#1E293B]">
            <button
              type="button"
              onClick={onPreviousStep}
              className="border border-[#1E293B] bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Payment</span>
            </button>

            <button
              id="final-submit-btn"
              type="button"
              disabled={!agreed || submitting}
              onClick={handleSubmit}
              className="bg-[#2DD4BF] hover:bg-teal-400 text-[#020617] text-xs font-bold py-2.5 px-8 rounded-lg transition-colors shadow-sm shadow-teal-500/10 flex items-center gap-2 disabled:opacity-40 cursor-pointer"
            >
              {submitting ? (
                <span>SUBMITTING...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
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
