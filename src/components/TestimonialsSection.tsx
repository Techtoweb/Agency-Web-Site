import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Sparkles, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSiteData } from '../data/siteDataContext';
import { TESTIMONIALS } from '../data/agencyData';

export const TestimonialsSection: React.FC = () => {
  const { siteData } = useSiteData();
  const testimonialsList = siteData?.testimonials && siteData.testimonials.length > 0 ? siteData.testimonials : TESTIMONIALS;
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonialsList.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonialsList.length) % testimonialsList.length);
  };

  return (
    <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20 mb-28 md:mb-36">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-fixed/40 text-secondary font-mono text-xs font-semibold mb-4 border border-secondary-fixed"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Client Partnership Results</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-[56px] font-extrabold text-[#191c1d] tracking-tight leading-tight mb-4"
        >
          Trusted by Industry Leaders
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg text-[#594139] leading-relaxed"
        >
          How we empower venture-backed startups and established market leaders with cutting-edge digital execution.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonialsList.map((t, idx) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            className="glass-card p-8 rounded-3xl border border-white/80 shadow-glass flex flex-col justify-between hover:shadow-glass-lg hover:-translate-y-1 transition-all duration-300 relative group"
          >
            <div>
              {/* Rating and metrics badge */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex text-amber-500">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {t.metrics}
                </span>
              </div>

              {/* Quote text */}
              <p className="text-sm sm:text-base text-[#191c1d] leading-relaxed italic mb-8">
                &quot;{t.quote}&quot;
              </p>
            </div>

            {/* Author info */}
            <div className="flex items-center gap-3.5 pt-4 border-t border-black/5">
              <img
                src={t.avatar}
                alt={t.author}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <div>
                <div className="text-sm font-bold text-[#191c1d]">{t.author}</div>
                <div className="text-xs text-[#594139] font-mono">
                  {t.role}, <span className="font-semibold text-primary">{t.company}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

