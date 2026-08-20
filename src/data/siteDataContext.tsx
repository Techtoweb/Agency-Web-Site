import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SiteDataState,
  HeroContentConfig,
  SiteSettingsConfig,
  ServiceCategoryDetail,
  SubServiceItem,
  ProjectItem,
  StatItem,
  ProcessStep,
  TestimonialItem,
  SectionVisibilityConfig,
  CustomPageSection,
  LeadInquiry
} from '../types';
import {
  HERO_DATA,
  SERVICES_CATEGORIES,
  PORTFOLIO_PROJECTS,
  PROCESS_STEPS,
  STATS_ITEMS,
  TESTIMONIALS
} from './agencyData';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const STORAGE_KEY = 'tech_to_web_cms_store_v1';

const DEFAULT_SETTINGS: SiteSettingsConfig = {
  agencyName: 'Tech To Web',
  tagline: 'High-Performance E-Commerce & Full Stack Digital Engineering',
  logoUrl: '',
  email: 'techtowebadmin@gmail.com',
  phone: '+1 (800) 555-0199',
  whatsapp: '+1 (800) 555-0199',
  address: 'San Francisco, CA & Global Remote Edge Nodes',
  footerNote: 'All systems monitored and verified with 99.99% enterprise uptime SLA.'
};

