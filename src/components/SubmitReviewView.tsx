import React, { useState } from 'react';
import { 
  CheckCircle2, 
  FileText, 
  User, 
  GraduationCap, 
  CreditCard, 
  ArrowLeft, 
  Send,
  Download,
  Award,
  AlertCircle
} from 'lucide-react';
import { Application, DocumentItem, PaymentRecord } from '../types';
import { IEM_COURSE_LABELS } from './ApplicationFormView';

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
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isSubmitted = Boolean(
    application && 
    application.status !== 'draft' &&
    ['submitted', 'under_review', 'correction_required', 'resubmitted', 'approved', 'rejected', 'seat_allotted', 'admission_confirmed'].includes(application.status)
  );

  const paymentRecord = payments.find(p => p.status === 'paid' || p.status === 'success');

  const c10 = application?.class10 || application?.academic?.class10;
  const c12 = application?.class12 || application?.academic?.class12;
  const exams = application?.entranceExams || application?.academic?.entranceExams;

  const pref1 = application?.preferences?.preference_1 || application?.course?.preference_1 || application?.course?.primaryCourse || 'CSE';
  const pref2 = application?.preferences?.preference_2 || application?.course?.preference_2 || application?.course?.secondaryCourse || 'IT';
  const pref3 = application?.preferences?.preference_3 || application?.course?.preference_3 || 'AIML';

  const handleSubmit = async () => {
    if (!agreed) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmitApplication();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit application to admissions registry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 text-[#1e1c17]">
      {/* Header & Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-headline text-2xl md:text-3xl font-semibold text-[#33253c] tracking-tight">
              Application Review &amp; Attestation
            </h1>
            <p className="text-xs text-[#4a454c] mt-0.5">Final verification before irreversible submission to admissions registry</p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f9f6ed] border border-[#ded9cf] rounded-full text-xs text-[#4a454c] font-medium">
            <span className={`w-2 h-2 rounded-full ${isSubmitted ? 'bg-emerald-600' : 'bg-amber-600'}`}></span>
            <span>{isSubmitted ? 'Official Submission Verified' : 'Final Declaration'}</span>
          </div>
        </div>

        {/* Progress Stepper (Static) */}
        <div className="flex items-center justify-between relative px-2 py-1">
          <div className="absolute left-6 right-6 top-5 h-0.5 bg-[#eae6da] z-0"></div>
          <div className="absolute left-6 top-5 h-0.5 bg-[#33253c] z-0 w-[100%]"></div>

          {/* Step 1 */}
          <div 
            onClick={() => onStepClick?.(1)}
            className="relative z-10 flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-[#fdfbf5]">
              ✓
            </div>
            <span className="text-xs font-semibold text-[#33253c]">Profile</span>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => onStepClick?.(2)}
            className="relative z-10 flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-[#fdfbf5]">
              ✓
            </div>
            <span className="text-xs font-semibold text-[#33253c]">Documents</span>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => onStepClick?.(3)}
            className="relative z-10 flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-[#fdfbf5]">
              ✓
            </div>
            <span className="text-xs font-semibold text-[#33253c]">Payment</span>
          </div>

          {/* Step 4 (Active) */}
          <div 
            onClick={() => onStepClick?.(4)}
            className="relative z-10 flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-[#fdfbf5] ${
              isSubmitted ? 'bg-emerald-600 text-white' : 'bg-[#33253c] text-white'
            }`}>
              {isSubmitted ? '✓' : '4'}
            </div>
            <span className="text-xs font-semibold text-[#33253c]">Submit</span>
          </div>
        </div>
      </div>

      {/* Submission Confirmation Alert (Green Tick inside review card) */}
      {isSubmitted && (
        <div id="review-green-tick-card" className="mb-6 bg-white border-2 border-emerald-500 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300">
              <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline text-lg font-bold text-[#33253c]">
                  Application Successfully Submitted
                </h3>
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Verified in Database
                </span>
              </div>
              <p className="text-xs text-[#4a454c] mt-0.5">
                Application Number: <strong className="font-mono text-[#33253c]">{application?.applicationNumber || application?.id}</strong> • Submitted at {application?.submittedAt ? new Date(application.submittedAt).toLocaleString() : 'Registered Session'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenReceipt}
              className="px-4 py-2 rounded-lg border border-[#33253c] text-[#33253c] hover:bg-[#f1ebdb] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onGoToDashboard}
              className="px-4 py-2 rounded-lg bg-[#33253c] hover:bg-[#4a3b53] text-white text-xs font-semibold cursor-pointer shadow-xs"
            >
              Dashboard
            </button>
          </div>
        </div>
      )}

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-xl text-red-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Main Review Sections Container */}
      <div className="space-y-6">
        
        {/* Card 1: Personal Details */}
        <div className="bg-white border border-[#ded9cf] rounded-xl p-6 shadow-xs">
          <h3 className="font-headline text-sm font-semibold text-[#33253c] pb-3 border-b border-[#ded9cf] flex items-center gap-2">
            <User className="w-4 h-4 text-[#33253c]" />
            Personal &amp; Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-4">
            <div>
              <span className="text-[#4a454c] block text-[11px] font-medium uppercase">Legal Full Name:</span>
              <span className="font-semibold text-[#1e1c17] text-sm">{application?.personal.fullName}</span>
            </div>
            <div>
              <span className="text-[#4a454c] block text-[11px] font-medium uppercase">Date of Birth:</span>
              <span className="font-semibold text-[#1e1c17]">{application?.personal.dob}</span>
            </div>
            <div>
              <span className="text-[#4a454c] block text-[11px] font-medium uppercase">Gender &amp; Category:</span>
              <span className="font-semibold text-[#1e1c17]">
                {application?.personal.gender || 'Not specified'} • {application?.personal.category || 'General'}
              </span>
            </div>
            <div>
              <span className="text-[#4a454c] block text-[11px] font-medium uppercase">Email Address:</span>
              <span className="font-semibold text-[#1e1c17]">{application?.personal.email}</span>
            </div>
            <div>
              <span className="text-[#4a454c] block text-[11px] font-medium uppercase">Contact Phone:</span>
              <span className="font-semibold text-[#1e1c17]">{application?.personal.phone}</span>
            </div>
            <div>
              <span className="text-[#4a454c] block text-[11px] font-medium uppercase">Blood Group:</span>
              <span className="font-semibold text-[#1e1c17]">{application?.personal.bloodGroup || 'O+'}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Academic Qualifications (Class 10 & 12) */}
        <div className="bg-white border border-[#ded9cf] rounded-xl p-6 shadow-xs">
          <h3 className="font-headline text-sm font-semibold text-[#33253c] pb-3 border-b border-[#ded9cf] flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#33253c]" />
            Academic Qualifications (Class 10 &amp; Class 12)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs">
            {/* Class 10 */}
            <div className="bg-[#fcfaf2] p-4 rounded-xl border border-[#ded9cf] space-y-2">
              <span className="font-bold text-xs text-[#33253c] uppercase block border-b border-[#ded9cf]/60 pb-1.5">
                Class 10 (Secondary)
              </span>
              <p><span className="text-[#4a454c]">School:</span> <strong className="text-[#1e1c17]">{c10?.schoolName || 'N/A'}</strong></p>
              <p><span className="text-[#4a454c]">Board:</span> <strong className="text-[#1e1c17]">{c10?.board || 'CBSE'}</strong></p>
              <p><span className="text-[#4a454c]">Passing Year:</span> <strong className="text-[#1e1c17]">{c10?.yearOfPassing || '2023'}</strong></p>
              <p>
                <span className="text-[#4a454c]">Marks:</span> <strong className="text-[#1e1c17]">{c10?.marksObtained} / {c10?.fullMarks}</strong> 
                <span className="ml-2 font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {c10?.percentage}%
                </span>
              </p>
            </div>

            {/* Class 12 */}
            <div className="bg-[#fcfaf2] p-4 rounded-xl border border-[#ded9cf] space-y-2">
              <span className="font-bold text-xs text-[#33253c] uppercase block border-b border-[#ded9cf]/60 pb-1.5">
                Class 12 (Higher Secondary)
              </span>
              <p><span className="text-[#4a454c]">School:</span> <strong className="text-[#1e1c17]">{c12?.schoolName || 'N/A'}</strong></p>
              <p><span className="text-[#4a454c]">Board &amp; Stream:</span> <strong className="text-[#1e1c17]">{c12?.board || 'CBSE'} • {c12?.stream || 'Science'}</strong></p>
              <p><span className="text-[#4a454c]">Passing Year:</span> <strong className="text-[#1e1c17]">{c12?.yearOfPassing || '2025'}</strong></p>
              <p>
                <span className="text-[#4a454c]">Marks:</span> <strong className="text-[#1e1c17]">{c12?.marksObtained} / {c12?.fullMarks}</strong>
                <span className="ml-2 font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {c12?.percentage}%
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Entrance Examination Details */}
        <div className="bg-white border border-[#ded9cf] rounded-xl p-6 shadow-xs">
          <h3 className="font-headline text-sm font-semibold text-[#33253c] pb-3 border-b border-[#ded9cf] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#33253c]" />
            Entrance Examination Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
            <div className="p-3.5 bg-[#fcfaf2] rounded-xl border border-[#ded9cf]">
              <span className="font-bold text-[#33253c] block text-xs mb-1">JEE Main 2026</span>
              {exams?.jeeMain?.appeared ? (
                <div className="space-y-1">
                  <p className="text-[#4a454c]">Percentile: <strong className="text-[#1e1c17] font-mono">{exams.jeeMain.percentile}</strong></p>
                  <p className="text-[#4a454c]">AIR Rank: <strong className="text-[#1e1c17] font-mono">{exams.jeeMain.rank}</strong></p>
                </div>
              ) : (
                <span className="text-[#7b776d] italic">Did not appear</span>
              )}
            </div>

            <div className="p-3.5 bg-[#fcfaf2] rounded-xl border border-[#ded9cf]">
              <span className="font-bold text-[#33253c] block text-xs mb-1">WBJEE</span>
              {exams?.wbjee?.appeared ? (
                <p className="text-[#4a454c] mt-1">General Merit Rank: <strong className="text-[#1e1c17] font-mono">{exams.wbjee.rank}</strong></p>
              ) : (
                <span className="text-[#7b776d] italic">Did not appear</span>
              )}
            </div>

            <div className="p-3.5 bg-[#fcfaf2] rounded-xl border border-[#ded9cf]">
              <span className="font-bold text-[#33253c] block text-xs mb-1">IEMJEE</span>
              {exams?.iemjee?.appeared ? (
                <p className="text-[#4a454c] mt-1">Allotted Rank: <strong className="text-[#1e1c17] font-mono">{exams.iemjee.rank}</strong></p>
              ) : (
                <span className="text-[#7b776d] italic">Did not appear</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 4: Course Selection — Three Preferences */}
        <div className="bg-white border border-[#ded9cf] rounded-xl p-6 shadow-xs">
          <h3 className="font-headline text-sm font-semibold text-[#33253c] pb-3 border-b border-[#ded9cf] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#33253c]" />
            Course Selection — Ordered Preferences
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
            <div className="p-3.5 bg-[#fdfbf5] rounded-xl border-2 border-[#33253c]/40 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#33253c] bg-[#e7dcea] px-2 py-0.5 rounded">
                Preference 1 (First Choice)
              </span>
              <p className="font-bold text-sm text-[#33253c] mt-1">{pref1}</p>
              <p className="text-[#4a454c] text-[11px]">{IEM_COURSE_LABELS[pref1] || pref1}</p>
            </div>

            <div className="p-3.5 bg-[#fdfbf5] rounded-xl border border-[#ded9cf] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4a454c] bg-[#f0eee6] px-2 py-0.5 rounded">
                Preference 2 (Second Choice)
              </span>
              <p className="font-bold text-sm text-[#33253c] mt-1">{pref2}</p>
              <p className="text-[#4a454c] text-[11px]">{IEM_COURSE_LABELS[pref2] || pref2}</p>
            </div>

            <div className="p-3.5 bg-[#fdfbf5] rounded-xl border border-[#ded9cf] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4a454c] bg-[#f0eee6] px-2 py-0.5 rounded">
                Preference 3 (Third Choice)
              </span>
              <p className="font-bold text-sm text-[#33253c] mt-1">{pref3}</p>
              <p className="text-[#4a454c] text-[11px]">{IEM_COURSE_LABELS[pref3] || pref3}</p>
            </div>
          </div>
        </div>

        {/* Card 5: Documents & Payment Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#ded9cf] rounded-xl p-6 shadow-xs">
            <h3 className="font-headline text-sm font-semibold text-[#33253c] pb-3 border-b border-[#ded9cf] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#33253c]" />
              Uploaded Documents ({documents.length})
            </h3>
            <ul className="divide-y divide-[#ded9cf] text-xs pt-2">
              {documents.map((d) => (
                <li key={d.id} className="py-2.5 flex justify-between items-center">
                  <span className="font-medium text-[#1e1c17]">{d.title}</span>
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                    d.status === 'approved' || d.status === 'verified'
                      ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                      : d.status === 'rejected'
                      ? 'text-red-800 bg-red-50 border-red-200'
                      : 'text-amber-800 bg-amber-50 border-amber-200'
                  }`}>
                    {d.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-[#ded9cf] rounded-xl p-6 shadow-xs">
            <h3 className="font-headline text-sm font-semibold text-[#33253c] pb-3 border-b border-[#ded9cf] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#33253c]" />
              Application Fee Acceptance
            </h3>
            <div className="pt-3 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#4a454c]">Status:</span>
                <span className="font-bold text-emerald-700">
                  {paymentRecord ? 'PAID & RECORDED' : 'RECORDED'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4a454c]">Transaction Reference:</span>
                <span className="text-[#1e1c17] font-mono">{paymentRecord?.transactionId || 'TXN-IEM-98214'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4a454c]">Amount:</span>
                <span className="font-bold text-[#1e1c17]">₹0.00 (MVP Free Dummy Acceptance)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Declaration */}
        {!isSubmitted && (
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
                I hereby declare that all academic qualifications, entrance examination percentiles and scores, and ordered course preferences stated in this application form are true, correct, and complete to the best of my knowledge. I understand that admission is subject to institutional document scrutiny and merit allotment.
              </span>
            </label>
          </div>
        )}

        {/* Footer Navigation */}
        {!isSubmitted && (
          <div className="pt-4 flex justify-between items-center border-t border-[#ded9cf]">
            <button
              type="button"
              onClick={onPreviousStep}
              className="border border-[#33253c] text-[#33253c] hover:bg-[#f1ebdb] text-xs font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Payment</span>
            </button>

            <button
              id="final-submit-btn"
              type="button"
              disabled={!agreed || submitting}
              onClick={handleSubmit}
              className="bg-[#33253c] hover:bg-[#4a3b53] text-white text-xs font-semibold py-2.5 px-8 rounded-lg shadow-xs flex items-center gap-2 disabled:opacity-40 cursor-pointer"
            >
              {submitting ? (
                <span>SUBMITTING APPLICATION...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
