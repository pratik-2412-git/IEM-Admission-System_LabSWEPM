import React, { useState, useEffect } from 'react';
import { Bookmark, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Application, Class10Details, Class12Details, EntranceExamDetails, CoursePreferences } from '../types';

export const IEM_COURSES = [
  'CSE',
  'ECE',
  'IT',
  'EE',
  'EEE',
  'ME',
  'AI',
  'AIML',
  'IOT',
  'IOT CSBT',
  'CSBS',
  'DATA SCIENCE',
  'CSIT',
  'CST',
  'CSE CYBERSECURITY',
  'CSE NETWORKS',
  'ROBOTICS & AI',
  'BIOTECHNOLOGY',
] as const;

export const IEM_COURSE_LABELS: Record<string, string> = {
  'CSE': 'B.Tech in Computer Science & Engineering (CSE)',
  'ECE': 'B.Tech in Electronics & Communication Engineering (ECE)',
  'IT': 'B.Tech in Information Technology (IT)',
  'EE': 'B.Tech in Electrical Engineering (EE)',
  'EEE': 'B.Tech in Electrical & Electronics Engineering (EEE)',
  'ME': 'B.Tech in Mechanical Engineering (ME)',
  'AI': 'B.Tech in Artificial Intelligence (AI)',
  'AIML': 'B.Tech in Artificial Intelligence & Machine Learning (AIML)',
  'IOT': 'B.Tech in Internet of Things (IOT)',
  'IOT CSBT': 'B.Tech in IoT & Cyber Security including Blockchain (IOT CSBT)',
  'CSBS': 'B.Tech in Computer Science & Business Systems (CSBS)',
  'DATA SCIENCE': 'B.Tech in CSE (Data Science)',
  'CSIT': 'B.Tech in Computer Science & Information Technology (CSIT)',
  'CST': 'B.Tech in Computer Science & Technology (CST)',
  'CSE CYBERSECURITY': 'B.Tech in CSE (Cyber Security)',
  'CSE NETWORKS': 'B.Tech in CSE (Networks)',
  'ROBOTICS & AI': 'B.Tech in Robotics & Artificial Intelligence',
  'BIOTECHNOLOGY': 'B.Tech in Biotechnology',
};

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
  // Personal Details
  const [fullName, setFullName] = useState(application?.personal.fullName || 'Aanya Sharma');
  const [dob, setDob] = useState(application?.personal.dob || '2006-06-15');
  const [email, setEmail] = useState(application?.personal.email || 'candidate@example.com');
  const [phone, setPhone] = useState(application?.personal.phone || '+91 98765 43210');
  const [gender, setGender] = useState(application?.personal.gender || 'Female');
  const [category, setCategory] = useState(application?.personal.category || 'General');

  // Academic Qualifications - Class 10
  const initial10 = application?.class10 || application?.academic?.class10;
  const [c10School, setC10School] = useState(initial10?.schoolName || 'Delhi Public School, Ruby Park');
  const [c10Board, setC10Board] = useState(initial10?.board || 'CBSE');
  const [c10PassingYear, setC10PassingYear] = useState(initial10?.yearOfPassing || '2023');
  const [c10FullMarks, setC10FullMarks] = useState<string>(initial10?.fullMarks ? String(initial10.fullMarks) : '500');
  const [c10MarksObtained, setC10MarksObtained] = useState<string>(initial10?.marksObtained ? String(initial10.marksObtained) : '478');
  const [c10Percentage, setC10Percentage] = useState<string>(
    initial10?.percentage ? String(initial10.percentage) : '95.60'
  );

  // Academic Qualifications - Class 12
  const initial12 = application?.class12 || application?.academic?.class12;
  const [c12School, setC12School] = useState(initial12?.schoolName || 'Delhi Public School, Ruby Park');
  const [c12Board, setC12Board] = useState(initial12?.board || 'CBSE');
  const [c12PassingYear, setC12PassingYear] = useState(initial12?.yearOfPassing || '2025');
  const [c12Stream, setC12Stream] = useState(initial12?.stream || 'Science');
  const [c12FullMarks, setC12FullMarks] = useState<string>(initial12?.fullMarks ? String(initial12.fullMarks) : '500');
  const [c12MarksObtained, setC12MarksObtained] = useState<string>(initial12?.marksObtained ? String(initial12.marksObtained) : '473');
  const [c12Percentage, setC12Percentage] = useState<string>(
    initial12?.percentage ? String(initial12.percentage) : '94.60'
  );

  // Entrance Examination Details
  const initialExams = application?.entranceExams || application?.academic?.entranceExams;
  const [jeeAppeared, setJeeAppeared] = useState<boolean>(initialExams?.jeeMain?.appeared ?? true);
  const [jeePercentile, setJeePercentile] = useState<string>(initialExams?.jeeMain?.percentile || '98.42');
  const [jeeRank, setJeeRank] = useState<string>(initialExams?.jeeMain?.rank || '1420');

  const [wbjeeAppeared, setWbjeeAppeared] = useState<boolean>(initialExams?.wbjee?.appeared ?? true);
  const [wbjeeRank, setWbjeeRank] = useState<string>(initialExams?.wbjee?.rank || '312');

  const [iemjeeAppeared, setIemjeeAppeared] = useState<boolean>(initialExams?.iemjee?.appeared ?? false);
  const [iemjeeRank, setIemjeeRank] = useState<string>(initialExams?.iemjee?.rank || '');

  // Course Selection: Three distinct preferences from 18 IEM programmes
  const initialPrefs = application?.preferences || application?.course?.preferences;
  const rawP1 = initialPrefs?.preference_1 || application?.course?.preference_1 || application?.course?.primaryCourse || 'CSE';
  const rawP2 = initialPrefs?.preference_2 || application?.course?.preference_2 || application?.course?.secondaryCourse || 'IT';
  const rawP3 = initialPrefs?.preference_3 || application?.course?.preference_3 || 'AIML';

  // Normalize course codes
  const normalizeCourseCode = (val: string): string => {
    if (!val) return 'CSE';
    for (const code of IEM_COURSES) {
      if (val === code || val.includes(`(${code})`) || val.toLowerCase().includes(code.toLowerCase())) {
        return code;
      }
    }
    return 'CSE';
  };

  const [preference1, setPreference1] = useState<string>(normalizeCourseCode(rawP1));
  const [preference2, setPreference2] = useState<string>(
    normalizeCourseCode(rawP2) === normalizeCourseCode(rawP1) ? 'IT' : normalizeCourseCode(rawP2)
  );
  const [preference3, setPreference3] = useState<string>(
    normalizeCourseCode(rawP3) === normalizeCourseCode(rawP1) || normalizeCourseCode(rawP3) === normalizeCourseCode(rawP2)
      ? 'AIML'
      : normalizeCourseCode(rawP3)
  );

  const [validationError, setValidationError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync when application loads from backend
  useEffect(() => {
    if (application) {
      if (application.personal.fullName) setFullName(application.personal.fullName);
      if (application.personal.dob) setDob(application.personal.dob);
      if (application.personal.email) setEmail(application.personal.email);
      if (application.personal.phone) setPhone(application.personal.phone);
      if (application.personal.gender) setGender(application.personal.gender);
      if (application.personal.category) setCategory(application.personal.category);

      const a10 = application.class10 || application.academic?.class10;
      if (a10) {
        if (a10.schoolName) setC10School(a10.schoolName);
        if (a10.board) setC10Board(a10.board);
        if (a10.yearOfPassing) setC10PassingYear(a10.yearOfPassing);
        if (a10.fullMarks) setC10FullMarks(String(a10.fullMarks));
        if (a10.marksObtained) setC10MarksObtained(String(a10.marksObtained));
        if (a10.percentage) setC10Percentage(String(a10.percentage));
      }

      const a12 = application.class12 || application.academic?.class12;
      if (a12) {
        if (a12.schoolName) setC12School(a12.schoolName);
        if (a12.board) setC12Board(a12.board);
        if (a12.yearOfPassing) setC12PassingYear(a12.yearOfPassing);
        if (a12.stream) setC12Stream(a12.stream);
        if (a12.fullMarks) setC12FullMarks(String(a12.fullMarks));
        if (a12.marksObtained) setC12MarksObtained(String(a12.marksObtained));
        if (a12.percentage) setC12Percentage(String(a12.percentage));
      }

      const ex = application.entranceExams || application.academic?.entranceExams;
      if (ex) {
        if (ex.jeeMain) {
          setJeeAppeared(Boolean(ex.jeeMain.appeared));
          setJeePercentile(ex.jeeMain.percentile || '');
          setJeeRank(ex.jeeMain.rank || '');
        }
        if (ex.wbjee) {
          setWbjeeAppeared(Boolean(ex.wbjee.appeared));
          setWbjeeRank(ex.wbjee.rank || '');
        }
        if (ex.iemjee) {
          setIemjeeAppeared(Boolean(ex.iemjee.appeared));
          setIemjeeRank(ex.iemjee.rank || '');
        }
      }

      const p1 = application.preferences?.preference_1 || application.course?.preference_1 || application.course?.primaryCourse;
      const p2 = application.preferences?.preference_2 || application.course?.preference_2 || application.course?.secondaryCourse;
      const p3 = application.preferences?.preference_3 || application.course?.preference_3;
      if (p1) setPreference1(normalizeCourseCode(p1));
      if (p2) setPreference2(normalizeCourseCode(p2));
      if (p3) setPreference3(normalizeCourseCode(p3));
    }
  }, [application]);

  // Auto-calculate Class 10 percentage with validation
  const handleC10MarksChange = (obtainedStr: string, fullStr: string) => {
    setC10MarksObtained(obtainedStr);
    setC10FullMarks(fullStr);
    const obt = parseFloat(obtainedStr);
    const full = parseFloat(fullStr);
    if (!isNaN(obt) && !isNaN(full) && full > 0) {
      if (obt > full) {
        setValidationError('Class 10 Marks Obtained cannot exceed Full Marks.');
      } else {
        setValidationError(null);
        setC10Percentage(((obt / full) * 100).toFixed(2));
      }
    }
  };

  // Auto-calculate Class 12 percentage with validation
  const handleC12MarksChange = (obtainedStr: string, fullStr: string) => {
    setC12MarksObtained(obtainedStr);
    setC12FullMarks(fullStr);
    const obt = parseFloat(obtainedStr);
    const full = parseFloat(fullStr);
    if (!isNaN(obt) && !isNaN(full) && full > 0) {
      if (obt > full) {
        setValidationError('Class 12 Marks Obtained cannot exceed Full Marks.');
      } else {
        setValidationError(null);
        setC12Percentage(((obt / full) * 100).toFixed(2));
      }
    }
  };

  // Handlers for distinct preferences
  const handlePreference1Change = (newP1: string) => {
    setPreference1(newP1);
    if (preference2 === newP1) {
      const nextAvailable = IEM_COURSES.find(c => c !== newP1 && c !== preference3) || 'IT';
      setPreference2(nextAvailable);
    }
    if (preference3 === newP1) {
      const nextAvailable = IEM_COURSES.find(c => c !== newP1 && c !== preference2) || 'AIML';
      setPreference3(nextAvailable);
    }
  };

  const handlePreference2Change = (newP2: string) => {
    setPreference2(newP2);
    if (preference3 === newP2) {
      const nextAvailable = IEM_COURSES.find(c => c !== preference1 && c !== newP2) || 'AIML';
      setPreference3(nextAvailable);
    }
  };

  // Construct payload objects
  const buildPayload = () => {
    const class10: Class10Details = {
      schoolName: c10School,
      board: c10Board,
      yearOfPassing: c10PassingYear,
      fullMarks: Number(c10FullMarks),
      marksObtained: Number(c10MarksObtained),
      percentage: Number(c10Percentage),
    };

    const class12: Class12Details = {
      schoolName: c12School,
      board: c12Board,
      yearOfPassing: c12PassingYear,
      stream: c12Stream,
      fullMarks: Number(c12FullMarks),
      marksObtained: Number(c12MarksObtained),
      percentage: Number(c12Percentage),
    };

    const entranceExams: EntranceExamDetails = {
      jeeMain: {
        appeared: jeeAppeared,
        percentile: jeeAppeared ? jeePercentile : '',
        rank: jeeAppeared ? jeeRank : '',
      },
      wbjee: {
        appeared: wbjeeAppeared,
        rank: wbjeeAppeared ? wbjeeRank : '',
      },
      iemjee: {
        appeared: iemjeeAppeared,
        rank: iemjeeAppeared ? iemjeeRank : '',
      },
    };

    const preferences: CoursePreferences = {
      preference_1: preference1,
      preference_2: preference2,
      preference_3: preference3,
    };

    return {
      personal: {
        ...(application?.personal || {}),
        fullName,
        dob,
        email,
        phone,
        gender,
        category,
      },
      academic: {
        ...(application?.academic || {}),
        previousInstitution: c12School,
        yearOfPassing: c12PassingYear,
        percentageCgpa: c12Percentage,
        class10,
        class12,
        entranceExams,
      },
      class10,
      class12,
      entranceExams,
      course: {
        primaryCourse: preference1,
        secondaryCourse: preference2,
        campusPreference: application?.course?.campusPreference || 'IEM Kolkata Main Campus (Salt Lake)',
        preference_1: preference1,
        preference_2: preference2,
        preference_3: preference3,
        preferences,
      },
      preferences,
    };
  };

  const validateForm = (): boolean => {
    setValidationError(null);
    if (!fullName.trim()) {
      setValidationError('Full Legal Name is mandatory.');
      return false;
    }
    if (!c10School.trim()) {
      setValidationError('Class 10 School Name is required.');
      return false;
    }
    const c10Full = parseFloat(c10FullMarks);
    const c10Obt = parseFloat(c10MarksObtained);
    if (isNaN(c10Full) || isNaN(c10Obt) || c10Obt > c10Full) {
      setValidationError('Class 10 marks are invalid or marks obtained exceeds full marks.');
      return false;
    }

    if (!c12School.trim()) {
      setValidationError('Class 12 School Name is required.');
      return false;
    }
    const c12Full = parseFloat(c12FullMarks);
    const c12Obt = parseFloat(c12MarksObtained);
    if (isNaN(c12Full) || isNaN(c12Obt) || c12Obt > c12Full) {
      setValidationError('Class 12 marks are invalid or marks obtained exceeds full marks.');
      return false;
    }

    if (jeeAppeared) {
      if (!jeePercentile.trim() || !jeeRank.trim()) {
        setValidationError('JEE Main Percentile and AIR Rank are mandatory when marked as appeared.');
        return false;
      }
    }

    if (wbjeeAppeared) {
      if (!wbjeeRank.trim()) {
        setValidationError('WBJEE Rank is mandatory when marked as appeared.');
        return false;
      }
    }

    if (iemjeeAppeared) {
      if (!iemjeeRank.trim()) {
        setValidationError('IEMJEE Rank is mandatory when marked as appeared.');
        return false;
      }
    }

    if (preference1 === preference2 || preference1 === preference3 || preference2 === preference3) {
      setValidationError('All three course preferences must be unique and distinct.');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      await onSaveProgress(buildPayload());
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setValidationError(err.message || 'Failed to save progress.');
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSaving(true);
    try {
      await onSaveProgress(buildPayload());
      onNextStep();
    } catch (err: any) {
      setValidationError(err.message || 'Failed to save form data.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 text-[#1e1c17]">
      {/* Header & Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-headline text-2xl md:text-3xl font-semibold text-[#33253c] tracking-tight">
              Application Form
            </h1>
            <p className="text-xs text-[#4a454c] mt-0.5">Academic Session 2026-2027 Registration</p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f9f6ed] border border-[#ded9cf] rounded-full text-xs text-[#4a454c] font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Draft Mode</span>
          </div>
        </div>

        {/* Static Progress Stepper */}
        <div className="flex items-center justify-between relative px-2 py-1">
          <div className="absolute left-6 right-6 top-5 h-0.5 bg-[#eae6da] z-0"></div>
          <div className="absolute left-6 top-5 h-0.5 bg-[#33253c] z-0 w-[12%]"></div>

          {/* Step 1 (Active) */}
          <div 
            onClick={() => onStepClick?.(1)}
            className="relative z-10 flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#33253c] text-white flex items-center justify-center font-bold text-xs ring-4 ring-[#fdfbf5]">
              1
            </div>
            <span className="text-xs font-semibold text-[#33253c]">Profile</span>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => onStepClick?.(2)}
            className="relative z-10 flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#fdfbf5] border-2 border-[#ded9cf] text-[#7b776d] flex items-center justify-center font-semibold text-xs ring-4 ring-[#fdfbf5]">
              2
            </div>
            <span className="text-xs text-[#7b776d] font-medium">Documents</span>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => onStepClick?.(3)}
            className="relative z-10 flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#fdfbf5] border-2 border-[#ded9cf] text-[#7b776d] flex items-center justify-center font-semibold text-xs ring-4 ring-[#fdfbf5]">
              3
            </div>
            <span className="text-xs text-[#7b776d] font-medium">Fee (₹0.00)</span>
          </div>

          {/* Step 4 */}
          <div 
            onClick={() => onStepClick?.(4)}
            className="relative z-10 flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#fdfbf5] border-2 border-[#ded9cf] text-[#7b776d] flex items-center justify-center font-semibold text-xs ring-4 ring-[#fdfbf5]">
              4
            </div>
            <span className="text-xs text-[#7b776d] font-medium">Submit</span>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <form 
        onSubmit={handleNext} 
        className="bg-white rounded-xl border border-[#ded9cf] p-6 md:p-8 shadow-xs space-y-8"
      >
        {/* Error Alert */}
        {validationError && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 1: PERSONAL DETAILS                                               */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#ded9cf] pb-2.5">
            <h3 className="font-headline text-base font-semibold text-[#33253c]">Personal Details</h3>
            <span className="text-xs text-[#4a454c] font-medium bg-[#f0eee6] px-2 py-0.5 rounded">Candidate Record</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="form-full-name">
                Full Legal Name <span className="text-[#ba1a1a]">*</span>
              </label>
              <input 
                id="form-full-name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your legal full name" 
                type="text"
                className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2.5 text-sm bg-[#fcfaf2] focus:bg-white focus:border-[#33253c] text-[#1e1c17] outline-none"
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
                className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2.5 text-sm bg-[#fcfaf2] focus:bg-white focus:border-[#33253c] text-[#1e1c17] outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="form-email">
                Registered Email Address <span className="text-[#ba1a1a]">*</span>
              </label>
              <input 
                id="form-email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="candidate@example.com" 
                type="email"
                className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2.5 text-sm bg-[#fcfaf2] focus:bg-white focus:border-[#33253c] text-[#1e1c17] outline-none"
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
                placeholder="+91 98765 43210" 
                type="tel"
                className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2.5 text-sm bg-[#fcfaf2] focus:bg-white focus:border-[#33253c] text-[#1e1c17] outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="form-gender">
                Gender
              </label>
              <select
                id="form-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2.5 text-sm bg-[#fcfaf2] focus:bg-white focus:border-[#33253c] text-[#1e1c17] outline-none cursor-pointer"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="form-category">
                Social Category
              </label>
              <select
                id="form-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2.5 text-sm bg-[#fcfaf2] focus:bg-white focus:border-[#33253c] text-[#1e1c17] outline-none cursor-pointer"
              >
                <option value="General">General / Open</option>
                <option value="OBC-A">OBC-A</option>
                <option value="OBC-B">OBC-B</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: ACADEMIC QUALIFICATIONS (CLASS 10 & CLASS 12)                  */}
        {/* ========================================================================= */}
        <section className="space-y-6 pt-2">
          <div className="flex items-center justify-between border-b border-[#ded9cf] pb-2.5">
            <div>
              <h3 className="font-headline text-base font-semibold text-[#33253c]">Academic Qualifications</h3>
              <p className="text-xs text-[#4a454c] mt-0.5">Educational records for Class 10 and Class 12</p>
            </div>
            <span className="text-xs text-[#4a454c] font-medium bg-[#f0eee6] px-2 py-0.5 rounded">Prior Education</span>
          </div>

          {/* Sub-section A: Class 10 Qualification */}
          <div className="bg-[#fcfaf2] p-5 rounded-xl border border-[#ded9cf] space-y-4">
            <h4 className="font-headline text-sm font-semibold text-[#33253c] flex items-center justify-between">
              <span>A. Class 10 (Secondary) Qualification</span>
              <span className="text-[11px] font-normal text-[#4a454c]">All fields mandatory</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="col-span-1 md:col-span-8 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="c10-school">
                  School Name <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  id="c10-school"
                  required
                  value={c10School}
                  onChange={(e) => setC10School(e.target.value)}
                  placeholder="Full name of Class 10 school"
                  type="text"
                  className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2 text-sm bg-white text-[#1e1c17] outline-none focus:border-[#33253c]"
                />
              </div>

              <div className="col-span-1 md:col-span-4 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="c10-board">
                  Education Board <span className="text-[#ba1a1a]">*</span>
                </label>
                <select
                  id="c10-board"
                  value={c10Board}
                  onChange={(e) => setC10Board(e.target.value)}
                  className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2 text-sm bg-white text-[#1e1c17] outline-none cursor-pointer focus:border-[#33253c]"
                >
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="WBCHSE">WBCHSE / WBBSE</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-span-1 md:col-span-3 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="c10-passing-year">
                  Year of Passing <span className="text-[#ba1a1a]">*</span>
                </label>
                <select
                  id="c10-passing-year"
                  value={c10PassingYear}
                  onChange={(e) => setC10PassingYear(e.target.value)}
                  className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2 text-sm bg-white text-[#1e1c17] outline-none cursor-pointer focus:border-[#33253c]"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="Earlier">Earlier</option>
                </select>
              </div>

              <div className="col-span-1 md:col-span-3 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="c10-full-marks">
                  Full Marks <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  id="c10-full-marks"
                  required
                  type="number"
                  min="1"
                  value={c10FullMarks}
                  onChange={(e) => handleC10MarksChange(c10MarksObtained, e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2 text-sm bg-white text-[#1e1c17] outline-none font-mono focus:border-[#33253c]"
                />
              </div>

              <div className="col-span-1 md:col-span-3 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="c10-marks-obtained">
                  Marks Obtained <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  id="c10-marks-obtained"
                  required
                  type="number"
                  min="0"
                  value={c10MarksObtained}
                  onChange={(e) => handleC10MarksChange(e.target.value, c10FullMarks)}
                  placeholder="e.g. 478"
                  className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2 text-sm bg-white text-[#1e1c17] outline-none font-mono focus:border-[#33253c]"
                />
              </div>

              <div className="col-span-1 md:col-span-3 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="c10-percentage">
                  Percentage (%)
                </label>
                <input
                  id="c10-percentage"
                  readOnly
                  value={c10Percentage ? `${c10Percentage}%` : ''}
                  placeholder="Auto-calculated"
                  className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2 text-sm bg-[#f0eee6] font-mono font-semibold text-[#33253c] outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Sub-section B: Class 12 Qualification */}
          <div className="bg-[#fcfaf2] p-5 rounded-xl border border-[#ded9cf] space-y-4">
            <h4 className="font-headline text-sm font-semibold text-[#33253c] flex items-center justify-between">
              <span>B. Class 12 (Higher Secondary) Qualification</span>
              <span className="text-[11px] font-normal text-[#4a454c]">All fields mandatory</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="col-span-1 md:col-span-8 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="c12-school">
                  School Name <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  id="c12-school"
                  required
                  value={c12School}
                  onChange={(e) => setC12School(e.target.value)}
                  placeholder="Full name of Class 12 school / Junior College"
                  type="text"
                  className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2 text-sm bg-white text-[#1e1c17] outline-none focus:border-[#33253c]"
                />
              </div>

              <div className="col-span-1 md:col-span-4 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="c12-board">
                  Education Board <span className="text-[#ba1a1a]">*</span>
                </label>
                <select
                  id="c12-board"
                  value={c12Board}
                  onChange={(e) => setC12Board(e.target.value)}
                  className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2 text-sm bg-white text-[#1e1c17] outline-none cursor-pointer focus:border-[#33253c]"
                >
                  <option value="CBSE">CBSE</option>
                  <option value="ISC">ISC</option>
                  <option value="WBCHSE">WBCHSE</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-span-1 md:col-span-4 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="c12-stream">
                  Stream <span className="text-[#ba1a1a]">*</span>
                </label>
                <select
                  id="c12-stream"
                  value={c12Stream}
                  onChange={(e) => setC12Stream(e.target.value)}
                  className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2 text-sm bg-white text-[#1e1c17] outline-none cursor-pointer focus:border-[#33253c]"
                >
                  <option value="Science">Science (PCM / PCMB)</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Arts">Arts / Humanities</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="c12-passing-year">
                  Year of Passing <span className="text-[#ba1a1a]">*</span>
                </label>
                <select
                  id="c12-passing-year"
                  value={c12PassingYear}
                  onChange={(e) => setC12PassingYear(e.target.value)}
                  className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2 text-sm bg-white text-[#1e1c17] outline-none cursor-pointer focus:border-[#33253c]"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="Earlier">Earlier</option>
                </select>
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="c12-full-marks">
                  Full Marks <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  id="c12-full-marks"
                  required
                  type="number"
                  min="1"
                  value={c12FullMarks}
                  onChange={(e) => handleC12MarksChange(c12MarksObtained, e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2 text-sm bg-white text-[#1e1c17] outline-none font-mono focus:border-[#33253c]"
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="c12-marks-obtained">
                  Marks Obtained <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  id="c12-marks-obtained"
                  required
                  type="number"
                  min="0"
                  value={c12MarksObtained}
                  onChange={(e) => handleC12MarksChange(e.target.value, c12FullMarks)}
                  placeholder="e.g. 473"
                  className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2 text-sm bg-white text-[#1e1c17] outline-none font-mono focus:border-[#33253c]"
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="c12-percentage">
                  Percentage (%)
                </label>
                <input
                  id="c12-percentage"
                  readOnly
                  value={c12Percentage ? `${c12Percentage}%` : ''}
                  placeholder="Auto-calculated"
                  className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2 text-sm bg-[#f0eee6] font-mono font-semibold text-[#33253c] outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: ENTRANCE EXAMINATION DETAILS                                   */}
        {/* ========================================================================= */}
        <section className="space-y-4 pt-2">
          <div className="border-b border-[#ded9cf] pb-2.5">
            <h3 className="font-headline text-base font-semibold text-[#33253c]">Entrance Examination Details</h3>
            <p className="text-xs text-[#4a454c] mt-0.5">National &amp; State Entrance Examinations</p>
          </div>

          <div className="space-y-4 pt-1">
            {/* JEE Main 2026 */}
            <div className="bg-[#fcfaf2] p-4 rounded-xl border border-[#ded9cf] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-xs text-[#1e1c17]">Did you appear in JEE Main 2026?</span>
                  <p className="text-[11px] text-[#4a454c]">National Testing Agency (NTA)</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="jeeMainAppeared"
                      checked={jeeAppeared === true}
                      onChange={() => setJeeAppeared(true)}
                      className="accent-[#33253c]"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="jeeMainAppeared"
                      checked={jeeAppeared === false}
                      onChange={() => {
                        setJeeAppeared(false);
                        setJeePercentile('');
                        setJeeRank('');
                      }}
                      className="accent-[#33253c]"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {jeeAppeared && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#ded9cf]/60">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="jee-percentile">
                      JEE Main NTA Percentile Score <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <input
                      id="jee-percentile"
                      required
                      value={jeePercentile}
                      onChange={(e) => setJeePercentile(e.target.value)}
                      placeholder="e.g. 98.42"
                      className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2 text-sm bg-white text-[#1e1c17] font-mono outline-none focus:border-[#33253c]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="jee-rank">
                      All India Rank (AIR) <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <input
                      id="jee-rank"
                      required
                      value={jeeRank}
                      onChange={(e) => setJeeRank(e.target.value)}
                      placeholder="e.g. 1420"
                      className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2 text-sm bg-white text-[#1e1c17] font-mono outline-none focus:border-[#33253c]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* WBJEE */}
            <div className="bg-[#fcfaf2] p-4 rounded-xl border border-[#ded9cf] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-xs text-[#1e1c17]">Did you appear in WBJEE?</span>
                  <p className="text-[11px] text-[#4a454c]">West Bengal Joint Entrance Examinations Board</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="wbjeeAppeared"
                      checked={wbjeeAppeared === true}
                      onChange={() => setWbjeeAppeared(true)}
                      className="accent-[#33253c]"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="wbjeeAppeared"
                      checked={wbjeeAppeared === false}
                      onChange={() => {
                        setWbjeeAppeared(false);
                        setWbjeeRank('');
                      }}
                      className="accent-[#33253c]"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {wbjeeAppeared && (
                <div className="pt-2 border-t border-[#ded9cf]/60">
                  <div className="flex flex-col gap-1.5 max-w-md">
                    <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="wbjee-rank">
                      WBJEE General Merit Rank (GMR) <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <input
                      id="wbjee-rank"
                      required
                      value={wbjeeRank}
                      onChange={(e) => setWbjeeRank(e.target.value)}
                      placeholder="e.g. 312"
                      className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2 text-sm bg-white text-[#1e1c17] font-mono outline-none focus:border-[#33253c]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* IEMJEE */}
            <div className="bg-[#fcfaf2] p-4 rounded-xl border border-[#ded9cf] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-xs text-[#1e1c17]">Did you appear in IEMJEE?</span>
                  <p className="text-[11px] text-[#4a454c]">Institute of Engineering &amp; Management Joint Entrance Exam</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="iemjeeAppeared"
                      checked={iemjeeAppeared === true}
                      onChange={() => setIemjeeAppeared(true)}
                      className="accent-[#33253c]"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="iemjeeAppeared"
                      checked={iemjeeAppeared === false}
                      onChange={() => {
                        setIemjeeAppeared(false);
                        setIemjeeRank('');
                      }}
                      className="accent-[#33253c]"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {iemjeeAppeared && (
                <div className="pt-2 border-t border-[#ded9cf]/60">
                  <div className="flex flex-col gap-1.5 max-w-md">
                    <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="iemjee-rank">
                      IEMJEE Rank <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <input
                      id="iemjee-rank"
                      required
                      value={iemjeeRank}
                      onChange={(e) => setIemjeeRank(e.target.value)}
                      placeholder="e.g. 84"
                      className="w-full border border-[#ded9cf] rounded-lg px-3.5 py-2 text-sm bg-white text-[#1e1c17] font-mono outline-none focus:border-[#33253c]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: COURSE SELECTION — THREE PREFERENCES                           */}
        {/* ========================================================================= */}
        <section className="space-y-4 pt-2">
          <div className="border-b border-[#ded9cf] pb-2.5">
            <h3 className="font-headline text-base font-semibold text-[#33253c]">Course Selection — Three Preferences</h3>
            <p className="text-xs text-[#4a454c] mt-0.5">
              Select 3 distinct, ordered preferences from all 18 IEM programmes. Duplicates are strictly excluded.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
            {/* Preference 1 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="form-preference-1">
                Preference 1 (First Choice) <span className="text-[#ba1a1a]">*</span>
              </label>
              <select
                id="form-preference-1"
                value={preference1}
                onChange={(e) => handlePreference1Change(e.target.value)}
                className="w-full border border-[#ded9cf] rounded-lg px-3 py-2.5 text-xs bg-[#fcfaf2] focus:bg-white focus:border-[#33253c] text-[#1e1c17] outline-none cursor-pointer font-medium"
              >
                {IEM_COURSES.map((code) => (
                  <option key={code} value={code}>
                    {code} — {IEM_COURSE_LABELS[code] || code}
                  </option>
                ))}
              </select>
            </div>

            {/* Preference 2 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="form-preference-2">
                Preference 2 (Second Choice) <span className="text-[#ba1a1a]">*</span>
              </label>
              <select
                id="form-preference-2"
                value={preference2}
                onChange={(e) => handlePreference2Change(e.target.value)}
                className="w-full border border-[#ded9cf] rounded-lg px-3 py-2.5 text-xs bg-[#fcfaf2] focus:bg-white focus:border-[#33253c] text-[#1e1c17] outline-none cursor-pointer font-medium"
              >
                {IEM_COURSES.filter(c => c !== preference1).map((code) => (
                  <option key={code} value={code}>
                    {code} — {IEM_COURSE_LABELS[code] || code}
                  </option>
                ))}
              </select>
            </div>

            {/* Preference 3 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1e1c17]" htmlFor="form-preference-3">
                Preference 3 (Third Choice) <span className="text-[#ba1a1a]">*</span>
              </label>
              <select
                id="form-preference-3"
                value={preference3}
                onChange={(e) => setPreference3(e.target.value)}
                className="w-full border border-[#ded9cf] rounded-lg px-3 py-2.5 text-xs bg-[#fcfaf2] focus:bg-white focus:border-[#33253c] text-[#1e1c17] outline-none cursor-pointer font-medium"
              >
                {IEM_COURSES.filter(c => c !== preference1 && c !== preference2).map((code) => (
                  <option key={code} value={code}>
                    {code} — {IEM_COURSE_LABELS[code] || code}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Feedback message */}
        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Progress successfully saved to database!</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-[#ded9cf]">
          <button 
            id="form-save-progress-btn"
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg border border-[#33253c] text-[#33253c] font-semibold text-xs hover:bg-[#f1ebdb] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-[#33253c]" />
            <span>{saving ? 'Saving...' : 'Save Draft'}</span>
          </button>
          <button 
            id="form-next-step-btn"
            type="submit"
            disabled={saving}
            className="px-7 py-2.5 rounded-lg bg-[#33253c] text-white font-semibold text-xs hover:bg-[#4a3b53] shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Next: Upload Documents</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
