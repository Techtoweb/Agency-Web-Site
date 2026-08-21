import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
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
import { doc, getDoc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { playNotificationChime } from '../utils/sound';

const STORAGE_KEY = 'tech_to_web_cms_store_v1';

const DEFAULT_SETTINGS: SiteSettingsConfig = {
  agencyName: 'Tech To Web',
  tagline: 'High-Performance E-Commerce & Full Stack Digital Engineering',
  logoUrl: '',
  email: 'techtowebadmin@gmail.com',
  phone: '+1 (800) 555-0199',
  whatsapp: '+1 (800) 555-0199',
  address: 'San Francisco, CA & Global Remote Edge Nodes',
  footerNote: 'All systems monitored and verified with 99.99% enterprise uptime SLA.',
  notificationSound: true
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
      id: 'order_initial_1',
      type: 'order',
      name: 'Rahman Chowdhury',
      email: 'rahman@zeynvero.shop',
      phone: '+880 1711 234567',
      whatsapp: '+880 1711 234567',
      company: 'Zeynvero Streetwear',
      website: 'https://zeynvero.shop',
      service: 'Shopify Solutions',
      subService: 'Shopify Store Design',
      servicePrice: '$299',
      budget: '$299',
      timeline: '3-5 Days',
      message: 'Looking to redesign our luxury streetwear lookbook and configure Shopify Markets for GCC rollout.',
      status: 'new',
      isRead: false,
      createdAt: '2026-08-18 10:30',
      timestamp: Date.now() - 172800000
    },
    {
      id: 'order_initial_2',
      type: 'order',
      name: 'Tariq Al-Mansoor',
      email: 'tariq@gulfvibes.store',
      phone: '+971 50 123 4567',
      whatsapp: '+971 50 123 4567',
      company: 'Gulf Vibes Official',
      website: 'https://gulfvibes.store',
      service: 'Payment Gateway Solutions',
      subService: 'USA LLC Formation & Payment Gateway Setup',
      servicePrice: '$450',
      budget: '$450',
      timeline: '10-14 Business Days',
      message: 'Need complete Wyoming LLC + Stripe US and Mercury bank setup for our luxury fragrance storefront.',
      status: 'in_progress',
      isRead: true,
      createdAt: '2026-08-17 16:45',
      timestamp: Date.now() - 259200000
    }
  ]
};

interface SiteDataContextType {
  siteData: SiteDataState;
  saveSiteData: (newData: SiteDataState) => Promise<{ success: boolean; cloudSaved: boolean; error?: string }>;
  isSyncing: boolean;
  dbStatus: 'connected' | 'syncing' | 'error' | 'offline';
  dbError: string | null;
  lastSyncedAt: string | null;
  testDbConnection: () => Promise<{ ok: boolean; message: string }>;
  generateAgencyDataTsCode: (overrideData?: SiteDataState) => string;
  updateHero: (hero: Partial<HeroContentConfig>) => void;
  updateSiteSettings: (settings: Partial<SiteSettingsConfig>) => void;
  // Category management
  addCategory: (category: ServiceCategoryDetail) => void;
  updateCategory: (id: string, category: Partial<ServiceCategoryDetail>) => void;
  deleteCategory: (id: string) => void;
  updateCategoryPrice: (categoryId: string, startingPrice: string, deliveryTime?: string) => void;
  // Subservice management & Dynamic Pricing
  addSubService: (categoryId: string, sub: SubServiceItem) => void;
  updateSubService: (categoryId: string, sub: SubServiceItem) => void;
  deleteSubService: (categoryId: string, subId: string) => void;
  updateSubServicePrice: (
    categoryId: string,
    subId: string,
    price: string,
    deliveryTime?: string,
    pricingType?: 'fixed' | 'starting' | 'monthly' | 'hourly' | 'custom',
    badge?: string
  ) => void;
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
  // Orders & Leads management
  unreadOrdersCount: number;
  addLead: (lead: Omit<LeadInquiry, 'id' | 'createdAt' | 'status'>) => Promise<LeadInquiry>;
  updateLeadStatus: (id: string, status: LeadInquiry['status']) => void;
  markLeadAsRead: (id: string, isRead?: boolean) => void;
  updateLeadNotes: (id: string, notes: string) => void;
  deleteLead: (id: string) => void;
  // Sound trigger
  triggerNotificationSound: () => void;
  // Reset & Backup
  resetToDefaults: () => void;
  importJsonData: (jsonStr: string) => boolean;
  exportJsonData: () => string;
}

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

