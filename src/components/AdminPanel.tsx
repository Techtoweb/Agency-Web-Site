import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Trash2,
  Edit3,
  Check,
  Layers,
  Briefcase,
  Sliders,
  FileText,
  Inbox,
  Settings,
  Eye,
  EyeOff,
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Download,
  Upload,
  RotateCcw,
  Search,
  ChevronDown,
  ChevronUp,
  Tag,
  Star,
  CheckCircle2,
  AlertCircle,
  Save,
  Database,
  Loader2,
  AlertTriangle,
  Code,
  Copy,
  Cloud,
  CloudOff,
  RefreshCw,
  FileCode,
  Bell,
  Volume2,
  VolumeX,
  MessageCircle,
  Mail,
  DollarSign,
  Clock,
  CreditCard,
  ShoppingCart,
  Phone,
  PhoneCall,
  Globe,
  Building,
  User,
  Calendar,
  CheckCheck
} from 'lucide-react';
import { useSiteData } from '../data/siteDataContext';
import { playNotificationChime } from '../utils/sound';
import { BrandLogo } from './BrandLogo';
import {
  ServiceCategoryDetail,
  SubServiceItem,
  ProjectItem,
  StatItem,
  TestimonialItem,
  ProcessStep,
  CustomPageSection,
  LeadInquiry,
  UserProfile,
  HeroContentConfig,
  SiteSettingsConfig,
  SectionVisibilityConfig,
  SiteDataState,
  isAuthorizedAdminEmail
} from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile | null;
  onOpenLogin?: () => void;
  initialTab?: AdminTab;
}

