import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { CustomPageSection } from '../types';

interface CustomSectionRendererProps {
  section: CustomPageSection;
  onActionClick?: (actionTitle: string) => void;
}

export const CustomSectionRenderer: React.FC<CustomSectionRendererProps> = ({
  section,
  onActionClick
}) => {
  if (!section.enabled) return null;

  return (
    <section
      id={`section-${section.id}`}
      className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20 mb-24 md:mb-32"
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-[32px] sm:rounded-[40px] p-8 sm:p-12 lg:p-16 border border-white/80 shadow-glass relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center">
          {section.badge && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-fixed/40 text-primary font-mono text-xs font-semibold mb-4 border border-primary-fixed/70"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{section.badge}</span>
            </motion.div>
          )}

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-[52px] font-extrabold text-[#191c1d] tracking-tight leading-tight mb-4"
          >
            {section.title}
          </motion.h2>

          {section.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-[#594139] leading-relaxed mb-6 font-medium"
            >
              {section.subtitle}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-sm sm:text-base text-[#191c1d]/90 leading-relaxed max-w-2xl mx-auto mb-8 whitespace-pre-line"
          >
            {section.content}
          </motion.div>

          {section.ctaText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <button
                onClick={() => onActionClick?.(section.ctaText || section.title)}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-white font-mono text-sm font-semibold px-8 py-3.5 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all cursor-pointer"
              >
                <span>{section.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
