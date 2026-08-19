import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Play, Sparkles, X, Shield, Zap, Laptop, ArrowRight } from 'lucide-react';

interface DigitalExperienceProps {
  onStartProject: () => void;
}

export const DigitalExperience: React.FC<DigitalExperienceProps> = ({ onStartProject }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <>
      <section id="about" className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20 mb-28 md:mb-36">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-center">
          {/* Left Text Block */}
          <div className="w-full md:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-fixed/40 text-primary font-mono text-xs font-semibold mb-6 border border-primary-fixed/60"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Engineering Excellence</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-[56px] font-extrabold text-[#191c1d] mb-6 sm:mb-8 leading-tight tracking-tight"
            >
              Designed to Look Better.
              <br />
              <span className="text-gradient">Built to Perform Better.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-[#594139] mb-10 leading-relaxed font-normal"
            >
              We bridge the gap between stunning visual aesthetics and rigorous technical architecture, ensuring your digital presence is not just a brochure, but a high-performance engine.
            </motion.p>

            {/* Checkpoints list */}
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="space-y-6 mb-8"
            >
              <li className="flex gap-4 items-start group">
                <div className="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center shrink-0 mt-1 shadow-xs group-hover:scale-110 transition-transform">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#191c1d] text-base mb-1 group-hover:text-secondary transition-colors">
                    Blazing Fast Load Times
                  </h4>
                  <p className="text-[#594139] text-sm leading-relaxed">
                    Optimized assets, edge-caching, sub-second TTFB, and zero bloat for instant gratification.
                  </p>
                </div>
              </li>

              <li className="flex gap-4 items-start group">
                <div className="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center shrink-0 mt-1 shadow-xs group-hover:scale-110 transition-transform">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#191c1d] text-base mb-1 group-hover:text-secondary transition-colors">
                    Pixel-Perfect Responsive Design
                  </h4>
                  <p className="text-[#594139] text-sm leading-relaxed">
                    Flawless execution across mobile, tablet, laptop, ultra-wide 4K, and varied browser engines.
                  </p>
                </div>
              </li>
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="pt-2"
            >
              <button
                onClick={onStartProject}
                data-cursor-text="UPGRADE"
                className="inline-flex items-center gap-2 font-mono text-sm font-bold text-primary hover:text-primary-container transition-colors group cursor-pointer"
              >
                <span>Upgrade Your Digital Presence</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
              </button>
            </motion.div>
          </div>

          {/* Right Video / Interactive Visual Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/2 relative group cursor-pointer"
            onClick={() => setIsVideoModalOpen(true)}
            data-cursor-text="PLAY SHOWREEL"
          >
            {/* Offset Background Accent Frame */}
            <div className="absolute inset-0 bg-secondary/15 rounded-3xl transform translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4 -z-10 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-500" />

            {/* Video Thumbnail Frame */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/60 glass-panel">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo6PqjZ7lOWQU5GvvrwrnhSnvInFx5AsdQ-bZNXF8hJEEuCZ4UXwyc-o8iPD7TBIrCbMovGjlK_-RjoLiCUIjPtu8y4bbfed9lWDQD0eAUTSoAOVwlCuSWWgRBaFH0lWO3Q7t0szICQiiaP7RsRGljPIpuuUMNt8GKWSYa3GjQpzYxyXQMt3hnXw87J7RqxMlHjatwir6H5L9hEL3LRar_R_Ry0vmNwMmkmrznLzWpsLI0F1QRNipD"
                alt="Tech To Web high-end digital technology agency interface visual"
                className="w-full h-[360px] sm:h-[460px] lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Dark Ambient Overlay with Centered Play Button */}
              <div className="absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/15 transition-colors">
                <div className="relative">
                  {/* Pulsing Outer Glow Ring */}
                  <div className="absolute -inset-4 bg-white/20 rounded-full blur-md animate-pulse pointer-events-none" />
                  <div className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/70 shadow-glass group-hover:scale-115 group-hover:bg-white/40 transition-all duration-300">
                    <Play className="w-8 h-8 text-white fill-current ml-1" />
                  </div>
                </div>
              </div>

              {/* Bottom Glass Tag */}
              <div className="absolute bottom-4 left-4 right-4 glass-card p-3 rounded-2xl flex justify-between items-center border border-white/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-mono font-bold text-[#191c1d]">Interactive Architecture Reel 2026</span>
                </div>
                <span className="text-[10px] font-mono font-semibold text-primary bg-primary-fixed/40 px-2 py-0.5 rounded-md">
                  Click to Watch
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video / Interactive Experience Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl border border-white/30 relative"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 bg-surface-container flex items-center justify-between border-b border-black/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-mono font-bold text-xs">
                  TW
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#191c1d]">
                    Tech To Web — Digital Technology Showcase
                  </h3>
                  <p className="text-xs text-[#594139]">High-performance engineering, motion design & growth systems.</p>
                </div>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-2 rounded-full hover:bg-surface text-[#191c1d] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Showcase Content */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="relative rounded-2xl overflow-hidden bg-[#191c1d] aspect-video flex items-center justify-center border border-black/10">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo6PqjZ7lOWQU5GvvrwrnhSnvInFx5AsdQ-bZNXF8hJEEuCZ4UXwyc-o8iPD7TBIrCbMovGjlK_-RjoLiCUIjPtu8y4bbfed9lWDQD0eAUTSoAOVwlCuSWWgRBaFH0lWO3Q7t0szICQiiaP7RsRGljPIpuuUMNt8GKWSYa3GjQpzYxyXQMt3hnXw87J7RqxMlHjatwir6H5L9hEL3LRar_R_Ry0vmNwMmkmrznLzWpsLI0F1QRNipD"
                  alt="Showcase preview"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="relative z-10 text-center text-white p-6 max-w-md">
                  <div className="w-14 h-14 rounded-full bg-primary/90 text-white flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                  <h4 className="text-lg font-bold">Interactive Experience Showcase</h4>
                  <p className="text-xs text-neutral-300 mt-1">
                    Simulating live responsive renders, edge API responses, and high-conversion client builds.
                  </p>
                </div>
              </div>

              {/* Highlights below showcase */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-surface rounded-2xl border border-black/5">
                  <Zap className="w-5 h-5 text-primary mb-2" />
                  <div className="text-sm font-bold text-[#191c1d]">Sub-Second Speed</div>
                  <p className="text-xs text-[#594139] mt-1">
                    Every asset is edge-cached and optimized for instant loading.
                  </p>
                </div>

                <div className="p-4 bg-surface rounded-2xl border border-black/5">
                  <Laptop className="w-5 h-5 text-secondary mb-2" />
                  <div className="text-sm font-bold text-[#191c1d]">Responsive Precision</div>
                  <p className="text-xs text-[#594139] mt-1">
                    Fluid layouts designed mathematically for any resolution.
                  </p>
                </div>

                <div className="p-4 bg-surface rounded-2xl border border-black/5">
                  <Shield className="w-5 h-5 text-tertiary mb-2" />
                  <div className="text-sm font-bold text-[#191c1d]">Enterprise Grade</div>
                  <p className="text-xs text-[#594139] mt-1">
                    Clean TypeScript codebases engineered for scale and safety.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 bg-surface-container/50 border-t border-black/5 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsVideoModalOpen(false);
                  onStartProject();
                }}
                className="bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-full text-xs font-mono font-bold shadow-md hover:scale-105 transition-all"
              >
                Schedule Architecture Consultation
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};
