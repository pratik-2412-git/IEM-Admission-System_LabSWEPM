import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, UserCheck, ShieldAlert, Sparkles, HelpCircle, Phone, Mail, Clock, X, CheckCircle2 } from 'lucide-react';
import { User, Application } from '../types';
import { IEMLogo } from './IEMLogo';

interface AuthScreenProps {
  onLoginSuccess: (user: User, application: Application) => void;
  onOpenDatabaseExplorer: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, onOpenDatabaseExplorer }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('candidate@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [coursePreference, setCoursePreference] = useState('B.Tech in Computer Science & Engineering (CSE)');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const iemLogo = "https://lh3.googleusercontent.com/aida-public/AB6AXuAhk-GeFs0zS-XHK3_pNbQxmaT2TKcUQhSfLrPNJpAwwmuiLTcaP9i6-FiW8cF4I740leSDyWe0Vuil2odmfLPIkJnd4R3NOFBjYfrww-y_dhdrtVF9yVus69KtP0rV7noIVq4REnrQw7V0-LdwzBCocnd5BFge_80nYtDh1RjG8IhgLPxPBWWW3t5s_FE9aD3zMj_TNG9KILh3YX3JQeD7JosJAma2W_mLRFxFLIdyIW394TlfjloqjdH77eTV9VT6aQ";

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      onLoginSuccess(data.user, data.application);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setErrorMessage('Please fill in your legal full name and email address.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          password: password || 'password123',
          phone,
          coursePreference,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      onLoginSuccess(data.user, data.application);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (role: 'candidate' | 'admin') => {
    if (role === 'candidate') {
      setEmail('candidate@example.com');
      setPassword('password123');
      setTab('login');
    } else {
      setEmail('admin@iem.edu.in');
      setPassword('admin123');
      setTab('login');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#020617] text-[#F8FAFC]">
      {/* Left Column: Hero Showcase */}
      <div className="relative w-full md:w-1/2 min-h-[420px] md:min-h-screen bg-[#030712] border-r border-[#1E293B] flex flex-col justify-between p-8 md:p-14 text-white overflow-hidden">
        {/* Subtle Geometric Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1600&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#030712]/90 to-[#030712]/95 pointer-events-none" />

        {/* Top: Brand Monogram Box */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 bg-[#0F172A] p-2.5 rounded-lg border border-[#1E293B] shadow-sm">
            <IEMLogo size="md" variant="icon" />
            <div>
              <p className="font-headline font-semibold text-sm text-[#F8FAFC]">IEM_ADMISSION_PORTAL</p>
              <p className="text-[10px] font-mono text-teal-400 uppercase tracking-widest">Academic Matrix 2026</p>
            </div>
          </div>
        </div>

        {/* Middle: Headline & Core Pitch */}
        <div className="relative z-10 my-auto py-8 max-w-lg">
          <div className="inline-block px-2.5 py-1 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-mono font-bold uppercase tracking-wider rounded mb-3">
            ACADEMIC SESSION 2026-2027
          </div>
          <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight mb-4">
            Unified Institutional Candidate Gateway.
          </h2>
          <p className="font-body text-slate-300 text-sm md:text-base leading-relaxed">
            Manage your IEM application lifecycle, ingest verifications, and observe automated merit counseling in a singular, zero-latency system.
          </p>

          <div className="mt-8 pt-6 border-t border-[#1E293B]">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2 overflow-hidden">
                <img className="inline-block h-8 w-8 rounded-md ring-1 ring-[#1E293B] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Student" referrerPolicy="no-referrer" />
                <img className="inline-block h-8 w-8 rounded-md ring-1 ring-[#1E293B] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Student" referrerPolicy="no-referrer" />
                <img className="inline-block h-8 w-8 rounded-md ring-1 ring-[#1E293B] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Student" referrerPolicy="no-referrer" />
                <img className="inline-block h-8 w-8 rounded-md ring-1 ring-[#1E293B] object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Student" referrerPolicy="no-referrer" />
              </div>
              <p className="text-xs font-mono text-slate-400">
                Active Pool: <strong className="text-teal-400 font-semibold">10,420+ verified candidates</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom: Quick Test Credentials Tool */}
        <div className="relative z-10 pt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Quick Auth:</span>
          <button 
            id="demo-candidate-login-btn"
            onClick={() => quickFill('candidate')}
            className="bg-[#0F172A] hover:bg-slate-800 text-slate-200 border border-[#1E293B] px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer font-mono text-[11px]"
          >
            <UserCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Candidate (Aanya)</span>
          </button>
          <button 
            id="demo-admin-login-btn"
            onClick={() => quickFill('admin')}
            className="bg-[#0F172A] hover:bg-slate-800 text-slate-200 border border-[#1E293B] px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer font-mono text-[11px]"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Desk</span>
          </button>
        </div>
      </div>

      {/* Right Column: Auth Card */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-16 bg-[#020617]">
        <div 
          id="auth-card-container"
          className="w-full max-w-md bg-[#0F172A] border border-[#1E293B] rounded-xl p-7 md:p-9 shadow-sm"
        >
          <div className="text-center mb-6">
            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Security Challenge</span>
            <h3 className="font-headline text-2xl font-bold text-[#F8FAFC] mt-0.5">
              {tab === 'login' ? 'Portal Authentication' : 'Create Candidate Entry'}
            </h3>
            <p className="font-body text-xs md:text-sm text-slate-400 mt-1">
              {tab === 'login' 
                ? 'Sign in with your registered credentials or launch candidate profile.' 
                : 'Enter your credentials to initiate application ledger record.'}
            </p>
          </div>

          {/* Segmented Toggle: Login / Register */}
          <div className="flex bg-[#030712] p-1 rounded-lg mb-6 border border-[#1E293B]">
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => { setTab('login'); setErrorMessage(null); }}
              className={`flex-1 py-2 text-xs font-mono font-semibold rounded transition-all cursor-pointer ${
                tab === 'login'
                  ? 'bg-[#1E293B] text-[#2DD4BF] shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SIGN_IN
            </button>
            <button
              id="auth-tab-register"
              type="button"
              onClick={() => { setTab('register'); setErrorMessage(null); }}
              className={`flex-1 py-2 text-xs font-mono font-semibold rounded transition-all cursor-pointer ${
                tab === 'register'
                  ? 'bg-[#1E293B] text-[#2DD4BF] shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              REGISTER
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-lg flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  id="login-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@example.com"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#1E293B] focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-[#030712] text-slate-100 placeholder-slate-500 outline-none transition-colors"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    Password <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs text-teal-400 hover:text-teal-300 font-mono"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#1E293B] focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-[#030712] text-slate-100 placeholder-slate-500 outline-none transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#2DD4BF] hover:bg-teal-400 text-[#020617] font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm shadow-teal-500/10 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-[#020617] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Authenticate Session</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Legal Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  id="register-fullname-input"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aanya Sharma"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#1E293B] focus:border-teal-400 bg-[#030712] text-slate-100 placeholder-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  id="register-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="applicant@example.com"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#1E293B] focus:border-teal-400 bg-[#030712] text-slate-100 placeholder-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Phone Number <span className="text-rose-400">*</span>
                </label>
                <input
                  id="register-phone-input"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98300 00000"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#1E293B] focus:border-teal-400 bg-[#030712] text-slate-100 placeholder-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Program <span className="text-rose-400">*</span>
                </label>
                <select
                  id="register-course-select"
                  value={coursePreference}
                  onChange={(e) => setCoursePreference(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#1E293B] focus:border-teal-400 bg-[#030712] text-slate-100 outline-none"
                >
                  <option value="B.Tech in Computer Science & Engineering (CSE)">B.Tech in Computer Science & Engineering (CSE)</option>
                  <option value="B.Tech in Artificial Intelligence & Data Science">B.Tech in AI & Data Science</option>
                  <option value="B.Tech in Electronics & Communication (ECE)">B.Tech in Electronics & Communication (ECE)</option>
                  <option value="B.Tech in Information Technology">B.Tech in Information Technology</option>
                  <option value="Master of Business Administration (MBA)">Master of Business Administration (MBA)</option>
                  <option value="Master of Computer Applications (MCA)">Master of Computer Applications (MCA)</option>
                </select>
              </div>

              <button
                id="register-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#2DD4BF] hover:bg-teal-400 text-[#020617] font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm shadow-teal-500/10 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-[#020617] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Applicant Entity</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer help link */}
          <div className="mt-6 pt-5 border-t border-[#1E293B] text-center">
            <button
              id="auth-helpdesk-btn"
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="text-xs font-mono text-slate-400 hover:text-teal-400 transition-colors"
            >
              [Admissions Desk Support]
            </button>
          </div>
        </div>
      </div>

      {/* Help Desk Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#0F172A] max-w-md w-full rounded-xl p-6 border border-[#1E293B] shadow-2xl relative text-slate-200">
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:bg-slate-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-headline font-semibold text-[#F8FAFC]">IEM Admissions Help Desk</h4>
                <p className="text-xs text-slate-400">Technical &amp; Enrollment Support</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 my-4">
              <div className="flex items-center gap-3 p-3 bg-[#030712] border border-[#1E293B] rounded-lg">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <div>
                  <p className="font-mono font-bold text-slate-200">Helpline Numbers</p>
                  <p className="font-mono text-slate-400">+91 33 2357 2059 / +91 98300 00000</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#030712] border border-[#1E293B] rounded-lg">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <div>
                  <p className="font-mono font-bold text-slate-200">Email Dispatch</p>
                  <p className="font-mono text-slate-400">admissions@iem.edu.in / helpdesk@iemcal.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#030712] border border-[#1E293B] rounded-lg">
                <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                <div>
                  <p className="font-mono font-bold text-slate-200">Operating Schedule</p>
                  <p className="font-mono text-slate-400">Mon - Sat: 09:00 - 18:00 IST</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-lg font-mono font-bold text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#0F172A] max-w-md w-full rounded-xl p-6 border border-[#1E293B] shadow-2xl relative text-slate-200">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:bg-slate-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="font-headline font-semibold text-[#F8FAFC] text-lg mb-2">Credentials Recovery</h4>
            <p className="text-xs text-slate-400 mb-4">
              Pre-configured test accounts for sandbox evaluation:
            </p>

            <div className="bg-[#030712] p-3.5 rounded-lg space-y-2 text-xs border border-[#1E293B] mb-4">
              <div>
                <span className="font-mono font-bold text-teal-400">Candidate Demo:</span>
                <p className="font-mono text-slate-300">candidate@example.com / password123</p>
              </div>
              <div>
                <span className="font-mono font-bold text-amber-400">Admin Desk:</span>
                <p className="font-mono text-slate-300">admin@iem.edu.in / admin123</p>
              </div>
            </div>

            <button
              onClick={() => {
                quickFill('candidate');
                setShowForgotModal(false);
              }}
              className="w-full bg-[#2DD4BF] hover:bg-teal-400 text-[#020617] py-2.5 rounded-lg font-bold text-xs"
            >
              Apply Candidate Credentials
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