type AdminTab = 'services' | 'projects' | 'sections' | 'hero-content' | 'testimonials-process' | 'leads' | 'settings';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenLogin,
  initialTab
}) => {
  const {
    siteData,
    saveSiteData,
    deleteLead,
    markLeadAsRead,
    isSyncing,
    dbStatus,
    dbError,
    lastSyncedAt,
    testDbConnection,
    generateAgencyDataTsCode,
    resetToDefaults,
    importJsonData,
    exportJsonData
  } = useSiteData();

  // Local draft state: all changes stay staged until explicitly saved
  const [draftData, setDraftData] = useState<SiteDataState>(siteData);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  // Sync draft data whenever admin panel is opened with fresh siteData
  useEffect(() => {
    if (isOpen) {
      setDraftData(siteData);
    }
  }, [isOpen, siteData]);

  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(draftData) !== JSON.stringify(siteData);
  }, [draftData, siteData]);

  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab || 'services');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Strict Admin Check: Only authorized admin emails (techtowebadmin@gmail.com / techtoweadmin@gmail.com)
  const isAdmin = isAuthorizedAdminEmail(currentUser?.email);

  // Modals / Edit States
  const [editingCategory, setEditingCategory] = useState<ServiceCategoryDetail | null>(null);
  const [isNewCategoryModal, setIsNewCategoryModal] = useState(false);

  const [selectedCatForSub, setSelectedCatForSub] = useState<string | null>(null);
  const [editingSubService, setEditingSubService] = useState<{ categoryId: string; sub: SubServiceItem } | null>(null);
  const [isNewSubModal, setIsNewSubModal] = useState(false);

  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isNewProjectModal, setIsNewProjectModal] = useState(false);

  const [editingCustomSection, setEditingCustomSection] = useState<CustomPageSection | null>(null);
  const [isNewCustomSectionModal, setIsNewCustomSectionModal] = useState(false);

  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [isNewTestimonialModal, setIsNewTestimonialModal] = useState(false);

  const [editingStep, setEditingStep] = useState<ProcessStep | null>(null);
  const [isNewStepModal, setIsNewStepModal] = useState(false);

  const [jsonImportText, setJsonImportText] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<'all' | LeadInquiry['status']>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<LeadInquiry | null>(null);
  const [copiedTextType, setCopiedTextType] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyText = (text: string, typeName: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedTextType(typeName);
      showToast(`📋 ${typeName} ক্লিপবোর্ডে কপি হয়েছে!`);
      setTimeout(() => setCopiedTextType(null), 2000);
    } catch {
      showToast(`📋 ${text}`);
    }
  };

  const handleDeleteOrder = (orderId: string, clientName?: string) => {
    if (window.confirm(`Are you sure you want to delete the order from "${clientName || 'this customer'}"? This will permanently remove it from database.`)) {
      // Remove from draft
      deleteDraftLead(orderId);
      // Remove from Firestore & SiteDataContext immediately
      try {
        deleteLead(orderId);
      } catch (err) {
        console.warn('Failed direct deleteLead call:', err);
      }
      if (selectedOrderForModal?.id === orderId) {
        setSelectedOrderForModal(null);
      }
      showToast('🗑️ অর্ডারটি সফলভাবে ডাটাবেজ থেকে মুছে ফেলা হয়েছে!');
    }
  };

  const handleClearCompletedOrders = () => {
    const completed = draftData.leads.filter((l) => l.status === 'completed');
    if (completed.length === 0) {
      showToast('কোনো কমপ্লিটেড অর্ডার নেই।');
      return;
    }
    if (window.confirm(`আপনি কি সব (${completed.length}টি) কমপ্লিটেড অর্ডার ডাটাবেজ থেকে মুছে ফেলতে চান?`)) {
      completed.forEach((c) => {
        deleteDraftLead(c.id);
        try {
          deleteLead(c.id);
        } catch {}
      });
      showToast(`🗑️ ${completed.length}টি কমপ্লিটেড অর্ডার মুছে ফেলা হয়েছে!`);
    }
  };

  // Explicit Save Function to Firestore and Local Storage
  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    try {
      const result = await saveSiteData(draftData);
      if (result.cloudSaved) {
        showToast('✓ সব পরিবর্তন ক্লাউড ডাটাবেজ (Firestore) ও লোকাল স্টোরেজে সফলভাবে সেভ করা হয়েছে!');
      } else {
        showToast(`✓ লোকাল স্টোরেজে সেভ হয়েছে (${result.error || 'Firestore offline'})`);
      }
    } catch (err: any) {
      showToast('✓ Changes saved locally.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestDatabaseConnection = async () => {
    setIsTestingDb(true);
    const res = await testDbConnection();
    setIsTestingDb(false);
    if (res.ok) {
      showToast('🟢 ' + res.message);
    } else {
      showToast('🔴 Database error: ' + res.message);
    }
  };

  const handleDownloadAgencyDataTs = () => {
    const code = generateAgencyDataTsCode(draftData);
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agencyData.ts';
    a.click();
    showToast('✓ agencyData.ts downloaded! Replace src/data/agencyData.ts in your repo.');
  };

  const handleCopyAgencyDataTs = async () => {
    const code = generateAgencyDataTsCode(draftData);
    try {
      await navigator.clipboard.writeText(code);
      showToast('✓ agencyData.ts code copied to clipboard!');
    } catch {
      alert('Failed to copy. Please download the file instead.');
    }
  };

  const handleDiscardChanges = () => {
    setDraftData(siteData);
    showToast('অসংরক্ষিত পরিবর্তনগুলো বাতিল করা হয়েছে (Discarded unsaved changes).');
  };

  // Draft Mutations
  const updateDraftHero = (hero: Partial<HeroContentConfig>) => {
    setDraftData((prev) => ({ ...prev, hero: { ...prev.hero, ...hero } }));
  };

  const updateDraftSettings = (settings: Partial<SiteSettingsConfig>) => {
    setDraftData((prev) => ({ ...prev, siteSettings: { ...prev.siteSettings, ...settings } }));
  };

  const addDraftCategory = (category: ServiceCategoryDetail) => {
    setDraftData((prev) => ({ ...prev, categories: [...prev.categories, category] }));
  };

  const updateDraftCategory = (id: string, updated: Partial<ServiceCategoryDetail>) => {
    setDraftData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === id ? { ...c, ...updated } : c))
    }));
  };

  const deleteDraftCategory = (id: string) => {
    setDraftData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id)
    }));
  };

  const addDraftSubService = (categoryId: string, sub: SubServiceItem) => {
    setDraftData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId ? { ...cat, subServices: [...(cat.subServices || []), sub] } : cat
      )
    }));
  };

  const updateDraftSubService = (categoryId: string, sub: SubServiceItem) => {
    setDraftData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, subServices: cat.subServices.map((s) => (s.id === sub.id ? sub : s)) }
          : cat
      )
    }));
  };

  const updateDraftSubServicePrice = (
    categoryId: string,
    subServiceId: string,
    price: string,
    deliveryTime?: string,
    pricingType?: any,
    badge?: string
  ) => {
    setDraftData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              subServices: (cat.subServices || []).map((s) =>
                s.id === subServiceId
                  ? {
                      ...s,
                      price,
                      ...(deliveryTime !== undefined ? { deliveryTime } : {}),
                      ...(pricingType !== undefined ? { pricingType } : {}),
                      ...(badge !== undefined ? { badge } : {})
                    }
                  : s
              )
            }
          : cat
      )
    }));
  };

  const deleteDraftSubService = (categoryId: string, subId: string) => {
    setDraftData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, subServices: cat.subServices.filter((s) => s.id !== subId) }
          : cat
      )
    }));
  };

  const addDraftProject = (project: ProjectItem) => {
    setDraftData((prev) => ({ ...prev, projects: [project, ...prev.projects] }));
  };

  const updateDraftProject = (id: string, updated: Partial<ProjectItem>) => {
    setDraftData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updated } : p))
    }));
  };

  const deleteDraftProject = (id: string) => {
    setDraftData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id)
    }));
  };

  const updateDraftStats = (stats: StatItem[]) => {
    setDraftData((prev) => ({ ...prev, stats }));
  };

  const addDraftProcessStep = (step: ProcessStep) => {
    setDraftData((prev) => ({ ...prev, processSteps: [...prev.processSteps, step] }));
  };

  const updateDraftProcessSteps = (steps: ProcessStep[]) => {
    setDraftData((prev) => ({ ...prev, processSteps: steps }));
  };

  const deleteDraftProcessStep = (number: string) => {
    setDraftData((prev) => ({
      ...prev,
      processSteps: prev.processSteps.filter((s) => s.number !== number)
    }));
  };

  const addDraftTestimonial = (item: TestimonialItem) => {
    setDraftData((prev) => ({ ...prev, testimonials: [item, ...prev.testimonials] }));
  };

  const updateDraftTestimonials = (testimonials: TestimonialItem[]) => {
    setDraftData((prev) => ({ ...prev, testimonials }));
  };

  const deleteDraftTestimonial = (id: string) => {
    setDraftData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((t) => t.id !== id)
    }));
  };

  const toggleDraftSectionVisibility = (sectionKey: keyof SectionVisibilityConfig, isVisible: boolean) => {
    setDraftData((prev) => ({
      ...prev,
      sectionsVisibility: { ...prev.sectionsVisibility, [sectionKey]: isVisible }
    }));
  };

  const addDraftCustomSection = (section: CustomPageSection) => {
    setDraftData((prev) => ({ ...prev, customSections: [...prev.customSections, section] }));
  };

  const updateDraftCustomSection = (id: string, section: Partial<CustomPageSection>) => {
    setDraftData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((s) => (s.id === id ? { ...s, ...section } : s))
    }));
  };

  const deleteDraftCustomSection = (id: string) => {
    setDraftData((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((s) => s.id !== id)
    }));
  };

  const updateDraftLeadStatus = (id: string, status: LeadInquiry['status']) => {
    setDraftData((prev) => ({
      ...prev,
      leads: prev.leads.map((l) => (l.id === id ? { ...l, status } : l))
    }));
  };

  const updateDraftLeadNotes = (id: string, notes: string) => {
    setDraftData((prev) => ({
      ...prev,
      leads: prev.leads.map((l) => (l.id === id ? { ...l, notes } : l))
    }));
  };

  const toggleDraftLeadRead = (id: string) => {
    setDraftData((prev) => ({
      ...prev,
      leads: prev.leads.map((l) => (l.id === id ? { ...l, isRead: !l.isRead } : l))
    }));
  };

  const deleteDraftLead = (id: string) => {
    setDraftData((prev) => ({
      ...prev,
      leads: prev.leads.filter((l) => l.id !== id)
    }));
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, SVG, JPG, WebP, GIF).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image file is larger than 5MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      updateDraftSettings({ logoUrl: result });
      showToast('✨ Logo staged in draft! Click "Save Changes to Database" to apply.');
    };
    reader.onerror = () => {
      alert('Failed to read image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  // Access Restriction Gate: If user is not logged in as techtowebadmin@gmail.com
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-black/10 text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 text-amber-600 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-mono text-[11px] font-bold">
              <span>Security Restriction</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#191c1d] tracking-tight">
              Admin Access Required
            </h2>
            <p className="text-xs sm:text-sm text-[#594139] leading-relaxed">
              The Master CMS Control Panel is strictly protected. Only accounts logged in as <strong className="text-amber-800 font-mono">techtowebadmin@gmail.com</strong> are authorized to access this panel.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container border border-black/5 text-left text-xs font-mono space-y-1">
            <div className="text-[#594139]">Current Session:</div>
            <div className="font-bold text-[#191c1d] truncate">
              {currentUser ? currentUser.email : 'Not Signed In'}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => {
                onClose();
                onOpenLogin?.();
              }}
              className="w-full bg-primary hover:bg-primary-container text-white py-3.5 rounded-full font-mono text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Log in as techtowebadmin@gmail.com</span>
            </button>

            <button
              onClick={onClose}
              className="w-full bg-surface hover:bg-surface-container text-[#191c1d] py-3 rounded-full font-mono text-xs font-semibold border border-black/10 transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-6 overflow-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[120] bg-[#191c1d] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 font-mono text-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-7xl h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-black/10"
      >
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-black/10 bg-surface-container flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-[#191c1d]">Tech To Web — Master CMS & Admin Panel</h2>
                {hasUnsavedChanges ? (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Unsaved Draft (অসংরক্ষিত ড্রাফট)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-mono font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Database Synced
                  </span>
                )}

                {/* Cloud DB Status indicator */}
                <button
                  type="button"
                  onClick={handleTestDatabaseConnection}
                  disabled={isTestingDb}
                  className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                    dbStatus === 'connected'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : dbStatus === 'error'
                      ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  }`}
                  title="Click to test Firestore connection"
                >
                  {isTestingDb ? (
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                  ) : dbStatus === 'connected' ? (
                    <Cloud className="w-2.5 h-2.5 text-emerald-600" />
                  ) : (
                    <CloudOff className="w-2.5 h-2.5 text-rose-600" />
                  )}
                  <span>
                    {isTestingDb ? 'Testing...' : dbStatus === 'connected' ? 'Firestore Connected' : 'Check DB'}
                  </span>
                </button>
              </div>
              <p className="text-[11px] sm:text-xs font-mono text-[#594139] hidden sm:block">
                Edit titles, photos, logo, services, projects, and click Save Changes to persist to database.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Export Code for GitHub Button */}
            <button
              type="button"
              onClick={handleDownloadAgencyDataTs}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-all cursor-pointer shadow-xs"
              title="Download agencyData.ts to replace in your GitHub repository so changes stay permanently even on fresh git clone/deploy"
            >
              <FileCode className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Export for GitHub (agencyData.ts)</span>
              <span className="sm:hidden">Export TS</span>
            </button>

            {/* Discard button if changes exist */}
            {hasUnsavedChanges && (
              <button
                type="button"
                onClick={handleDiscardChanges}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 transition-all cursor-pointer shadow-xs"
                title="Discard unsaved changes"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Discard</span>
              </button>
            )}

            {/* Prominent Save Changes Button */}
            <button
              type="button"
              onClick={handleSaveToDatabase}
              disabled={isSaving}
              className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-mono font-bold transition-all shadow-md cursor-pointer ${
                hasUnsavedChanges
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400/50 shadow-emerald-600/30 animate-pulse'
                  : 'bg-primary hover:bg-primary-container text-white'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes (সেভ করুন)</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                const exported = exportJsonData();
                const blob = new Blob([exported], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `techtoweb_backup_${Date.now()}.json`;
                a.click();
                showToast('Site data backup downloaded!');
              }}
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold bg-white border border-black/10 hover:border-primary/40 text-[#191c1d] transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-primary" />
              <span>Backup</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white border border-black/10 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all flex items-center justify-center text-[#594139] cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="px-6 border-b border-black/10 bg-white flex items-center gap-1 overflow-x-auto py-2 shrink-0 no-scrollbar">
          {[
            { id: 'services', label: 'Services & Subservices', icon: Layers, count: draftData.categories.length },
            { id: 'projects', label: 'Projects / Portfolio', icon: Briefcase, count: draftData.projects.length },
            { id: 'sections', label: 'Pages & Section Toggles', icon: Sliders },
            { id: 'hero-content', label: 'Hero & Site Content', icon: FileText },
            { id: 'testimonials-process', label: 'Testimonials & Steps', icon: Star, count: draftData.testimonials.length },
            { id: 'leads', label: 'Orders & Notifications', icon: Inbox, count: draftData.leads.length, badge: draftData.leads.filter(l => l.status === 'new' || !l.isRead).length },
            { id: 'settings', label: 'Settings & Restore', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-[#594139] hover:bg-surface-container hover:text-[#191c1d]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] ${
                      isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-[#594139]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {tab.badge ? (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-surface">
          {/* TAB 1: SERVICES MANAGER */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-[#191c1d]">Service Categories & Offerings</h3>
                  <p className="text-xs font-mono text-[#594139]">
                    Add, edit, change images, deliverables, or delete services. Click &quot;Save Changes&quot; to apply to database.
                  </p>
                </div>
                <button
                  onClick={() => setIsNewCategoryModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-white font-mono text-xs font-bold hover:bg-primary-container transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Service Category</span>
                </button>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {draftData.categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-white rounded-3xl p-6 border border-black/10 shadow-xs hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-xs shrink-0"
                          style={{ backgroundColor: cat.color || '#ab3500' }}
                        >
                          <Layers className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-base text-[#191c1d]">{cat.title}</h4>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-surface-container text-[#594139]">
                              ID: {cat.id}
                            </span>
                          </div>
                          <p className="text-xs font-mono text-primary font-semibold">{cat.sublabel}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingCategory(cat)}
                          className="p-2 rounded-xl bg-surface-container hover:bg-primary/10 hover:text-primary transition-all text-[#594139] cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete category "${cat.title}" and its ${cat.subServices?.length || 0} sub-services?`)) {
                              deleteDraftCategory(cat.id);
                              showToast(`Service "${cat.title}" deleted from draft. Click "Save Changes" to save.`);
                            }
                          }}
                          className="p-2 rounded-xl bg-surface-container hover:bg-rose-100 hover:text-rose-600 transition-all text-[#594139] cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#594139] leading-relaxed line-clamp-2">{cat.description}</p>

                    {/* Image Preview & Stats / Pricing */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-black/5">
                      <div className="relative h-20 rounded-xl overflow-hidden bg-black/5 border border-black/5">
                        <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white font-mono text-[9px]">
                          Cover Photo
                        </span>
                      </div>
                      <div className="bg-surface-container rounded-xl p-3 flex flex-col justify-center">
                        <span className="text-[10px] font-mono text-[#594139] uppercase">Starting Investment</span>
                        <span className="text-sm sm:text-base font-extrabold text-emerald-700 font-mono">
                          {cat.startingPrice ? `From ${cat.startingPrice}` : (cat.stats?.value || '$299+')}
                        </span>
                        <span className="text-[10px] font-mono text-[#594139] mt-0.5">
                          {cat.subServices?.length || 0} Subservices
                        </span>
                      </div>
                    </div>

                    {/* Sub-services List & Add button */}
                    <div className="space-y-2 pt-2 border-t border-black/5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#191c1d]">
                          Sub-services & Custom Pricing ({cat.subServices?.length || 0})
                        </span>
                        <button
                          onClick={() => {
                            setSelectedCatForSub(cat.id);
                            setIsNewSubModal(true);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-primary hover:underline cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Sub-service</span>
                        </button>
                      </div>

                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {cat.subServices?.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl bg-surface-container/70 hover:bg-surface-container transition-all border border-black/5 text-xs gap-2"
                          >
                            <div className="pr-2 flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-bold text-[#191c1d] truncate">{sub.name}</p>
                                {sub.badge && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-100 text-amber-900">
                                    {sub.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-[#594139] truncate">{sub.desc}</p>
                              {sub.deliveryTime && (
                                <span className="text-[10px] font-mono text-neutral-500">
                                  ⏱️ {sub.deliveryTime}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {/* Quick Price Input */}
                              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-black/10 shadow-2xs">
                                <span className="text-[10px] font-mono text-[#594139] font-bold">Price:</span>
                                <input
                                  type="text"
                                  placeholder="$299"
                                  value={sub.price || ''}
                                  onChange={(e) => {
                                    updateDraftSubServicePrice(cat.id, sub.id, e.target.value);
                                  }}
                                  className="w-20 font-mono font-bold text-emerald-700 text-xs focus:outline-none bg-transparent"
                                />
                              </div>

                              <button
                                onClick={() => setEditingSubService({ categoryId: cat.id, sub })}
                                className="p-1.5 rounded-lg bg-white hover:bg-primary/10 text-[#594139] hover:text-primary transition-all cursor-pointer border border-black/5"
                                title="Edit Full Sub-Service Details"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete sub-service "${sub.name}"?`)) {
                                    deleteDraftSubService(cat.id, sub.id);
                                    showToast(`Sub-service deleted from draft.`);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-white hover:bg-rose-100 text-[#594139] hover:text-rose-600 transition-all cursor-pointer border border-black/5"
                                title="Delete Sub-service"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS / PORTFOLIO MANAGER */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-[#191c1d]">Portfolio & Live Client Projects</h3>
                  <p className="text-xs font-mono text-[#594139]">
                    Add, edit titles, update screenshots/photos, live URLs, metrics, or delete projects. Click &quot;Save Changes&quot; to apply to database.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#594139]" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      className="pl-8 pr-3 py-2 rounded-xl bg-white border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary w-48"
                    />
                  </div>
                  <button
                    onClick={() => setIsNewProjectModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-white font-mono text-xs font-bold hover:bg-primary-container transition-all shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Project</span>
                  </button>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {draftData.projects
                  .filter((p) =>
                    p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
                    p.client.toLowerCase().includes(projectSearch.toLowerCase()) ||
                    p.category.toLowerCase().includes(projectSearch.toLowerCase())
                  )
                  .map((project) => (
                    <div
                      key={project.id}
                      className="bg-white rounded-3xl overflow-hidden border border-black/10 shadow-xs hover:shadow-md transition-all flex flex-col"
                    >
                      {/* Image Thumbnail with Direct Upload Overlay */}
                      <div className="relative h-44 bg-surface-container overflow-hidden group">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                        
                        {/* Quick Direct Photo Upload Overlay */}
                        <label className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-white cursor-pointer z-10 backdrop-blur-[2px] p-2 text-center">
                          <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg">
                            <Upload className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-mono font-bold">Upload New Photo</span>
                          <span className="text-[9px] font-mono text-white/80">(ছবি পরিবর্তন করুন)</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const optimizedUrl = await compressImageFile(file);
                                  updateDraftProject(project.id, { image: optimizedUrl });
                                  showToast(`✓ Photo for "${project.title}" updated! Click "Save Changes" to apply.`);
                                } catch (err: any) {
                                  alert(err?.message || 'Failed to upload photo');
                                }
                              }
                            }}
                          />
                        </label>

                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-20 pointer-events-none">
                          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-bold">
                            {project.category.toUpperCase()}
                          </span>
                          {project.isLive && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 text-white font-mono text-[10px] font-bold">
                              {project.liveStatus || 'LIVE 🟢'}
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white z-20 pointer-events-none">
                          <span className="text-xs font-mono font-bold truncate">{project.client}</span>
                          <span className="text-[10px] font-mono text-white/80">{project.year}</span>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-bold text-base text-[#191c1d] leading-snug">{project.title}</h4>
                          <p className="text-xs text-[#594139] line-clamp-2">{project.description}</p>
                          
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-mono text-primary font-bold hover:underline"
                            >
                              <span>{project.liveUrl}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        {/* Metrics Tags */}
                        <div className="flex flex-wrap gap-1 pt-2 border-t border-black/5">
                          {project.metrics?.map((m, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-surface-container font-mono text-[10px] text-[#191c1d] font-semibold"
                            >
                              {m.label}: <strong>{m.value}</strong>
                            </span>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-3 border-t border-black/5">
                          <span className="text-[10px] font-mono text-[#594139]">ID: {project.id}</span>
                          <div className="flex items-center gap-2">
                            {/* Quick Photo Upload Button */}
                            <label
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-surface-container hover:bg-emerald-50 hover:text-emerald-700 transition-all text-xs font-mono font-bold text-[#594139] cursor-pointer"
                              title="Upload Photo from device"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    try {
                                      const optimizedUrl = await compressImageFile(file);
                                      updateDraftProject(project.id, { image: optimizedUrl });
                                      showToast(`✓ Photo for "${project.title}" updated! Click "Save Changes" to apply.`);
                                    } catch (err: any) {
                                      alert(err?.message || 'Failed to upload photo');
                                    }
                                  }
                                }}
                              />
                            </label>

                            <button
                              onClick={() => setEditingProject(project)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-primary/10 hover:text-primary transition-all text-xs font-mono font-bold text-[#191c1d] cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete project "${project.title}"?`)) {
                                  deleteDraftProject(project.id);
                                  showToast(`Project "${project.title}" deleted from draft. Click "Save Changes" to save.`);
                                }
                              }}
                              className="p-1.5 rounded-xl bg-surface-container hover:bg-rose-100 hover:text-rose-600 transition-all text-[#594139] cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 3: PAGES & SECTION TOGGLES */}
          {activeTab === 'sections' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[#191c1d]">Page Sections & Custom Content Blocks</h3>
                <p className="text-xs font-mono text-[#594139]">
                  Show or hide major landing page sections, or add completely new custom sections to the site. Click &quot;Save Changes&quot; to apply to database.
                </p>
              </div>

              {/* Standard Sections Toggle List */}
              <div className="bg-white rounded-3xl p-6 border border-black/10 shadow-xs space-y-4">
                <h4 className="text-sm font-mono font-bold text-[#191c1d] uppercase tracking-wider">
                  Core Website Sections (Toggle Visibility)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'hero', name: 'Hero Banner Section', desc: 'Main headline, badges, and primary CTAs' },
                    { key: 'stats', name: 'Live Metrics & Stats', desc: '100+ Projects, 50+ Clients counter' },
                    { key: 'services', name: 'Services & Subservices', desc: 'Full interactive 4-pillar showcase' },
                    { key: 'portfolio', name: 'Portfolio & Live Work', desc: 'Client case studies and live store grid' },
                    { key: 'digitalExp', name: 'Digital Experience Banner', desc: 'Interactive capabilities & tech stack' },
                    { key: 'process', name: '6-Step Growth Process', desc: 'Discover to Launch methodology' },
                    { key: 'testimonials', name: 'Testimonials & Reviews', desc: 'Verified CEO & Director quotes' },
                    { key: 'cta', name: 'Call to Action Banner', desc: 'Final project proposal trigger' },
                    { key: 'footer', name: 'Site Footer', desc: 'Navigation, links, and SLA notes' }
                  ].map((sec) => {
                    const isVisible = draftData.sectionsVisibility[sec.key as keyof typeof draftData.sectionsVisibility];
                    return (
                      <div
                        key={sec.key}
                        className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                          isVisible
                            ? 'bg-emerald-50/50 border-emerald-200/70 shadow-2xs'
                            : 'bg-surface-container/50 border-black/5 opacity-60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#191c1d]">{sec.name}</span>
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                isVisible ? 'bg-emerald-200 text-emerald-900' : 'bg-neutral-200 text-neutral-700'
                              }`}
                            >
                              {isVisible ? 'ACTIVE' : 'HIDDEN'}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#594139] mt-1">{sec.desc}</p>
                        </div>

                        <button
                          onClick={() => {
                            toggleDraftSectionVisibility(sec.key as any, !isVisible);
                            showToast(`${sec.name} toggled in draft. Click "Save Changes" to save.`);
                          }}
                          className={`p-2 rounded-xl transition-all cursor-pointer ${
                            isVisible
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-neutral-300 text-neutral-700 hover:bg-neutral-400'
                          }`}
                        >
                          {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Sections / Page Blocks */}
              <div className="bg-white rounded-3xl p-6 border border-black/10 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-mono font-bold text-[#191c1d] uppercase tracking-wider">
                      Custom Added Sections ({draftData.customSections?.length || 0})
                    </h4>
                    <p className="text-xs text-[#594139]">
                      Create custom announcements, landing sections, or marketing highlights.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsNewCustomSectionModal(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary text-white font-mono text-xs font-bold hover:bg-primary-container transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Custom Section</span>
                  </button>
                </div>

                {draftData.customSections?.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-black/10 rounded-2xl bg-surface-container/30">
                    <Sparkles className="w-8 h-8 text-[#594139] mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-mono text-[#594139]">No custom sections added yet.</p>
                    <p className="text-[11px] text-[#594139]/70 mt-0.5">
                      Click &quot;Create Custom Section&quot; above to create a bespoke page block with custom content and CTAs.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {draftData.customSections?.map((cSec) => (
                      <div
                        key={cSec.id}
                        className="p-4 rounded-2xl bg-surface-container/50 border border-black/10 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary-fixed text-primary font-bold">
                              {cSec.badge || 'Custom'}
                            </span>
                            <h5 className="font-bold text-sm text-[#191c1d] mt-1">{cSec.title}</h5>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setEditingCustomSection(cSec)}
                              className="p-1.5 rounded-lg hover:bg-white text-[#594139] hover:text-primary transition-all cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete custom section "${cSec.title}"?`)) {
                                  deleteDraftCustomSection(cSec.id);
                                  showToast('Custom section deleted from draft.');
                                }
                              }}
                              className="p-1.5 rounded-lg hover:bg-rose-100 text-[#594139] hover:text-rose-600 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-[#594139] line-clamp-3">{cSec.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: HERO & SITE CONTENT */}
          {activeTab === 'hero-content' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[#191c1d]">Hero Section & Branding Content</h3>
                <p className="text-xs font-mono text-[#594139]">
                  Update hero headlines, badge text, background photo, CTAs, and contact details. Click &quot;Save Changes&quot; to apply to database.
                </p>
              </div>

              {/* Hero Settings Form */}
              <div className="bg-white rounded-3xl p-6 border border-black/10 shadow-xs space-y-5">
                <h4 className="text-sm font-mono font-bold text-[#191c1d] uppercase tracking-wider">
                  Hero Header Headlines
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-[#191c1d] mb-1">
                      Top Badge Label
                    </label>
                    <input
                      type="text"
                      value={draftData.hero.badge}
                      onChange={(e) => updateDraftHero({ badge: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-[#191c1d] mb-1">
                      Primary Headline
                    </label>
                    <input
                      type="text"
                      value={draftData.hero.titlePrimary}
                      onChange={(e) => updateDraftHero({ titlePrimary: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-[#191c1d] mb-1">
                      Highlight Word (Gradient)
                    </label>
                    <input
                      type="text"
                      value={draftData.hero.titleHighlight}
                      onChange={(e) => updateDraftHero({ titleHighlight: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-[#191c1d] mb-1">
                      Secondary Headline
                    </label>
                    <input
                      type="text"
                      value={draftData.hero.titleSecondary}
                      onChange={(e) => updateDraftHero({ titleSecondary: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-[#191c1d] mb-1">
                      Stats Badge / Proof
                    </label>
                    <input
                      type="text"
                      value={draftData.hero.statsBadge}
                      onChange={(e) => updateDraftHero({ statsBadge: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-[#191c1d] mb-1">
                    Hero Subtitle / Description
                  </label>
                  <textarea
                    rows={3}
                    value={draftData.hero.subtitle}
                    onChange={(e) => updateDraftHero({ subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs text-[#191c1d] focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Hero Image URL & Preview */}
                <div>
                  <label className="block text-xs font-mono font-semibold text-[#191c1d] mb-1">
                    Hero Graphic / Showcase Image URL
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={draftData.hero.heroImage}
                      onChange={(e) => updateDraftHero({ heroImage: e.target.value })}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary"
                    />
                    <div className="w-14 h-11 rounded-xl overflow-hidden bg-black/10 border border-black/10 shrink-0">
                      <img src={draftData.hero.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand Logo Upload & Real-Time Sync Card */}
              <div className="bg-white rounded-3xl p-6 border border-black/10 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-mono font-bold text-[#191c1d] uppercase tracking-wider">
                        Brand Logo Management
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Header & Footer Preview
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[#594139] mt-0.5">
                      Upload your photo / company logo or enter an image URL. Click &quot;Save Changes&quot; to permanently store it.
                    </p>
                  </div>

                  {draftData.siteSettings.logoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        updateDraftSettings({ logoUrl: '' });
                        showToast('Custom logo removed from draft.');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Revert to Default Monogram</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Upload Zone & URL Input */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* File Upload Dropzone / Button */}
                    <div>
                      <label className="block text-xs font-mono font-semibold text-[#191c1d] mb-1.5">
                        1. Upload Photo / Logo File
                      </label>
                      <label className="group relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary bg-surface/50 hover:bg-surface transition-all cursor-pointer text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoFileUpload}
                          className="hidden"
                        />
                        <div className="w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary/20 text-primary flex items-center justify-center mb-2 transition-transform group-hover:scale-110">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-[#191c1d]">
                          Click here to browse & upload logo photo
                        </p>
                        <p className="text-[11px] font-mono text-[#594139] mt-0.5">
                          Supports PNG, SVG, JPG, WebP (Transparent PNG / SVG recommended)
                        </p>
                      </label>
                    </div>

                    {/* Or Paste Direct URL */}
                    <div>
                      <label className="block text-xs font-mono font-semibold text-[#191c1d] mb-1.5">
                        2. Or Enter Direct Image URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="https://example.com/logo.png"
                          value={draftData.siteSettings.logoUrl || ''}
                          onChange={(e) => {
                            updateDraftSettings({ logoUrl: e.target.value });
                          }}
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary"
                        />
                        {draftData.siteSettings.logoUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              updateDraftSettings({ logoUrl: '' });
                              showToast('Logo cleared from draft.');
                            }}
                            className="p-2.5 rounded-xl bg-surface-container hover:bg-rose-100 hover:text-rose-600 text-[#594139] transition-all cursor-pointer"
                            title="Clear logo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Live Previews: Header & Footer Preview */}
                  <div className="lg:col-span-5 bg-surface-container rounded-2xl p-4 border border-black/5 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#191c1d] flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-primary" />
                          Live Header & Footer Preview
                        </span>
                        <span className="text-[10px] font-mono text-[#594139]">Draft Staged</span>
                      </div>

                      {/* 1. Header Preview Box */}
                      <div className="space-y-1 mb-3">
                        <span className="text-[10px] font-mono text-[#594139]">Navbar Header (Light Background):</span>
                        <div className="p-3 rounded-xl bg-white border border-black/10 shadow-xs flex items-center">
                          <BrandLogo
                            logoUrl={draftData.siteSettings.logoUrl}
                            agencyName={draftData.siteSettings.agencyName || 'Tech To Web'}
                            size="sm"
                          />
                        </div>
                      </div>

                      {/* 2. Footer Preview Box */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#594139]">Footer (Dark Surface):</span>
                        <div className="p-3 rounded-xl bg-[#191c1d] border border-white/10 shadow-xs flex items-center">
                          <BrandLogo
                            logoUrl={draftData.siteSettings.logoUrl}
                            agencyName={draftData.siteSettings.agencyName || 'Tech To Web'}
                            size="sm"
                            isDarkBg={true}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[11px] font-mono text-[#594139]">
                      <span>Status: {draftData.siteSettings.logoUrl ? 'Custom Image Staged' : 'Default Monogram Active'}</span>
                      {hasUnsavedChanges && (
                        <span className="text-amber-600 font-bold">Unsaved Draft</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Site Branding & Contact Details */}
              <div className="bg-white rounded-3xl p-6 border border-black/10 shadow-xs space-y-6">
                <div>
                  <h4 className="text-sm font-mono font-bold text-[#191c1d] uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>Live Support & Agency Contact Settings</span>
                  </h4>
                  <p className="text-xs text-[#594139] font-mono mt-1">
                    Configure the live WhatsApp number and Email address shown to visitors across the floating support widget, navbar, and footer.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-[#191c1d] mb-1">
                      Agency Name (ব্র্যান্ডের নাম)
                    </label>
                    <input
                      type="text"
                      value={draftData.siteSettings.agencyName}
                      onChange={(e) => updateDraftSettings({ agencyName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-mono font-semibold text-[#191c1d]">
                        Support Email (সাপোর্ট ইমেইল)
                      </label>
                      <a
                        href={`mailto:${draftData.siteSettings.email}`}
                        className="text-[10px] font-mono text-primary hover:underline flex items-center gap-0.5"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="w-2.5 h-2.5" /> Test Mail
                      </a>
                    </div>
                    <input
                      type="email"
                      placeholder="techtowebadmin@gmail.com"
                      value={draftData.siteSettings.email}
                      onChange={(e) => updateDraftSettings({ email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-mono font-semibold text-[#191c1d]">
                        Support WhatsApp (হোয়াটসঅ্যাপ নম্বর)
                      </label>
                      <a
                        href={`https://wa.me/${(draftData.siteSettings.whatsapp || draftData.siteSettings.phone || '').replace(/[^0-9]/g, '')}`}
                        className="text-[10px] font-mono text-emerald-700 hover:underline flex items-center gap-0.5"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="w-2.5 h-2.5" /> Test WhatsApp
                      </a>
                    </div>
                    <input
                      type="text"
                      placeholder="+1 (800) 555-0199 or +8801700000000"
                      value={draftData.siteSettings.whatsapp || draftData.siteSettings.phone || ''}
                      onChange={(e) => updateDraftSettings({ phone: e.target.value, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Live Support Channel Preview Card */}
                <div className="p-4 rounded-2xl bg-surface-container/60 border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono font-bold text-[#191c1d] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Support Widget Channels Preview:
                    </span>
                    <p className="text-xs text-[#594139] font-mono">
                      WhatsApp: <strong className="text-emerald-800">{draftData.siteSettings.whatsapp || draftData.siteSettings.phone}</strong> | Email: <strong className="text-primary">{draftData.siteSettings.email}</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-300">
                      WhatsApp Connected
                    </span>
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono font-bold border border-amber-300">
                      Email Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TESTIMONIALS & PROCESS STEPS */}
          {activeTab === 'testimonials-process' && (
            <div className="space-y-8">
              {/* Testimonials */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#191c1d]">Client Testimonials & Quotes</h3>
                    <p className="text-xs font-mono text-[#594139]">
                      Add, edit client recommendations, avatars, and verified metrics. Click &quot;Save Changes&quot; to apply to database.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsNewTestimonialModal(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary text-white font-mono text-xs font-bold hover:bg-primary-container transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Testimonial</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {draftData.testimonials.map((t) => (
                    <div
                      key={t.id}
                      className="bg-white rounded-2xl p-5 border border-black/10 shadow-xs flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex text-amber-500">
                            {Array.from({ length: t.rating || 5 }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                            ))}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingTestimonial(t)}
                              className="p-1.5 rounded-lg hover:bg-surface-container text-[#594139] hover:text-primary transition-all cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete testimonial from ${t.author}?`)) {
                                  deleteDraftTestimonial(t.id);
                                  showToast('Testimonial removed from draft. Click "Save Changes" to save.');
                                }
                              }}
                              className="p-1.5 rounded-lg hover:bg-rose-100 text-[#594139] hover:text-rose-600 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-[#594139] italic line-clamp-3">&quot;{t.quote}&quot;</p>
                      </div>

                      <div className="flex items-center gap-3 pt-3 border-t border-black/5">
                        <img src={t.avatar} alt={t.author} className="w-8 h-8 rounded-full object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#191c1d] truncate">{t.author}</p>
                          <p className="text-[10px] font-mono text-[#594139] truncate">{t.role}, {t.company}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process Steps */}
              <div className="space-y-4 pt-4 border-t border-black/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#191c1d]">6-Step Process Steps</h3>
                    <p className="text-xs font-mono text-[#594139]">
                      Edit step titles, duration, descriptions, and deliverables. Click &quot;Save Changes&quot; to apply to database.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsNewStepModal(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary text-white font-mono text-xs font-bold hover:bg-primary-container transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Process Step</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {draftData.processSteps.map((step) => (
                    <div
                      key={step.number}
                      className="bg-white rounded-2xl p-5 border border-black/10 shadow-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-mono font-black text-primary">{step.number}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingStep(step)}
                            className="p-1.5 rounded-lg hover:bg-surface-container text-[#594139] hover:text-primary transition-all cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete step ${step.number} (${step.title})?`)) {
                                deleteDraftProcessStep(step.number);
                                showToast(`Step ${step.number} deleted from draft. Click "Save Changes" to save.`);
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-rose-100 text-[#594139] hover:text-rose-600 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold text-sm text-[#191c1d]">{step.title}</h4>
                      <p className="text-xs text-[#594139] line-clamp-2">{step.desc}</p>
                      <span className="inline-block text-[10px] font-mono text-primary font-bold">
                        ⏱️ {step.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ORDERS & LEADS CRM */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              {/* Header with Stats, Search & Actions */}
              <div className="bg-white p-5 rounded-3xl border border-black/10 shadow-xs space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-xl font-bold text-[#191c1d]">Orders & Client Inquiries Hub</h3>
                      {draftData.leads.filter((l) => l.status === 'new' || !l.isRead).length > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500 text-white animate-pulse">
                          {draftData.leads.filter((l) => l.status === 'new' || !l.isRead).length} New / Unread
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-surface-container font-semibold text-[#594139]">
                        Total Orders: {draftData.leads.length}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[#594139] mt-0.5">
                      View all customer descriptions, project requirements, contact details, and delete or manage orders easily.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Clear Completed Orders */}
                    {draftData.leads.some((l) => l.status === 'completed') && (
                      <button
                        onClick={handleClearCompletedOrders}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-mono font-bold transition-all border border-rose-200 cursor-pointer"
                        title="Delete All Completed Orders"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Clear Completed ({draftData.leads.filter((l) => l.status === 'completed').length})</span>
                      </button>
                    )}

                    {/* Sound Test Button */}
                    <button
                      onClick={() => {
                        playNotificationChime();
                        showToast('🔔 Notification chime played!');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-[#191c1d] text-xs font-mono font-bold transition-all border border-black/5 cursor-pointer"
                      title="Test Notification Sound"
                    >
                      <Volume2 className="w-4 h-4 text-primary" />
                      <span>Test Sound</span>
                    </button>

                    {/* Sound Enable/Disable Toggle */}
                    <button
                      onClick={() => {
                        const updated = !draftData.siteSettings.notificationSound;
                        updateDraftSettings({ notificationSound: updated });
                        showToast(updated ? '🔔 Notification sound enabled' : '🔕 Notification sound muted');
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                        draftData.siteSettings.notificationSound
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                      }`}
                    >
                      {draftData.siteSettings.notificationSound ? <Bell className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                      <span>Sound: {draftData.siteSettings.notificationSound ? 'ON' : 'OFF'}</span>
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-[#594139] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by customer name, email, phone/whatsapp, service, or keywords in description..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary placeholder:text-[#594139]/60"
                  />
                  {orderSearchQuery && (
                    <button
                      onClick={() => setOrderSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#594139] hover:text-black"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: 'all', label: 'All Orders', count: draftData.leads.length },
                  {
                    id: 'new',
                    label: 'New / Unread',
                    count: draftData.leads.filter((l) => l.status === 'new' || !l.isRead).length
                  },
                  {
                    id: 'in_progress',
                    label: 'In Progress',
                    count: draftData.leads.filter((l) => l.status === 'in_progress').length
                  },
                  {
                    id: 'contacted',
                    label: 'Contacted',
                    count: draftData.leads.filter((l) => l.status === 'contacted').length
                  },
                  {
                    id: 'completed',
                    label: 'Completed',
                    count: draftData.leads.filter((l) => l.status === 'completed').length
                  },
                  {
                    id: 'cancelled',
                    label: 'Cancelled',
                    count: draftData.leads.filter((l) => l.status === 'cancelled').length
                  }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setLeadStatusFilter(st.id as any)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-mono font-bold capitalize transition-all cursor-pointer shrink-0 ${
                      leadStatusFilter === st.id
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-white text-[#594139] border border-black/10 hover:bg-surface-container'
                    }`}
                  >
                    <span>{st.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        leadStatusFilter === st.id ? 'bg-white/20 text-white' : 'bg-black/5 text-[#191c1d]'
                      }`}
                    >
                      {st.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Inquiries / Orders List */}
              {draftData.leads.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-black/10 space-y-3">
                  <Inbox className="w-12 h-12 text-[#594139] mx-auto opacity-40" />
                  <div>
                    <h4 className="font-bold text-sm text-[#191c1d]">No Incoming Orders or Inquiries Yet</h4>
                    <p className="text-xs font-mono text-[#594139] max-w-md mx-auto mt-1">
                      When potential clients order a service or submit instructions on your website, all details (email, WhatsApp, description, requirements) will appear here instantly.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {draftData.leads
                    .filter((l) => {
                      // Status filter
                      if (leadStatusFilter === 'new' && !(l.status === 'new' || !l.isRead)) return false;
                      if (leadStatusFilter !== 'all' && leadStatusFilter !== 'new' && l.status !== leadStatusFilter) return false;

                      // Search query filter
                      if (orderSearchQuery.trim()) {
                        const q = orderSearchQuery.toLowerCase();
                        const clientName = (l.name || '').toLowerCase();
                        const clientEmail = (l.email || '').toLowerCase();
                        const clientPhone = (l.phone || l.whatsapp || '').toLowerCase();
                        const company = (l.company || '').toLowerCase();
                        const service = (l.service || '').toLowerCase();
                        const subService = (l.subService || '').toLowerCase();
                        const msg = (l.message || l.description || l.requirements || '').toLowerCase();
                        const id = (l.id || '').toLowerCase();

                        return (
                          clientName.includes(q) ||
                          clientEmail.includes(q) ||
                          clientPhone.includes(q) ||
                          company.includes(q) ||
                          service.includes(q) ||
                          subService.includes(q) ||
                          msg.includes(q) ||
                          id.includes(q)
                        );
                      }
                      return true;
                    })
                    .map((lead) => {
                      const cleanPhone = (lead.phone || lead.whatsapp || '').replace(/[^0-9]/g, '');
                      const whatsappUrl = cleanPhone
                        ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                            `Hello ${lead.name}, thank you for choosing Tech To Web for "${lead.subService || lead.service}". We have reviewed your order requirements and are ready to proceed!`
                          )}`
                        : null;
                      const mailtoUrl = `mailto:${lead.email}?subject=${encodeURIComponent(
                        `Tech To Web: Order Confirmation for ${lead.subService || lead.service}`
                      )}&body=${encodeURIComponent(`Hi ${lead.name},\n\nThank you for ordering ${lead.subService || lead.service} from Tech To Web.\n\nWe have received your requirements and will start work immediately.`)}`;

                      const fullDescription = lead.message || lead.description || lead.requirements || '';

                      return (
                        <div
                          key={lead.id}
                          className={`bg-white rounded-3xl p-6 border transition-all space-y-4 shadow-xs hover:shadow-md ${
                            !lead.isRead || lead.status === 'new'
                              ? 'border-primary/40 bg-gradient-to-r from-orange-50/25 via-white to-white ring-1 ring-primary/25'
                              : 'border-black/10'
                          }`}
                        >
                          {/* Order Top Bar */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/5 pb-3">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              {/* Order ID Badge */}
                              <button
                                onClick={() => handleCopyText(lead.id, `Order ID #${lead.id}`)}
                                className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-surface-container text-[#191c1d] border border-black/5 hover:bg-black/5 cursor-pointer"
                                title="Click to copy Order ID"
                              >
                                <span>#{lead.id.slice(0, 8)}</span>
                                <Copy className="w-3 h-3 text-[#594139]" />
                              </button>

                              {/* Order Type Badge */}
                              <span
                                className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-1 rounded-xl ${
                                  lead.orderType === 'order'
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                    : 'bg-primary-fixed text-primary border border-primary/20'
                                }`}
                              >
                                {lead.orderType === 'order' ? <ShoppingCart className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                                <span>{lead.orderType === 'order' ? 'Direct Service Order' : 'Proposal / Quote'}</span>
                              </span>

                              {/* Unread dot */}
                              {(!lead.isRead || lead.status === 'new') && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 animate-pulse">
                                  ● New Unread
                                </span>
                              )}

                              <span className="text-xs font-mono text-[#594139] flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#594139]" />
                                {lead.createdAt}
                              </span>
                            </div>

                            {/* Status Selector & Actions */}
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Status Dropdown */}
                              <select
                                value={lead.status}
                                onChange={(e) => {
                                  updateDraftLeadStatus(lead.id, e.target.value as any);
                                  showToast(`Status updated to "${e.target.value}".`);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-surface border border-black/10 text-xs font-mono font-bold text-[#191c1d] focus:outline-none cursor-pointer"
                              >
                                <option value="new">● New</option>
                                <option value="contacted">● Contacted</option>
                                <option value="in_progress">● In Progress</option>
                                <option value="completed">● Completed</option>
                                <option value="cancelled">● Cancelled</option>
                              </select>

                              {/* Toggle Read */}
                              <button
                                onClick={() => {
                                  toggleDraftLeadRead(lead.id);
                                  showToast(lead.isRead ? 'Marked as unread' : 'Marked as read');
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-[#191c1d] text-xs font-mono cursor-pointer border border-black/5"
                                title="Toggle Read/Unread"
                              >
                                {lead.isRead ? 'Mark Unread' : 'Mark Read'}
                              </button>

                              {/* Open Details Modal */}
                              <button
                                onClick={() => {
                                  setSelectedOrderForModal(lead);
                                  if (!lead.isRead) {
                                    toggleDraftLeadRead(lead.id);
                                  }
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-mono font-bold hover:bg-primary-container transition-all cursor-pointer shadow-xs"
                                title="Open full customer description and order specs"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Open Order Details</span>
                              </button>

                              {/* Delete Order Button */}
                              <button
                                onClick={() => handleDeleteOrder(lead.id, lead.name)}
                                className="p-2 rounded-xl bg-surface-container hover:bg-rose-100 hover:text-rose-600 transition-all text-[#594139] cursor-pointer"
                                title="Delete Order (মুছে ফেলুন)"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Client & Service Info Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Client Details Box */}
                            <div className="bg-surface-container/50 rounded-2xl p-4 border border-black/5 space-y-2.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-[#594139] font-bold flex items-center gap-1">
                                  <User className="w-3 h-3 text-[#594139]" /> Client Contact Information
                                </span>
                              </div>

                              <div>
                                <h4 className="font-extrabold text-base text-[#191c1d]">{lead.name}</h4>
                                {lead.company && (
                                  <p className="text-xs font-mono text-[#594139] flex items-center gap-1 mt-0.5">
                                    <Building className="w-3 h-3 text-[#594139]" /> {lead.company}
                                  </p>
                                )}
                                {lead.website && (
                                  <a
                                    href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-mono text-primary hover:underline inline-flex items-center gap-1 mt-0.5"
                                  >
                                    <Globe className="w-3 h-3" /> {lead.website} <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-black/5">
                                <div className="inline-flex items-center gap-1 bg-white border border-black/10 rounded-xl p-1 shadow-2xs">
                                  <a
                                    href={mailtoUrl}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold text-[#191c1d] hover:text-primary transition-all"
                                  >
                                    <Mail className="w-3.5 h-3.5 text-primary" />
                                    <span>{lead.email}</span>
                                  </a>
                                  <button
                                    onClick={() => handleCopyText(lead.email, 'Email address')}
                                    className="p-1 text-[#594139] hover:text-black rounded hover:bg-black/5 cursor-pointer"
                                    title="Copy Email"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>

                                {(lead.phone || lead.whatsapp) && (
                                  <div className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-xl p-1 shadow-2xs">
                                    <a
                                      href={whatsappUrl || `tel:${lead.phone || lead.whatsapp}`}
                                      target={whatsappUrl ? '_blank' : undefined}
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold text-emerald-900 hover:text-emerald-700 transition-all"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>WhatsApp: {lead.phone || lead.whatsapp}</span>
                                    </a>
                                    <button
                                      onClick={() => handleCopyText(lead.phone || lead.whatsapp || '', 'Phone/WhatsApp number')}
                                      className="p-1 text-emerald-700 hover:text-emerald-900 rounded hover:bg-emerald-100 cursor-pointer"
                                      title="Copy Number"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Service & Pricing Details Box */}
                            <div className="bg-surface-container/50 rounded-2xl p-4 border border-black/5 space-y-2.5">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-[#594139] font-bold flex items-center gap-1">
                                <Briefcase className="w-3 h-3 text-[#594139]" /> Ordered Service & Financials
                              </span>

                              <div>
                                <h5 className="font-bold text-sm text-[#191c1d]">{lead.service}</h5>
                                {lead.subService && (
                                  <p className="text-xs font-mono font-semibold text-primary mt-0.5">
                                    ↳ Package / Sub-Service: {lead.subService}
                                  </p>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/5">
                                <div className="bg-white p-2.5 rounded-xl border border-black/5">
                                  <span className="text-[10px] font-mono text-[#594139] block">Agreed / Budget</span>
                                  <span className="text-sm font-extrabold text-emerald-700 font-mono">
                                    {lead.price || lead.servicePrice || lead.budget || 'Custom Quote'}
                                  </span>
                                </div>
                                <div className="bg-white p-2.5 rounded-xl border border-black/5">
                                  <span className="text-[10px] font-mono text-[#594139] block">Delivery Target</span>
                                  <span className="text-xs font-bold text-[#191c1d] font-mono">
                                    {lead.deliveryTime || lead.timeline || 'Standard SLA'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Customer Description / Requirements Highlight Box */}
                          <div className="bg-gradient-to-r from-neutral-50 to-orange-50/30 rounded-2xl p-4 border border-black/10 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-mono uppercase tracking-wider text-[#191c1d] font-bold flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-primary" /> Customer Requirements & Instructions (গ্রাহকের বিবরণ)
                              </span>
                              <div className="flex items-center gap-2">
                                {fullDescription && (
                                  <button
                                    onClick={() => handleCopyText(fullDescription, 'Customer Description')}
                                    className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#594139] hover:text-black px-2 py-1 rounded-lg bg-white border border-black/10 cursor-pointer"
                                  >
                                    <Copy className="w-3 h-3" />
                                    <span>Copy Description</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => setSelectedOrderForModal(lead)}
                                  className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-primary hover:text-primary-container px-2 py-1 rounded-lg bg-primary/10 cursor-pointer"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>View Full Screen</span>
                                </button>
                              </div>
                            </div>

                            {fullDescription ? (
                              <p className="text-xs text-[#191c1d] leading-relaxed whitespace-pre-wrap line-clamp-3 bg-white/80 p-3 rounded-xl border border-black/5 font-sans">
                                {fullDescription}
                              </p>
                            ) : (
                              <p className="text-xs text-[#594139] italic">
                                No additional text provided with this order.
                              </p>
                            )}
                          </div>

                          {/* Internal Admin Private Notes & Action Footer */}
                          <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex-1">
                              <input
                                type="text"
                                placeholder="Internal admin notes (e.g. Sent wireframes, waiting for logo files)..."
                                value={lead.notes || ''}
                                onChange={(e) => {
                                  updateDraftLeadNotes(lead.id, e.target.value);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary"
                              />
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {whatsappUrl && (
                                <a
                                  href={whatsappUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold transition-all shadow-xs"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </a>
                              )}
                              <a
                                href={mailtoUrl}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#191c1d] hover:bg-black text-white text-xs font-mono font-bold transition-all shadow-xs"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span>Email</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SETTINGS & RESTORE */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[#191c1d]">Data Management & System Reset</h3>
                <p className="text-xs font-mono text-[#594139]">
                  Manage brand logo, export full site backups, import JSON configurations, or restore default state.
                </p>
              </div>

              {/* Brand Logo Upload & Real-Time Sync Card in Settings */}
              <div className="bg-white rounded-3xl p-6 border border-black/10 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-mono font-bold text-[#191c1d] uppercase tracking-wider">
                        Brand Logo Management (Header & Footer)
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Header & Footer Preview
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[#594139] mt-0.5">
                      Upload your logo file or provide an image URL. Click &quot;Save Changes&quot; to apply across the entire site.
                    </p>
                  </div>

                  {draftData.siteSettings.logoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        updateDraftSettings({ logoUrl: '' });
                        showToast('Custom logo removed from draft.');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Revert to Default Monogram</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Upload Zone & URL Input */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* File Upload Dropzone / Button */}
                    <div>
                      <label className="block text-xs font-mono font-semibold text-[#191c1d] mb-1.5">
                        Upload Logo Photo / File
                      </label>
                      <label className="group relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary bg-surface/50 hover:bg-surface transition-all cursor-pointer text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoFileUpload}
                          className="hidden"
                        />
                        <div className="w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary/20 text-primary flex items-center justify-center mb-2 transition-transform group-hover:scale-110">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-[#191c1d]">
                          Click to upload logo image
                        </p>
                        <p className="text-[11px] font-mono text-[#594139] mt-0.5">
                          Supports PNG, SVG, JPG, WebP
                        </p>
                      </label>
                    </div>

                    {/* Or Paste Direct URL */}
                    <div>
                      <label className="block text-xs font-mono font-semibold text-[#191c1d] mb-1.5">
                        Or Image URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="https://example.com/logo.png"
                          value={draftData.siteSettings.logoUrl || ''}
                          onChange={(e) => {
                            updateDraftSettings({ logoUrl: e.target.value });
                          }}
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary"
                        />
                        {draftData.siteSettings.logoUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              updateDraftSettings({ logoUrl: '' });
                              showToast('Logo cleared from draft.');
                            }}
                            className="p-2.5 rounded-xl bg-surface-container hover:bg-rose-100 hover:text-rose-600 text-[#594139] transition-all cursor-pointer"
                            title="Clear logo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Live Previews: Header & Footer Preview */}
                  <div className="lg:col-span-5 bg-surface-container rounded-2xl p-4 border border-black/5 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#191c1d] flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-primary" />
                          Live Header & Footer Preview
                        </span>
                        <span className="text-[10px] font-mono text-[#594139]">Draft Staged</span>
                      </div>

                      {/* Header Preview */}
                      <div className="space-y-1 mb-3">
                        <span className="text-[10px] font-mono text-[#594139]">Header Preview:</span>
                        <div className="p-3 rounded-xl bg-white border border-black/10 shadow-xs flex items-center">
                          <BrandLogo
                            logoUrl={draftData.siteSettings.logoUrl}
                            agencyName={draftData.siteSettings.agencyName || 'Tech To Web'}
                            size="sm"
                          />
                        </div>
                      </div>

                      {/* Footer Preview */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#594139]">Footer Preview:</span>
                        <div className="p-3 rounded-xl bg-[#191c1d] border border-white/10 shadow-xs flex items-center">
                          <BrandLogo
                            logoUrl={draftData.siteSettings.logoUrl}
                            agencyName={draftData.siteSettings.agencyName || 'Tech To Web'}
                            size="sm"
                            isDarkBg={true}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[11px] font-mono text-[#594139]">
                      <span>Status: {draftData.siteSettings.logoUrl ? 'Custom Image Staged' : 'Default Monogram Active'}</span>
                      {hasUnsavedChanges && (
                        <span className="text-amber-600 font-bold">Unsaved Draft</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. Cloud Database Status & Diagnostics */}
              <div className="bg-white rounded-3xl p-6 border border-black/10 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                      dbStatus === 'connected' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {dbStatus === 'connected' ? <Cloud className="w-5 h-5" /> : <CloudOff className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-mono font-bold text-[#191c1d] uppercase tracking-wider">
                        Firebase Cloud Database Sync (ক্লাউড ডাটাবেজ স্ট্যাটাস)
                      </h4>
                      <p className="text-xs font-mono text-[#594139]">
                        Real-time cloud persistence connected to Google Firestore (<code className="text-primary font-bold">site_cms/main_config</code>)
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestDatabaseConnection}
                    disabled={isTestingDb}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-surface-container hover:bg-white border border-black/10 text-[#191c1d] transition-all cursor-pointer shrink-0"
                  >
                    {isTestingDb ? <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" /> : <RefreshCw className="w-3.5 h-3.5 text-primary" />}
                    <span>{isTestingDb ? 'Testing Connection...' : 'Test Cloud Connection'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-3.5 rounded-2xl bg-surface-container border border-black/5 space-y-1">
                    <span className="text-[#594139] block text-[11px]">Database Status</span>
                    <div className="flex items-center gap-2 font-bold">
                      <span className={`w-2.5 h-2.5 rounded-full ${dbStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                      <span className={dbStatus === 'connected' ? 'text-emerald-800' : 'text-rose-800'}>
                        {dbStatus === 'connected' ? 'Connected & Active (কানেক্টেড)' : 'Connection Check Required'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-container border border-black/5 space-y-1">
                    <span className="text-[#594139] block text-[11px]">Last Cloud Sync Time</span>
                    <span className="font-bold text-[#191c1d] block">
                      {lastSyncedAt ? lastSyncedAt : 'Synced on load'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-container border border-black/5 space-y-1">
                    <span className="text-[#594139] block text-[11px]">Local Cache Status</span>
                    <span className="font-bold text-emerald-800 block flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active (Instant Offline Fallback)
                    </span>
                  </div>
                </div>

                {dbError && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-mono text-rose-800 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Firestore Sync Notice:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">{dbError}</p>
                  </div>
                )}
              </div>

              {/* 2. Permanent GitHub Repository Code Synchronization (গিটহাব রেপোজিটরির স্থায়ী ডাটা সিঙ্ক) */}
              <div className="bg-gradient-to-br from-blue-50/60 to-indigo-50/40 rounded-3xl p-6 border border-blue-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-200/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                      <FileCode className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-mono font-bold text-blue-950 uppercase tracking-wider">
                        GitHub Repository Permanent Code Sync (গিটহাব কোড সিঙ্ক)
                      </h4>
                      <p className="text-xs font-mono text-blue-800/80">
                        Export your customized services, projects, logo & text as ready-to-use TypeScript code for your repository.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleDownloadAgencyDataTs}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download agencyData.ts</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyAgencyDataTs}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold bg-white hover:bg-blue-50 text-blue-900 border border-blue-200 shadow-xs transition-all cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-blue-600" />
                      <span>Copy Code</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white/90 rounded-2xl p-4 border border-blue-100 text-xs font-mono text-[#191c1d] space-y-2.5 leading-relaxed">
                  <div className="font-bold text-blue-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>গিটহাবে পুশ করলে ডাটা আগের মতো হওয়া ঠেকাতে স্থায়ী সমাধান:</span>
                  </div>
                  <ol className="list-decimal pl-5 space-y-1.5 text-[11px] text-[#594139]">
                    <li>
                      <strong>ক্লাউড ডাটাবেজ (স্বয়ংক্রিয়):</strong> অ্যাডমিন প্যানেলে <em>&quot;Save Changes&quot;</em> ক্লিক করলে ডাটা Firebase Firestore ক্লাউডে সেভ হয়ে যায় এবং যে কোনো ভিজিটর বা নতুন ব্রাউজার সরাসরি ক্লাউড থেকে ডাটা দেখতে পায়।
                    </li>
                    <li>
                      <strong>GitHub কোড পার্মানেন্ট করতে:</strong> আপনি যদি চান আপনার গিটহাব রিপোজিটরির সোর্স কোডেই আপনার সব পরিবর্তন স্থায়ীভাবে থাকুক, তাহলে উপরের <strong>&quot;Download agencyData.ts&quot;</strong> বাটনে ক্লিক করে ফাইলটি ডাউনলোড করুন।
                    </li>
                    <li>
                      ডাউনলোড করা ফাইলটি আপনার প্রজেক্টের <code className="bg-blue-100/70 text-blue-900 px-1.5 py-0.5 rounded font-bold">src/data/agencyData.ts</code> ফাইলে পেস্ট করে <code className="bg-slate-100 text-slate-900 px-1.5 py-0.5 rounded font-bold">git push</code> করে দিন। এরপর গিটহাবে পুশ করলেও আর কখনো আগের ডিফল্ট ডাটায় ফিরে যাবে না!
                    </li>
                  </ol>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export / Import Box */}
                <div className="bg-white rounded-3xl p-6 border border-black/10 shadow-xs space-y-4">
                  <h4 className="font-bold text-sm text-[#191c1d] font-mono uppercase tracking-wider">
                    Import / Export JSON Data
                  </h4>

                  <textarea
                    rows={6}
                    placeholder="Paste site JSON configuration here to import..."
                    value={jsonImportText}
                    onChange={(e) => setJsonImportText(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-surface border border-black/10 font-mono text-[11px] text-[#191c1d] focus:outline-none focus:border-primary"
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        if (!jsonImportText) return;
                        const success = importJsonData(jsonImportText);
                        if (success) {
                          showToast('Data imported successfully!');
                          setJsonImportText('');
                        } else {
                          alert('Invalid JSON structure. Please check and try again.');
                        }
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-primary text-white font-mono text-xs font-bold hover:bg-primary-container transition-all cursor-pointer text-center"
                    >
                      Apply Imported JSON
                    </button>
                    <button
                      onClick={() => {
                        setJsonImportText(exportJsonData());
                        showToast('Current JSON copied into box!');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-surface-container border border-black/10 text-xs font-mono font-bold text-[#191c1d] hover:bg-white transition-all cursor-pointer"
                    >
                      View Current JSON
                    </button>
                  </div>
                </div>

                {/* Factory Reset Box */}
                <div className="bg-white rounded-3xl p-6 border border-black/10 shadow-xs space-y-4 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-rose-600 font-mono uppercase tracking-wider">
                      Factory Reset Data
                    </h4>
                    <p className="text-xs text-[#594139] mt-2 leading-relaxed">
                      This will reset all services, projects, page sections, headlines, and testimonials back to the original default agency state.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-3">
                    <div className="flex items-center gap-2 font-bold">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>Action cannot be undone without a backup!</span>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to reset all CMS content to factory defaults?')) {
                          resetToDefaults();
                          showToast('Site restored to original defaults!');
                        }
                      }}
                      className="w-full py-2.5 rounded-xl bg-rose-600 text-white font-mono text-xs font-bold hover:bg-rose-700 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset to Factory Defaults</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* --- SUB-MODALS FOR ADDING / EDITING ITEMS --- */}

      {/* 0. Order Inspection & Full Customer Description Modal */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-black/10 space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-black/10">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xs">
                  {selectedOrderForModal.orderType === 'order' ? (
                    <ShoppingCart className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#191c1d]">
                      {selectedOrderForModal.orderType === 'order' ? 'Service Order Details' : 'Proposal Inquiry'}
                    </h3>
                    <button
                      onClick={() => handleCopyText(selectedOrderForModal.id, `Order ID #${selectedOrderForModal.id}`)}
                      className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-surface-container hover:bg-black/5 text-[#191c1d] cursor-pointer"
                      title="Copy Order ID"
                    >
                      <span>#{selectedOrderForModal.id.slice(0, 8)}</span>
                      <Copy className="w-3 h-3 text-[#594139]" />
                    </button>
                  </div>
                  <p className="text-xs font-mono text-[#594139] flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#594139]" /> Submitted on {selectedOrderForModal.createdAt}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderForModal(null)}
                className="p-2 rounded-xl hover:bg-surface-container text-[#594139] hover:text-black cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status & Action Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-surface-container border border-black/5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#594139]">Status:</span>
                <select
                  value={selectedOrderForModal.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as any;
                    updateDraftLeadStatus(selectedOrderForModal.id, newStatus);
                    setSelectedOrderForModal({
                      ...selectedOrderForModal,
                      status: newStatus
                    });
                    showToast(`Status updated to "${newStatus}".`);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white border border-black/10 text-xs font-mono font-bold text-[#191c1d] focus:outline-none cursor-pointer"
                >
                  <option value="new">● New</option>
                  <option value="contacted">● Contacted</option>
                  <option value="in_progress">● In Progress</option>
                  <option value="completed">● Completed</option>
                  <option value="cancelled">● Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    toggleDraftLeadRead(selectedOrderForModal.id);
                    setSelectedOrderForModal({
                      ...selectedOrderForModal,
                      isRead: !selectedOrderForModal.isRead
                    });
                    showToast(selectedOrderForModal.isRead ? 'Marked as unread' : 'Marked as read');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white border border-black/10 hover:bg-surface-container-high text-[#191c1d] text-xs font-mono cursor-pointer"
                >
                  {selectedOrderForModal.isRead ? 'Mark as Unread' : 'Mark as Read'}
                </button>

                <button
                  onClick={() => handleDeleteOrder(selectedOrderForModal.id, selectedOrderForModal.name)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-mono font-bold cursor-pointer transition-all"
                  title="Delete this order"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Order</span>
                </button>
              </div>
            </div>

            {/* Client Contact Profile */}
            <div className="bg-surface rounded-2xl p-5 border border-black/10 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#594139] font-bold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-primary" /> Customer Contact Information
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-mono text-[#594139] block">Full Name</span>
                  <h4 className="text-base font-extrabold text-[#191c1d]">{selectedOrderForModal.name}</h4>
                  {selectedOrderForModal.company && (
                    <p className="text-xs font-mono text-[#594139] flex items-center gap-1 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-[#594139]" /> {selectedOrderForModal.company}
                    </p>
                  )}
                </div>

                <div>
                  <span className="text-[11px] font-mono text-[#594139] block">Website / Store URL</span>
                  {selectedOrderForModal.website ? (
                    <a
                      href={selectedOrderForModal.website.startsWith('http') ? selectedOrderForModal.website : `https://${selectedOrderForModal.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono text-primary font-bold hover:underline inline-flex items-center gap-1 mt-0.5 break-all"
                    >
                      <Globe className="w-3.5 h-3.5 shrink-0" /> {selectedOrderForModal.website} <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-xs font-mono text-[#594139] italic">Not provided</span>
                  )}
                </div>
              </div>

              {/* Direct Reach Buttons */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-black/5">
                {/* Email Box */}
                <div className="flex items-center gap-1 bg-white border border-black/10 rounded-xl p-1 shadow-2xs">
                  <a
                    href={`mailto:${selectedOrderForModal.email}?subject=${encodeURIComponent(
                      `Tech To Web: Order Update for ${selectedOrderForModal.subService || selectedOrderForModal.service}`
                    )}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-[#191c1d] hover:text-primary transition-all"
                  >
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    <span>{selectedOrderForModal.email}</span>
                  </a>
                  <button
                    onClick={() => handleCopyText(selectedOrderForModal.email, 'Email address')}
                    className="p-1.5 text-[#594139] hover:text-black rounded hover:bg-black/5 cursor-pointer"
                    title="Copy Email"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* WhatsApp Box */}
                {(selectedOrderForModal.phone || selectedOrderForModal.whatsapp) && (
                  <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-xl p-1 shadow-2xs">
                    <a
                      href={`https://wa.me/${(selectedOrderForModal.phone || selectedOrderForModal.whatsapp || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello ${selectedOrderForModal.name}, thank you for choosing Tech To Web for "${selectedOrderForModal.subService || selectedOrderForModal.service}". We are ready to discuss your order requirements!`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-emerald-900 hover:text-emerald-700 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp: {selectedOrderForModal.phone || selectedOrderForModal.whatsapp}</span>
                    </a>
                    <button
                      onClick={() => handleCopyText(selectedOrderForModal.phone || selectedOrderForModal.whatsapp || '', 'Phone/WhatsApp number')}
                      className="p-1.5 text-emerald-700 hover:text-emerald-900 rounded hover:bg-emerald-100 cursor-pointer"
                      title="Copy Number"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Service & Financials Specifications */}
            <div className="bg-surface rounded-2xl p-5 border border-black/10 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#594139] font-bold flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-primary" /> Service & Pricing Specifications
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-mono text-[#594139] block">Selected Service Category</span>
                  <h5 className="font-bold text-sm text-[#191c1d]">{selectedOrderForModal.service}</h5>
                  {selectedOrderForModal.subService && (
                    <p className="text-xs font-mono font-semibold text-primary mt-0.5">
                      ↳ Package: {selectedOrderForModal.subService}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-black/5">
                    <span className="text-[10px] font-mono text-[#594139] block">Agreed / Budget</span>
                    <span className="text-base font-extrabold text-emerald-700 font-mono">
                      {selectedOrderForModal.price || selectedOrderForModal.servicePrice || selectedOrderForModal.budget || 'Custom Quote'}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-black/5">
                    <span className="text-[10px] font-mono text-[#594139] block">Delivery SLA</span>
                    <span className="text-xs font-bold text-[#191c1d] font-mono">
                      {selectedOrderForModal.deliveryTime || selectedOrderForModal.timeline || 'Standard SLA'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* FULL CUSTOMER DESCRIPTION & REQUIREMENTS */}
            <div className="bg-gradient-to-br from-neutral-50 to-orange-50/40 rounded-2xl p-5 border border-black/15 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#191c1d] font-bold flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-primary" /> Customer Description & Requirements (গ্রাহকের বিবরণ)
                </span>
                {(selectedOrderForModal.message || selectedOrderForModal.description || selectedOrderForModal.requirements) && (
                  <button
                    onClick={() =>
                      handleCopyText(
                        selectedOrderForModal.message || selectedOrderForModal.description || selectedOrderForModal.requirements || '',
                        'Customer Description'
                      )
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#191c1d] px-3 py-1.5 rounded-xl bg-white border border-black/10 hover:border-primary cursor-pointer shadow-xs"
                  >
                    <Copy className="w-3.5 h-3.5 text-primary" />
                    <span>Copy Full Description</span>
                  </button>
                )}
              </div>

              <div className="bg-white p-4 rounded-xl border border-black/10">
                {selectedOrderForModal.message || selectedOrderForModal.description || selectedOrderForModal.requirements ? (
                  <div className="text-xs text-[#191c1d] leading-relaxed whitespace-pre-wrap break-words font-sans">
                    {selectedOrderForModal.message || selectedOrderForModal.description || selectedOrderForModal.requirements}
                  </div>
                ) : (
                  <p className="text-xs text-[#594139] italic">
                    The client did not provide additional written instructions with this submission.
                  </p>
                )}
              </div>
            </div>

            {/* Admin Private Internal Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-[#594139] font-bold uppercase tracking-wider">
                Admin Private Notes
              </label>
              <textarea
                rows={3}
                placeholder="Write internal notes about this order (milestones, payments, custom agreements)..."
                value={selectedOrderForModal.notes || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  updateDraftLeadNotes(selectedOrderForModal.id, val);
                  setSelectedOrderForModal({
                    ...selectedOrderForModal,
                    notes: val
                  });
                }}
                className="w-full p-3 rounded-2xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary leading-relaxed"
              />
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-black/10">
              <button
                onClick={() => handleDeleteOrder(selectedOrderForModal.id, selectedOrderForModal.name)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-mono font-bold cursor-pointer transition-all"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Delete Order Permanently</span>
              </button>

              <div className="flex items-center gap-2">
                {(selectedOrderForModal.phone || selectedOrderForModal.whatsapp) && (
                  <a
                    href={`https://wa.me/${(selectedOrderForModal.phone || selectedOrderForModal.whatsapp || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${selectedOrderForModal.name}, reaching out from Tech To Web regarding your order for "${selectedOrderForModal.subService || selectedOrderForModal.service}".`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold transition-all shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Chat</span>
                  </a>
                )}
                <a
                  href={`mailto:${selectedOrderForModal.email}?subject=${encodeURIComponent(
                    `Tech To Web: Update for ${selectedOrderForModal.subService || selectedOrderForModal.service}`
                  )}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#191c1d] hover:bg-black text-white text-xs font-mono font-bold transition-all shadow-xs"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Email</span>
                </a>
                <button
                  onClick={() => setSelectedOrderForModal(null)}
                  className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-[#191c1d] text-xs font-mono font-bold cursor-pointer border border-black/5"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. Category Modal (Add / Edit) */}
      {(editingCategory || isNewCategoryModal) && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-black/10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#191c1d]">
                {editingCategory ? `Edit Category: ${editingCategory.title}` : 'Add New Service Category'}
              </h3>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setIsNewCategoryModal(false);
                }}
                className="p-1.5 rounded-xl hover:bg-surface-container text-[#594139] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <CategoryForm
              initial={editingCategory || undefined}
              onSave={(cat) => {
                if (editingCategory) {
                  updateDraftCategory(cat.id, cat);
                  showToast(`Category "${cat.title}" updated in draft. Click "Save Changes" to save.`);
                } else {
                  addDraftCategory(cat);
                  showToast(`Category "${cat.title}" created in draft. Click "Save Changes" to save.`);
                }
                setEditingCategory(null);
                setIsNewCategoryModal(false);
              }}
              onCancel={() => {
                setEditingCategory(null);
                setIsNewCategoryModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* 2. SubService Modal (Add / Edit) */}
      {(editingSubService || isNewSubModal) && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-black/10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#191c1d]">
                {editingSubService ? `Edit Sub-Service: ${editingSubService.sub.name}` : 'Add Sub-Service'}
              </h3>
              <button
                onClick={() => {
                  setEditingSubService(null);
                  setIsNewSubModal(false);
                }}
                className="p-1.5 rounded-xl hover:bg-surface-container text-[#594139] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <SubServiceForm
              initial={editingSubService?.sub}
              categories={draftData.categories}
              selectedCatId={selectedCatForSub || editingSubService?.categoryId || draftData.categories[0]?.id}
              onSave={(catId, sub) => {
                if (editingSubService) {
                  updateDraftSubService(catId, sub);
                  showToast(`Sub-service "${sub.name}" updated in draft. Click "Save Changes" to save.`);
                } else {
                  addDraftSubService(catId, sub);
                  showToast(`Sub-service "${sub.name}" added to draft. Click "Save Changes" to save.`);
                }
                setEditingSubService(null);
                setIsNewSubModal(false);
              }}
              onCancel={() => {
                setEditingSubService(null);
                setIsNewSubModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* 3. Project Modal (Add / Edit) */}
      {(editingProject || isNewProjectModal) && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-black/10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#191c1d]">
                {editingProject ? `Edit Project: ${editingProject.title}` : 'Add New Portfolio Project'}
              </h3>
              <button
                onClick={() => {
                  setEditingProject(null);
                  setIsNewProjectModal(false);
                }}
                className="p-1.5 rounded-xl hover:bg-surface-container text-[#594139] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ProjectForm
              initial={editingProject || undefined}
              categories={draftData.categories}
              onSave={(project) => {
                if (editingProject) {
                  updateDraftProject(project.id, project);
                  showToast(`Project "${project.title}" updated in draft. Click "Save Changes" to save.`);
                } else {
                  addDraftProject(project);
                  showToast(`Project "${project.title}" created in draft. Click "Save Changes" to save.`);
                }
                setEditingProject(null);
                setIsNewProjectModal(false);
              }}
              onCancel={() => {
                setEditingProject(null);
                setIsNewProjectModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* 4. Custom Section Modal */}
      {(editingCustomSection || isNewCustomSectionModal) && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-black/10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#191c1d]">
                {editingCustomSection ? `Edit Section: ${editingCustomSection.title}` : 'Add Custom Section'}
              </h3>
              <button
                onClick={() => {
                  setEditingCustomSection(null);
                  setIsNewCustomSectionModal(false);
                }}
                className="p-1.5 rounded-xl hover:bg-surface-container text-[#594139] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <CustomSectionForm
              initial={editingCustomSection || undefined}
              onSave={(sec) => {
                if (editingCustomSection) {
                  updateDraftCustomSection(sec.id, sec);
                  showToast(`Section "${sec.title}" updated in draft. Click "Save Changes" to save.`);
                } else {
                  addDraftCustomSection(sec);
                  showToast(`Section "${sec.title}" created in draft. Click "Save Changes" to save.`);
                }
                setEditingCustomSection(null);
                setIsNewCustomSectionModal(false);
              }}
              onCancel={() => {
                setEditingCustomSection(null);
                setIsNewCustomSectionModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* 5. Testimonial Modal */}
      {(editingTestimonial || isNewTestimonialModal) && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-black/10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#191c1d]">
                {editingTestimonial ? `Edit Testimonial: ${editingTestimonial.author}` : 'Add Testimonial'}
              </h3>
              <button
                onClick={() => {
                  setEditingTestimonial(null);
                  setIsNewTestimonialModal(false);
                }}
                className="p-1.5 rounded-xl hover:bg-surface-container text-[#594139] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <TestimonialForm
              initial={editingTestimonial || undefined}
              onSave={(t) => {
                if (editingTestimonial) {
                  updateDraftTestimonials(draftData.testimonials.map((item) => (item.id === t.id ? t : item)));
                  showToast(`Testimonial for ${t.author} updated in draft. Click "Save Changes" to save.`);
                } else {
                  addDraftTestimonial(t);
                  showToast(`Testimonial added to draft. Click "Save Changes" to save.`);
                }
                setEditingTestimonial(null);
                setIsNewTestimonialModal(false);
              }}
              onCancel={() => {
                setEditingTestimonial(null);
                setIsNewTestimonialModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* 6. Step Modal */}
      {(editingStep || isNewStepModal) && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-black/10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#191c1d]">
                {editingStep ? `Edit Step ${editingStep.number}` : 'Add Process Step'}
              </h3>
              <button
                onClick={() => {
                  setEditingStep(null);
                  setIsNewStepModal(false);
                }}
                className="p-1.5 rounded-xl hover:bg-surface-container text-[#594139] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <StepForm
              initial={editingStep || undefined}
              onSave={(step) => {
                if (editingStep) {
                  updateDraftProcessSteps(draftData.processSteps.map((s) => (s.number === step.number ? step : s)));
                  showToast(`Step ${step.number} updated in draft. Click "Save Changes" to save.`);
                } else {
                  addDraftProcessStep(step);
                  showToast(`Step ${step.number} added to draft. Click "Save Changes" to save.`);
                }
                setEditingStep(null);
                setIsNewStepModal(false);
              }}
              onCancel={() => {
                setEditingStep(null);
                setIsNewStepModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUB-FORMS ---

// Reusable Client-Side Compressed Image Upload Helper (Optimized for Retina Clarity & Fast Cloud Storage)
export const compressImageFile = (
  file: File,
  maxWidth = 960,
  maxHeight = 640,
  quality = 0.76
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Please select a valid image file (PNG, JPG, WebP, GIF).'));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(event.target?.result as string);
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type === 'image/png' || file.type === 'image/svg+xml' ? 'image/png' : 'image/jpeg';
        const compressedDataUrl = canvas.toDataURL(mimeType, quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for processing.'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
};

export const ImageUploadField: React.FC<{
  label: string;
  value: string;
  onChange: (newVal: string) => void;
  helperText?: string;
  aspectRatio?: 'video' | 'square' | 'auto';
}> = ({ label, value, onChange, helperText, aspectRatio = 'video' }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    try {
      setIsProcessing(true);
      const optimizedUrl = await compressImageFile(file);
      onChange(optimizedUrl);
    } catch (err: any) {
      alert(err?.message || 'Failed to upload photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block font-bold text-[#191c1d]">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-mono text-primary hover:underline cursor-pointer flex items-center gap-1"
        >
          {showUrlInput ? '📁 Switch to Direct Upload' : '🔗 Paste Web URL instead'}
        </button>
      </div>

      {/* Main Direct File Upload & Preview Box */}
      <div className="space-y-2.5">
        {value ? (
          <div className="relative rounded-2xl overflow-hidden border border-black/10 bg-surface-container group">
            <div className={`w-full ${aspectRatio === 'video' ? 'h-48' : 'h-40'} relative overflow-hidden bg-neutral-900`}>
              <img
                src={value}
                alt="Selected preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                <label className="px-3.5 py-2 rounded-xl bg-white text-[#191c1d] font-mono text-xs font-bold shadow-md cursor-pointer hover:bg-surface-container flex items-center gap-1.5 transition-all">
                  <Upload className="w-3.5 h-3.5 text-primary" />
                  <span>Change Photo (ছবি পরিবর্তন)</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(file);
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold shadow-md cursor-pointer transition-all"
                  title="Remove Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3 bg-white border-t border-black/5 flex items-center justify-between text-[11px] font-mono text-[#594139]">
              <span className="flex items-center gap-1 font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {value.startsWith('data:image') ? 'Direct Photo Attached (লোকাল ফটো সংযুক্ত)' : 'Image URL Connected'}
              </span>
              <label className="text-primary hover:underline cursor-pointer font-bold flex items-center gap-1">
                <Upload className="w-3 h-3" /> Upload New
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </label>
            </div>
          </div>
        ) : (
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center ${
              dragOver
                ? 'border-primary bg-primary/5 scale-[1.01]'
                : 'border-primary/30 hover:border-primary bg-surface/50 hover:bg-surface'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <div className="w-12 h-12 rounded-2xl bg-primary/10 group-hover:bg-primary/20 text-primary flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110 shadow-xs">
              {isProcessing ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>
            <p className="text-xs font-bold text-[#191c1d]">
              {isProcessing ? 'Processing & Optimizing Image...' : 'Click to Upload Direct Photo (মোবাইল বা পিসি থেকে ফটো দিন)'}
            </p>
            <p className="text-[11px] font-mono text-[#594139] mt-1">
              Supports PNG, JPG, JPEG, WebP, GIF (Auto-compressed & Web Ready)
            </p>
          </label>
        )}

        {/* Optional Direct URL Input Field */}
        {showUrlInput && (
          <div className="pt-2 border-t border-black/5 space-y-1">
            <label className="block text-[11px] font-mono text-[#594139]">Or paste Image URL:</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-black/10 text-[11px] bg-white font-mono"
              />
              {value && (
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="px-3 py-2 rounded-xl bg-surface-container text-[#594139] hover:text-rose-600 text-xs font-mono"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {helperText && (
          <p className="text-[10px] font-mono text-[#594139]">{helperText}</p>
        )}
      </div>
    </div>
  );
};

const CategoryForm: React.FC<{
  initial?: ServiceCategoryDetail;
  onSave: (cat: ServiceCategoryDetail) => void;
  onCancel: () => void;
}> = ({ initial, onSave, onCancel }) => {
  const [id, setId] = useState(initial?.id || 'service-' + Date.now());
  const [title, setTitle] = useState(initial?.title || '');
  const [shortLabel, setShortLabel] = useState(initial?.shortLabel || '');
  const [sublabel, setSublabel] = useState(initial?.sublabel || '');
  const [startingPrice, setStartingPrice] = useState(initial?.startingPrice || '$299');
  const [deliveryTime, setDeliveryTime] = useState(initial?.deliveryTime || '1-2 Weeks');
  const [color, setColor] = useState(initial?.color || '#ab3500');
  const [description, setDescription] = useState(initial?.description || '');
  const [image, setImage] = useState(initial?.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80');
  const [statLabel, setStatLabel] = useState(initial?.stats?.label || 'Avg Growth');
  const [statValue, setStatValue] = useState(initial?.stats?.value || '+120%');

  return (
    <div className="space-y-4 text-xs font-mono">
      <div>
        <label className="block font-bold text-[#191c1d] mb-1">Category Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Shopify Solutions"
          className="w-full px-3 py-2 rounded-xl border border-black/10"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Short Label (Nav)</label>
          <input
            type="text"
            value={shortLabel}
            onChange={(e) => setShortLabel(e.target.value)}
            placeholder="e.g. Shopify"
            className="w-full px-3 py-2 rounded-xl border border-black/10"
          />
        </div>
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Sublabel (Badge)</label>
          <input
            type="text"
            value={sublabel}
            onChange={(e) => setSublabel(e.target.value)}
            placeholder="e.g. E-Commerce"
            className="w-full px-3 py-2 rounded-xl border border-black/10"
          />
        </div>
      </div>

      {/* Starting Price & Delivery */}
      <div className="grid grid-cols-2 gap-3 p-3 bg-surface-container rounded-2xl border border-black/5">
        <div>
          <label className="block font-bold text-emerald-800 mb-1">Starting Price (শুরুর মূল্য)</label>
          <input
            type="text"
            value={startingPrice}
            onChange={(e) => setStartingPrice(e.target.value)}
            placeholder="e.g. $299 or $450"
            className="w-full px-3 py-2 rounded-xl border border-black/10 bg-white font-bold text-emerald-700"
          />
        </div>
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Estimated Delivery (সময়সীমা)</label>
          <input
            type="text"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            placeholder="e.g. 1-2 Weeks"
            className="w-full px-3 py-2 rounded-xl border border-black/10 bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block font-bold text-[#191c1d] mb-1">Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-black/10 font-sans text-xs"
        />
      </div>

      {/* Direct Image Upload for Category */}
      <ImageUploadField
        label="Category Hero Photo / Screenshot"
        value={image}
        onChange={(newImg) => setImage(newImg)}
        helperText="Direct photo upload supported. Compressed automatically for instant page loading."
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Highlight Metric Label</label>
          <input
            type="text"
            value={statLabel}
            onChange={(e) => setStatLabel(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10"
          />
        </div>
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Metric Value</label>
          <input
            type="text"
            value={statValue}
            onChange={(e) => setStatValue(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={() => {
            if (!title) return alert('Title is required');
            onSave({
              id,
              title,
              shortLabel: shortLabel || title,
              sublabel: sublabel || 'Core Service',
              startingPrice,
              deliveryTime,
              icon: initial?.icon || 'Layers',
              color,
              bgColor: 'bg-primary-fixed/20',
              badgeColor: 'text-primary bg-primary-fixed',
              description,
              image,
              stats: { label: statLabel, value: statValue },
              subServices: initial?.subServices || []
            });
          }}
          className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold cursor-pointer hover:bg-primary-container"
        >
          Save Category
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 rounded-xl bg-surface-container font-bold cursor-pointer">
          Cancel
        </button>
      </div>
    </div>
  );
};

const SubServiceForm: React.FC<{
  initial?: SubServiceItem;
  categories: ServiceCategoryDetail[];
  selectedCatId: string;
  onSave: (catId: string, sub: SubServiceItem) => void;
  onCancel: () => void;
}> = ({ initial, categories, selectedCatId, onSave, onCancel }) => {
  const [catId, setCatId] = useState(selectedCatId);
  const [name, setName] = useState(initial?.name || '');
  const [desc, setDesc] = useState(initial?.desc || '');
  const [price, setPrice] = useState(initial?.price || '$299');
  const [pricingType, setPricingType] = useState<SubServiceItem['pricingType']>(initial?.pricingType || 'fixed');
  const [deliveryTime, setDeliveryTime] = useState(initial?.deliveryTime || '3-5 Days');
  const [badge, setBadge] = useState(initial?.badge || '');
  const [tagsStr, setTagsStr] = useState(initial?.tags?.join(', ') || '');
  const [delivStr, setDelivStr] = useState(initial?.deliverables?.join('\n') || '');

  return (
    <div className="space-y-4 text-xs font-mono">
      <div>
        <label className="block font-bold text-[#191c1d] mb-1">Parent Category</label>
        <select
          value={catId}
          onChange={(e) => setCatId(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-black/10"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-bold text-[#191c1d] mb-1">Sub-service Name (সার্ভিসের নাম)</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Shopify Store Design"
          className="w-full px-3 py-2 rounded-xl border border-black/10"
        />
      </div>

      {/* Pricing & Delivery Customization Row */}
      <div className="p-3 bg-surface-container rounded-2xl border border-black/5 space-y-3">
        <span className="text-[10px] font-mono uppercase font-bold text-emerald-800">
          💰 Custom Service Pricing & SLA (মূল্য ও সময়সীমা নির্ধারণ)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-[#191c1d] mb-1">Service Price (মূল্য)</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. $299, $450, $1200 or 15,000 BDT"
              className="w-full px-3 py-2 rounded-xl border border-black/10 bg-white font-bold text-emerald-700"
            />
          </div>
          <div>
            <label className="block font-bold text-[#191c1d] mb-1">Pricing Model (মূল্যের ধরণ)</label>
            <select
              value={pricingType || 'fixed'}
              onChange={(e) => setPricingType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-black/10 bg-white"
            >
              <option value="fixed">Fixed Price (নির্দিষ্ট মূল্য)</option>
              <option value="starting">Starting From (শুরু মূল্য)</option>
              <option value="monthly">Monthly Retainer (মাসিক)</option>
              <option value="hourly">Hourly Rate (ঘন্টা প্রতি)</option>
              <option value="custom">Custom Quote (কাস্টম)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-[#191c1d] mb-1">Delivery SLA (ডেলিভারি সময়)</label>
            <input
              type="text"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              placeholder="e.g. 3-5 Days, 1 Week"
              className="w-full px-3 py-2 rounded-xl border border-black/10 bg-white"
            />
          </div>
          <div>
            <label className="block font-bold text-[#191c1d] mb-1">Promo Badge (ঐচ্ছিক ব্যাজ)</label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. Popular 🔥, Best Value ⭐"
              className="w-full px-3 py-2 rounded-xl border border-black/10 bg-white"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block font-bold text-[#191c1d] mb-1">Description</label>
        <textarea
          rows={3}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-black/10 font-sans text-xs"
        />
      </div>

      <div>
        <label className="block font-bold text-[#191c1d] mb-1">Tags (Comma Separated)</label>
        <input
          type="text"
          value={tagsStr}
          onChange={(e) => setTagsStr(e.target.value)}
          placeholder="Liquid, Responsive UI, Figma"
          className="w-full px-3 py-2 rounded-xl border border-black/10"
        />
      </div>

      <div>
        <label className="block font-bold text-[#191c1d] mb-1">Deliverables (One Per Line)</label>
        <textarea
          rows={3}
          value={delivStr}
          onChange={(e) => setDelivStr(e.target.value)}
          placeholder="Custom Design System&#10;Mobile Layouts&#10;Fast TTFB (<200ms)"
          className="w-full px-3 py-2 rounded-xl border border-black/10 font-sans text-xs"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={() => {
            if (!name) return alert('Name is required');
            onSave(catId, {
              id: initial?.id || 'sub-' + Date.now(),
              name,
              desc,
              price,
              pricingType,
              deliveryTime,
              badge,
              tags: tagsStr.split(',').map((t) => t.trim()).filter(Boolean),
              icon: initial?.icon || 'Layout',
              deliverables: delivStr.split('\n').map((d) => d.trim()).filter(Boolean)
            });
          }}
          className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold cursor-pointer hover:bg-primary-container"
        >
          Save Sub-Service
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 rounded-xl bg-surface-container font-bold cursor-pointer">
          Cancel
        </button>
      </div>
    </div>
  );
};

const ProjectForm: React.FC<{
  initial?: ProjectItem;
  categories: ServiceCategoryDetail[];
  onSave: (p: ProjectItem) => void;
  onCancel: () => void;
}> = ({ initial, categories, onSave, onCancel }) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [category, setCategory] = useState(initial?.category || 'shopify');
  const [categoryLabel, setCategoryLabel] = useState(initial?.categoryLabel || 'Shopify Store Design');
  const [client, setClient] = useState(initial?.client || '');
  const [year, setYear] = useState(initial?.year || '2026');
  const [image, setImage] = useState(initial?.image || 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=800&q=80');
  const [liveUrl, setLiveUrl] = useState(initial?.liveUrl || '');
  const [isLive, setIsLive] = useState(initial?.isLive ?? true);
  const [liveStatus, setLiveStatus] = useState(initial?.liveStatus || 'Running / Live Store');
  const [description, setDescription] = useState(initial?.description || '');
  const [challenge, setChallenge] = useState(initial?.challenge || '');
  const [solution, setSolution] = useState(initial?.solution || '');
  const [impact, setImpact] = useState(initial?.impact || '');
  const [tagsStr, setTagsStr] = useState(initial?.tags?.join(', ') || 'Shopify Plus, Live Project, CRO');
  const [metric1Label, setMetric1Label] = useState(initial?.metrics?.[0]?.label || 'AOV Lift');
  const [metric1Val, setMetric1Val] = useState(initial?.metrics?.[0]?.value || '+65%');
  const [metric2Label, setMetric2Label] = useState(initial?.metrics?.[1]?.label || 'Speed');
  const [metric2Val, setMetric2Val] = useState(initial?.metrics?.[1]?.value || '0.9s');

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Project Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Zeynvero Luxury Streetwear"
            className="w-full px-3 py-2 rounded-xl border border-black/10"
          />
        </div>
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Client Name</label>
          <input
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="e.g. Zeynvero Ltd"
            className="w-full px-3 py-2 rounded-xl border border-black/10"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Category Label</label>
          <input
            type="text"
            value={categoryLabel}
            onChange={(e) => setCategoryLabel(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10"
          />
        </div>
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Year</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10"
          />
        </div>
      </div>

      {/* Direct Image Upload for Project */}
      <ImageUploadField
        label="Project Screenshot / Photo (প্রজেক্ট ফটো বা স্ক্রিনশট)"
        value={image}
        onChange={(newImg) => setImage(newImg)}
        helperText="Direct photo upload from mobile/desktop supported. Automatically optimized & compressed for ultra-fast loading."
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Live URL (e.g. https://...)</label>
          <input
            type="text"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10"
          />
        </div>
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Live Status Badge</label>
          <input
            type="text"
            value={liveStatus}
            onChange={(e) => setLiveStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10"
          />
        </div>
      </div>

      <div>
        <label className="block font-bold text-[#191c1d] mb-1">Project Description</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-black/10 font-sans text-xs"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Challenge</label>
          <textarea
            rows={2}
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10 font-sans text-xs"
          />
        </div>
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Solution</label>
          <textarea
            rows={2}
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10 font-sans text-xs"
          />
        </div>
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Impact</label>
          <textarea
            rows={2}
            value={impact}
            onChange={(e) => setImpact(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10 font-sans text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Metric 1 (Label & Value)</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Label"
              value={metric1Label}
              onChange={(e) => setMetric1Label(e.target.value)}
              className="w-1/2 px-2 py-1.5 rounded-lg border border-black/10"
            />
            <input
              type="text"
              placeholder="Value"
              value={metric1Val}
              onChange={(e) => setMetric1Val(e.target.value)}
              className="w-1/2 px-2 py-1.5 rounded-lg border border-black/10 font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Metric 2 (Label & Value)</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Label"
              value={metric2Label}
              onChange={(e) => setMetric2Label(e.target.value)}
              className="w-1/2 px-2 py-1.5 rounded-lg border border-black/10"
            />
            <input
              type="text"
              placeholder="Value"
              value={metric2Val}
              onChange={(e) => setMetric2Val(e.target.value)}
              className="w-1/2 px-2 py-1.5 rounded-lg border border-black/10 font-bold"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={() => {
            if (!title) return alert('Title is required');
            onSave({
              id: initial?.id || 'proj-' + Date.now(),
              title,
              category,
              categoryLabel: categoryLabel || 'Custom Service',
              client: client || 'Private Client',
              year: year || '2026',
              image,
              liveUrl,
              isLive: isLive || !!liveUrl,
              liveStatus: liveStatus || 'Active 🟢',
              description,
              challenge,
              solution,
              impact,
              tags: tagsStr.split(',').map((t) => t.trim()).filter(Boolean),
              metrics: [
                { label: metric1Label, value: metric1Val },
                { label: metric2Label, value: metric2Val },
                { label: 'Live Status', value: 'Active 🟢' }
              ]
            });
          }}
          className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold cursor-pointer hover:bg-primary-container"
        >
          Save Project
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 rounded-xl bg-surface-container font-bold cursor-pointer">
          Cancel
        </button>
      </div>
    </div>
  );
};

const CustomSectionForm: React.FC<{
  initial?: CustomPageSection;
  onSave: (sec: CustomPageSection) => void;
  onCancel: () => void;
}> = ({ initial, onSave, onCancel }) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [badge, setBadge] = useState(initial?.badge || 'Featured');
  const [subtitle, setSubtitle] = useState(initial?.subtitle || '');
  const [content, setContent] = useState(initial?.content || '');
  const [ctaText, setCtaText] = useState(initial?.ctaText || 'Learn More');
  const [ctaLink, setCtaLink] = useState(initial?.ctaLink || '#contact');

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Section Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10"
          />
        </div>
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Badge</label>
          <input
            type="text"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10"
          />
        </div>
      </div>

      <div>
        <label className="block font-bold text-[#191c1d] mb-1">Subtitle</label>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-black/10"
        />
      </div>

      <div>
        <label className="block font-bold text-[#191c1d] mb-1">Section Content</label>
        <textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-black/10 font-sans text-xs"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">CTA Button Text</label>
          <input
            type="text"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10"
          />
        </div>
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">CTA Link / Target</label>
          <input
            type="text"
            value={ctaLink}
            onChange={(e) => setCtaLink(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={() => {
            if (!title) return alert('Title is required');
            onSave({
              id: initial?.id || 'sec-' + Date.now(),
              title,
              badge,
              subtitle,
              content,
              ctaText,
              ctaLink,
              enabled: true
            });
          }}
          className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold cursor-pointer hover:bg-primary-container"
        >
          Save Custom Section
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 rounded-xl bg-surface-container font-bold cursor-pointer">
          Cancel
        </button>
      </div>
    </div>
  );
};

const TestimonialForm: React.FC<{
  initial?: TestimonialItem;
  onSave: (t: TestimonialItem) => void;
  onCancel: () => void;
}> = ({ initial, onSave, onCancel }) => {
  const [author, setAuthor] = useState(initial?.author || '');
  const [role, setRole] = useState(initial?.role || 'CEO');
  const [company, setCompany] = useState(initial?.company || '');
  const [quote, setQuote] = useState(initial?.quote || '');
  const [avatar, setAvatar] = useState(initial?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');
  const [metrics, setMetrics] = useState(initial?.metrics || '+140% Growth');
  const [rating, setRating] = useState(initial?.rating || 5);

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Author Name</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10"
          />
        </div>
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10"
          />
        </div>
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Metric Badge</label>
          <input
            type="text"
            value={metrics}
            onChange={(e) => setMetrics(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10"
          />
        </div>
      </div>

      <div>
        <label className="block font-bold text-[#191c1d] mb-1">Avatar Image URL</label>
        <input
          type="text"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-black/10 text-[11px]"
        />
      </div>

      <div>
        <label className="block font-bold text-[#191c1d] mb-1">Quote</label>
        <textarea
          rows={3}
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-black/10 font-sans text-xs"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={() => {
            if (!author || !quote) return alert('Author and quote are required');
            onSave({
              id: initial?.id || 'test-' + Date.now(),
              author,
              role,
              company,
              quote,
              avatar,
              metrics,
              rating
            });
          }}
          className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold cursor-pointer hover:bg-primary-container"
        >
          Save Testimonial
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 rounded-xl bg-surface-container font-bold cursor-pointer">
          Cancel
        </button>
      </div>
    </div>
  );
};

const StepForm: React.FC<{
  initial?: ProcessStep;
  onSave: (step: ProcessStep) => void;
  onCancel: () => void;
}> = ({ initial, onSave, onCancel }) => {
  const [number, setNumber] = useState(initial?.number || '07');
  const [title, setTitle] = useState(initial?.title || '');
  const [desc, setDesc] = useState(initial?.desc || '');
  const [detail, setDetail] = useState(initial?.detail || '');
  const [duration, setDuration] = useState(initial?.duration || 'Week 1');
  const [delivStr, setDelivStr] = useState(initial?.deliverables?.join('\n') || '');

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Step Number (e.g. 01, 02)</label>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10"
          />
        </div>
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-[#191c1d] mb-1">Duration</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10"
          />
        </div>
      </div>

      <div>
        <label className="block font-bold text-[#191c1d] mb-1">Short Description</label>
        <textarea
          rows={2}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-black/10 font-sans text-xs"
        />
      </div>

      <div>
        <label className="block font-bold text-[#191c1d] mb-1">Deliverables (One Per Line)</label>
        <textarea
          rows={3}
          value={delivStr}
          onChange={(e) => setDelivStr(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-black/10 font-sans text-xs"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={() => {
            if (!title) return alert('Title is required');
            onSave({
              number,
              title,
              desc,
              detail: detail || desc,
              duration,
              deliverables: delivStr.split('\n').map((d) => d.trim()).filter(Boolean)
            });
          }}
          className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold cursor-pointer hover:bg-primary-container"
        >
          Save Process Step
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 rounded-xl bg-surface-container font-bold cursor-pointer">
          Cancel
        </button>
      </div>
    </div>
  );
};
