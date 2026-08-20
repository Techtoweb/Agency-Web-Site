import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircle,
  Mail,
  X,
  Copy,
  Check,
  Send,
  ExternalLink,
  Headphones,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Clock,
  PhoneCall
} from 'lucide-react';
import { useSiteData } from '../data/siteDataContext';

interface FloatingSupportWidgetProps {
  onOpenContactModal?: (serviceName?: string, subServiceName?: string, price?: string, delivery?: string, orderType?: 'order' | 'proposal' | 'contact') => void;
}

export const FloatingSupportWidget: React.FC<FloatingSupportWidgetProps> = ({ onOpenContactModal }) => {
  const { siteData } = useSiteData();
  const settings = siteData?.siteSettings || {
    agencyName: 'Tech To Web',
    email: 'techtowebadmin@gmail.com',
    whatsapp: '+1 (800) 555-0199',
    phone: '+1 (800) 555-0199'
  };

  const [isOpen, setIsOpen] = useState(false);
  const [quickMessage, setQuickMessage] = useState('');
  const [copiedType, setCopiedType] = useState<'whatsapp' | 'email' | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'whatsapp' | 'email'>('all');
  const widgetRef = useRef<HTMLDivElement>(null);

  const rawWhatsapp = settings.whatsapp || settings.phone || '+1 (800) 555-0199';
  const cleanWhatsappNumber = rawWhatsapp.replace(/[^0-9]/g, '');
  const supportEmail = settings.email || 'techtowebadmin@gmail.com';

  // Close widget when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleCopy = (text: string, type: 'whatsapp' | 'email') => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      // fallback
    }
  };

  // WhatsApp click handler with optional custom message
  const handleOpenWhatsApp = () => {
    const msg = quickMessage.trim()
      ? `Hello Tech To Web Support Team,\n\n${quickMessage.trim()}`
      : `Hello Tech To Web Support Team, I am visiting your website and would like to get in touch regarding your services and project consultation.`;
    
    const url = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Email click handler with optional custom message
  const handleOpenEmail = () => {
    const subject = `Support & Project Inquiry - Tech To Web`;
    const body = quickMessage.trim()
      ? `Hi Tech To Web Support Team,\n\n${quickMessage.trim()}\n\nBest regards.`
      : `Hi Tech To Web Support Team,\n\nI am contacting you from your website regarding your digital services. Please share your availability and consultation details.\n\nThank you.`;

    const mailtoUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  // Open the interactive on-site contact modal
  const handleOpenOnSiteForm = () => {
    setIsOpen(false);
    if (onOpenContactModal) {
      onOpenContactModal('General Inquiry & Live Support', '', '', '', 'contact');
    }
  };

  return (
    <div ref={widgetRef} className="fixed bottom-6 right-6 z-[95] flex flex-col items-end">
      {/* POPUP SUPPORT HUB CARD */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 w-[92vw] sm:w-[390px] max-w-[420px] bg-white rounded-3xl shadow-2xl border border-black/10 overflow-hidden text-[#191c1d]"
          >
            {/* Header with Live Status */}
            <div className="bg-gradient-to-r from-[#191c1d] via-[#2a2f32] to-[#191c1d] p-5 text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white shadow-inner">
                      <Headphones className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#191c1d] rounded-full animate-pulse" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm tracking-tight text-white">Live Support & Helpdesk</h4>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Online Now
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-neutral-300 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-400" /> WhatsApp & Email Fast Support
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all cursor-pointer"
                  title="Close Support Window"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sub-tag */}
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-neutral-300">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Guaranteed 24/7 Assistance
                </span>
                <span className="text-emerald-400 font-bold">⚡ Reply in &lt; 5 mins</span>
              </div>
            </div>

            {/* Channels & Actions Container */}
            <div className="p-4 sm:p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
              {/* CHANNEL 1: WHATSAPP SUPPORT */}
              <div className="bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 transition-all duration-200 shadow-2xs hover:shadow-xs group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
                      <MessageCircle className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h5 className="font-extrabold text-sm text-[#191c1d]">WhatsApp Support</h5>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#25D366]/20 text-emerald-800">
                          Instant
                        </span>
                      </div>
                      <p className="font-mono text-xs font-bold text-emerald-950 mt-0.5">
                        {rawWhatsapp}
                      </p>
                      <p className="text-[11px] text-[#594139] mt-0.5">
                        Live 1-on-1 chat with project engineers & advisors.
                      </p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Action Buttons */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-emerald-200/60">
                  <button
                    onClick={handleOpenWhatsApp}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-mono font-bold transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </button>

                  <button
                    onClick={() => handleCopy(rawWhatsapp, 'whatsapp')}
                    className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 transition-all text-xs font-mono font-bold cursor-pointer"
                    title="Copy WhatsApp Number"
                  >
                    {copiedType === 'whatsapp' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-emerald-700" />
                    )}
                  </button>
                </div>
              </div>

              {/* CHANNEL 2: EMAIL SUPPORT */}
              <div className="bg-orange-50/50 hover:bg-orange-50/80 border border-primary/20 rounded-2xl p-4 transition-all duration-200 shadow-2xs hover:shadow-xs group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h5 className="font-extrabold text-sm text-[#191c1d]">Email Support</h5>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-primary/15 text-primary">
                          Official
                        </span>
                      </div>
                      <p className="font-mono text-xs font-bold text-[#191c1d] mt-0.5 truncate">
                        {supportEmail}
                      </p>
                      <p className="text-[11px] text-[#594139] mt-0.5">
                        Send detailed briefs, RFPs, documents, or custom quotes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Action Buttons */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-primary/15">
                  <button
                    onClick={handleOpenEmail}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#191c1d] hover:bg-black text-white text-xs font-mono font-bold transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95"
                  >
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>Send Email Now</span>
                  </button>

                  <button
                    onClick={() => handleCopy(supportEmail, 'email')}
                    className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white border border-black/10 text-[#191c1d] hover:bg-surface-container transition-all text-xs font-mono font-bold cursor-pointer"
                    title="Copy Email Address"
                  >
                    {copiedType === 'email' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#594139]" />
                    )}
                  </button>
                </div>
              </div>

              {/* QUICK INQUIRY COMPOSER */}
              <div className="bg-surface rounded-2xl p-3.5 border border-black/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-[#594139] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Quick Message / বিবরণ লিখুন
                  </span>
                  {quickMessage && (
                    <button
                      onClick={() => setQuickMessage('')}
                      className="text-[10px] font-mono text-[#594139] hover:text-black"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <textarea
                  rows={2}
                  value={quickMessage}
                  onChange={(e) => setQuickMessage(e.target.value)}
                  placeholder="Type what you need (e.g. Need Shopify redesign or Custom Web App)..."
                  className="w-full p-2.5 rounded-xl bg-white border border-black/10 text-xs font-mono text-[#191c1d] placeholder:text-[#594139]/60 focus:outline-none focus:border-primary resize-none leading-relaxed"
                />

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleOpenWhatsApp}
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-mono text-xs font-bold transition-all border border-[#25D366]/30 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>Send via WhatsApp</span>
                  </button>

                  <button
                    onClick={handleOpenEmail}
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-mono text-xs font-bold transition-all border border-primary/30 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send via Email</span>
                  </button>
                </div>
              </div>

              {/* Complete On-Site Proposal Button */}
              <button
                onClick={handleOpenOnSiteForm}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-all border border-black/5 text-xs font-mono font-bold text-[#191c1d] cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span>Open Complete Website Order & Proposal Form</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#594139] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING TRIGGER BADGE / BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center gap-2.5 sm:gap-3 p-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all duration-300 cursor-pointer border ${
          isOpen
            ? 'bg-[#191c1d] text-white border-white/20 ring-2 ring-primary/40'
            : 'bg-gradient-to-r from-[#191c1d] via-[#262b2e] to-[#191c1d] text-white border-amber-400/40 hover:border-amber-400 shadow-black/25'
        }`}
        title="Open WhatsApp & Email Live Support"
      >
        {/* Support Icons Cluster */}
        <div className="flex items-center -space-x-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md ring-2 ring-[#191c1d]">
            <MessageCircle className="w-4 h-4 fill-current" />
          </div>
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md ring-2 ring-[#191c1d]">
            <Mail className="w-4 h-4" />
          </div>
        </div>

        {/* Text Details on desktop / tablet */}
        <div className="text-left pr-1 hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-extrabold text-white tracking-wide">Live Support</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="text-[10px] font-mono text-amber-300 block -mt-0.5">
            WhatsApp & Email
          </span>
        </div>

        {/* Pulse Dot */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
        </span>
      </motion.button>
    </div>
  );
};
