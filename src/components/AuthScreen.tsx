import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldAlert, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  KeyRound, 
  Mail, 
  GraduationCap, 
  Building2, 
  Lock, 
  Eye, 
  EyeOff,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { User, Application } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (user: User, application?: Application | null) => void;
  onOpenDatabaseExplorer?: () => void;
}

type AuthMode = 
  | 'select_role'
  | 'student_login'
  | 'student_register'
  | 'student_otp'
  | 'admin_login';

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, onOpenDatabaseExplorer }) => {
  const [mode, setMode] = useState<AuthMode>('select_role');

  // Student Login & Register fields
  const [studentEmail, setStudentEmail] = useState('candidate@example.com');
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentCourse, setStudentCourse] = useState('B.Tech in Computer Science & Engineering (CSE)');
  const [otpCode, setOtpCode] = useState('');
  const [isRegisteringOtp, setIsRegisteringOtp] = useState(false);
  const [receivedOtpHint, setReceivedOtpHint] = useState<string | null>(null);

  // Admin fields
  const [adminEmail, setAdminEmail] = useState('admin@iem.edu.in');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const campusBg = "https://lh3.googleusercontent.com/aida-public/AB6AXuCO2CJceficZr4Nvzpo7sw76MSPxS37pMdExwunpT4wq4Vvvy6qzQh_zqDSeO0z0jk5AazjuUJpdRgoAqRyiPo9K8GMoLWAnLqd4jp4qcBgYjuWygTwiKQg0hN8Xgjxm8REaoRwwyBC4PKuv6hFddzAOR--DPe-Cdohru2adTvUlyGv4BFfOswuC8widrBL2jMhJgBL0U0644LdNwBXMK3CX7xP7I2IjVQjw1QJj1Egg77iKQpIgYkn";
  const iemOfficialLogo = "https://lh3.googleusercontent.com/aida-public/AB6AXuCe5xxzKqYA-MBCYP22K-FQrucAS092QmrlXlvR1sQl8ueFmoucEQYq-abWsgX4dfvc6M1luAd_LQJtujbInVYFRTNfYmK0uJXXbNBwNNy4f5oUQQHbHrYVbbp421RmmefWkFYRkgXj1PlKNymFPP_hwHaJJnXuCNFcQcYbuXddFm3zGwiDdFwzSQ3hcsFuID2rENL8C2MOyoeoTzaXhyMW9VMEh6hP8IvjIGK84doNBzrxEAMHWx5bP0fVevz2gCMu0Q";

  // Quick Switchers
  const handleQuickStudent = () => {
    setStudentEmail('candidate@example.com');
    setMode('student_login');
    setErrorMessage(null);
  };

  const handleQuickAdmin = () => {
    setAdminEmail('admin@iem.edu.in');
    setAdminPassword('admin123');
    setMode('admin_login');
    setErrorMessage(null);
  };

  // 1. Send OTP for Student Login
  const handleStudentSendLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/student/login-send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: studentEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send login code');

      setIsRegisteringOtp(false);
      setReceivedOtpHint(data.debugOtp || null);
      setSuccessMessage(data.message || 'Verification OTP sent to your email.');
      setMode('student_otp');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error sending login code.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Send OTP for Student Registration
  const handleStudentSendRegisterOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentEmail.trim()) {
      setErrorMessage('Full name and email are mandatory.');
      return;
    }
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/student/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: studentName,
          email: studentEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      setIsRegisteringOtp(true);
      setReceivedOtpHint(data.debugOtp || null);
      setSuccessMessage(data.message || 'Verification OTP sent to your email.');
      setMode('student_otp');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error initiating registration.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      const endpoint = isRegisteringOtp
        ? '/api/auth/student/verify-otp-register'
        : '/api/auth/student/verify-otp-login';

      const bodyPayload = isRegisteringOtp
        ? {
            email: studentEmail,
            otp: otpCode,
            phone: studentPhone,
            coursePreference: studentCourse,
          }
        : {
            email: studentEmail,
            otp: otpCode,
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');

      if (data.token) {
        localStorage.setItem('iem_token', data.token);
      }

      onLoginSuccess(data.user, data.application);
    } catch (err: any) {
      setErrorMessage(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Admin authentication failed');

      if (data.token) {
        localStorage.setItem('iem_token', data.token);
      }

      onLoginSuccess(data.user, null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to authenticate as administrator.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex w-full min-h-screen bg-[#fdfbf5] text-[#1e1c17]">
      {/* Left Branding Side */}
      <div className="hidden lg:flex lg:w-1/2 relative split-bg items-center justify-center p-12 text-white">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${campusBg}")` }}
        />
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="bg-white/95 p-3 rounded-xl inline-flex items-center justify-center shadow-md">
            <img 
              alt="IEM Official Logo" 
              className="h-16 w-auto object-contain" 
              src={iemOfficialLogo}
            />
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold block mb-1">
              Admissions Cycle 2026-2027
            </span>
            <h1 className="font-headline text-3xl md:text-4xl font-semibold leading-tight text-white">
              Institute of Engineering &amp; Management
            </h1>
            <p className="text-sm md:text-base text-white/90 leading-relaxed mt-3">
              Official centralized portal for admission scrutiny, candidate verification, institutional merit rankings, and departmental seat allotment.
            </p>
          </div>

          <div className="pt-4 border-t border-white/20 flex items-center justify-between text-xs text-white/80">
            <div>
              <p className="font-semibold text-white">Salt Lake Main Campus</p>
              <p>Sector V, Bidhannagar, Kolkata 700091</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white">Admissions Helpline</p>
              <p className="font-mono">+91 33 2357 2059</p>
            </div>
          </div>

          {/* Quick Credential Shortcuts */}
          <div className="pt-4 border-t border-white/15 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-white/70 font-medium">Quick Credentials:</span>
            <button
              type="button"
              onClick={handleQuickStudent}
              className="px-2.5 py-1 rounded bg-white/15 hover:bg-white/25 text-white text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Student Profile</span>
            </button>
            <button
              type="button"
              onClick={handleQuickAdmin}
              className="px-2.5 py-1 rounded bg-white/15 hover:bg-white/25 text-white text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
              <span>Admin Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Side: Authentication Flows */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-[#fdfbf5]">
        <div className="w-full max-w-md bg-white border border-[#ded9cf] p-8 sm:p-9 rounded-2xl shadow-sm">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="lg:hidden flex justify-center mb-3">
              <img 
                alt="IEM Official Logo" 
                className="h-12 w-auto object-contain" 
                src={iemOfficialLogo}
              />
            </div>
            <h2 className="font-headline text-2xl font-semibold text-[#33253c]">
              {mode === 'select_role' && 'IEM Admission Portal'}
              {mode === 'student_login' && 'Student Login'}
              {mode === 'student_register' && 'New Student Registration'}
              {mode === 'student_otp' && 'Verify Email OTP'}
              {mode === 'admin_login' && 'Official Dean & Faculty Login'}
            </h2>
            <p className="text-xs text-[#4a454c] mt-1">
              {mode === 'select_role' && 'Select your portal access mode to proceed'}
              {mode === 'student_login' && 'Enter your registered email to receive a login OTP'}
              {mode === 'student_register' && 'Create your applicant profile with email verification'}
              {mode === 'student_otp' && `Enter the 6-digit code sent to ${studentEmail}`}
              {mode === 'admin_login' && 'Authorized admissions committee credentials required'}
            </p>
          </div>

          {/* Feedback Banners */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
              <button 
                type="button" 
                onClick={() => setErrorMessage(null)} 
                className="text-red-500 hover:text-red-700 font-bold ml-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Debug Code Helper Banner for easy testing */}
          {receivedOtpHint && mode === 'student_otp' && (
            <div className="mb-4 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
              <span>Demo OTP: <strong className="font-mono text-sm tracking-wider">{receivedOtpHint}</strong></span>
              <button
                type="button"
                onClick={() => setOtpCode(receivedOtpHint)}
                className="text-xs font-semibold text-amber-900 underline cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
          )}

          {/* VIEW 1: INITIAL LANDING - TWO PRIMARY OPTIONS */}
          {mode === 'select_role' && (
            <div className="space-y-4">
              <button
                id="btn-login-student"
                type="button"
                onClick={() => { setMode('student_login'); setErrorMessage(null); setSuccessMessage(null); }}
                className="w-full p-4 rounded-xl border-2 border-[#33253c] bg-[#33253c] hover:bg-[#4a3b53] text-white flex items-center justify-between text-left cursor-pointer shadow-sm transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-sm">Login as Student</h3>
                    <p className="text-xs text-white/80 mt-0.5">Application form, documents &amp; seat status</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-white/70" />
              </button>

              <button
                id="btn-login-admin"
                type="button"
                onClick={() => { setMode('admin_login'); setErrorMessage(null); setSuccessMessage(null); }}
                className="w-full p-4 rounded-xl border border-[#ded9cf] bg-[#f9f6ed] hover:bg-[#f0eee6] text-[#1e1c17] flex items-center justify-between text-left cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-white border border-[#ded9cf] flex items-center justify-center text-[#33253c]">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-sm text-[#33253c]">Login as Admin</h3>
                    <p className="text-xs text-[#4a454c] mt-0.5">Admissions scrutiny, merit ranking &amp; allotment</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#4a454c]" />
              </button>

              <div className="pt-4 border-t border-[#ded9cf] text-center">
                <p className="text-xs text-[#4a454c]">
                  New candidate applying for 2026?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('student_register'); setErrorMessage(null); }}
                    className="font-semibold text-[#33253c] underline cursor-pointer"
                  >
                    Register here
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* VIEW 2: STUDENT LOGIN FORM (EMAIL -> OTP) */}
          {mode === 'student_login' && (
            <form onSubmit={handleStudentSendLoginOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1e1c17] mb-1.5" htmlFor="student-login-email">
                  Registered Email Address <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    id="student-login-email"
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="candidate@example.com"
                    className="w-full rounded-lg border border-[#ded9cf] bg-[#fdfbf5] text-sm py-2.5 px-3.5 text-[#1e1c17] outline-none"
                  />
                  <Mail className="w-4 h-4 text-[#7b776d] absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[11px] text-[#4a454c] mt-1">
                  We will send a one-time verification code to this email.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#33253c] hover:bg-[#4a3b53] text-white text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {loading ? <span className="btn-spinner" /> : null}
                <span>Send Login OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between pt-3 border-t border-[#ded9cf] text-xs">
                <button
                  type="button"
                  onClick={() => setMode('select_role')}
                  className="text-[#4a454c] hover:text-[#1e1c17] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('student_register'); setErrorMessage(null); }}
                  className="font-semibold text-[#33253c] hover:underline cursor-pointer"
                >
                  New Applicant? Register
                </button>
              </div>
            </form>
          )}

          {/* VIEW 3: STUDENT REGISTRATION FORM */}
          {mode === 'student_register' && (
            <form onSubmit={handleStudentSendRegisterOtp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1e1c17] mb-1" htmlFor="reg-name">
                  Full Name (as per Grade 10 Marksheet) <span className="text-red-600">*</span>
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Suman Dey"
                  className="w-full rounded-lg border border-[#ded9cf] bg-[#fdfbf5] text-sm py-2 px-3 text-[#1e1c17] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1e1c17] mb-1" htmlFor="reg-email">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full rounded-lg border border-[#ded9cf] bg-[#fdfbf5] text-sm py-2 px-3 text-[#1e1c17] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1e1c17] mb-1" htmlFor="reg-phone">
                  Contact Phone Number
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-lg border border-[#ded9cf] bg-[#fdfbf5] text-sm py-2 px-3 text-[#1e1c17] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1e1c17] mb-1" htmlFor="reg-course">
                  Program of Choice
                </label>
                <select
                  id="reg-course"
                  value={studentCourse}
                  onChange={(e) => setStudentCourse(e.target.value)}
                  className="w-full rounded-lg border border-[#ded9cf] bg-[#fdfbf5] text-sm py-2 px-3 text-[#1e1c17] outline-none cursor-pointer"
                >
                  <option value="B.Tech in Computer Science & Engineering (CSE)">B.Tech in Computer Science &amp; Engineering (CSE)</option>
                  <option value="B.Tech in Artificial Intelligence & Data Science">B.Tech in Artificial Intelligence &amp; Data Science</option>
                  <option value="B.Tech in Electronics & Communication (ECE)">B.Tech in Electronics &amp; Communication (ECE)</option>
                  <option value="B.Tech in Information Technology">B.Tech in Information Technology</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#33253c] hover:bg-[#4a3b53] text-white text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors mt-2"
              >
                {loading ? <span className="btn-spinner" /> : null}
                <span>Send Registration OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between pt-3 border-t border-[#ded9cf] text-xs">
                <button
                  type="button"
                  onClick={() => setMode('select_role')}
                  className="text-[#4a454c] hover:text-[#1e1c17] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('student_login'); setErrorMessage(null); }}
                  className="font-semibold text-[#33253c] hover:underline cursor-pointer"
                >
                  Already Registered? Login
                </button>
              </div>
            </form>
          )}

          {/* VIEW 4: OTP VERIFICATION SCREEN */}
          {mode === 'student_otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-[#f9f6ed] rounded-xl border border-[#ded9cf] text-xs text-[#4a454c] space-y-1">
                <div className="flex justify-between">
                  <span>Target Email:</span>
                  <strong className="text-[#1e1c17]">{studentEmail}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Operation:</span>
                  <span className="font-semibold text-[#33253c]">
                    {isRegisteringOtp ? 'Account Provisioning' : 'Secure Login'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1e1c17] mb-1.5" htmlFor="otp-input">
                  Enter 6-Digit Verification Code <span className="text-red-600">*</span>
                </label>
                <input
                  id="otp-input"
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full text-center tracking-widest text-xl font-mono font-bold py-2.5 rounded-lg border-2 border-[#33253c] bg-[#fdfbf5] text-[#33253c] outline-none"
                  autoFocus
                />
              </div>

              <button
                id="btn-verify-otp"
                type="submit"
                disabled={loading || otpCode.length < 6}
                className="w-full bg-[#33253c] hover:bg-[#4a3b53] disabled:opacity-50 text-white text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {loading ? <span className="btn-spinner" /> : null}
                <span>Verify &amp; Proceed to Dashboard</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between pt-3 border-t border-[#ded9cf] text-xs">
                <button
                  type="button"
                  onClick={() => setMode(isRegisteringOtp ? 'student_register' : 'student_login')}
                  className="text-[#4a454c] hover:text-[#1e1c17] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    if (isRegisteringOtp) handleStudentSendRegisterOtp(e as any);
                    else handleStudentSendLoginOtp(e as any);
                  }}
                  className="font-semibold text-[#33253c] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend Code</span>
                </button>
              </div>
            </form>
          )}

          {/* VIEW 5: ADMIN LOGIN FORM */}
          {mode === 'admin_login' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1e1c17] mb-1" htmlFor="admin-email">
                  Administrator Official Email <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    id="admin-email"
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@iem.edu.in"
                    className="w-full rounded-lg border border-[#ded9cf] bg-[#fdfbf5] text-sm py-2.5 px-3.5 text-[#1e1c17] outline-none"
                  />
                  <Mail className="w-4 h-4 text-[#7b776d] absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1e1c17] mb-1" htmlFor="admin-password">
                  Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showAdminPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-[#ded9cf] bg-[#fdfbf5] text-sm py-2.5 px-3.5 pr-10 text-[#1e1c17] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7b776d] hover:text-[#1e1c17] cursor-pointer"
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 bg-[#f9f6ed] rounded-lg border border-[#ded9cf] text-[11px] text-[#4a454c]">
                <span>Secured Admin Portal. Unauthorized access is logged in compliance with institutional regulations.</span>
              </div>

              <button
                id="btn-admin-submit"
                type="submit"
                disabled={loading}
                className="w-full bg-[#33253c] hover:bg-[#4a3b53] text-white text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {loading ? <span className="btn-spinner" /> : null}
                <span>Login to Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between pt-3 border-t border-[#ded9cf] text-xs">
                <button
                  type="button"
                  onClick={() => setMode('select_role')}
                  className="text-[#4a454c] hover:text-[#1e1c17] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Role Selection</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </main>
  );
};
