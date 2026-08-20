import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Sparkles, Zap, Shield, Rocket, MessageCircle, Mail, Headphones } from 'lucide-react';
import { useSiteData } from '../data/siteDataContext';

interface CTASectionProps {
  onStartProject: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onStartProject }) => {
  const { siteData } = useSiteData();
  const settings = siteData?.siteSettings || {
    email: 'techtowebadmin@gmail.com',
    whatsapp: '+1 (800) 555-0199',
    phone: '+1 (800) 555-0199'
  };

  const rawWhatsapp = settings.whatsapp || settings.phone || '+1 (800) 555-0199';
  const cleanWhatsapp = rawWhatsapp.replace(/[^0-9]/g, '');
  const supportEmail = settings.email || 'techtowebadmin@gmail.com';

  return (
    <section id="contact" className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20 mb-20 md:mb-28">
      <div className="bg-gradient-to-br from-[#191c1d] via-[#24292b] to-[#191c1d] text-white rounded-[32px] sm:rounded-[40px] p-8 sm:p-14 lg:p-20 relative overflow-hidden shadow-2xl border border-white/10">
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-primary/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-fixed/20 text-primary-fixed font-mono text-xs font-semibold mb-6 border border-primary-fixed/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for the Modern Web Era</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-[64px] font-extrabold tracking-tight leading-tight mb-6"
          >
            Ready to Build Something{' '}
            <span className="text-gradient inline-block">Extraordinary?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-neutral-300 mb-10 leading-relaxed max-w-xl mx-auto"
          >
            Transform your digital footprint with high-velocity engineering, bespoke Shopify architecture, and compound marketing growth.
          </motion.p>

          {/* Action Buttons: Proposal + WhatsApp + Email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3.5"
          >
            <button
              onClick={onStartProject}
              data-cursor-text="START"
              className="bg-primary hover:bg-primary-container text-white font-mono text-sm sm:text-base font-bold px-8 sm:px-9 py-4 rounded-full shadow-xl shadow-primary/30 hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 cursor-pointer active:scale-95"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-5 h-5" />
            </button>

            <a
              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello Tech To Web Support Team, I would like to inquire about starting a project.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-mono text-sm font-bold px-6 py-4 rounded-full shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all duration-300 cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>WhatsApp Chat</span>
            </a>

            <a
              href={`mailto:${supportEmail}?subject=${encodeURIComponent('Project Inquiry & Consultation - Tech To Web')}&body=${encodeURIComponent('Hi Tech To Web Support Team,\n\nI am contacting you to discuss my project requirements...\n\nThank you.')}`}
              className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 text-white font-mono text-sm font-bold px-6 py-4 rounded-full border border-white/20 hover:scale-105 transition-all duration-300 cursor-pointer active:scale-95 backdrop-blur-md"
            >
              <Mail className="w-5 h-5 text-amber-400" />
              <span>Email Support</span>
            </a>
          </motion.div>

          {/* Guarantee Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 mt-12 border-t border-white/10 text-xs font-mono text-neutral-400"
          >
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>2-Hour Rapid Response SLA</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>100% Milestone-Based Delivery</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Rocket className="w-4 h-4 text-blue-400" />
              <span>Continuous Growth Optimization</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
