import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, Zap, Star } from 'lucide-react';
import { useSiteData } from '../data/siteDataContext';
import { HERO_DATA } from '../data/agencyData';

interface HeroProps {
  onExploreWork: () => void;
  onSelectService: (category: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreWork, onSelectService }) => {
  const { siteData } = useSiteData();
  const heroData = siteData?.hero || HERO_DATA;
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mousePos.x * 24, springConfig);
  const smoothY = useSpring(mousePos.y * 24, springConfig);
  const smoothRotateX = useSpring(-mousePos.y * 8, springConfig);
  const smoothRotateY = useSpring(mousePos.x * 8, springConfig);

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20 mb-28 md:mb-36 pt-4 relative"
    >
      <div className="bg-white rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-glass-lg relative p-8 sm:p-12 md:p-16 lg:p-20 flex flex-col md:flex-row items-center border border-white/70">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-tertiary-fixed/20 via-white to-primary-fixed/25 opacity-70 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Left Column: Text & CTAs */}
        <div className="w-full md:w-1/2 z-10 pr-0 md:pr-8 lg:pr-12">
          {/* Tag / Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-fixed/40 text-primary font-mono text-xs sm:text-sm font-semibold mb-6 border border-primary-fixed/70 shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>{heroData.badge}</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-[72px] font-extrabold tracking-tight text-[#191c1d] leading-[1.08] mb-6"
          >
            {heroData.titlePrimary}{' '}
            <span className="text-gradient inline-block hover:scale-[1.02] transition-transform duration-300">
              {heroData.titleHighlight}
            </span>
            <br />
            {heroData.titleSecondary}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg lg:text-xl text-[#594139] mb-10 max-w-lg leading-relaxed font-normal"
          >
            {heroData.subtitle}
          </motion.p>

          {/* Action Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-6"
          >
            {/* Primary Action Button */}
            <button
              onClick={onExploreWork}
              data-cursor-text="EXPLORE"
              className="group relative inline-flex items-center gap-3 bg-[#191c1d] text-white font-mono text-sm font-semibold px-8 py-4 rounded-full hover:bg-primary transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 cursor-pointer active:scale-95"
            >
              <span>{heroData.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            {/* Avatar Stack with High-Growth Clients */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3.5 hover:space-x-1 transition-all duration-300">
                {HERO_DATA.avatars.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Client partner ${idx + 1}`}
                    className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-sm transition-transform duration-300 hover:scale-110 hover:z-20"
                  />
                ))}
                <div className="w-11 h-11 rounded-full border-2 border-white bg-surface-variant flex items-center justify-center font-mono text-xs font-bold text-[#594139] shadow-sm">
                  +50
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center text-amber-500 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] text-[#594139] font-medium">{heroData.statsBadge}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Layered Parallax Visual with Interactive Micro-Widgets */}
        <div className="w-full md:w-1/2 mt-12 md:mt-0 relative z-10 perspective-1000">
          <motion.div
            style={{
              x: smoothX,
              y: smoothY,
              rotateX: smoothRotateX,
              rotateY: smoothRotateY,
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl overflow-visible group"
          >
            {/* Main Visual Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/60 bg-gradient-to-tr from-white to-surface-container">
              <img
                src={heroData.heroImage}
                alt="Tech To Web high performance digital ecosystem 3D visual"
                className="w-full h-auto object-cover rounded-3xl transform transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>

            {/* Floating Live Badge 1: Store Conversion */}
            <motion.div
              animate={{
                y: [0, -6, 0],
                rotate: [0, 1, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              onClick={() => onSelectService('shopify')}
              data-cursor-text="SHOPIFY"
              className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 glass-card p-3 sm:p-4 rounded-2xl shadow-glass flex items-center gap-3 border border-white/80 cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-fixed/60 flex items-center justify-center text-primary shadow-xs">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#594139]">Shopify Speed</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-700">0.8s</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#191c1d]">+142% Conversion</p>
              </div>
            </motion.div>

            {/* Floating Live Badge 2: Real-time ROAS / SEO */}
            <motion.div
              animate={{
                y: [0, 8, 0],
                rotate: [0, -1, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1
              }}
              onClick={() => onSelectService('marketing')}
              data-cursor-text="GROWTH"
              className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 glass-card p-3 sm:p-4 rounded-2xl shadow-glass flex items-center gap-3 border border-white/80 cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary-fixed/60 flex items-center justify-center text-secondary shadow-xs">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#594139]">Ad Performance</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-700">4.6x ROAS</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#191c1d]">$12M+ Revenue Run</p>
              </div>
            </motion.div>

            {/* Floating Live Badge 3: Edge Web Dev */}
            <motion.div
              animate={{
                x: [0, 4, 0],
                y: [0, 5, 0]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 2
              }}
              className="hidden lg:flex absolute top-1/2 -right-8 glass-card px-3.5 py-2 rounded-xl shadow-glass items-center gap-2 border border-white/80"
            >
              <ShieldCheck className="w-4 h-4 text-tertiary" />
              <span className="text-xs font-mono font-semibold text-[#191c1d]">100% Core Vitals</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
