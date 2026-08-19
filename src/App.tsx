import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, LogOut, Sparkles, Sliders, ShieldCheck } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FloatingServicePanel } from './components/FloatingServicePanel';
import { CoreExpertise } from './components/CoreExpertise';
import { DigitalExperience } from './components/DigitalExperience';
import { ProcessSection } from './components/ProcessSection';
import { PortfolioSection } from './components/PortfolioSection';
import { StatsSection } from './components/StatsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { ContactModal } from './components/ContactModal';
import { ProjectModal } from './components/ProjectModal';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';
import { CustomSectionRenderer } from './components/CustomSectionRenderer';
import { useSiteData } from './data/siteDataContext';
import { ProjectItem, UserProfile, AuthTab, isAuthorizedAdminEmail } from './types';

export default function App() {
  const { siteData } = useSiteData();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactDefaultService, setContactDefaultService] = useState('Shopify Plus Solutions');
  const [selectedCategory, setSelectedCategory] = useState('shopify');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Admin CMS Panel
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Authentication States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>('login');
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('tech_to_web_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'login' | 'logout' } | null>(null);

  // Strict Admin Check: Only authorized admin emails (techtowebadmin@gmail.com / techtoweadmin@gmail.com)
  const isAdmin = isAuthorizedAdminEmail(user?.email);

  const sectionVis = siteData?.sectionVisibility || {
    hero: true,
    stats: true,
    services: true,
    portfolio: true,
    digitalExp: true,
    process: true,
    testimonials: true,
    cta: true,
    footer: true
  };

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  // Clear toast after 4s
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleOpenAuth = (tab: AuthTab = 'login') => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  const handleSuccessAuth = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    try {
      localStorage.setItem('tech_to_web_user', JSON.stringify(authenticatedUser));
    } catch {
      // ignore
    }
    setToastMessage({
      title: `Welcome back, ${authenticatedUser.name}!`,
      desc: 'You are now signed in to the Tech To Web client portal.',
      type: 'login'
    });
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('tech_to_web_user');
    } catch {
      // ignore
    }
    setToastMessage({
      title: 'Logged Out Successfully',
      desc: 'You have been securely signed out of your account.',
      type: 'logout'
    });
  };

  const handleOpenContact = (serviceName?: string) => {
    if (serviceName) {
      setContactDefaultService(serviceName);
    }
    setIsContactOpen(true);
  };

  const handleServiceInquirySubmitted = (serviceName: string) => {
    if (user) {
      const currentServices = user.activeServices || [];
      const updatedUser: UserProfile = {
        ...user,
        serviceInterest: serviceName,
        activeServices: Array.from(new Set([...currentServices, serviceName])),
      };
      setUser(updatedUser);
      try {
        localStorage.setItem('tech_to_web_user', JSON.stringify(updatedUser));
      } catch {}
      setToastMessage({
        title: 'Service Added to Profile!',
        desc: `"${serviceName}" has been linked to your client dashboard.`,
        type: 'login'
      });
    }
  };

  const handleSelectServiceCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleExploreWork = () => {
    const el = document.getElementById('work');
    if (el) {
      const navOffset = 90;
      const pos = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top: pos, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface selection:bg-primary-fixed selection:text-primary relative overflow-x-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 right-4 sm:right-8 z-[120] max-w-sm w-full bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-black/10 flex items-start gap-3"
          >
            <div className={`p-2 rounded-xl shrink-0 ${toastMessage.type === 'login' ? 'bg-emerald-100 text-emerald-600' : 'bg-neutral-100 text-neutral-600'}`}>
              {toastMessage.type === 'login' ? <CheckCircle2 className="w-5 h-5" /> : <LogOut className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-[#191c1d]">{toastMessage.title}</p>
              <p className="text-[11px] text-[#594139] mt-0.5">{toastMessage.desc}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-[#594139] hover:text-[#191c1d] text-xs font-bold p-1"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Navigation */}
      <Navbar
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* 1. Hero Section */}
        {sectionVis.hero && (
          <Hero
            onExploreWork={handleExploreWork}
            onSelectService={(cat) => {
              handleSelectServiceCategory(cat);
              const el = document.getElementById('services');
              if (el) {
                const navOffset = 90;
                const pos = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
                window.scrollTo({ top: pos, behavior: 'smooth' });
              }
            }}
          />
        )}

        {/* 2. Floating Service Navigation Ribbon */}
        {sectionVis.services && (
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20">
            <FloatingServicePanel
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectServiceCategory}
            />
          </div>
        )}

        {/* 3. Core Service Pillars & Category Breakdown */}
        {sectionVis.services && (
          <CoreExpertise
            selectedCategory={selectedCategory}
            onSelectService={(cat) => {
              handleSelectServiceCategory(cat);
            }}
            onStartProjectForService={(svc) => handleOpenContact(svc)}
          />
        )}

        {/* 4. Digital Experience & Video Showcase */}
        {sectionVis.digitalExp && (
          <DigitalExperience onStartProject={() => handleOpenContact('Enterprise Web Architecture')} />
        )}

        {/* Custom Dynamic Sections created in Admin */}
        {siteData?.sections &&
          siteData.sections.length > 0 &&
          siteData.sections.map((sec) => (
            <CustomSectionRenderer
              key={sec.id}
              section={sec}
              onActionClick={(action) => handleOpenContact(action)}
            />
          ))}

        {/* 6. 6-Phase Engineering Lifecycle Process */}
        {sectionVis.process && (
          <ProcessSection onStartProject={() => handleOpenContact('Phase 1 Discovery & Architecture')} />
        )}

        {/* 7. Case Studies & Impact Portfolio */}
        {sectionVis.portfolio && (
          <PortfolioSection onSelectProject={(project) => setSelectedProject(project)} />
        )}

        {/* 8. Impact Numbers & Telemetry Counters */}
        {sectionVis.stats && <StatsSection />}

        {/* 9. Verified Partner Testimonials */}
        {sectionVis.testimonials && <TestimonialsSection />}

        {/* 10. High-Velocity Action Banner */}
        {sectionVis.cta && (
          <CTASection onStartProject={() => handleOpenContact('Comprehensive Digital Transformation')} />
        )}
      </main>

      {/* Global Footer */}
      {sectionVis.footer && (
        <Footer
          onStartProject={() => handleOpenContact('General Partnership')}
          onSelectService={(cat) => handleSelectServiceCategory(cat)}
        />
      )}

      {/* Floating CMS Admin Quick Access Button (Only visible if logged in as techtowebadmin@gmail.com) */}
      {isAdmin && (
        <div className="fixed bottom-6 left-6 z-40">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#191c1d] text-white text-xs font-mono font-bold shadow-2xl border border-amber-400/40 hover:bg-primary transition-all cursor-pointer backdrop-blur-md"
            title="Open Admin CMS Control Panel"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin CMS</span>
          </motion.button>
        </div>
      )}

      {/* Admin CMS Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentUser={user}
        onOpenLogin={() => handleOpenAuth('login')}
      />

      {/* Modals */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        defaultService={contactDefaultService}
        onServiceInquirySubmitted={handleServiceInquirySubmitted}
      />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onStartProject={() => {
          const title = selectedProject?.title;
          setSelectedProject(null);
          handleOpenContact(title ? `Architecture like ${title}` : 'Bespoke Project');
        }}
      />

      {/* Login & Sign Up Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialTab={authTab}
        onSuccessAuth={handleSuccessAuth}
      />
    </div>
  );
}

