import React, { useState, useEffect } from 'react';
import { Save, ArrowRight, CheckCircle2, Bookmark } from 'lucide-react';
import { Application } from '../types';

interface ApplicationFormViewProps {
  application: Application | null;
  onSaveProgress: (updated: Partial<Application>) => Promise<void>;
  onNextStep: () => void;
  onStepClick?: (stepNumber: 1 | 2 | 3 | 4) => void;
}

export const ApplicationFormView: React.FC<ApplicationFormViewProps> = ({
  application,
  onSaveProgress,
  onNextStep,
  onStepClick,
}) => {
  const [fullName, setFullName] = useState(application?.personal.fullName || '');
  const [dob, setDob] = useState(application?.personal.dob || '2005-06-15');
  const [email, setEmail] = useState(application?.personal.email || 'applicant@example.com');
  const [phone, setPhone] = useState(application?.personal.phone || '+1 (555) 000-0000');

  const [previousInstitution, setPreviousInstitution] = useState(application?.academic.previousInstitution || 'Delhi Public School, Ruby Park');
  const [yearOfPassing, setYearOfPassing] = useState(application?.academic.yearOfPassing || '2025');
  const [percentageCgpa, setPercentageCgpa] = useState(application?.academic.percentageCgpa || '94.6');

  const [primaryCourse, setPrimaryCourse] = useState(
    application?.course.primaryCourse || 'B.Tech Computer Science'
  );

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (application) {
      if (application.personal.fullName) setFullName(application.personal.fullName);
      if (application.personal.dob) setDob(application.personal.dob);
      if (application.personal.email) setEmail(application.personal.email);
      if (application.personal.phone) setPhone(application.personal.phone);
      if (application.academic.previousInstitution) setPreviousInstitution(application.academic.previousInstitution);
      if (application.academic.yearOfPassing) setYearOfPassing(application.academic.yearOfPassing);
      if (application.academic.percentageCgpa) setPercentageCgpa(application.academic.percentageCgpa);
      if (application.course.primaryCourse) setPrimaryCourse(application.course.primaryCourse);
    }
  }, [application]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSaveProgress({
        personal: {
          ...(application?.personal || {}),
          fullName,
          dob,
          email,
          phone,
        },
        academic: {
          ...(application?.academic || {}),
          previousInstitution,
          yearOfPassing,
          percentageCgpa,
        },
        course: {
          ...(application?.course || {}),
          primaryCourse,
          secondaryCourse: application?.course.secondaryCourse || 'B.Tech Electronics',
          campusPreference: application?.course.campusPreference || 'IEM Kolkata - Main Campus',
        },
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSave();
    onNextStep();
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 transition-colors duration-300">
      {/* Header & Stepper */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-headline text-2xl md:text-3xl font-semibold text-[#33253c] tracking-tight">
              Application Form
            </h1>
            <p className="text-xs text-[#4a454c] mt-0.5">Academic Session 2026-2027 Registration</p>
          </div>

          {/* Smooth pulsing autosave indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f9f6ed] border border-[#ded9cf] rounded-full text-xs text-[#4a454c] font-medium shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Auto-saved draft</span>
          </div>
        </div>

        {/* Progress Stepper with Connected Lines */}
        <div className="flex items-center justify-between relative px-2 py-1">
          {/* Track line background */}
          <div className="absolute left-6 right-6 top-5 h-0.5 bg-[#eae6da] z-0"></div>
          {/* Smooth animated active progress line */}
          <div className="animated-progress-bar absolute left-6 top-5 h-0.5 bg-[#33253c] z-0 w-[12%]"></div>

          {/* Step 1 (Active) */}
          <div 
            onClick={() => onStepClick?.(1)}
            className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer animate-fade-up stagger-1"
          >
            <div className="w-9 h-9 rounded-full bg-[#33253c] text-white flex items-center justify-center font-bold text-xs shadow-md ring-4 ring-[#fdfbf5] transition-transform group-hover:scale-105">
              1
            </div>
            <span className="text-xs font-semibold text-[#33253c]">Profile</span>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => onStepClick?.(2)}
            className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer animate-fade-up stagger-2"
          >
            <div className="w-9 h-9 rounded-full bg-[#fdfbf5] border-2 border-[#ded9cf] text-[#7b776d] flex items-center justify-center font-semibold text-xs ring-4 ring-[#fdfbf5] transition-all duration-200 group-hover:border-[#33253c] group-hover:text-[#33253c] group-hover:scale-105">
              2
            </div>
            <span className="text-xs text-[#7b776d] group-hover:text-[#33253c] transition-colors font-medium">Documents</span>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => onStepClick?.(3)}
            className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer animate-fade-up stagger-3"
          >
            <div className="w-9 h-9 rounded-full bg-[#fdfbf5] border-2 border-[#ded9cf] text-[#7b776d] flex items-center justify-center font-semibold text-xs ring-4 ring-[#fdfbf5] transition-all duration-200 group-hover:border-[#33253c] group-hover:text-[#33253c] group-hover:scale-105">
              3
            </div>
            <span className="text-xs text-[#7b776d] group-hover:text-[#33253c] transition-colors font-medium">Payment</span>
          </div>

          {/* Step 4 */}
          <div 
            onClick={() => onStepClick?.(4)}
            className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer animate-fade-up stagger-4"
          >
            <div className="w-9 h-9 rounded-full bg-[#fdfbf5] border-2 border-[#ded9cf] text-[#7b776d] flex items-center justify-center font-semibold text-xs ring-4 ring-[#fdfbf5] transition-all duration-200 group-hover:border-[#33253c] group-hover:text-[#33253c] group-hover:scale-105">
              4
            </div>
            <span className="text-xs text-[#7b776d] group-hover:text-[#33253c] transition-colors font-medium">Submit</span>
          </div>
        </div>
      </div>

      {/* Form Container with refined warm styling */}
      <form 
        onSubmit={handleNext} 
        className="bg-white/95 backdrop-blur-xs rounded-xl border border-[#ded9cf] p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-8 animate-fade-up"
      >
        {/* Section: Personal Details */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#ded9cf] pb-2.5">
            <h3 className="font-headline text-base font-semibold text-[#33253c]">Personal Details</h3>
            <span className="text-xs text-[#4a454c] font-medium bg-[#f0eee6] px-2 py-0.5 rounded">Step 1 of 4</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="form-full-name">
                Full Name <span className="text-[#ba1a1a]">*</span>
              </label>
              <input 
                id="form-full-name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your legal name" 
                type="text"
                className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2.5 text-sm bg-[#fcfaf2] focus:bg-white focus:outline-none focus:border-[#33253c] focus:ring-2 focus:ring-[#33253c]/20 transition-all duration-200 hover:border-[#33253c]/60 text-[#1e1c17] outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="form-dob">
                Date of Birth <span className="text-[#ba1a1a]">*</span>
              </label>
              <input 
                id="form-dob"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                type="date"
                className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2.5 text-sm bg-[#fcfaf2] focus:bg-white focus:outline-none focus:border-[#33253c] focus:ring-2 focus:ring-[#33253c]/20 transition-all duration-200 hover:border-[#33253c]/60 text-[#1e1c17] outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="form-email">
                Email Address <span className="text-[#ba1a1a]">*</span>
              </label>
              <input 
                id="form-email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="applicant@example.com" 
                type="email"
                className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2.5 text-sm bg-[#fcfaf2] focus:bg-white focus:outline-none focus:border-[#33253c] focus:ring-2 focus:ring-[#33253c]/20 transition-all duration-200 hover:border-[#33253c]/60 text-[#1e1c17] outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="form-phone">
                Phone Number <span className="text-[#ba1a1a]">*</span>
              </label>
              <input 
                id="form-phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000" 
                type="tel"
                className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2.5 text-sm bg-[#fcfaf2] focus:bg-white focus:outline-none focus:border-[#33253c] focus:ring-2 focus:ring-[#33253c]/20 transition-all duration-200 hover:border-[#33253c]/60 text-[#1e1c17] outline-none"
              />
            </div>
          </div>
        </section>

        {/* Section: Academic Background */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-[#ded9cf] pb-2.5">
            <h3 className="font-headline text-base font-semibold text-[#33253c]">Academic Background</h3>
            <span className="text-xs text-[#4a454c] font-medium">Prior Education</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-1">
            <div className="col-span-1 md:col-span-8 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="form-institution">
                Previous Institution <span className="text-[#ba1a1a]">*</span>
              </label>
              <input 
                id="form-institution"
                required
                value={previousInstitution}
                onChange={(e) => setPreviousInstitution(e.target.value)}
                placeholder="Name of High School or College" 
                type="text"
                className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2.5 text-sm bg-[#fcfaf2] focus:bg-white focus:outline-none focus:border-[#33253c] focus:ring-2 focus:ring-[#33253c]/20 transition-all duration-200 hover:border-[#33253c]/60 text-[#1e1c17] outline-none"
              />
            </div>

            <div className="col-span-1 md:col-span-4 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="form-year-passing">
                Year of Passing <span className="text-[#ba1a1a]">*</span>
              </label>
              <select 
                id="form-year-passing"
                value={yearOfPassing}
                onChange={(e) => setYearOfPassing(e.target.value)}
                className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2.5 text-sm bg-[#fcfaf2] focus:bg-white focus:outline-none focus:border-[#33253c] focus:ring-2 focus:ring-[#33253c]/20 transition-all duration-200 hover:border-[#33253c]/60 cursor-pointer text-[#1e1c17] outline-none"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">Earlier</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-6 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="form-cgpa">
                Percentage / CGPA <span className="text-[#ba1a1a]">*</span>
              </label>
              <input 
                id="form-cgpa"
                required
                value={percentageCgpa}
                onChange={(e) => setPercentageCgpa(e.target.value)}
                placeholder="e.g. 85% or 3.8" 
                type="text"
                className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2.5 text-sm bg-[#fcfaf2] focus:bg-white focus:outline-none focus:border-[#33253c] focus:ring-2 focus:ring-[#33253c]/20 transition-all duration-200 hover:border-[#33253c]/60 font-mono text-[#1e1c17] outline-none"
              />
            </div>
          </div>
        </section>

        {/* Section: Course Selection */}
        <section className="space-y-4 pt-2">
          <div className="border-b border-[#ded9cf] pb-2.5">
            <h3 className="font-headline text-base font-semibold text-[#33253c]">Course Selection</h3>
          </div>
          <div className="flex flex-col gap-4 pt-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="form-course-preference">
                Primary Course Preference <span className="text-[#ba1a1a]">*</span>
              </label>
              <select 
                id="form-course-preference"
                value={primaryCourse}
                onChange={(e) => setPrimaryCourse(e.target.value)}
                className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2.5 text-sm bg-[#fcfaf2] focus:bg-white focus:outline-none focus:border-[#33253c] focus:ring-2 focus:ring-[#33253c]/20 transition-all duration-200 hover:border-[#33253c]/60 cursor-pointer text-[#1e1c17] outline-none"
              >
                <option value="B.Tech Computer Science">B.Tech Computer Science</option>
                <option value="B.Tech Electronics">B.Tech Electronics</option>
                <option value="BBA General">BBA General</option>
                <option value="MBA Finance">MBA Finance</option>
                <option value="B.Tech in Artificial Intelligence & Data Science">B.Tech in Artificial Intelligence & Data Science</option>
                <option value="Master of Computer Applications (MCA)">Master of Computer Applications (MCA)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Skeleton Loading preview pulse indicator for verification */}
        <div className="p-4 bg-[#f9f6ed]/70 rounded-lg border border-dashed border-[#ded9cf] flex items-center gap-3">
          <span className="material-symbols-outlined text-[#63603c] text-xl animate-spin" style={{ animationDuration: '3s' }}>
            sync
          </span>
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 bg-[#eae6da] rounded-full w-48 animate-pulse"></div>
            <div className="h-2 bg-[#eae6da]/70 rounded-full w-32 animate-pulse"></div>
          </div>
          <span className="text-xs text-[#4a454c] font-medium">Auto-verifying input standards</span>
        </div>

        {/* Feedback message */}
        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Progress successfully saved to database ledger!</span>
          </div>
        )}

        {/* Actions with micro-interactions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-[#ded9cf]">
          <button 
            id="form-save-progress-btn"
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg border border-[#33253c] text-[#33253c] font-semibold text-xs hover:bg-[#f1ebdb] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-[#33253c]" />
            <span>{saving ? 'Saving...' : 'Save Progress'}</span>
          </button>
          <button 
            id="form-next-step-btn"
            type="submit"
            className="px-7 py-2.5 rounded-lg bg-[#33253c] text-white font-semibold text-xs hover:bg-[#4a3b53] active:scale-[0.98] transition-all duration-150 shadow-sm flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </form>
    </div>
  );
};
