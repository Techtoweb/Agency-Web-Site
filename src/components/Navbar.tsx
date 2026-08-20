import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight,
  Menu,
  X,
  Sparkles,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  ShieldCheck,
  FolderGit2,
  Send,
  Sliders,
  MessageCircle,
  Mail,
  Headphones
} from 'lucide-react';
import { UserProfile, AuthTab, isAuthorizedAdminEmail } from '../types';
import { useSiteData } from '../data/siteDataContext';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  onStartProject?: () => void;
  activeSection?: string;
  user?: UserProfile | null;
  onOpenAuth: (tab: AuthTab) => void;
  onLogout: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onStartProject,
  activeSection = 'home',
  user,
  onOpenAuth,
  onLogout,
  onOpenAdmin
}) => {
  const { siteData } = useSiteData();
  const settings = siteData?.siteSettings;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const rawWhatsapp = settings?.whatsapp || settings?.phone || '+1 (800) 555-0199';
  const cleanWhatsapp = rawWhatsapp.replace(/[^0-9]/g, '');
  const supportEmail = settings?.email || 'techtowebadmin@gmail.com';

  // Strict Admin Check: Only authorized admin emails (techtowebadmin@gmail.com / techtoweadmin@gmail.com)
  const isAdmin = isAuthorizedAdminEmail(user?.email);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Services', href: '#services', id: 'services' },
    { name: 'Work', href: '#work', id: 'work' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const navOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <header
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-3.5 bg-white/85 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-b border-white/60'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-8 sm:px-12 lg:px-20 flex justify-between items-center">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, '#home')}
            className="group flex items-center transition-transform duration-300 hover:scale-[1.02]"
            data-cursor-text="HOME"
          >
            <BrandLogo
              logoUrl={settings?.logoUrl}
              agencyName={settings?.agencyName || 'Tech To Web'}
              size="md"
            />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-surface-container/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/60 shadow-xs">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`relative px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-full ${
                    isActive
                      ? 'text-primary font-semibold'
                      : 'text-[#594139] hover:text-primary hover:bg-white/60'
                  }`}
                  data-cursor-text="GO"
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavTab"
                      className="absolute inset-0 bg-white rounded-full shadow-xs border border-primary/10 -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Desktop Auth Area */}
          <div className="hidden sm:flex items-center gap-3">
            {/* If NOT logged in: Only Login Button */}
            {!user ? (
              <button
                onClick={() => onOpenAuth('login')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-bold text-[#191c1d] hover:text-primary hover:bg-white hover:border-primary/30 transition-all border border-black/10 bg-surface-container/80 cursor-pointer shadow-2xs hover:shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-primary" />
                <span>Log In</span>
              </button>
            ) : (
              /* If LOGGED IN: User Profile Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-black/10 shadow-xs hover:border-primary/40 transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-mono text-xs font-bold text-primary">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="text-left hidden lg:block pr-1">
                    <span className="block text-xs font-bold text-[#191c1d] leading-tight truncate max-w-[110px]">
                      {user.name}
                    </span>
                    <span className="block text-[10px] font-mono text-emerald-600 leading-none">
                      ● Active
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#594139]" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-black/10 p-3 z-50 space-y-2"
                    >
                      {/* User Info Header */}
                      <div className="p-2.5 rounded-xl bg-surface-container border border-black/5 space-y-1.5">
                        <div>
                          <p className="font-bold text-xs text-[#191c1d]">{user.name}</p>
                          <p className="text-[11px] font-mono text-[#594139] truncate">{user.email}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                            isAdmin
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-primary-fixed/60 text-primary'
                          }`}>
                            <ShieldCheck className="w-3 h-3" />
                            <span>{isAdmin ? 'Administrator' : (user.role || 'Verified Client')}</span>
                          </div>
                          {user.serviceInterest && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100/80 border border-emerald-300 text-[10px] font-mono font-bold text-emerald-800">
                              <span>✓ {user.serviceInterest}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Dropdown Links */}
                      <div className="space-y-1">
                        <a
                          href="#work"
                          onClick={(e) => scrollToSection(e, '#work')}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold text-[#191c1d] hover:bg-surface transition-colors"
                        >
                          <FolderGit2 className="w-3.5 h-3.5 text-primary" />
                          <span>Client Projects</span>
                        </a>

                        {onStartProject && (
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onStartProject();
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold text-[#191c1d] hover:bg-surface transition-colors text-left cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5 text-primary" />
                            <span>Request Proposal</span>
                          </button>
                        )}
                      </div>

                      {/* Logout Action */}
                      <div className="pt-2 border-t border-black/5">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Controls */}
          <div className="flex md:hidden items-center gap-2">
            {!user ? (
              <button
                onClick={() => onOpenAuth('login')}
                className="text-xs bg-surface-container border border-black/10 text-[#191c1d] px-3 py-1.5 rounded-full font-mono font-medium flex items-center gap-1 shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5 text-primary" />
                <span>Log In</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="text-xs bg-primary-fixed/60 border border-primary/30 text-primary px-3 py-1.5 rounded-full font-mono font-bold flex items-center gap-1 shadow-2xs"
              >
                <User className="w-3.5 h-3.5" />
                <span className="max-w-[70px] truncate">{user.name.split(' ')[0]}</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white/80 border border-black/5 text-[#191c1d] hover:bg-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[72px] z-40 bg-white/95 backdrop-blur-2xl border-b border-surface-variant p-6 shadow-2xl md:hidden"
          >
            <div className="flex flex-col gap-3">
              {/* If user is logged in on mobile */}
              {user && (
                <div className="p-3.5 rounded-2xl bg-surface-container border border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-xs text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[#191c1d]">{user.name}</p>
                      <p className="text-[11px] font-mono text-[#594139]">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                    aria-label="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}

              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`text-base font-semibold py-2.5 px-4 rounded-xl transition-colors ${
                    activeSection === link.id
                      ? 'bg-primary-fixed/40 text-primary'
                      : 'text-[#191c1d] hover:bg-surface'
                  }`}
                >
                  {link.name}
                </a>
              ))}

              {/* Live Support Channels on Mobile */}
              <div className="p-3.5 rounded-2xl bg-surface-container border border-black/5 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#594139]">
                  <span className="flex items-center gap-1">
                    <Headphones className="w-3.5 h-3.5 text-primary" /> Live Support 24/7
                  </span>
                  <span className="text-emerald-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello Tech To Web Support, I am visiting your website and would like to chat.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366] text-white font-mono text-xs font-bold shadow-xs hover:bg-[#20bd5a] transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`mailto:${supportEmail}?subject=${encodeURIComponent('Support & Project Inquiry - Tech To Web')}&body=${encodeURIComponent('Hi Tech To Web Support Team,\n\nI would like to inquire about...')}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#191c1d] text-white font-mono text-xs font-bold shadow-xs hover:bg-black transition-all"
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Email Us</span>
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-variant flex flex-col gap-2.5">
                {!user ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('login');
                    }}
                    className="w-full bg-primary hover:bg-primary-container text-white py-3 rounded-full font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/20 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Log In</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full bg-rose-50 text-rose-700 hover:bg-rose-100 py-3 rounded-full font-mono text-xs font-bold flex items-center justify-center gap-2 border border-rose-200 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

