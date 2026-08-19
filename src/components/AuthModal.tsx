import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Lock,
  Mail,
  User,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Building2,
  ShieldCheck,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, AuthTab, isAuthorizedAdminEmail } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: AuthTab;
  onSuccessAuth: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  onSuccessAuth
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authSuccess, setAuthSuccess] = useState<UserProfile | null>(null);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupCompany, setSignupCompany] = useState('');

  // Reset tab if initialTab changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setAuthSuccess(null);
      setForgotPasswordMode(false);
      setResetEmailSent(false);
    }
  }, [isOpen, initialTab]);

  // Keyboard Escape & Scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ab3500', '#ff6b35', '#0040e0', '#10b981', '#ffffff']
      });
    } catch {
      // ignore
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const emailClean = loginEmail.trim();
      const isAdmin = isAuthorizedAdminEmail(emailClean);

      const authenticatedUser: UserProfile = {
        id: isAdmin ? 'admin_techtoweb' : 'usr_' + Date.now(),
        name: isAdmin ? 'Tech To Web Admin' : (emailClean.split('@')[0] || 'Client Member'),
        email: emailClean || (isAdmin ? 'techtowebadmin@gmail.com' : 'client@brand.com'),
        company: isAdmin ? 'Tech To Web Core Team' : 'Partner Enterprise',
        role: isAdmin ? 'Administrator' : 'Verified Client',
        joinedAt: 'August 2026',
        avatar: isAdmin
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
          : `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(emailClean || 'tech')}`
      };

      setAuthSuccess(authenticatedUser);
      triggerCelebration();

      setTimeout(() => {
        onSuccessAuth(authenticatedUser);
        onClose();
      }, 1200);
    }, 600);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const emailClean = signupEmail.trim();
      const isAdmin = isAuthorizedAdminEmail(emailClean);

      const newUser: UserProfile = {
        id: isAdmin ? 'admin_techtoweb' : 'usr_' + Date.now(),
        name: isAdmin ? 'Tech To Web Admin' : (signupName || 'New Client'),
        email: emailClean || 'client@brand.com',
        company: isAdmin ? 'Tech To Web Core Team' : (signupCompany || 'Brand Studio'),
        role: isAdmin ? 'Administrator' : 'Verified Client',
        joinedAt: 'August 2026',
        avatar: isAdmin
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
          : `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(signupName || 'client')}`
      };

      setAuthSuccess(newUser);
      triggerCelebration();

      setTimeout(() => {
        onSuccessAuth(newUser);
        onClose();
      }, 1300);
    }, 700);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetEmailSent(true);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      {/* Floating Quick Close / Back Button */}
      <button
        onClick={onClose}
        aria-label="Back to website"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[110] bg-neutral-900/90 hover:bg-primary text-white p-3 rounded-full shadow-2xl border border-white/20 hover:scale-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs font-mono font-bold pr-1">Back</span>
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl border border-white/40 my-8 relative"
      >
        {/* Header Bar */}
        <div className="p-5 bg-surface-container flex items-center justify-between border-b border-black/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563eb] via-[#0f172a] to-[#ff6b35] p-[2px] shadow-sm flex items-center justify-center">
              <div className="w-full h-full rounded-[10px] bg-[#0f172a] flex items-center justify-center gap-0.5 font-mono font-black text-xs">
                <span className="text-[#38bdf8]">T</span>
                <span className="text-[#ff6b35]">W</span>
              </div>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight block">
                <span className="text-[#2563eb]">Tech</span>{' '}
                <span className="text-[#71717a] font-medium">To</span>{' '}
                <span className="text-[#ff6b35]">Web</span>{' '}
                <span className="text-[#191c1d] text-xs font-mono font-semibold ml-1">Portal</span>
              </span>
              <span className="text-[11px] font-mono text-[#594139]">
                Client & Partner Access
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full hover:bg-surface text-[#191c1d] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State Overlay */}
        <AnimatePresence>
          {authSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 text-center bg-white space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#191c1d] tracking-tight">
                Welcome, {authSuccess.name}!
              </h3>
              <p className="text-sm text-[#594139] max-w-xs mx-auto">
                {activeTab === 'login'
                  ? 'Successfully logged in to your Tech To Web client portal.'
                  : 'Your account has been created successfully. Welcome aboard!'}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-black/5 text-xs font-mono text-primary font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Redirecting to your workspace...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Forgot Password Flow */}
        {!authSuccess && forgotPasswordMode && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setForgotPasswordMode(false);
                  setResetEmailSent(false);
                }}
                className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#594139] hover:text-primary transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </button>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-[#191c1d] tracking-tight">
                Reset your password
              </h3>
              <p className="text-xs sm:text-sm text-[#594139] mt-1">
                Enter your email address and we will send you a secure link to reset your password.
              </p>
            </div>

            {resetEmailSent ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-semibold text-emerald-900">
                  Password Reset Link Sent!
                </p>
                <p className="text-xs text-emerald-700">
                  Please check your inbox at <strong>{loginEmail || 'your email'}</strong> for instructions.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForgotPasswordMode(false);
                    setResetEmailSent(false);
                  }}
                  className="mt-2 text-xs font-mono font-bold text-emerald-800 underline hover:text-emerald-950"
                >
                  Return to login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-[#191c1d] uppercase tracking-wider mb-1.5">
                    Account Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#594139] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-black/10 focus:border-primary focus:bg-white focus:outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-container text-white py-3.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Reset Link</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Main Login / Signup Tabs Form */}
        {!authSuccess && !forgotPasswordMode && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Tab Switcher */}
            <div className="relative flex p-1 rounded-2xl bg-surface-container border border-black/5">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`relative flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'login' ? 'text-white' : 'text-[#594139] hover:text-[#191c1d]'
                }`}
              >
                {activeTab === 'login' && (
                  <motion.div
                    layoutId="authActivePill"
                    className="absolute inset-0 bg-primary rounded-xl shadow-xs -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className={`relative flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'signup' ? 'text-white' : 'text-[#594139] hover:text-[#191c1d]'
                }`}
              >
                {activeTab === 'signup' && (
                  <motion.div
                    layoutId="authActivePill"
                    className="absolute inset-0 bg-primary rounded-xl shadow-xs -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </div>

            {/* Tab 1: LOGIN FORM */}
            {activeTab === 'login' && (
              <motion.div
                key="login-tab"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#191c1d] tracking-tight">
                      Welcome Back
                    </h3>
                    <p className="text-xs sm:text-sm text-[#594139] mt-0.5">
                      Access your active client portal or administrator CMS controls.
                    </p>
                  </div>
                </div>

                {/* Admin Quick Fill Helper */}
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="block text-[11px] font-mono font-bold text-amber-900">Admin Account:</span>
                      <span className="block text-xs font-mono font-semibold text-amber-800">techtowebadmin@gmail.com</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('techtowebadmin@gmail.com');
                      setLoginPassword('AdminPassword2026!');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-mono text-[10px] font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    Auto-Fill
                  </button>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#191c1d] uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#594139] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="client@brand.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-black/10 focus:border-primary focus:bg-white focus:outline-none text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-mono font-bold text-[#191c1d] uppercase tracking-wider">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setForgotPasswordMode(true)}
                        className="text-xs font-mono text-primary hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#594139] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 rounded-xl bg-surface border border-black/10 focus:border-primary focus:bg-white focus:outline-none text-sm transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#594139] hover:text-[#191c1d]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary/20 accent-primary"
                      />
                      <span className="text-xs text-[#594139]">Keep me logged in</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary-container text-white py-3.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Log In to Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-xs text-[#594139] pt-2">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('signup')}
                    className="font-bold text-primary hover:underline cursor-pointer"
                  >
                    Sign up here
                  </button>
                </p>
              </motion.div>
            )}

            {/* Tab 2: SIGNUP FORM */}
            {activeTab === 'signup' && (
              <motion.div
                key="signup-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#191c1d] tracking-tight">
                    Create Client Account
                  </h3>
                  <p className="text-xs sm:text-sm text-[#594139] mt-0.5">
                    Get instant access to real-time project milestones, quote generators, and direct developer communication.
                  </p>
                </div>

                <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono font-bold text-[#191c1d] uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-[#594139] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-surface border border-black/10 focus:border-primary focus:bg-white focus:outline-none text-xs sm:text-sm transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-bold text-[#191c1d] uppercase tracking-wider mb-1">
                        Company / Brand
                      </label>
                      <div className="relative">
                        <Building2 className="w-3.5 h-3.5 text-[#594139] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={signupCompany}
                          onChange={(e) => setSignupCompany(e.target.value)}
                          placeholder="Your Brand"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-surface border border-black/10 focus:border-primary focus:bg-white focus:outline-none text-xs sm:text-sm transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-[#191c1d] uppercase tracking-wider mb-1">
                      Business Email
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-[#594139] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="you@brand.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-surface border border-black/10 focus:border-primary focus:bg-white focus:outline-none text-xs sm:text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-[#191c1d] uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-[#594139] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Create strong password"
                        className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-surface border border-black/10 focus:border-primary focus:bg-white focus:outline-none text-xs sm:text-sm transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#594139] hover:text-[#191c1d]"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary-container text-white py-3.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          <span>Create Free Account</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <p className="text-center text-xs text-[#594139] pt-1">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="font-bold text-primary hover:underline cursor-pointer"
                  >
                    Log in here
                  </button>
                </p>
              </motion.div>
            )}
          </div>
        )}

        {/* Footer Security Badge */}
        <div className="px-6 py-3 bg-surface-container flex items-center justify-between border-t border-black/5 text-[11px] font-mono text-[#594139]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit TLS Encrypted Session</span>
          </span>
          <span>Tech To Web © 2026</span>
        </div>
      </motion.div>
    </div>
  );
};