// Helper to remove any undefined values before sending to Firebase Firestore
const sanitizeForFirestore = (obj: any): any => {
  if (obj === undefined) return null;
  if (obj === null) return null;
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForFirestore);
  }
  if (typeof obj === 'object') {
    const res: any = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val !== undefined) {
        res[key] = sanitizeForFirestore(val);
      }
    }
    return res;
  }
  return obj;
};

export const SiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'syncing' | 'error' | 'offline'>('connected');
  const [dbError, setDbError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const previousLeadCountRef = useRef<number>(0);

  const [siteData, setSiteData] = useState<SiteDataState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedCats = parsed.categories && parsed.categories.length > 0 ? parsed.categories : INITIAL_STATE.categories;
        // Merge any new default categories like payment-gateway if not present
        const mergedCats = [...savedCats];
        INITIAL_STATE.categories.forEach((defaultCat) => {
          const existingIdx = mergedCats.findIndex((c: ServiceCategoryDetail) => c.id === defaultCat.id);
          if (existingIdx === -1) {
            mergedCats.push(defaultCat);
          } else {
            // Keep prices if missing
            if (!mergedCats[existingIdx].startingPrice && defaultCat.startingPrice) {
              mergedCats[existingIdx].startingPrice = defaultCat.startingPrice;
            }
            if (!mergedCats[existingIdx].deliveryTime && defaultCat.deliveryTime) {
              mergedCats[existingIdx].deliveryTime = defaultCat.deliveryTime;
            }
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

  const unreadOrdersCount = useMemo(() => {
    return siteData.leads.filter((l) => l.isRead === false || (!l.isRead && l.status === 'new')).length;
  }, [siteData.leads]);

  const triggerNotificationSound = () => {
    if (siteData.siteSettings.notificationSound !== false) {
      playNotificationChime();
    }
  };

  // Test Firestore Connection explicitly
  const testDbConnection = async (): Promise<{ ok: boolean; message: string }> => {
    try {
      const docRef = doc(db, 'site_cms', 'main_config');
      const snapshot = await getDoc(docRef);
      setDbStatus('connected');
      setDbError(null);
      return {
        ok: true,
        message: snapshot.exists()
          ? 'Connected to Firestore. Cloud database record found and synced.'
          : 'Connected to Firestore. Ready for initial sync.'
      };
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to communicate with Firestore.';
      setDbStatus('error');
      setDbError(errMsg);
      return { ok: false, message: errMsg };
    }
  };

  // Initial load from Firestore with direct getDoc + onSnapshot listener
  useEffect(() => {
    let isMounted = true;

    const initFirestore = async () => {
      try {
        const mainDocRef = doc(db, 'site_cms', 'main_config');
        const projectsDocRef = doc(db, 'site_cms', 'projects_data');
        const categoriesDocRef = doc(db, 'site_cms', 'categories_data');

        // 1. Direct parallel fetch for fast bootstrap on fresh machines / after git clone
        const [mainSnap, projectsSnap, categoriesSnap] = await Promise.all([
          getDoc(mainDocRef).catch(() => null),
          getDoc(projectsDocRef).catch(() => null),
          getDoc(categoriesDocRef).catch(() => null)
        ]);

        const remoteMain = mainSnap && mainSnap.exists() ? (mainSnap.data() as Partial<SiteDataState>) : {};
        const remoteProjects = projectsSnap && projectsSnap.exists() ? projectsSnap.data()?.projects : null;
        const remoteCategories = categoriesSnap && categoriesSnap.exists() ? categoriesSnap.data()?.categories : null;

        const remoteData: Partial<SiteDataState> = {
          ...remoteMain,
          ...(remoteProjects ? { projects: remoteProjects } : {}),
          ...(remoteCategories ? { categories: remoteCategories } : {})
        };

        if (Object.keys(remoteData).length > 0 && isMounted) {
          setSiteData((prev) => {
            const localTimestamp = prev.lastUpdated || 0;
            const remoteTimestamp = remoteData.lastUpdated || 0;
            if (remoteTimestamp > 0 && remoteTimestamp < localTimestamp) {
              return prev;
            }
            const merged: SiteDataState = {
              ...prev,
              ...remoteData,
              lastUpdated: Math.max(localTimestamp, remoteTimestamp),
              hero: { ...prev.hero, ...(remoteData.hero || {}) },
              siteSettings: { ...prev.siteSettings, ...(remoteData.siteSettings || {}) },
              sectionsVisibility: { ...prev.sectionsVisibility, ...(remoteData.sectionsVisibility || {}) },
              categories: remoteData.categories && remoteData.categories.length > 0 ? remoteData.categories : prev.categories,
              projects: remoteData.projects && remoteData.projects.length > 0 ? remoteData.projects : prev.projects,
              stats: remoteData.stats && remoteData.stats.length > 0 ? remoteData.stats : prev.stats,
              processSteps: remoteData.processSteps && remoteData.processSteps.length > 0 ? remoteData.processSteps : prev.processSteps,
              testimonials: remoteData.testimonials && remoteData.testimonials.length > 0 ? remoteData.testimonials : prev.testimonials,
              customSections: remoteData.customSections || prev.customSections,
              leads: remoteData.leads || prev.leads
            };
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            } catch {}
            return merged;
          });
          setDbStatus('connected');
          setLastSyncedAt(new Date().toLocaleTimeString());
        }
      } catch (err: any) {
        console.info('Initial Firestore fetch status:', err?.message || 'Local cache active');
        if (isMounted) {
          if (err?.code === 'permission-denied') {
            setDbStatus('error');
            setDbError('Firestore permission denied. Check your Firebase security rules.');
          } else {
            setDbStatus('offline');
          }
        }
      }
    };

    initFirestore();

    // 2. Real-time onSnapshot subscription for live multi-tab & multi-device updates
    try {
      const docRef = doc(db, 'site_cms', 'main_config');
      const projectsDocRef = doc(db, 'site_cms', 'projects_data');

      const unsubscribeMain = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists() && isMounted) {
            const remoteData = snapshot.data() as Partial<SiteDataState>;
            if (remoteData && Object.keys(remoteData).length > 0) {
              setSiteData((prev) => {
                const localTimestamp = prev.lastUpdated || 0;
                const remoteTimestamp = remoteData.lastUpdated || 0;
                if (remoteTimestamp > 0 && remoteTimestamp < localTimestamp) {
                  return prev;
                }

                // Check if new leads arrived
                if (remoteData.leads && remoteData.leads.length > (prev.leads?.length || 0)) {
                  if (previousLeadCountRef.current > 0 && remoteData.leads.length > previousLeadCountRef.current) {
                    triggerNotificationSound();
                  }
                  previousLeadCountRef.current = remoteData.leads.length;
                }

                const merged: SiteDataState = {
                  ...prev,
                  ...remoteData,
                  lastUpdated: Math.max(localTimestamp, remoteTimestamp),
                  hero: { ...prev.hero, ...(remoteData.hero || {}) },
                  siteSettings: { ...prev.siteSettings, ...(remoteData.siteSettings || {}) },
                  sectionsVisibility: { ...prev.sectionsVisibility, ...(remoteData.sectionsVisibility || {}) },
                  categories: remoteData.categories || prev.categories,
                  projects: remoteData.projects || prev.projects,
                  stats: remoteData.stats || prev.stats,
                  processSteps: remoteData.processSteps || prev.processSteps,
                  testimonials: remoteData.testimonials || prev.testimonials,
                  customSections: remoteData.customSections || prev.customSections,
                  leads: remoteData.leads || prev.leads
                };
                try {
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
                } catch {}
                return merged;
              });
              setDbStatus('connected');
              setDbError(null);
              setLastSyncedAt(new Date().toLocaleTimeString());
            }
          }
        },
        (err) => {
          console.warn('Firestore onSnapshot subscription notice:', err.message);
        }
      );

      const unsubscribeProjects = onSnapshot(
        projectsDocRef,
        (snapshot) => {
          if (snapshot.exists() && isMounted) {
            const data = snapshot.data();
            if (data?.projects && Array.isArray(data.projects) && data.projects.length > 0) {
              setSiteData((prev) => {
                const merged: SiteDataState = {
                  ...prev,
                  projects: data.projects
                };
                try {
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
                } catch {}
                return merged;
              });
            }
          }
        },
        () => {}
      );

      return () => {
        isMounted = false;
        unsubscribeMain();
        unsubscribeProjects();
      };
    } catch (e) {
      console.warn('Could not initialize onSnapshot listener:', e);
    }
  }, []);

  // Update Hero Content
  const updateHero = (heroUpdates: Partial<HeroContentConfig>) => {
    setSiteData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        ...heroUpdates
      }
    }));
  };

  // Update Site Settings
  const updateSiteSettings = (settingsUpdates: Partial<SiteSettingsConfig>) => {
    setSiteData((prev) => ({
      ...prev,
      siteSettings: {
        ...prev.siteSettings,
        ...settingsUpdates
      }
    }));
  };

  // Category management
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

  const updateCategoryPrice = (categoryId: string, startingPrice: string, deliveryTime?: string) => {
    setSiteData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              startingPrice,
              ...(deliveryTime ? { deliveryTime } : {})
            }
          : cat
      )
    }));
  };

  const deleteCategory = (id: string) => {
    setSiteData((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat.id !== id)
    }));
  };

  // Subservice management & Dynamic Pricing
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

  const updateSubService = (categoryId: string, updatedSub: SubServiceItem) => {
    setSiteData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subServices: cat.subServices.map((sub) => (sub.id === updatedSub.id ? updatedSub : sub))
          };
        }
        return cat;
      })
    }));
  };

  const updateSubServicePrice = (
    categoryId: string,
    subId: string,
    price: string,
    deliveryTime?: string,
    pricingType?: 'fixed' | 'starting' | 'monthly' | 'hourly' | 'custom',
    badge?: string
  ) => {
    setSiteData((prev) => {
      const updatedCategories = prev.categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subServices: cat.subServices.map((sub) => {
              if (sub.id === subId) {
                return {
                  ...sub,
                  price,
                  ...(deliveryTime !== undefined ? { deliveryTime } : {}),
                  ...(pricingType !== undefined ? { pricingType } : {}),
                  ...(badge !== undefined ? { badge } : {})
                };
              }
              return sub;
            })
          };
        }
        return cat;
      });

      const updated = {
        ...prev,
        categories: updatedCategories,
        lastUpdated: Date.now()
      };

      // Also persist to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}

      return updated;
    });
  };

  const deleteSubService = (categoryId: string, subId: string) => {
    setSiteData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subServices: cat.subServices.filter((sub) => sub.id !== subId)
          };
        }
        return cat;
      })
    }));
  };

  // Projects management
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

  // Stats management
  const updateStats = (stats: StatItem[]) => {
    setSiteData((prev) => ({
      ...prev,
      stats
    }));
  };

  // Process steps management
  const updateProcessSteps = (steps: ProcessStep[]) => {
    setSiteData((prev) => ({
      ...prev,
      processSteps: steps
    }));
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

  // Testimonials management
  const updateTestimonials = (testimonials: TestimonialItem[]) => {
    setSiteData((prev) => ({
      ...prev,
      testimonials
    }));
  };

  const addTestimonial = (item: TestimonialItem) => {
    setSiteData((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, item]
    }));
  };

  const deleteTestimonial = (id: string) => {
    setSiteData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((t) => t.id !== id)
    }));
  };

  // Sections visibility & custom pages
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

  // Orders & Leads management
  const addLead = async (leadData: Omit<LeadInquiry, 'id' | 'createdAt' | 'status'>): Promise<LeadInquiry> => {
    const timestamp = Date.now();
    const newLead: LeadInquiry = {
      ...leadData,
      id: 'order_' + timestamp,
      status: 'new',
      isRead: false,
      createdAt: new Date().toLocaleString(),
      timestamp
    };

    // Play notification sound chime for real-time feedback
    triggerNotificationSound();

    // 1. Update React state immediately
    setSiteData((prev) => {
      const updated = {
        ...prev,
        leads: [newLead, ...prev.leads],
        lastUpdated: timestamp
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 2. Persist to Firestore: both in site_cms/main_config AND individual service_orders doc
    try {
      const sanitized = sanitizeForFirestore(newLead);
      const orderDocRef = doc(db, 'service_orders', newLead.id);
      await setDoc(orderDocRef, sanitized);

      // Also sync site_cms main config
      const docRef = doc(db, 'site_cms', 'main_config');
      await setDoc(
        docRef,
        {
          leads: sanitizeForFirestore([newLead, ...siteData.leads]),
          lastUpdated: timestamp
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Direct Firestore order backup notice (local storage preserved):', err);
    }

    return newLead;
  };

  const updateLeadStatus = (id: string, status: LeadInquiry['status']) => {
    setSiteData((prev) => {
      const updatedLeads = prev.leads.map((l) => (l.id === id ? { ...l, status } : l));
      const updated = {
        ...prev,
        leads: updatedLeads,
        lastUpdated: Date.now()
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      // Sync to Firestore in background
      try {
        const docRef = doc(db, 'site_cms', 'main_config');
        setDoc(docRef, { leads: sanitizeForFirestore(updatedLeads), lastUpdated: Date.now() }, { merge: true });
        const singleOrderRef = doc(db, 'service_orders', id);
        setDoc(singleOrderRef, { status }, { merge: true });
      } catch {}
      return updated;
    });
  };

  const markLeadAsRead = (id: string, isRead: boolean = true) => {
    setSiteData((prev) => {
      const updatedLeads = prev.leads.map((l) => (l.id === id ? { ...l, isRead } : l));
      const updated = {
        ...prev,
        leads: updatedLeads,
        lastUpdated: Date.now()
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      try {
        const docRef = doc(db, 'site_cms', 'main_config');
        setDoc(docRef, { leads: sanitizeForFirestore(updatedLeads), lastUpdated: Date.now() }, { merge: true });
        const singleOrderRef = doc(db, 'service_orders', id);
        setDoc(singleOrderRef, { isRead }, { merge: true });
      } catch {}
      return updated;
    });
  };

  const updateLeadNotes = (id: string, notes: string) => {
    setSiteData((prev) => {
      const updatedLeads = prev.leads.map((l) => (l.id === id ? { ...l, notes } : l));
      const updated = {
        ...prev,
        leads: updatedLeads,
        lastUpdated: Date.now()
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      try {
        const docRef = doc(db, 'site_cms', 'main_config');
        setDoc(docRef, { leads: sanitizeForFirestore(updatedLeads), lastUpdated: Date.now() }, { merge: true });
        const singleOrderRef = doc(db, 'service_orders', id);
        setDoc(singleOrderRef, { notes }, { merge: true });
      } catch {}
      return updated;
    });
  };

  const deleteLead = (id: string) => {
    setSiteData((prev) => {
      const updatedLeads = prev.leads.filter((l) => l.id !== id);
      const updated = {
        ...prev,
        leads: updatedLeads,
        lastUpdated: Date.now()
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      try {
        const docRef = doc(db, 'site_cms', 'main_config');
        setDoc(docRef, { leads: sanitizeForFirestore(updatedLeads), lastUpdated: Date.now() }, { merge: true });
        const singleOrderRef = doc(db, 'service_orders', id);
        deleteDoc(singleOrderRef).catch(() => {});
      } catch {}
      return updated;
    });
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

  const generateAgencyDataTsCode = (overrideData?: SiteDataState): string => {
    const data = overrideData || siteData;
    const heroObj = {
      badge: data.hero.badge,
      titlePrimary: data.hero.titlePrimary,
      titleHighlight: data.hero.titleHighlight,
      titleSecondary: data.hero.titleSecondary,
      subtitle: data.hero.subtitle,
      ctaPrimary: data.hero.ctaPrimary,
      ctaSecondary: data.hero.ctaSecondary,
      heroImage: data.hero.heroImage,
      avatars: HERO_DATA.avatars,
      statsBadge: data.hero.statsBadge
    };

    return `import { ServiceItem, ProjectItem, ProcessStep, StatItem, TestimonialItem, ServiceCategory, ServiceCategoryDetail, SubServiceItem } from '../types';

import zeynveroImg from '../assets/images/zeynvero_real_screenshot_1787051613095.jpg';
import gulfvibesImg from '../assets/images/gulfvibes_real_screenshot_1787051627201.jpg';
import clevaraImg from '../assets/images/clevara_real_screenshot_1787051641052.jpg';
import furpupImg from '../assets/images/furpup_real_screenshot_1787051654567.jpg';
import pelicanImg from '../assets/images/pelican_real_screenshot_1787051675724.jpg';
import nextvaultImg from '../assets/images/nextvault_real_screenshot_1787051690648.jpg';
import grifigoImg from '../assets/images/grifigo_real_screenshot_1787051703379.jpg';

export const HERO_DATA = ${JSON.stringify(heroObj, null, 2)};

export const SERVICES_CATEGORIES: ServiceCategoryDetail[] = ${JSON.stringify(data.categories, null, 2)};

export const PORTFOLIO_PROJECTS: ProjectItem[] = ${JSON.stringify(data.projects, null, 2)};

export const PROCESS_STEPS: ProcessStep[] = ${JSON.stringify(data.processSteps, null, 2)};

export const STATS_ITEMS: StatItem[] = ${JSON.stringify(data.stats, null, 2)};

export const TESTIMONIALS: TestimonialItem[] = ${JSON.stringify(data.testimonials, null, 2)};
`;
  };

  const saveSiteData = async (newData: SiteDataState): Promise<{ success: boolean; cloudSaved: boolean; error?: string }> => {
    setIsSyncing(true);
    const updatedState: SiteDataState = {
      ...newData,
      lastUpdated: Date.now()
    };

    // 1. Update React state immediately
    setSiteData(updatedState);

    // 2. Persist to LocalStorage immediately for instant offline reliability
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
    } catch (e) {
      console.error('LocalStorage save error:', e);
    }

    // 3. Persist to Firebase Firestore with multi-document segmentation (ensures zero document size limit errors)
    try {
      const sanitized = sanitizeForFirestore(updatedState);
      const mainDocRef = doc(db, 'site_cms', 'main_config');
      const projectsDocRef = doc(db, 'site_cms', 'projects_data');
      const categoriesDocRef = doc(db, 'site_cms', 'categories_data');

      // Save main config, dedicated projects doc, and dedicated categories doc in parallel
      await Promise.all([
        setDoc(mainDocRef, sanitized, { merge: true }),
        setDoc(projectsDocRef, { projects: sanitizeForFirestore(updatedState.projects), lastUpdated: Date.now() }, { merge: true }),
        setDoc(categoriesDocRef, { categories: sanitizeForFirestore(updatedState.categories), lastUpdated: Date.now() }, { merge: true })
      ]);
      
      setDbStatus('connected');
      setDbError(null);
      setLastSyncedAt(new Date().toLocaleTimeString());
      setIsSyncing(false);
      return { success: true, cloudSaved: true };
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to save to Firebase Firestore.';
      console.warn('Firestore sync error:', errMsg);
      
      setDbStatus('error');
      setDbError(errMsg);
      setIsSyncing(false);
      return {
        success: true,
        cloudSaved: false,
        error: errMsg
      };
    }
  };

  return (
    <SiteDataContext.Provider
      value={{
        siteData,
        saveSiteData,
        isSyncing,
        dbStatus,
        dbError,
        lastSyncedAt,
        testDbConnection,
        generateAgencyDataTsCode,
        updateHero,
        updateSiteSettings,
        addCategory,
        updateCategory,
        deleteCategory,
        updateCategoryPrice,
        addSubService,
        updateSubService,
        deleteSubService,
        updateSubServicePrice,
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
        unreadOrdersCount,
        addLead,
        updateLeadStatus,
        markLeadAsRead,
        updateLeadNotes,
        deleteLead,
        triggerNotificationSound,
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
