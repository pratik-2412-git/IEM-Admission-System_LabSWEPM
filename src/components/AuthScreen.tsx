import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, CheckCircle2, UserCheck, ShieldAlert, Database, HelpCircle, Phone } from 'lucide-react';
import { User, Application } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (user: User, application: Application) => void;
  onOpenDatabaseExplorer?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, onOpenDatabaseExplorer }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('candidate@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCategory, setRegCategory] = useState('general');
  const [regTerms, setRegTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [loginSuccessStatus, setLoginSuccessStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const campusBg = "https://lh3.googleusercontent.com/aida-public/AB6AXuCO2CJceficZr4Nvzpo7sw76MSPxS37pMdExwunpT4wq4Vvvy6qzQh_zqDSeO0z0jk5AazjuUJpdRgoAqRyiPo9K8GMoLWAnLqd4jp4qcBgYjuWygTwiKQg0hN8Xgjxm8REaoRwwyBC4PKuv6hFddzAOR--DPe-Cdohru2adTvUlyGv4BFfOswuC8widrBL2jMhJgBL0U0644LdNwBXMK3CX7xP7I2IjVQjw1QJj1Egg77iKQpIgYkn";
  const iemOfficialLogo = "https://lh3.googleusercontent.com/aida-public/AB6AXuCe5xxzKqYA-MBCYP22K-FQrucAS092QmrlXlvR1sQl8ueFmoucEQYq-abWsgX4dfvc6M1luAd_LQJtujbInVYFRTNfYmK0uJXXbNBwNNy4f5oUQQHbHrYVbbp421RmmefWkFYRkgXj1PlKNymFPP_hwHaJJnXuCNFcQcYbuXddFm3zGwiDdFwzSQ3hcsFuID2rENL8C2MOyoeoTzaXhyMW9VMEh6hP8IvjIGK84doNBzrxEAMHWx5bP0fVevz2gCMu0Q";
  const mobileLogo = "https://lh3.googleusercontent.com/aida-public/AB6AXuAIylhKHmOif3yBQp2LN0Jyj_j2DJAfCQYJ923aebmFGrlwparEvHT733rCf3IqtIxJ99CmkoEvVLGbZxFCCaFxwQd_vkmVh3NWr99nAtyhhXtVKF89ADE5mQPs7_p-k2UsZcZGcjoG3xxlBqCF7yf5JsBSRLro5bBBcDqKKgV4Pd1_OHNV88vJODz4opupLnibZxZgJ_G-RyHWfqSK4Gc_tQeKSCsS1AheDm2N2eypj4ywK6lRzhVT4cdcGz6mPBgpnw";

  const studentAvatars = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAqSxvKss3DTzrYVpKh0_FBeT39c7tQq5tRAfwsBgxFcc6HC8DQdYUQ2njhZWJuDshWS3_1fDoYXrbbB0QkS285kces7X0-19EmTrwqUvClIT6N3mC4v0thSyy7JJxTjddD94xYr_RyJfSaQh3-b6Xfd6fBRJ6zFNOYdlvQHXi38Y9xAggBqUOWMGBVeeH12n358XyC2CUoHMfXKyBUuYkyMD8_3tIb_AFJLrFoR5_JhtNIL47D5C8i",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBpsDFPLD7TyAXeFvI46HFcdyVeplWvXPM3M3BjQ8qdaCIwwGk5c72cK4wJUIP4e_gAPG8KdTB-rQU2g0M8Ul6iVAs1QqIIY8par1gt9dHJhUEUi0ZMjO84QhnCRix8xtMDwT6eaSFzguJ4PUNTv3ESVHI4MLO0FTV3cxq9KaYNdllDuGe4IL-ykZsVO4Ctue0DZcmd0jmuvR0yJL0IqjQRh_qjuEowG_og0FlK_4CMDDvEOCN2j5Ke",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD_vmc5LuVHR2Qd6vu19OpQ4GtPR1nVsN11OdtNAuSIpvfd1S9We53wRw6C3rzOq_O6G8EozCwxgO6paifReepy1-XOPc6W3nYfnP2BDv-jqhpxeS3646Q3-1dBuc8198BEPdU29NYk4KVHzzm2HrypHGUH_4oC4iRddvf6N0YyiIyQSRhSR1Vb7UC7rWy-U9AtvWXjUJbwMkQKqIGGU4Nxc6HmD65mBSilXTS6vAJPv80ZDyE38Wji",
  ];

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

      const contentType = res.headers.get('content-type');
      let data: any = {};
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        throw new Error('Authentication server returned an unexpected response. Please try again.');
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      setLoginSuccessStatus(true);
      setTimeout(() => {
        onLoginSuccess(data.user, data.application);
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please verify your credentials.');
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
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
          fullName: regName,
          email: regEmail,
          password: regPassword || 'Candidate@2026',
          category: regCategory,
        }),
      });

      const contentType = res.headers.get('content-type');
      let data: any = {};
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        throw new Error('Server returned an unexpected response. Please try again.');
      }

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setLoginSuccessStatus(true);
      setTimeout(() => {
        onLoginSuccess(data.user, data.application);
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
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
    <main className="flex-grow flex w-full min-h-screen bg-[#fdfbf5] text-[#1e1c17] antialiased">
      {/* Left Side: Branding & Imagery */}
      <div className="hidden lg:flex lg:w-1/2 relative split-bg items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 ease-out hover:scale-105"
          style={{ backgroundImage: `url("${campusBg}")` }}
        />
        <div className="relative z-10 p-12 text-white max-w-lg animate-fade-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/30 flex items-center justify-center">
              <img 
                alt="IEM Official Logo" 
                className="h-[80px] w-auto object-contain" 
                src={iemOfficialLogo}
              />
            </div>
          </div>
          
          <h2 className="font-headline text-3xl md:text-4xl font-semibold text-white mb-6 leading-tight drop-shadow-sm">
            Shape Your Future with Excellence.
          </h2>
          <p className="font-body text-base md:text-lg text-white/90 mb-8 leading-relaxed">
            Access the IEM Admission Portal to begin your journey. Manage your application, upload documents, and track your admission status in one secure place.
          </p>

          <div className="flex gap-4 items-center mt-10 pt-8 border-t border-white/20">
            <div className="flex -space-x-3">
              {studentAvatars.map((src, i) => (
                <img 
                  key={i}
                  alt="Student avatar" 
                  className="w-11 h-11 rounded-full border-2 border-[#4a3b53] object-cover shadow-sm"
                  src={src}
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
            <div className="font-body text-sm text-white/90">
              Join over <strong className="text-white font-semibold">10,000+</strong> applicants for the 2026 cycle.
            </div>
          </div>

          {/* Quick Credential Switchers */}
          <div className="mt-8 pt-6 border-t border-white/15 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-white/70">Test Profiles:</span>
            <button
              id="quick-fill-candidate-btn"
              type="button"
              onClick={() => quickFill('candidate')}
              className="px-2.5 py-1 rounded bg-white/15 hover:bg-white/25 text-white text-xs backdrop-blur-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Candidate</span>
            </button>
            <button
              id="quick-fill-admin-btn"
              type="button"
              onClick={() => quickFill('admin')}
              className="px-2.5 py-1 rounded bg-white/15 hover:bg-white/25 text-white text-xs backdrop-blur-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
              <span>Admissions Admin</span>
            </button>
            {onOpenDatabaseExplorer && (
              <button
                id="login-view-db-btn"
                type="button"
                onClick={onOpenDatabaseExplorer}
                className="px-2.5 py-1 rounded bg-white/15 hover:bg-white/25 text-white text-xs backdrop-blur-xs flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
              >
                <Database className="w-3.5 h-3.5 text-purple-200" />
                <span>Live Database</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Side: Authentication Form with Warm Creamy Vanilla Palette */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-gradient-to-br from-[#fdfbf5] via-[#faf7ee] to-[#f5f1e4]">
        <div className="w-full max-w-md auth-card bg-white/95 backdrop-blur-sm p-8 sm:p-9 rounded-2xl border border-[#ded9cf]/60 animate-fade-up shadow-xl">
          
          {/* Subtle Loading / Skeleton Shimmer State Notification */}
          <div className="mb-5 rounded-lg p-2.5 skeleton-shimmer border border-[#ded9cf]/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#63603c] animate-ping"></div>
              <span className="text-xs font-semibold text-[#63603c] tracking-wide">Synchronizing IEM Admissions Database...</span>
            </div>
            <span className="text-[11px] text-[#4a454c] font-mono font-medium">Cycle 2026</span>
          </div>

          <div className="text-center mb-6 animate-fade-up stagger-1">
            <div className="lg:hidden flex items-center justify-center mb-4">
              <div className="bg-white p-2 rounded-xl border border-[#ded9cf]/60 shadow-sm inline-flex">
                <img 
                  alt="IEM Official Logo" 
                  className="h-14 w-auto object-contain" 
                  src={mobileLogo}
                />
              </div>
            </div>
            <h2 className="font-headline text-2xl sm:text-[26px] font-semibold text-[#1e1c17] mb-1.5 tracking-tight">
              {tab === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#4a454c]">
              {tab === 'login' 
                ? 'Please log in to continue or register for a new account.' 
                : 'Register to start your IEM application process.'}
            </p>
          </div>

          {/* Tabs Toggle */}
          <div className="flex rounded-xl bg-[#f0eee6] p-1.5 mb-6 border border-[#ded9cf]/50 animate-fade-up stagger-2" role="tablist">
            <button 
              id="tab-login"
              type="button"
              role="tab"
              aria-selected={tab === 'login'}
              onClick={() => { setTab('login'); setErrorMessage(null); }}
              className={`flex-1 text-xs sm:text-sm py-2 px-4 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
                tab === 'login' 
                  ? 'bg-white text-[#33253c] shadow-sm' 
                  : 'text-[#4a454c] hover:text-[#33253c]'
              }`}
            >
              Login
            </button>
            <button 
              id="tab-register"
              type="button"
              role="tab"
              aria-selected={tab === 'register'}
              onClick={() => { setTab('register'); setErrorMessage(null); }}
              className={`flex-1 text-xs sm:text-sm py-2 px-4 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
                tab === 'register' 
                  ? 'bg-white text-[#33253c] shadow-sm' 
                  : 'text-[#4a454c] hover:text-[#33253c]'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
              <span>{errorMessage}</span>
              <button 
                type="button" 
                onClick={() => setErrorMessage(null)} 
                className="text-red-500 hover:text-red-700 font-bold ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* Login Form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4" id="form-login">
              <div className="animate-fade-up stagger-3">
                <label className="block text-xs font-semibold text-[#1e1c17] mb-1.5" htmlFor="login-email">
                  Email Address
                </label>
                <input 
                  id="login-email"
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@example.com"
                  className="form-input w-full rounded-lg border border-[#ded9cf]/80 bg-[#fdfbf5] text-sm py-2.5 px-3.5 text-[#1e1c17] placeholder:text-[#4a454c]/50 transition-all outline-none"
                />
              </div>

              <div className="animate-fade-up stagger-4">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-[#1e1c17]" htmlFor="login-password">
                    Password
                  </label>
                  <button 
                    type="button"
                    onClick={() => {
                      setEmail('candidate@example.com');
                      setPassword('password123');
                    }}
                    className="text-xs text-[#33253c] hover:underline transition-colors font-medium cursor-pointer"
                  >
                    Reset with demo pwd
                  </button>
                </div>
                <div className="relative">
                  <input 
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="form-input w-full rounded-lg border border-[#ded9cf]/80 bg-[#fdfbf5] text-sm py-2.5 px-3.5 pr-11 text-[#1e1c17] placeholder:text-[#4a454c]/50 transition-all outline-none"
                  />
                  <button 
                    id="btn-toggle-password"
                    type="button"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-[#4a454c]/70 hover:text-[#1e1c17] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 animate-fade-up stagger-5">
                <button 
                  id="btn-login-submit"
                  type="submit"
                  disabled={loading}
                  className="relative w-full bg-[#33253c] text-white text-sm font-semibold py-3 px-5 rounded-lg hover:bg-[#4a3b53] active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 group overflow-hidden cursor-pointer"
                >
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {loading && !loginSuccessStatus && <span className="btn-spinner"></span>}
                  
                  <span className="flex items-center gap-2 transition-transform group-hover:translate-x-0.5 duration-200">
                    {loginSuccessStatus ? (
                      <span className="flex items-center gap-1.5 text-emerald-300">
                        <CheckCircle2 className="w-4 h-4" />
                        Verified! Redirecting...
                      </span>
                    ) : loading ? (
                      'Authenticating Candidate...'
                    ) : (
                      <>
                        Login to Portal
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-200" />
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5" id="form-register">
              <div className="animate-fade-up stagger-1">
                <label className="block text-xs font-semibold text-[#1e1c17] mb-1" htmlFor="reg-name">
                  Full Name <span className="text-[#ba1a1a]">*</span>
                </label>
                <input 
                  id="reg-name"
                  type="text" 
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="As per official documents"
                  className="form-input w-full rounded-lg border border-[#ded9cf]/80 bg-[#fdfbf5] text-sm py-2 px-3 text-[#1e1c17] outline-none"
                />
              </div>

              <div className="animate-fade-up stagger-2">
                <label className="block text-xs font-semibold text-[#1e1c17] mb-1" htmlFor="reg-email">
                  Email Address <span className="text-[#ba1a1a]">*</span>
                </label>
                <input 
                  id="reg-email"
                  type="email" 
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="candidate@example.com"
                  className="form-input w-full rounded-lg border border-[#ded9cf]/80 bg-[#fdfbf5] text-sm py-2 px-3 text-[#1e1c17] outline-none"
                />
              </div>

              <div className="animate-fade-up stagger-3">
                <label className="block text-xs font-semibold text-[#1e1c17] mb-1" htmlFor="reg-password">
                  Create Password <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <input 
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="form-input w-full rounded-lg border border-[#ded9cf]/80 bg-[#fdfbf5] text-sm py-2 px-3 pr-10 text-[#1e1c17] outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-[#4a454c]/70 hover:text-[#1e1c17]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="animate-fade-up stagger-4">
                <label className="block text-xs font-semibold text-[#1e1c17] mb-1" htmlFor="reg-category">
                  Category <span className="text-[#ba1a1a]">*</span>
                </label>
                <select 
                  id="reg-category"
                  required
                  value={regCategory}
                  onChange={(e) => setRegCategory(e.target.value)}
                  className="form-input w-full rounded-lg border border-[#ded9cf]/80 bg-[#fdfbf5] text-sm py-2 px-3 text-[#1e1c17] outline-none cursor-pointer"
                >
                  <option value="general">General</option>
                  <option value="sc">SC</option>
                  <option value="st">ST</option>
                  <option value="obc">OBC</option>
                </select>
              </div>

              <div className="flex items-start gap-2 pt-1 animate-fade-up stagger-5">
                <input 
                  id="reg-terms"
                  type="checkbox" 
                  checked={regTerms}
                  onChange={(e) => setRegTerms(e.target.checked)}
                  required
                  className="mt-1 rounded border-[#ded9cf] text-[#33253c] focus:ring-[#33253c]"
                />
                <label className="text-xs text-[#4a454c]" htmlFor="reg-terms">
                  I agree to the <span className="text-[#33253c] underline decoration-[#33253c]/40 font-medium">Terms of Service</span> and <span className="text-[#33253c] underline decoration-[#33253c]/40 font-medium">Privacy Policy</span> of the IEM Admission System.
                </label>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#33253c] text-white text-sm font-semibold py-3 rounded-lg hover:bg-[#4a3b53] transition-all shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span className="btn-spinner"></span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Assistance */}
          <div className="mt-7 pt-5 border-t border-[#ded9cf]/50 text-center animate-fade-in stagger-5">
            <p className="text-xs text-[#4a454c]">
              Need help? Contact <span className="text-[#33253c] font-semibold hover:underline">Help Desk</span> or call admission helpline at <span className="font-mono font-medium text-[#1e1c17]">+91 33 2357 2059</span>
            </p>
          </div>

        </div>
      </div>
    </main>
  );
};
