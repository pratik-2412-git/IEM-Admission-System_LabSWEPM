import React, { useState, useEffect } from 'react';
import { Calendar, Save, ArrowRight, CheckCircle2, School, User as UserIcon, BookOpen } from 'lucide-react';
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
    application?.course.primaryCourse || 'B.Tech in Computer Science & Engineering (CSE)'
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
          secondaryCourse: application?.course.secondaryCourse || 'B.Tech in Artificial Intelligence & Data Science',
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
    <div className="space-y-6 max-w-[1200px] mx-auto pb-12 text-[#F8FAFC]">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Registration Pipeline</span>
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-[#F8FAFC] tracking-tight mt-0.5">
          Application Form
        </h2>
      </div>

      {/* Top 4-Step Stepper from Mockup */}
      <div className="py-2">
        <div className="flex items-center justify-between max-w-2xl">
          {/* Step 1: Profile (Active) */}
          <button 
            type="button"
            onClick={() => onStepClick?.(1)}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-[#2DD4BF] text-[#020617] font-bold font-mono text-xs flex items-center justify-center shadow-sm shadow-teal-500/20">
              01
            </div>
            <span className="text-xs font-mono font-bold text-[#2DD4BF]">Profile</span>
          </button>

          {/* Bar 1 */}
          <div className="flex-1 h-[2px] bg-slate-800 mx-3 -mt-4" />

          {/* Step 2: Documents */}
          <button 
            type="button"
            onClick={() => onStepClick?.(2)}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-[#030712] border border-[#1E293B] text-slate-500 font-mono text-xs flex items-center justify-center group-hover:border-teal-400 group-hover:text-slate-300 transition-colors">
              02
            </div>
            <span className="text-xs font-mono text-slate-400 group-hover:text-slate-200 transition-colors">Documents</span>
          </button>

          {/* Bar 2 */}
          <div className="flex-1 h-[2px] bg-slate-800 mx-3 -mt-4" />

          {/* Step 3: Payment */}
          <button 
            type="button"
            onClick={() => onStepClick?.(3)}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-[#030712] border border-[#1E293B] text-slate-500 font-mono text-xs flex items-center justify-center group-hover:border-teal-400 group-hover:text-slate-300 transition-colors">
              03
            </div>
            <span className="text-xs font-mono text-slate-400 group-hover:text-slate-200 transition-colors">Payment</span>
          </button>

          {/* Bar 3 */}
          <div className="flex-1 h-[2px] bg-slate-800 mx-3 -mt-4" />

          {/* Step 4: Submit */}
          <button 
            type="button"
            onClick={() => onStepClick?.(4)}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-[#030712] border border-[#1E293B] text-slate-500 font-mono text-xs flex items-center justify-center group-hover:border-teal-400 group-hover:text-slate-300 transition-colors">
              04
            </div>
            <span className="text-xs font-mono text-slate-400 group-hover:text-slate-200 transition-colors">Submit</span>
          </button>
        </div>
      </div>

      {/* Main Form Container Card */}
      <form onSubmit={handleNext} className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 md:p-8 shadow-sm space-y-8">
        {/* Section 1: Personal Details */}
        <div>
          <h3 className="font-headline text-base font-semibold text-[#F8FAFC] pb-2.5 border-b border-[#1E293B] mb-5 flex items-center gap-2">
            <span className="text-teal-400 font-mono text-xs">[01]</span> Personal Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Legal Name <span className="text-rose-400">*</span>
              </label>
              <input
                id="form-full-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your legal name"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#1E293B] focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-[#030712] text-slate-100 placeholder-slate-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Date of Birth <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="form-dob"
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  placeholder="yyyy-mm-dd"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#1E293B] focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-[#030712] text-slate-100 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <input
                id="form-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="applicant@example.com"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#1E293B] focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-[#030712] text-slate-100 placeholder-slate-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Phone Number <span className="text-rose-400">*</span>
              </label>
              <input
                id="form-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#1E293B] focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-[#030712] text-slate-100 placeholder-slate-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Academic Background */}
        <div>
          <h3 className="font-headline text-base font-semibold text-[#F8FAFC] pb-2.5 border-b border-[#1E293B] mb-5 flex items-center gap-2">
            <span className="text-teal-400 font-mono text-xs">[02]</span> Academic Background
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-8">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Previous Institution <span className="text-rose-400">*</span>
              </label>
              <input
                id="form-institution"
                type="text"
                required
                value={previousInstitution}
                onChange={(e) => setPreviousInstitution(e.target.value)}
                placeholder="Name of High School or College"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#1E293B] focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-[#030712] text-slate-100 placeholder-slate-500 outline-none"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Year of Passing <span className="text-rose-400">*</span>
              </label>
              <select
                id="form-year-passing"
                value={yearOfPassing}
                onChange={(e) => setYearOfPassing(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#1E293B] focus:border-teal-400 bg-[#030712] text-slate-100 outline-none"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>

            <div className="md:col-span-6">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Percentage / CGPA <span className="text-rose-400">*</span>
              </label>
              <input
                id="form-cgpa"
                type="text"
                required
                value={percentageCgpa}
                onChange={(e) => setPercentageCgpa(e.target.value)}
                placeholder="e.g. 85% or 3.8"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#1E293B] focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-[#030712] text-slate-100 placeholder-slate-500 outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Course Selection */}
        <div>
          <h3 className="font-headline text-base font-semibold text-[#F8FAFC] pb-2.5 border-b border-[#1E293B] mb-5 flex items-center gap-2">
            <span className="text-teal-400 font-mono text-xs">[03]</span> Program Preference
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Primary Course Preference <span className="text-rose-400">*</span>
            </label>
            <select
              id="form-course-preference"
              value={primaryCourse}
              onChange={(e) => setPrimaryCourse(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#1E293B] focus:border-teal-400 bg-[#030712] text-slate-100 outline-none"
            >
              <option value="B.Tech in Computer Science & Engineering (CSE)">B.Tech in Computer Science & Engineering (CSE)</option>
              <option value="B.Tech in Artificial Intelligence & Data Science">B.Tech in Artificial Intelligence & Data Science</option>
              <option value="B.Tech in Electronics & Communication (ECE)">B.Tech in Electronics & Communication (ECE)</option>
              <option value="B.Tech in Information Technology">B.Tech in Information Technology</option>
              <option value="B.Tech in Mechanical Engineering">B.Tech in Mechanical Engineering</option>
              <option value="Master of Business Administration (MBA)">Master of Business Administration (MBA)</option>
              <option value="Master of Computer Applications (MCA)">Master of Computer Applications (MCA)</option>
            </select>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="pt-6 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-end gap-3">
          {savedSuccess && (
            <span className="text-xs text-teal-400 font-mono flex items-center gap-1.5 mr-auto">
              <CheckCircle2 className="w-4 h-4" />
              Progress committed to database ledger!
            </span>
          )}

          <button
            id="form-save-progress-btn"
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-[#1E293B] bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-teal-400" />
            <span>{saving ? 'Saving...' : 'SAVE_PROGRESS'}</span>
          </button>

          <button
            id="form-next-step-btn"
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#2DD4BF] hover:bg-teal-400 text-[#020617] text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm shadow-teal-500/10 cursor-pointer"
          >
            <span>Next: Upload Documents</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </form>
    </div>
  );
};
