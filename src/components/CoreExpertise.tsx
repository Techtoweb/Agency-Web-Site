import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Store,
  Code2,
  Megaphone,
  Search,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  CreditCard,
  Building,
  Landmark,
  Check,
  Zap,
  Sliders,
  Layers,
  Settings,
  Cpu,
  ArrowRightLeft,
  Laptop,
  Building2,
  Target,
  Smartphone,
  Database,
  Share2,
  Instagram,
  MessageSquare,
  PieChart,
  TrendingUp,
  Video,
  Mail,
  BarChart3,
  FileCode2,
  Link2,
  MapPin,
  Activity,
  Globe,
  Filter,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useSiteData } from '../data/siteDataContext';
import { SERVICES_CATEGORIES, SubServiceItem } from '../data/agencyData';

interface CoreExpertiseProps {
  selectedCategory: string;
  onSelectService: (categoryId: string) => void;
  onStartProjectForService: (serviceName: string) => void;
}

// Icon mapper for subservices
const getCategoryGradientClass = (catId: string) => {
  switch (catId) {
    case 'shopify':
      return 'bg-gradient-to-br from-[#b83200] via-[#df4305] to-[#ff6b2b] text-white shadow-xl shadow-orange-600/30 border-orange-200/50 ring-2 ring-orange-400/60';
    case 'web-dev':
      return 'bg-gradient-to-br from-[#0037b3] via-[#0256fa] to-[#00aaff] text-white shadow-xl shadow-blue-600/30 border-blue-200/50 ring-2 ring-blue-400/60';
    case 'marketing':
      return 'bg-gradient-to-br from-[#6209aa] via-[#8422db] to-[#be3cf8] text-white shadow-xl shadow-purple-600/30 border-purple-200/50 ring-2 ring-purple-400/60';
    case 'seo':
      return 'bg-gradient-to-br from-[#00575b] via-[#00897b] to-[#00c9a7] text-white shadow-xl shadow-teal-600/30 border-teal-200/50 ring-2 ring-teal-400/60';
    case 'payment-gateway':
      return 'bg-gradient-to-br from-[#047857] via-[#059669] to-[#10b981] text-white shadow-xl shadow-emerald-600/30 border-emerald-200/50 ring-2 ring-emerald-400/60';
    default:
      return 'bg-gradient-to-br from-primary via-primary-container to-secondary text-white shadow-xl border-white/40 ring-2 ring-primary/50';
  }
};

const getSubserviceIcon = (iconName: string) => {
  switch (iconName) {
    case 'Layout':
    case 'Laptop':
      return <Laptop className="w-5 h-5" />;
    case 'Code2':
      return <Code2 className="w-5 h-5" />;
    case 'Sliders':
      return <Sliders className="w-5 h-5" />;
    case 'Settings':
      return <Settings className="w-5 h-5" />;
    case 'Layers':
      return <Layers className="w-5 h-5" />;
    case 'Zap':
      return <Zap className="w-5 h-5" />;
    case 'Cpu':
      return <Cpu className="w-5 h-5" />;
    case 'ArrowRightLeft':
      return <ArrowRightLeft className="w-5 h-5" />;
    case 'ShoppingBag':
      return <ShoppingBag className="w-5 h-5" />;
    case 'Building':
      return <Building className="w-5 h-5" />;
    case 'Building2':
      return <Building2 className="w-5 h-5" />;
    case 'Landmark':
      return <Landmark className="w-5 h-5" />;
    case 'CreditCard':
      return <CreditCard className="w-5 h-5" />;
    case 'ShieldCheck':
      return <ShieldCheck className="w-5 h-5" />;
    case 'Target':
      return <Target className="w-5 h-5" />;
    case 'Smartphone':
      return <Smartphone className="w-5 h-5" />;
    case 'Database':
      return <Database className="w-5 h-5" />;
    case 'Share2':
      return <Share2 className="w-5 h-5" />;
    case 'Instagram':
      return <Instagram className="w-5 h-5" />;
    case 'MessageSquare':
      return <MessageSquare className="w-5 h-5" />;
    case 'PieChart':
      return <PieChart className="w-5 h-5" />;
    case 'TrendingUp':
      return <TrendingUp className="w-5 h-5" />;
    case 'Video':
      return <Video className="w-5 h-5" />;
    case 'Mail':
      return <Mail className="w-5 h-5" />;
    case 'BarChart3':
      return <BarChart3 className="w-5 h-5" />;
    case 'FileCode2':
      return <FileCode2 className="w-5 h-5" />;
    case 'Link2':
      return <Link2 className="w-5 h-5" />;
    case 'MapPin':
      return <MapPin className="w-5 h-5" />;
    case 'Activity':
      return <Activity className="w-5 h-5" />;
    case 'Globe':
      return <Globe className="w-5 h-5" />;
    case 'Store':
      return <Store className="w-5 h-5" />;
    default:
      return <Sparkles className="w-5 h-5" />;
  }
};

