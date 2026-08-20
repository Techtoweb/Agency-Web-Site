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
  ShieldCheck,
  Clock,
  Tag,
  ShoppingCart
} from 'lucide-react';
import { useSiteData } from '../data/siteDataContext';
import { SERVICES_CATEGORIES, SubServiceItem } from '../data/agencyData';

interface CoreExpertiseProps {
  selectedCategory: string;
  onSelectService: (categoryId: string) => void;
  onStartProjectForService: (serviceName: string) => void;
  onOrderService?: (categoryTitle: string, subService: SubServiceItem) => void;
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
  onStartProjectForService,
  onOrderService
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
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold mb-4 border border-primary/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Services & Tailored Pricing</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl font-extrabold text-[#191c1d] tracking-tight leading-tight mb-4"
        >
          Engineered for Revenue & Scale.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-[#594139] leading-relaxed font-sans"
        >
          Explore our specialized engineering disciplines with transparent pricing, guaranteed delivery timeframes, and instant order placement.
        </motion.p>
      </div>

      {/* Top 5 Dominant Category Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
        {categoriesList.map((cat, idx) => {
          const isSelected = selectedCategory === cat.id;
          const gradientClass = getCategoryGradientClass(cat.id);

          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => onSelectService(cat.id)}
              className={`relative text-left p-4 sm:p-5 rounded-2xl sm:rounded-3xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[140px] sm:min-h-[160px] ${
                isSelected
                  ? `${gradientClass} scale-[1.03] z-10`
                  : 'bg-white hover:bg-surface-container border border-black/5 hover:border-black/15 shadow-xs hover:shadow-md text-[#191c1d]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider ${
                      isSelected ? 'text-white/90' : 'text-primary'
                    }`}
                  >
                    {cat.shortLabel}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  )}
                </div>

                <h4
                  className={`text-sm sm:text-base font-extrabold leading-snug tracking-tight ${
                    isSelected ? 'text-white' : 'text-[#191c1d]'
                  }`}
                >
                  {cat.title}
                </h4>
              </div>

              <div className="pt-2 border-t border-black/5 flex items-center justify-between">
                <span
                  className={`text-[10px] sm:text-xs font-mono font-bold ${
                    isSelected ? 'text-white/90' : 'text-emerald-700 font-semibold'
                  }`}
                >
                  {cat.startingPrice ? `From ${cat.startingPrice}` : (cat.stats?.label || 'Available')}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold ${
                    isSelected ? 'text-white/90' : 'text-[#594139]'
                  }`}
                >
                  {cat.subServices?.length || 0} Options
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
              {currentCategoryData.startingPrice && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold">
                  From {currentCategoryData.startingPrice}
                </span>
              )}
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#191c1d] tracking-tight">
              {currentCategoryData.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#594139] mt-1 max-w-2xl">
              {currentCategoryData.description}
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
                Services Catalog ({currentCategoryData.subServices.length})
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
                /* COMPACT, SLEEK & MODERN CARDS GRID WITH EXPLICIT PRICING */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {filteredSubServices.map((sub, idx) => (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.03 }}
                      onClick={() => setActiveModalSubService(sub)}
                      className="group bg-white rounded-3xl p-5 border border-black/5 hover:border-primary/50 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-xs hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
                    >
                      {/* Top Accent bar on hover */}
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                      <div>
                        {/* Card Header: Icon + Price Badge */}
                        <div className="flex items-start justify-between gap-2 mb-3.5">
                          <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center text-[#191c1d] group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-2xs shrink-0">
                            {getSubserviceIcon(sub.icon)}
                          </div>
                          
                          <div className="text-right">
                            {sub.price ? (
                              <span className="inline-block px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-mono text-xs font-bold border border-emerald-200/80 shadow-2xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                {sub.price}
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono text-neutral-400 group-hover:text-primary font-bold transition-colors">
                                0{idx + 1}
                              </span>
                            )}
                            {sub.badge && (
                              <span className="block text-[9px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded mt-0.5">
                                {sub.badge}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title - Full Name clearly displayed */}
                        <h4 className="text-sm sm:text-[15px] font-bold text-[#191c1d] mb-1.5 group-hover:text-primary transition-colors leading-snug min-h-[42px] flex items-start">
                          {sub.name}
                        </h4>

                        {/* Clean description */}
                        <p className="text-xs text-[#594139] leading-relaxed line-clamp-2 mb-3">
                          {sub.desc}
                        </p>

                        {/* Delivery Time & Key Feature */}
                        {sub.deliveryTime && (
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#594139] bg-surface-container/70 px-2.5 py-1 rounded-lg mb-3">
                            <Clock className="w-3 h-3 text-primary shrink-0" />
                            <span>Delivery: <strong className="text-[#191c1d]">{sub.deliveryTime}</strong></span>
                          </div>
                        )}
                      </div>

                      {/* Card Footer: View Details & Order Button */}
                      <div className="pt-3 border-t border-surface-variant/60 flex items-center justify-between mt-auto">
                        <span className="text-[10px] font-mono text-neutral-600 bg-surface-container px-2 py-0.5 rounded-md font-medium truncate max-w-[110px]">
                          {sub.tags[0]}
                        </span>
                        
                        <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-primary group-hover:translate-x-0.5 transition-transform">
                          <span>View & Order</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Bottom Call to Action for Selected Pillar */}
              <div className="mt-8 p-5 sm:p-6 rounded-3xl bg-white border border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary shrink-0 shadow-2xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#191c1d]">
                      Need a custom or multi-domain package for {currentCategoryData.shortLabel}?
                    </h5>
                    <p className="text-xs text-[#594139]">
                      We can configure combined sprints, custom payment gateway infrastructure, and dedicated developers.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    onStartProjectForService(`Custom ${currentCategoryData.title} Package`)
                  }
                  className="bg-primary hover:bg-primary-container text-white font-mono text-xs font-bold px-6 py-3 rounded-full transition-all shadow-md hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
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
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Simulation Widgets based on Category */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6">
                {currentCategoryData.id === 'shopify' ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-black/5">
                      <span className="font-mono text-xs font-bold text-[#191c1d]">
                        Shopify 2.0 Checkout Simulator
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                        Sub-Second TTFB
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {['store', 'product', 'cart', 'checkout'].map((step) => (
                        <button
                          key={step}
                          onClick={() => setShopifyStep(step as any)}
                          className={`flex-1 py-2 text-center rounded-xl text-xs font-mono capitalize transition-all cursor-pointer ${
                            shopifyStep === step
                              ? 'bg-primary text-white font-bold shadow-xs'
                              : 'bg-surface text-[#594139] hover:bg-surface-container'
                          }`}
                        >
                          {step}
                        </button>
                      ))}
                    </div>

                    <div className="p-4 rounded-2xl bg-surface-container border border-black/5 text-xs font-mono space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#594139]">Active Step:</span>
                        <span className="font-bold text-[#191c1d] uppercase">{shopifyStep}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#594139]">Liquid Render Time:</span>
                        <span className="font-bold text-emerald-600">84ms (Edge Cached)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#594139]">Conversion Uplift:</span>
                        <span className="font-bold text-primary">+42.8% Average</span>
                      </div>
                    </div>
                  </div>
                ) : currentCategoryData.id === 'payment-gateway' ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-black/5">
                      <span className="font-mono text-xs font-bold text-[#191c1d]">
                        Global Merchant & Payment Gateway Simulator
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                        100% Approval Rate
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3.5 rounded-2xl bg-surface-container border border-black/5">
                        <span className="text-[#594139] block text-[10px]">Formation Type</span>
                        <span className="font-bold text-[#191c1d]">Wyoming USA LLC / UK LTD</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-surface-container border border-black/5">
                        <span className="text-[#594139] block text-[10px]">Gateways Connected</span>
                        <span className="font-bold text-emerald-600">Stripe US + PayPal + Mercury</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-900 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>Ready for Global Checkout in 135+ Currencies</span>
                      </div>
                      <p className="text-[11px] text-emerald-800">
                        Zero border restrictions. Instant card checkout with 3D Secure 2.0.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-black/5">
                      <span className="font-mono text-xs font-bold text-[#191c1d]">
                        High-Scale Digital Engine
                      </span>
                      <span className="text-[10px] font-mono text-primary bg-primary-fixed/50 px-2 py-0.5 rounded-full font-bold">
                        Ultra-Fast SLA
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-surface-container border border-black/5 text-xs font-mono space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#594139]">System Architecture:</span>
                        <span className="font-bold text-[#191c1d]">React 19 + TypeScript + Edge API</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#594139]">Lighthouse Score:</span>
                        <span className="font-bold text-emerald-600">99/100 Core Web Vitals</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DETAILED SUB-SERVICE SPECIFICATION & ORDER MODAL */}
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
              className="relative w-full max-w-2xl bg-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 shadow-2xl border border-white/60 z-10 max-h-[90vh] overflow-y-auto"
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
                <div className="w-14 h-14 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center shrink-0 shadow-xs">
                  {getSubserviceIcon(activeModalSubService.icon)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                      {currentCategoryData.shortLabel} / {currentCategoryData.sublabel}
                    </span>
                    {activeModalSubService.badge && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">
                        {activeModalSubService.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#191c1d] leading-tight mt-1">
                    {activeModalSubService.name}
                  </h3>
                </div>
              </div>

              {/* Pricing & Delivery Summary Box */}
              <div className="mb-6 p-4 rounded-2xl bg-surface-container border border-black/5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono text-[#594139] uppercase block font-bold">Package Investment</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-mono">
                    {activeModalSubService.price || currentCategoryData.startingPrice || 'Custom Quote'}
                  </span>
                  {activeModalSubService.pricingType && (
                    <span className="text-[11px] font-mono text-[#594139] ml-1.5">
                      ({activeModalSubService.pricingType})
                    </span>
                  )}
                </div>

                {activeModalSubService.deliveryTime && (
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#594139] uppercase block font-bold">Turnaround Time</span>
                    <span className="text-sm font-bold text-[#191c1d] font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {activeModalSubService.deliveryTime}
                    </span>
                  </div>
                )}
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
                  {activeModalSubService.deliverables?.map((deliv, dIdx) => (
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
                  Technologies & Standards
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalSubService.tags?.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-xs font-mono bg-surface-container text-[#191c1d] px-3 py-1 rounded-lg border border-black/5 font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Footer Actions: Order Service Now */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-surface-variant">
                <button
                  onClick={() => setActiveModalSubService(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-mono font-bold text-[#594139] hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Close Details
                </button>

                <button
                  onClick={() => {
                    const sub = activeModalSubService;
                    setActiveModalSubService(null);
                    if (onOrderService) {
                      onOrderService(currentCategoryData.title, sub);
                    } else {
                      onStartProjectForService(`${currentCategoryData.shortLabel} - ${sub.name}`);
                    }
                  }}
                  className="w-full sm:w-auto bg-primary hover:bg-primary-container text-white font-mono text-xs font-bold px-7 py-3.5 rounded-full transition-all shadow-md hover:scale-105 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Order This Service Now {activeModalSubService.price ? `(${activeModalSubService.price})` : ''}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