const DEFAULT_SECTIONS_VISIBILITY: SectionVisibilityConfig = {
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

const INITIAL_STATE: SiteDataState = {
  hero: {
    badge: HERO_DATA.badge,
    titlePrimary: HERO_DATA.titlePrimary,
    titleHighlight: HERO_DATA.titleHighlight,
    titleSecondary: HERO_DATA.titleSecondary,
    subtitle: HERO_DATA.subtitle,
    ctaPrimary: HERO_DATA.ctaPrimary,
    ctaSecondary: HERO_DATA.ctaSecondary,
    heroImage: HERO_DATA.heroImage,
    statsBadge: HERO_DATA.statsBadge
  },
  siteSettings: DEFAULT_SETTINGS,
  categories: SERVICES_CATEGORIES,
  projects: PORTFOLIO_PROJECTS,
  stats: STATS_ITEMS,
  processSteps: PROCESS_STEPS,
  testimonials: TESTIMONIALS,
  sectionsVisibility: DEFAULT_SECTIONS_VISIBILITY,
  customSections: [],
  leads: [
    {
      id: 'lead_initial_1',
      type: 'contact',
      name: 'Rahman Chowdhury',
      email: 'rahman@zeynvero.shop',
      company: 'Zeynvero Streetwear',
      service: 'Shopify Plus Solutions',
      budget: '$10,000 - $25,000',
      message: 'Looking to redesign our luxury streetwear lookbook and configure Shopify Markets for GCC rollout.',
      status: 'new',
      createdAt: '2026-08-18 10:30'
    },
    {
      id: 'lead_initial_2',
      type: 'proposal',
      name: 'Tariq Al-Mansoor',
      email: 'tariq@gulfvibes.store',
      company: 'Gulf Vibes Official',
      service: 'Web Dev & Apps',
      budget: '$25,000 - $50,000',
      timeline: '4-8 Weeks',
      message: 'Need bespoke Hydrogen 2.0 storefront with sub-second page loads across UAE and Saudi Arabia.',
      status: 'in_progress',
      createdAt: '2026-08-17 16:45'
    }
  ]
};

interface SiteDataContextType {
  siteData: SiteDataState;
  saveSiteData: (newData: SiteDataState) => Promise<boolean>;
  isSyncing: boolean;
  updateHero: (hero: Partial<HeroContentConfig>) => void;
  updateSiteSettings: (settings: Partial<SiteSettingsConfig>) => void;
  // Category management
  addCategory: (category: ServiceCategoryDetail) => void;
  updateCategory: (id: string, category: Partial<ServiceCategoryDetail>) => void;
  deleteCategory: (id: string) => void;
  // Subservice management
  addSubService: (categoryId: string, sub: SubServiceItem) => void;
  updateSubService: (categoryId: string, sub: SubServiceItem) => void;
  deleteSubService: (categoryId: string, subId: string) => void;
  // Projects management
  addProject: (project: ProjectItem) => void;
  updateProject: (id: string, project: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
  // Stats management
  updateStats: (stats: StatItem[]) => void;
  // Process steps management
  updateProcessSteps: (steps: ProcessStep[]) => void;
  addProcessStep: (step: ProcessStep) => void;
  deleteProcessStep: (number: string) => void;
  // Testimonials management
  updateTestimonials: (testimonials: TestimonialItem[]) => void;
  addTestimonial: (item: TestimonialItem) => void;
  deleteTestimonial: (id: string) => void;
  // Sections visibility & custom pages
  toggleSectionVisibility: (sectionKey: keyof SectionVisibilityConfig, isVisible: boolean) => void;
  addCustomSection: (section: CustomPageSection) => void;
  updateCustomSection: (id: string, section: Partial<CustomPageSection>) => void;
  deleteCustomSection: (id: string) => void;
  // Leads management
  addLead: (lead: Omit<LeadInquiry, 'id' | 'createdAt' | 'status'>) => void;
  updateLeadStatus: (id: string, status: LeadInquiry['status']) => void;
  deleteLead: (id: string) => void;
  // Reset & Backup
  resetToDefaults: () => void;
  importJsonData: (jsonStr: string) => boolean;
  exportJsonData: () => string;
}

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

export const SiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [siteData, setSiteData] = useState<SiteDataState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedCats = parsed.categories && parsed.categories.length > 0 ? parsed.categories : INITIAL_STATE.categories;
        // Merge any new default categories like payment-gateway if not present
        const mergedCats = [...savedCats];
        INITIAL_STATE.categories.forEach((defaultCat) => {
          if (!mergedCats.some((c: ServiceCategoryDetail) => c.id === defaultCat.id)) {
            mergedCats.push(defaultCat);
          }
        });

        return {
          ...INITIAL_STATE,
          ...parsed,
          hero: { ...INITIAL_STATE.hero, ...(parsed.hero || {}) },
          siteSettings: { ...INITIAL_STATE.siteSettings, ...(parsed.siteSettings || {}) },
          sectionsVisibility: { ...INITIAL_STATE.sectionsVisibility, ...(parsed.sectionsVisibility || {}) },
          categories: mergedCats,
          projects: parsed.projects && parsed.projects.length > 0 ? parsed.projects : INITIAL_STATE.projects,
          stats: parsed.stats && parsed.stats.length > 0 ? parsed.stats : INITIAL_STATE.stats,
          processSteps: parsed.processSteps && parsed.processSteps.length > 0 ? parsed.processSteps : INITIAL_STATE.processSteps,
          testimonials: parsed.testimonials && parsed.testimonials.length > 0 ? parsed.testimonials : INITIAL_STATE.testimonials,
          customSections: parsed.customSections || [],
          leads: parsed.leads || INITIAL_STATE.leads
        };
      }
    } catch (e) {
      console.warn('Failed to load CMS data from localStorage:', e);
    }
    return INITIAL_STATE;
  });

  // Initial load from Firestore with conflict resolution (only apply if remote is newer)
  useEffect(() => {
    try {
      const docRef = doc(db, 'site_cms', 'main_config');
      const unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const remoteData = snapshot.data() as Partial<SiteDataState>;
            if (remoteData && Object.keys(remoteData).length > 0) {
              setSiteData((prev) => {
                // If remote has a timestamp and it is NOT newer than local, ignore stale remote snapshot
                const localTimestamp = prev.lastUpdated || 0;
                const remoteTimestamp = remoteData.lastUpdated || 0;
                if (remoteTimestamp > 0 && remoteTimestamp < localTimestamp) {
                  return prev; // Keep current local data
                }

                return {
                  ...prev,
                  ...remoteData,
                  lastUpdated: Math.max(localTimestamp, remoteTimestamp),
                  hero: { ...prev.hero, ...(remoteData.hero || {}) },
                  siteSettings: { ...prev.siteSettings, ...(remoteData.siteSettings || {}) },
                  sectionsVisibility: { ...prev.sectionsVisibility, ...(remoteData.sectionsVisibility || {}) }
                };
              });
            }
          }
        },
        (err) => {
          console.info('Firestore subscription status:', err?.message || 'Offline local fallback active');
        }
      );

      return () => unsubscribe();
    } catch (e) {
      // Firestore listener fallback
    }
  }, []);

  const updateHero = (hero: Partial<HeroContentConfig>) => {
    setSiteData((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...hero }
    }));
  };

  const updateSiteSettings = (settings: Partial<SiteSettingsConfig>) => {
    setSiteData((prev) => ({
      ...prev,
      siteSettings: { ...prev.siteSettings, ...settings }
    }));
  };

  const addCategory = (category: ServiceCategoryDetail) => {
    setSiteData((prev) => ({
      ...prev,
      categories: [...prev.categories, category]
    }));
  };

  const updateCategory = (id: string, updated: Partial<ServiceCategoryDetail>) => {
    setSiteData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => (cat.id === id ? { ...cat, ...updated } : cat))
    }));
  };

  const deleteCategory = (id: string) => {
    setSiteData((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat.id !== id)
    }));
  };

  const addSubService = (categoryId: string, sub: SubServiceItem) => {
    setSiteData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subServices: [...cat.subServices, sub]
          };
        }
        return cat;
      })
    }));
  };

  const updateSubService = (categoryId: string, sub: SubServiceItem) => {
    setSiteData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subServices: cat.subServices.map((s) => (s.id === sub.id ? sub : s))
          };
        }
        return cat;
      })
    }));
  };

  const deleteSubService = (categoryId: string, subId: string) => {
    setSiteData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subServices: cat.subServices.filter((s) => s.id !== subId)
          };
        }
        return cat;
      })
    }));
  };

  const addProject = (project: ProjectItem) => {
    setSiteData((prev) => ({
      ...prev,
      projects: [project, ...prev.projects]
    }));
  };

  const updateProject = (id: string, updated: Partial<ProjectItem>) => {
    setSiteData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updated } : p))
    }));
  };

  const deleteProject = (id: string) => {
    setSiteData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id)
    }));
  };

  const updateStats = (stats: StatItem[]) => {
    setSiteData((prev) => ({ ...prev, stats }));
  };

  const updateProcessSteps = (steps: ProcessStep[]) => {
    setSiteData((prev) => ({ ...prev, processSteps: steps }));
  };

  const addProcessStep = (step: ProcessStep) => {
    setSiteData((prev) => ({
      ...prev,
      processSteps: [...prev.processSteps, step]
    }));
  };

  const deleteProcessStep = (number: string) => {
    setSiteData((prev) => ({
      ...prev,
      processSteps: prev.processSteps.filter((s) => s.number !== number)
    }));
  };

  const updateTestimonials = (testimonials: TestimonialItem[]) => {
    setSiteData((prev) => ({ ...prev, testimonials }));
  };

  const addTestimonial = (item: TestimonialItem) => {
    setSiteData((prev) => ({
      ...prev,
      testimonials: [item, ...prev.testimonials]
    }));
  };

  const deleteTestimonial = (id: string) => {
    setSiteData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((t) => t.id !== id)
    }));
  };

  const toggleSectionVisibility = (sectionKey: keyof SectionVisibilityConfig, isVisible: boolean) => {
    setSiteData((prev) => ({
      ...prev,
      sectionsVisibility: {
        ...prev.sectionsVisibility,
        [sectionKey]: isVisible
      }
    }));
  };

  const addCustomSection = (section: CustomPageSection) => {
    setSiteData((prev) => ({
      ...prev,
      customSections: [...prev.customSections, section]
    }));
  };

  const updateCustomSection = (id: string, updated: Partial<CustomPageSection>) => {
    setSiteData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((s) => (s.id === id ? { ...s, ...updated } : s))
    }));
  };

  const deleteCustomSection = (id: string) => {
    setSiteData((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((s) => s.id !== id)
    }));
  };

  const addLead = (leadData: Omit<LeadInquiry, 'id' | 'createdAt' | 'status'>) => {
    const newLead: LeadInquiry = {
      ...leadData,
      id: 'lead_' + Date.now(),
      status: 'new',
      createdAt: new Date().toLocaleString()
    };
    setSiteData((prev) => ({
      ...prev,
      leads: [newLead, ...prev.leads]
    }));
  };

  const updateLeadStatus = (id: string, status: LeadInquiry['status']) => {
    setSiteData((prev) => ({
      ...prev,
      leads: prev.leads.map((l) => (l.id === id ? { ...l, status } : l))
    }));
  };

  const deleteLead = (id: string) => {
    setSiteData((prev) => ({
      ...prev,
      leads: prev.leads.filter((l) => l.id !== id)
    }));
  };

  const resetToDefaults = () => {
    setSiteData(INITIAL_STATE);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STATE));
  };

  const importJsonData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === 'object') {
        setSiteData((prev) => ({
          ...prev,
          ...parsed
        }));
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON import:', e);
    }
    return false;
  };

  const exportJsonData = (): string => {
    return JSON.stringify(siteData, null, 2);
  };

  const saveSiteData = async (newData: SiteDataState): Promise<boolean> => {
    setIsSyncing(true);
    const updatedState: SiteDataState = {
      ...newData,
      lastUpdated: Date.now()
    };

    try {
      setSiteData(updatedState);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
      } catch (e) {
        console.error('LocalStorage save error:', e);
      }

      // Explicit write to Firebase Firestore
      const docRef = doc(db, 'site_cms', 'main_config');
      await setDoc(docRef, updatedState, { merge: true });
      setIsSyncing(false);
      return true;
    } catch (err: any) {
      console.warn('Firestore sync notice (changes saved in local cache):', err?.message || err);
      setIsSyncing(false);
      return true;
    }
  };

  return (
    <SiteDataContext.Provider
      value={{
        siteData,
        saveSiteData,
        isSyncing,
        updateHero,
        updateSiteSettings,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubService,
        updateSubService,
        deleteSubService,
        addProject,
        updateProject,
        deleteProject,
        updateStats,
        updateProcessSteps,
        addProcessStep,
        deleteProcessStep,
        updateTestimonials,
        addTestimonial,
        deleteTestimonial,
        toggleSectionVisibility,
        addCustomSection,
        updateCustomSection,
        deleteCustomSection,
        addLead,
        updateLeadStatus,
        deleteLead,
        resetToDefaults,
        importJsonData,
        exportJsonData
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
};