export const CoreExpertise: React.FC<CoreExpertiseProps> = ({
  selectedCategory,
  onSelectService,
  onStartProjectForService
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'simulator'>('categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalSubService, setActiveModalSubService] = useState<SubServiceItem | null>(null);

  // Simulations states
  const [shopifyStep, setShopifyStep] = useState<'store' | 'product' | 'cart' | 'checkout'>('cart');
  const [webDevTab, setWebDevTab] = useState<'preview' | 'code' | 'vitals'>('preview');
  const [marketingBudget, setMarketingBudget] = useState<number>(5000);
  const [seoKeyword, setSeoKeyword] = useState<string>('minimalist sustainable jewelry');
  const [isSimulatingSeo, setIsSimulatingSeo] = useState<boolean>(false);
  const [seoRank, setSeoRank] = useState<number>(1);

  const calculateMarketingMetrics = (budget: number) => {
    const roas = 4.4;
    const revenue = budget * roas;
    const leads = Math.round(budget / 18);
    const clicks = Math.round(budget / 0.85);
    return { revenue, leads, clicks, roas };
  };

  const marketingMetrics = calculateMarketingMetrics(marketingBudget);

  const handleSimulateSeo = () => {
    setIsSimulatingSeo(true);
    setSeoRank(14);
    setTimeout(() => {
      setSeoRank(6);
    }, 500);
    setTimeout(() => {
      setSeoRank(1);
      setIsSimulatingSeo(false);
    }, 1100);
  };

  const { siteData } = useSiteData();
  const categoriesList = siteData?.categories && siteData.categories.length > 0 ? siteData.categories : SERVICES_CATEGORIES;

  const currentCategoryData =
    categoriesList.find((c) => c.id === selectedCategory) || categoriesList[0] || SERVICES_CATEGORIES[0];

  // Filter sub-services by search query
  const filteredSubServices = (currentCategoryData.subServices || []).filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section id="services" className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20 mb-24 md:mb-32 pt-12">
      {/* Section Header */}
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-fixed/40 text-secondary font-mono text-xs font-semibold mb-4 border border-secondary-fixed"
        >
          Specialized Engineering & Growth
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-[52px] font-extrabold tracking-tight text-[#191c1d] leading-tight mb-4"
        >
          Our Core Service Pillars
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg text-[#594139] leading-relaxed"
        >
          Explore our full range of technical capabilities. Click on any service card to view deliverables and specifications.
        </motion.p>
      </div>

      {/* 5 MAIN PRIMARY OPTIONS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 mb-12">
        {categoriesList.map((cat, index) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              onClick={() => {
                onSelectService(cat.id);
                setSearchQuery('');
              }}
              className={`relative text-left p-5 sm:p-6 rounded-3xl transition-all duration-300 cursor-pointer overflow-hidden border ${
                isSelected
                  ? `${getCategoryGradientClass(cat.id)} scale-[1.02]`
                  : 'bg-white text-[#191c1d] hover:bg-white/95 hover:shadow-lg border-white/80 hover:-translate-y-1'
              }`}
            >
              {/* Top Glow Accent Indicator */}
              {isSelected && (
                <motion.div
                  layoutId="activePillarPill"
                  className="absolute top-0 left-0 right-0 h-1.5 bg-white/40 shadow-xs backdrop-blur-xs"
                />
              )}

              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? 'bg-white/20 text-white shadow-inner backdrop-blur-md border border-white/30'
                      : 'bg-surface-container text-[#191c1d]'
                  }`}
                >
                  {cat.id === 'shopify' && <Store className="w-5 h-5" />}
                  {cat.id === 'web-dev' && <Code2 className="w-5 h-5" />}
                  {cat.id === 'marketing' && <Megaphone className="w-5 h-5" />}
                  {cat.id === 'seo' && <Search className="w-5 h-5" />}
                  {cat.id === 'payment-gateway' && <CreditCard className="w-5 h-5" />}
                  {!['shopify', 'web-dev', 'marketing', 'seo', 'payment-gateway'].includes(cat.id) && <Layers className="w-5 h-5" />}
                </div>

                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    isSelected
                      ? 'bg-white/20 text-white backdrop-blur-md border border-white/30'
                      : 'bg-surface-container text-[#594139]'
                  }`}
                >
                  {cat.subServices.length} Services
                </span>
              </div>

              <div>
                <span
                  className={`text-[11px] font-mono font-bold uppercase tracking-wider block mb-1 ${
                    isSelected ? 'text-white/90 drop-shadow-xs' : 'text-primary'
                  }`}
                >
                  {cat.sublabel}
                </span>
                <h3
                  className={`text-lg sm:text-xl font-extrabold tracking-tight ${
                    isSelected ? 'text-white' : 'text-[#191c1d]'
                  }`}
                >
                  {cat.shortLabel}
                </h3>
              </div>

              <div className="mt-5 pt-4 border-t border-white/20 flex items-center justify-between">
                <span
                  className={`text-xs font-mono font-semibold flex items-center gap-1.5 ${
                    isSelected ? 'text-white' : 'text-primary'
                  }`}
                >
                  <span>{isSelected ? 'Active Selection' : 'Explore Category'}</span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      isSelected ? 'translate-x-1' : ''
                    }`}
                  />
                </span>
                <span
                  className={`text-[11px] font-mono font-bold ${
                    isSelected ? 'text-white/90' : 'text-neutral-400'
                  }`}
                >
                  {cat.stats.value}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* DYNAMIC CATEGORY EXPLORER CONTAINER */}
      <div className="bg-surface-container-low/80 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 lg:p-12 border border-white/80 shadow-glass">
        {/* Header with Active Domain Details & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 mb-8 border-b border-surface-variant">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold mb-2 bg-white border border-black/5 shadow-2xs text-[#191c1d]">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>
                Domain: <strong className="text-primary">{currentCategoryData.shortLabel} ({currentCategoryData.sublabel})</strong>
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#191c1d] tracking-tight">
              {currentCategoryData.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#594139] mt-1 max-w-2xl">
              Click any service card to view complete specifications, tools, and deliverables.
            </p>
          </div>

          {/* View Toggles & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* View Mode Switcher */}
            <div className="bg-surface-container p-1 rounded-xl flex items-center">
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === 'categories'
                    ? 'bg-white text-[#191c1d] shadow-xs'
                    : 'text-[#594139] hover:text-[#191c1d]'
                }`}
              >
                Catalog ({currentCategoryData.subServices.length})
              </button>
              <button
                onClick={() => setActiveTab('simulator')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'simulator'
                    ? 'bg-white text-primary shadow-xs'
                    : 'text-[#594139] hover:text-[#191c1d]'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span>Live Simulator</span>
              </button>
            </div>

            {/* Quick Search */}
            {activeTab === 'categories' && (
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Filter ${currentCategoryData.shortLabel}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-48 pl-8 pr-3 py-1.5 text-xs font-mono bg-white rounded-xl border border-black/10 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                />
                <Filter className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'categories' ? (
            <motion.div
              key={`cat-grid-${currentCategoryData.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {filteredSubServices.length === 0 ? (
                <div className="text-center py-12 bg-white/60 rounded-2xl border border-black/5">
                  <p className="text-sm font-mono text-[#594139]">
                    No service found matching "{searchQuery}".
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-3 text-xs font-mono font-bold text-primary underline cursor-pointer"
                  >
                    Clear Filter
                  </button>
                </div>
              ) : (
                /* COMPACT, SLEEK & MODERN CARDS GRID */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                  {filteredSubServices.map((sub, idx) => (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.03 }}
                      onClick={() => setActiveModalSubService(sub)}
                      className="group bg-white rounded-2xl p-5 border border-black/5 hover:border-primary/50 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-xs hover:shadow-lg hover:-translate-y-1 relative overflow-hidden"
                    >
                      {/* Top Accent bar on hover */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                      <div>
                        {/* Card Header: Icon + Number badge */}
                        <div className="flex items-center justify-between mb-3.5">
                          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-[#191c1d] group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-2xs">
                            {getSubserviceIcon(sub.icon)}
                          </div>
                          <span className="text-[10px] font-mono text-neutral-400 group-hover:text-primary font-bold transition-colors">
                            0{idx + 1}
                          </span>
                        </div>

                        {/* Title - Full Name clearly displayed */}
                        <h4 className="text-sm sm:text-[15px] font-bold text-[#191c1d] mb-2 group-hover:text-primary transition-colors leading-snug min-h-[42px] flex items-start">
                          {sub.name}
                        </h4>

                        {/* Clean description */}
                        <p className="text-xs text-[#594139] leading-relaxed line-clamp-2 mb-3.5">
                          {sub.desc}
                        </p>
                      </div>

                      {/* Card Footer: 1 tag + Click to view indicator */}
                      <div className="pt-3 border-t border-surface-variant/60 flex items-center justify-between mt-auto">
                        <span className="text-[10px] font-mono text-neutral-600 bg-surface-container px-2 py-0.5 rounded-md font-medium">
                          {sub.tags[0]}
                        </span>
                        
                        <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-primary group-hover:translate-x-1 transition-transform">
                          <span>View Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Bottom Call to Action for Selected Pillar */}
              <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-white border border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#191c1d]">
                      Looking for custom {currentCategoryData.shortLabel} development or retainer?
                    </h5>
                    <p className="text-xs text-[#594139]">
                      We configure bespoke combinations, technical sprints, and dedicated engineers.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    onStartProjectForService(`Custom ${currentCategoryData.title} Package`)
                  }
                  className="bg-primary hover:bg-primary-container text-white font-mono text-xs font-bold px-5 py-2.5 rounded-full transition-all shadow-md hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
                >
                  Request Custom Quote
                </button>
              </div>
            </motion.div>
          ) : (
            /* SIMULATOR TAB */
            <motion.div
              key={`simulator-${currentCategoryData.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-white text-primary border border-black/5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Real-Time Output Simulator</span>
                </div>
                <h4 className="text-2xl font-bold text-[#191c1d]">
                  Experience our {currentCategoryData.shortLabel} Standard
                </h4>
                <p className="text-sm text-[#594139] leading-relaxed">
                  Interact with the live simulator on the right to visualize the performance metrics, speed, and conversion mechanics we deploy for every client project.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() =>
                      onStartProjectForService(`${currentCategoryData.title} Implementation`)
                    }
                    className="inline-flex items-center gap-2 bg-[#191c1d] hover:bg-primary text-white font-mono text-xs font-bold px-5 py-3 rounded-full transition-colors cursor-pointer"
                  >
                    <span>Deploy This Architecture</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="glass-panel p-6 rounded-3xl border border-white/80 shadow-glass-lg relative overflow-hidden bg-white/95">
                  {/* Header of simulator widget */}
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-surface-variant">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-400" />
                      <span className="w-3 h-3 rounded-full bg-amber-400" />
                      <span className="w-3 h-3 rounded-full bg-emerald-400" />
                      <span className="ml-2 text-xs font-mono font-bold text-[#594139]">
                        Interactive Playground
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary bg-primary-fixed/40 px-2.5 py-1 rounded-full">
                      Live Telemetry
                    </span>
                  </div>

                  {/* 1. SHOPIFY CONVERSION SIMULATOR */}
                  {selectedCategory === 'shopify' && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between bg-surface-container/60 p-1.5 rounded-xl text-xs font-mono">
                        {[
                          { id: 'store', label: '1. Storefront' },
                          { id: 'product', label: '2. Product' },
                          { id: 'cart', label: '3. Fast Cart' },
                          { id: 'checkout', label: '4. 1-Click Pay' },
                        ].map((step) => (
                          <button
                            key={step.id}
                            onClick={() => setShopifyStep(step.id as any)}
                            className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all text-center cursor-pointer ${
                              shopifyStep === step.id
                                ? 'bg-white text-primary shadow-xs'
                                : 'text-[#594139] hover:text-[#191c1d]'
                            }`}
                          >
                            {step.label}
                          </button>
                        ))}
                      </div>

                      <div className="bg-surface rounded-2xl p-5 border border-black/5 relative min-h-[200px] flex flex-col justify-center">
                        {shopifyStep === 'store' && (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-mono font-bold text-[#191c1d]">AURA LUXE STUDIOS</span>
                              <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">99.8% Speed</span>
                            </div>
                            <div className="h-20 bg-gradient-to-r from-primary-fixed/40 to-secondary-fixed/40 rounded-xl flex items-center justify-center text-xs font-mono font-bold text-[#191c1d]">
                              Hydrogen 2.0 Edge Storefront Loaded
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="h-8 bg-white rounded-lg border border-black/5" />
                              <div className="h-8 bg-white rounded-lg border border-black/5" />
                              <div className="h-8 bg-white rounded-lg border border-black/5" />
                            </div>
                          </div>
                        )}

                        {shopifyStep === 'product' && (
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#ffdbd0] to-[#dde1ff] flex items-center justify-center text-2xl shadow-inner shrink-0">
                              🛋️
                            </div>
                            <div className="space-y-1.5 flex-1">
                              <div className="text-sm font-bold text-[#191c1d]">Sculptural Lounge Chair</div>
                              <div className="text-xs font-mono text-primary font-bold">$1,280 USD</div>
                              <button
                                onClick={() => setShopifyStep('cart')}
                                className="mt-1 text-xs bg-primary text-white font-mono px-3 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer"
                              >
                                <ShoppingBag className="w-3 h-3" />
                                <span>Add to Bag</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {shopifyStep === 'cart' && (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs font-bold text-[#191c1d]">
                              <span>Drawer Cart (0.1s Slide)</span>
                              <span className="text-emerald-600 font-mono">Free Global Express</span>
                            </div>
                            <div className="p-2.5 bg-white rounded-xl border border-black/5 flex justify-between items-center">
                              <div className="text-xs font-medium text-[#191c1d]">Sculptural Lounge Chair (x1)</div>
                              <div className="text-xs font-mono font-bold text-primary">$1,280</div>
                            </div>
                            <button
                              onClick={() => setShopifyStep('checkout')}
                              className="w-full bg-[#191c1d] hover:bg-primary text-white text-xs font-mono font-bold py-2 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Proceed to 1-Click Checkout</span>
                            </button>
                          </div>
                        )}

                        {shopifyStep === 'checkout' && (
                          <div className="text-center space-y-2 py-2">
                            <div className="w-9 h-9 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                              <Check className="w-4 h-4" />
                            </div>
                            <div className="text-sm font-bold text-[#191c1d]">Hydrogen Checkout Authorized</div>
                            <p className="text-xs text-[#594139]">Processed in 1.2 seconds total.</p>
                            <div className="text-[11px] font-mono text-primary font-bold">Conversion Rate: 4.8% (Benchmark: 1.8%)</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 2. WEB DEV INTERACTIVE INSPECTOR */}
                  {selectedCategory === 'web-dev' && (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        {(['preview', 'code', 'vitals'] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setWebDevTab(tab)}
                            className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                              webDevTab === tab
                                ? 'bg-secondary text-white shadow-xs'
                                : 'bg-surface-container text-[#594139] hover:bg-white'
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      {webDevTab === 'preview' && (
                        <div className="p-4 bg-white rounded-2xl border border-black/5 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-mono font-bold text-secondary">React 19 + Next.js App Router</span>
                            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold">
                              SSR Edge Deployed
                            </span>
                          </div>
                          <div className="h-16 bg-gradient-to-r from-secondary-fixed/30 to-tertiary-fixed/30 rounded-xl p-3 flex flex-col justify-between">
                            <div className="text-xs font-bold text-[#191c1d]">Enterprise SaaS Architecture</div>
                            <div className="flex gap-2">
                              <div className="h-1.5 bg-secondary rounded-full w-3/4" />
                              <div className="h-1.5 bg-primary-container rounded-full w-1/4" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                            <div className="p-2 bg-surface rounded-lg">TTFB: <span className="font-bold text-emerald-600">28ms</span></div>
                            <div className="p-2 bg-surface rounded-lg">Bundle: <span className="font-bold text-emerald-600">14kb gzip</span></div>
                          </div>
                        </div>
                      )}

                      {webDevTab === 'code' && (
                        <div className="p-4 bg-[#191c1d] rounded-2xl font-mono text-[11px] text-emerald-400 space-y-1 overflow-x-auto">
                          <p className="text-neutral-500">// Modular High-Velocity Web Component</p>
                          <p><span className="text-purple-400">export const</span> <span className="text-yellow-300">FastApp</span> = () =&gt; &#123;</p>
                          <p className="pl-3"><span className="text-purple-400">const</span> vitals = <span className="text-blue-400">usePerformanceMetrics</span>();</p>
                          <p className="pl-3"><span className="text-purple-400">return</span> &lt;<span className="text-rose-400">EdgeRenderer</span> score=&#123;<span className="text-amber-300">100</span>&#125; /&gt;;</p>
                          <p>&#125;;</p>
                        </div>
                      )}

                      {webDevTab === 'vitals' && (
                        <div className="grid grid-cols-4 gap-2 text-center">
                          {[
                            { metric: 'Perf', val: '100' },
                            { metric: 'Access', val: '100' },
                            { metric: 'Best', val: '100' },
                            { metric: 'SEO', val: '100' },
                          ].map((item, i) => (
                            <div key={i} className="p-3 bg-white rounded-xl border border-black/5">
                              <div className="w-9 h-9 rounded-full border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto text-xs font-mono font-bold mb-1">
                                {item.val}
                              </div>
                              <div className="text-[10px] font-mono text-[#594139]">{item.metric}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. DIGITAL MARKETING ROAS SIMULATOR */}
                  {selectedCategory === 'marketing' && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center text-xs font-mono font-bold text-[#191c1d] mb-2">
                          <span>Monthly Media Budget:</span>
                          <span className="text-primary text-sm">${marketingBudget.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min="1000"
                          max="25000"
                          step="500"
                          value={marketingBudget}
                          onChange={(e) => setMarketingBudget(Number(e.target.value))}
                          className="w-full accent-primary h-2 bg-surface-variant rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                        <div className="p-2.5 bg-white rounded-xl border border-black/5 text-center">
                          <div className="text-[11px] text-[#594139] font-mono">Est. Revenue</div>
                          <div className="text-sm font-extrabold text-primary font-mono mt-0.5">
                            ${marketingMetrics.revenue.toLocaleString()}
                          </div>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-black/5 text-center">
                          <div className="text-[11px] text-[#594139] font-mono">Blended ROAS</div>
                          <div className="text-sm font-extrabold text-emerald-600 font-mono mt-0.5">
                            {marketingMetrics.roas}x
                          </div>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-black/5 text-center">
                          <div className="text-[11px] text-[#594139] font-mono">Target Leads</div>
                          <div className="text-sm font-extrabold text-[#191c1d] font-mono mt-0.5">
                            {marketingMetrics.leads}
                          </div>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-black/5 text-center">
                          <div className="text-[11px] text-[#594139] font-mono">Clicks</div>
                          <div className="text-sm font-extrabold text-[#191c1d] font-mono mt-0.5">
                            {marketingMetrics.clicks}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. SEO KEYWORD ELEVATOR SIMULATOR */}
                  {selectedCategory === 'seo' && (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={seoKeyword}
                          onChange={(e) => setSeoKeyword(e.target.value)}
                          placeholder="Enter target search query..."
                          className="flex-1 px-3 py-2 text-xs font-mono bg-white rounded-xl border border-black/10 focus:outline-none focus:ring-1 focus:ring-[#00696e]"
                        />
                        <button
                          onClick={handleSimulateSeo}
                          disabled={isSimulatingSeo}
                          className="px-3.5 py-2 bg-[#00696e] hover:bg-[#00383a] text-white text-xs font-mono font-bold rounded-xl transition-colors shrink-0 cursor-pointer"
                        >
                          {isSimulatingSeo ? 'Auditing...' : 'Rank #1'}
                        </button>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-black/5 space-y-1.5">
                        <div className="text-[10px] font-mono text-neutral-400">https://yourbrand.com › shop</div>
                        <div className="text-xs font-bold text-blue-700 hover:underline">
                          {seoKeyword.charAt(0).toUpperCase() + seoKeyword.slice(1)} | Official Store 2026
                        </div>
                        <div className="flex items-center gap-2 pt-1 text-[10px] font-mono">
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                            Rank: #{seoRank}
                          </span>
                          <span className="text-[#00696e] font-bold">CTR: 36.4%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DETAILED SERVICE MODAL POPUP (ON CARD CLICK) */}
      <AnimatePresence>
        {activeModalSubService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalSubService(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 shadow-2xl border border-white/60 z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalSubService(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-surface-container hover:bg-surface-variant flex items-center justify-center text-[#191c1d] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-start gap-4 mb-6 pr-8">
                <div className="w-13 h-13 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center shrink-0 shadow-xs">
                  {getSubserviceIcon(activeModalSubService.icon)}
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary block mb-1">
                    {currentCategoryData.shortLabel} / {currentCategoryData.sublabel}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#191c1d] leading-tight">
                    {activeModalSubService.name}
                  </h3>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="mb-6 p-4 rounded-2xl bg-surface-container-low/70 border border-black/5">
                <p className="text-xs sm:text-sm text-[#594139] leading-relaxed">
                  {activeModalSubService.desc}
                </p>
              </div>

              {/* Key Deliverables & Scope */}
              <div className="mb-6">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#191c1d] mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Key Deliverables & Specifications</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeModalSubService.deliverables.map((deliv, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-3 rounded-xl bg-white border border-black/5 shadow-2xs flex items-start gap-2.5 text-xs text-[#191c1d]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="font-medium leading-snug">{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technology & Framework Tags */}
              <div className="mb-8">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#191c1d] mb-2.5">
                  Technologies & Frameworks
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalSubService.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-xs font-mono bg-surface-container text-[#191c1d] px-3 py-1 rounded-lg border border-black/5 font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-surface-variant">
                <button
                  onClick={() => setActiveModalSubService(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-mono font-bold text-[#594139] hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Close Details
                </button>

                <button
                  onClick={() => {
                    const serviceTitle = `${currentCategoryData.shortLabel} - ${activeModalSubService.name}`;
                    setActiveModalSubService(null);
                    onStartProjectForService(serviceTitle);
                  }}
                  className="w-full sm:w-auto bg-primary hover:bg-primary-container text-white font-mono text-xs font-bold px-6 py-3 rounded-full transition-all shadow-md hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Start With This Service</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
