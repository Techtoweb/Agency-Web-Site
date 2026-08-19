import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { useSiteData } from '../data/siteDataContext';
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
    addProcessStep,
    updateProcessSteps,
    deleteProcessStep,
    addTestimonial,
    updateTestimonials,
    deleteTestimonial,
    toggleSectionVisibility,
    addCustomSection,
    updateCustomSection,
    deleteCustomSection,
    updateLeadStatus,
    deleteLead,
    resetToDefaults,
    importJsonData,
    exportJsonData
  } = useSiteData();

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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
      updateSiteSettings({ logoUrl: result });
      showToast('✨ Logo uploaded successfully! Updated in Header and Footer.');
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
        <div className="px-6 py-4 border-b border-black/10 bg-surface-container flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#191c1d]">Tech To Web — Master CMS & Admin Panel</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 text-[10px] font-mono font-bold">
                  LIVE EDIT MODE
                </span>
              </div>
              <p className="text-xs font-mono text-[#594139]">
                Full site content control: edit titles, photos, services, projects, pages, and leads in real time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-bold">Admin:</span>
              <span className="text-amber-800">techtowebadmin@gmail.com</span>
            </div>

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
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-white border border-black/10 hover:border-primary/40 text-[#191c1d] transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-primary" />
              <span>Backup JSON</span>
            </button>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-white border border-black/10 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all flex items-center justify-center text-[#594139] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="px-6 border-b border-black/10 bg-white flex items-center gap-1 overflow-x-auto py-2 shrink-0 no-scrollbar">
          {[
            { id: 'services', label: 'Services & Subservices', icon: Layers, count: siteData.categories.length },
            { id: 'projects', label: 'Projects / Portfolio', icon: Briefcase, count: siteData.projects.length },
            { id: 'sections', label: 'Pages & Section Toggles', icon: Sliders },
            { id: 'hero-content', label: 'Hero & Site Content', icon: FileText },
            { id: 'testimonials-process', label: 'Testimonials & Steps', icon: Star, count: siteData.testimonials.length },
            { id: 'leads', label: 'Inquiries & Leads', icon: Inbox, count: siteData.leads.length, badge: siteData.leads.filter(l => l.status === 'new').length },
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
                    Add, edit, change images, deliverables, or delete services displayed on the website.
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
                {siteData.categories.map((cat) => (
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
                              deleteCategory(cat.id);
                              showToast(`Service "${cat.title}" deleted.`);
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

                    {/* Image Preview & Stats */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-black/5">
                      <div className="relative h-20 rounded-xl overflow-hidden bg-black/5 border border-black/5">
                        <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white font-mono text-[9px]">
                          Cover Photo
                        </span>
                      </div>
                      <div className="bg-surface-container rounded-xl p-3 flex flex-col justify-center">
                        <span className="text-[10px] font-mono text-[#594139] uppercase">{cat.stats?.label || 'Metric'}</span>
                        <span className="text-base font-bold text-[#191c1d]">{cat.stats?.value || '+100%'}</span>
                        <span className="text-[10px] font-mono text-emerald-600 font-bold mt-0.5">
                          {cat.subServices?.length || 0} Subservices
                        </span>
                      </div>
                    </div>

                    {/* Sub-services List & Add button */}
                    <div className="space-y-2 pt-2 border-t border-black/5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#191c1d]">
                          Sub-services ({cat.subServices?.length || 0})
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

                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {cat.subServices?.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container/60 hover:bg-surface-container transition-all border border-black/5 text-xs"
                          >
                            <div className="pr-2">
                              <p className="font-bold text-[#191c1d]">{sub.name}</p>
                              <p className="text-[10px] text-[#594139] truncate max-w-[240px]">{sub.desc}</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => setEditingSubService({ categoryId: cat.id, sub })}
                                className="p-1.5 rounded-lg hover:bg-white text-[#594139] hover:text-primary transition-all cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete sub-service "${sub.name}"?`)) {
                                    deleteSubService(cat.id, sub.id);
                                    showToast(`Sub-service deleted.`);
                                  }
                                }}
                                className="p-1.5 rounded-lg hover:bg-rose-100 text-[#594139] hover:text-rose-600 transition-all cursor-pointer"
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
                    Add, edit titles, update screenshots/photos, live URLs, metrics, or delete projects.
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
                {siteData.projects
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
                      {/* Image Thumbnail */}
                      <div className="relative h-44 bg-surface-container overflow-hidden group">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-bold">
                            {project.category.toUpperCase()}
                          </span>
                          {project.isLive && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 text-white font-mono text-[10px] font-bold">
                              {project.liveStatus || 'LIVE 🟢'}
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
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
                                  deleteProject(project.id);
                                  showToast(`Project "${project.title}" deleted.`);
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
                  Show or hide major landing page sections, or add completely new custom sections to the site.
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
                    const isVisible = siteData.sectionsVisibility[sec.key as keyof typeof siteData.sectionsVisibility];
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
                            toggleSectionVisibility(sec.key as any, !isVisible);
                            showToast(`${sec.name} is now ${!isVisible ? 'Visible' : 'Hidden'}`);
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
                      Custom Added Sections ({siteData.customSections?.length || 0})
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

                {siteData.customSections?.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-black/10 rounded-2xl bg-surface-container/30">
                    <Sparkles className="w-8 h-8 text-[#594139] mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-mono text-[#594139]">No custom sections added yet.</p>
                    <p className="text-[11px] text-[#594139]/70 mt-0.5">
                      Click &quot;Create Custom Section&quot; above to create a bespoke page block with custom content and CTAs.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {siteData.customSections?.map((cSec) => (
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
                                  deleteCustomSection(cSec.id);
                                  showToast('Custom section deleted.');
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
                  Update hero headlines, badge text, background photo, CTAs, and contact details.
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
                      value={siteData.hero.badge}
                      onChange={(e) => updateHero({ badge: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-[#191c1d] mb-1">
                      Primary Headline
                    </label>
                    <input
                      type="text"
                      value={siteData.hero.titlePrimary}
                      onChange={(e) => updateHero({ titlePrimary: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-[#191c1d] mb-1">
                      Highlight Word (Gradient)
                    </label>
                    <input
                      type="text"
                      value={siteData.hero.titleHighlight}
                      onChange={(e) => updateHero({ titleHighlight: e.target.value })}
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
                      value={siteData.hero.titleSecondary}
                      onChange={(e) => updateHero({ titleSecondary: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-[#191c1d] mb-1">
                      Stats Badge / Proof
                    </label>
                    <input
                      type="text"
                      value={siteData.hero.statsBadge}
                      onChange={(e) => updateHero({ statsBadge: e.target.value })}
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
                    value={siteData.hero.subtitle}
                    onChange={(e) => updateHero({ subtitle: e.target.value })}
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
                      value={siteData.hero.heroImage}
                      onChange={(e) => updateHero({ heroImage: e.target.value })}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary"
                    />
                    <div className="w-14 h-11 rounded-xl overflow-hidden bg-black/10 border border-black/10 shrink-0">
                      <img src={siteData.hero.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
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
                        Syncs Header & Footer Automatically
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[#594139] mt-0.5">
                      Upload your photo / company logo or enter an image URL. It instantly updates across the Navbar header and the Footer.
                    </p>
                  </div>

                  {siteData.siteSettings.logoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        updateSiteSettings({ logoUrl: '' });
                        showToast('Custom logo removed. Reverted to default monogram icon.');
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
                          value={siteData.siteSettings.logoUrl || ''}
                          onChange={(e) => {
                            updateSiteSettings({ logoUrl: e.target.value });
                          }}
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary"
                        />
                        {siteData.siteSettings.logoUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              updateSiteSettings({ logoUrl: '' });
                              showToast('Logo cleared.');
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
                        <span className="text-[10px] font-mono text-[#594139]">Real-time Sync</span>
                      </div>

                      {/* 1. Header Preview Box */}
                      <div className="space-y-1 mb-3">
                        <span className="text-[10px] font-mono text-[#594139]">Navbar Header (Light Background):</span>
                        <div className="p-3 rounded-xl bg-white border border-black/10 shadow-xs flex items-center">
                          <BrandLogo
                            logoUrl={siteData.siteSettings.logoUrl}
                            agencyName={siteData.siteSettings.agencyName || 'Tech To Web'}
                            size="sm"
                          />
                        </div>
                      </div>

                      {/* 2. Footer Preview Box */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#594139]">Footer (Dark Surface):</span>
                        <div className="p-3 rounded-xl bg-[#191c1d] border border-white/10 shadow-xs flex items-center">
                          <BrandLogo
                            logoUrl={siteData.siteSettings.logoUrl}
                            agencyName={siteData.siteSettings.agencyName || 'Tech To Web'}
                            size="sm"
                            isDarkBg={true}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[11px] font-mono text-[#594139]">
                      <span>Status: {siteData.siteSettings.logoUrl ? 'Custom Image Active' : 'Default Monogram Active'}</span>
                      {siteData.siteSettings.logoUrl && (
                        <span className="text-emerald-700 font-bold">✓ Synced</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Site Branding & Contact Details */}
              <div className="bg-white rounded-3xl p-6 border border-black/10 shadow-xs space-y-4">
                <h4 className="text-sm font-mono font-bold text-[#191c1d] uppercase tracking-wider">
                  Agency Contact & Footer Info
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-[#191c1d] mb-1">
                      Agency Name
                    </label>
                    <input
                      type="text"
                      value={siteData.siteSettings.agencyName}
                      onChange={(e) => updateSiteSettings({ agencyName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-[#191c1d] mb-1">
                      Admin / Contact Email
                    </label>
                    <input
                      type="email"
                      value={siteData.siteSettings.email}
                      onChange={(e) => updateSiteSettings({ email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-[#191c1d] mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={siteData.siteSettings.phone}
                      onChange={(e) => updateSiteSettings({ phone: e.target.value, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary"
                    />
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
                      Add, edit client recommendations, avatars, and verified metrics.
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
                  {siteData.testimonials.map((t) => (
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
                                  deleteTestimonial(t.id);
                                  showToast('Testimonial removed.');
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
                      Edit step titles, duration, descriptions, and deliverables.
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
                  {siteData.processSteps.map((step) => (
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
                                deleteProcessStep(step.number);
                                showToast(`Step ${step.number} deleted.`);
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

          {/* TAB 6: LEADS & CRM */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-[#191c1d]">Client Inquiries & Project Proposals</h3>
                  <p className="text-xs font-mono text-[#594139]">
                    Manage contact form leads, change statuses, and track project requirements.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {(['all', 'new', 'contacted', 'in_progress', 'completed'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setLeadStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold capitalize transition-all cursor-pointer ${
                        leadStatusFilter === st
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-white text-[#594139] border border-black/10 hover:bg-surface-container'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {siteData.leads.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-black/10">
                  <Inbox className="w-10 h-10 text-[#594139] mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-mono text-[#594139]">No incoming inquiries yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {siteData.leads
                    .filter((l) => (leadStatusFilter === 'all' ? true : l.status === leadStatusFilter))
                    .map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-white rounded-2xl p-5 border border-black/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-[#191c1d]">{lead.name}</h4>
                            {lead.company && (
                              <span className="text-xs font-mono text-[#594139]">({lead.company})</span>
                            )}
                            <span
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full capitalize ${
                                lead.status === 'new'
                                  ? 'bg-rose-100 text-rose-800'
                                  : lead.status === 'in_progress'
                                  ? 'bg-amber-100 text-amber-800'
                                  : lead.status === 'contacted'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              ● {lead.status.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#594139]">
                            <span>📧 {lead.email}</span>
                            <span>🎯 {lead.service}</span>
                            {lead.budget && <span>💰 {lead.budget}</span>}
                            <span>🕒 {lead.createdAt}</span>
                          </div>

                          {lead.message && (
                            <p className="text-xs text-[#191c1d] bg-surface-container p-2.5 rounded-xl border border-black/5 mt-1">
                              &quot;{lead.message}&quot;
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <select
                            value={lead.status}
                            onChange={(e) => {
                              updateLeadStatus(lead.id, e.target.value as any);
                              showToast(`Status updated to "${e.target.value}"`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none cursor-pointer"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>

                          <button
                            onClick={() => {
                              if (confirm(`Delete inquiry from ${lead.name}?`)) {
                                deleteLead(lead.id);
                                showToast('Inquiry deleted.');
                              }
                            }}
                            className="p-2 rounded-xl bg-surface-container hover:bg-rose-100 hover:text-rose-600 transition-all text-[#594139] cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
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
                        Auto-Updates Navbar & Footer
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[#594139] mt-0.5">
                      Upload your logo file or provide an image URL. It will automatically update the Header and Footer.
                    </p>
                  </div>

                  {siteData.siteSettings.logoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        updateSiteSettings({ logoUrl: '' });
                        showToast('Custom logo removed. Reverted to default monogram icon.');
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
                          value={siteData.siteSettings.logoUrl || ''}
                          onChange={(e) => {
                            updateSiteSettings({ logoUrl: e.target.value });
                          }}
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs font-mono text-[#191c1d] focus:outline-none focus:border-primary"
                        />
                        {siteData.siteSettings.logoUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              updateSiteSettings({ logoUrl: '' });
                              showToast('Logo cleared.');
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
                        <span className="text-[10px] font-mono text-[#594139]">Real-time</span>
                      </div>

                      {/* Header Preview */}
                      <div className="space-y-1 mb-3">
                        <span className="text-[10px] font-mono text-[#594139]">Header Preview:</span>
                        <div className="p-3 rounded-xl bg-white border border-black/10 shadow-xs flex items-center">
                          <BrandLogo
                            logoUrl={siteData.siteSettings.logoUrl}
                            agencyName={siteData.siteSettings.agencyName || 'Tech To Web'}
                            size="sm"
                          />
                        </div>
                      </div>

                      {/* Footer Preview */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#594139]">Footer Preview:</span>
                        <div className="p-3 rounded-xl bg-[#191c1d] border border-white/10 shadow-xs flex items-center">
                          <BrandLogo
                            logoUrl={siteData.siteSettings.logoUrl}
                            agencyName={siteData.siteSettings.agencyName || 'Tech To Web'}
                            size="sm"
                            isDarkBg={true}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[11px] font-mono text-[#594139]">
                      <span>Status: {siteData.siteSettings.logoUrl ? 'Custom Image Active' : 'Default Monogram Active'}</span>
                      {siteData.siteSettings.logoUrl && (
                        <span className="text-emerald-700 font-bold">✓ Synced</span>
                      )}
                    </div>
                  </div>
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
                  updateCategory(cat.id, cat);
                  showToast(`Category "${cat.title}" updated.`);
                } else {
                  addCategory(cat);
                  showToast(`Category "${cat.title}" created.`);
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
              categories={siteData.categories}
              selectedCatId={selectedCatForSub || editingSubService?.categoryId || siteData.categories[0]?.id}
              onSave={(catId, sub) => {
                if (editingSubService) {
                  updateSubService(catId, sub);
                  showToast(`Sub-service "${sub.name}" updated.`);
                } else {
                  addSubService(catId, sub);
                  showToast(`Sub-service "${sub.name}" added.`);
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
              categories={siteData.categories}
              onSave={(project) => {
                if (editingProject) {
                  updateProject(project.id, project);
                  showToast(`Project "${project.title}" updated.`);
                } else {
                  addProject(project);
                  showToast(`Project "${project.title}" created.`);
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
                  updateCustomSection(sec.id, sec);
                  showToast(`Section "${sec.title}" updated.`);
                } else {
                  addCustomSection(sec);
                  showToast(`Section "${sec.title}" created.`);
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
                  updateTestimonials(siteData.testimonials.map((item) => (item.id === t.id ? t : item)));
                  showToast(`Testimonial for ${t.author} updated.`);
                } else {
                  addTestimonial(t);
                  showToast(`Testimonial added.`);
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
                  updateProcessSteps(siteData.processSteps.map((s) => (s.number === step.number ? step : s)));
                  showToast(`Step ${step.number} updated.`);
                } else {
                  addProcessStep(step);
                  showToast(`Step ${step.number} added.`);
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

const CategoryForm: React.FC<{
  initial?: ServiceCategoryDetail;
  onSave: (cat: ServiceCategoryDetail) => void;
  onCancel: () => void;
}> = ({ initial, onSave, onCancel }) => {
  const [id, setId] = useState(initial?.id || 'service-' + Date.now());
  const [title, setTitle] = useState(initial?.title || '');
  const [shortLabel, setShortLabel] = useState(initial?.shortLabel || '');
  const [sublabel, setSublabel] = useState(initial?.sublabel || '');
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

      <div>
        <label className="block font-bold text-[#191c1d] mb-1">Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-black/10 font-sans text-xs"
        />
      </div>

      <div>
        <label className="block font-bold text-[#191c1d] mb-1">Hero Image URL</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-black/10 text-[11px]"
        />
      </div>

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
        <label className="block font-bold text-[#191c1d] mb-1">Sub-service Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Shopify Store Design"
          className="w-full px-3 py-2 rounded-xl border border-black/10"
        />
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

      <div>
        <label className="block font-bold text-[#191c1d] mb-1">Screenshot / Image URL</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-black/10 text-[11px]"
          />
          <div className="w-14 h-10 rounded-xl overflow-hidden bg-black/10 border border-black/10 shrink-0">
            <img src={image} alt="Preview" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

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
