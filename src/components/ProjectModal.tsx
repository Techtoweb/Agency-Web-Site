import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, ArrowRight, ArrowLeft, TrendingUp, Globe } from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onStartProject: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onStartProject }) => {
  // Close on Escape key press and prevent background scrolling
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {/* Backdrop: Clicking outside modal triggers onClose */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      >
        {/* Floating Quick Close / Back Button for mobile & desktop */}
        <button
          onClick={onClose}
          aria-label="Back to projects"
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[110] bg-neutral-900/90 hover:bg-primary text-white p-3 rounded-full shadow-2xl border border-white/20 hover:scale-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-mono font-bold pr-1">Back</span>
        </button>

        {/* Modal Window Container - stop propagation so clicking inside doesn't close */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl border border-white/40 my-8 relative"
        >
          {/* Top Header Bar with prominent "← Back to Projects" button */}
          <div className="p-4 sm:p-5 bg-surface-container flex flex-wrap items-center justify-between gap-3 border-b border-black/5">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-neutral-100 text-[#191c1d] border border-black/10 font-mono text-xs font-bold shadow-xs hover:text-primary transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Projects</span>
              </button>

              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-primary-fixed/60 text-primary">
                {project.categoryLabel}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {project.isLive && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>{project.liveStatus || 'Live & Running'}</span>
                </span>
              )}
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-2 rounded-full hover:bg-surface text-[#191c1d] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Project Banner Image with Live Store Trigger */}
          <div className="relative h-64 sm:h-80 bg-neutral-950 overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{project.title}</h2>
                <p className="text-sm text-neutral-300 font-mono mt-1">Client: {project.client} • {project.year}</p>
              </div>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-neutral-900 font-mono text-xs font-bold hover:bg-neutral-100 transition-colors shrink-0 shadow-md"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Open Live Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Modal Body Content */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* High-level Impact Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-surface-container rounded-2xl border border-black/5">
              {project.metrics.map((m, i) => (
                <div key={i} className="text-center">
                  <div className="text-xs text-[#594139] font-mono">{m.label}</div>
                  <div className="text-lg sm:text-2xl font-extrabold text-primary font-mono mt-0.5">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Overview */}
            <div>
              <h3 className="text-lg font-bold text-[#191c1d] mb-2">Project Overview</h3>
              <p className="text-sm sm:text-base text-[#594139] leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Challenge & Solution Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 bg-surface rounded-2xl border border-black/5">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-rose-700 mb-2">
                  The Challenge
                </div>
                <p className="text-xs sm:text-sm text-[#594139] leading-relaxed">
                  {project.challenge}
                </p>
              </div>

              <div className="p-5 bg-surface rounded-2xl border border-black/5">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 mb-2">
                  Our Engineering Solution
                </div>
                <p className="text-xs sm:text-sm text-[#594139] leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </div>

            {/* Business Impact */}
            <div className="p-5 bg-primary-fixed/20 rounded-2xl border border-primary-fixed/50 flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#191c1d]">Business Impact</h4>
                <p className="text-xs sm:text-sm text-[#594139] mt-1 leading-relaxed">
                  {project.impact}
                </p>
              </div>
            </div>

            {/* Tech Stack Chips */}
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#594139] mb-3">
                Technologies & Frameworks
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-surface-variant text-[#191c1d] text-xs font-mono font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions with prominent Back and CTA options */}
          <div className="p-4 sm:p-6 bg-surface-container flex flex-wrap justify-between items-center gap-4 border-t border-black/5">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-neutral-100 text-[#191c1d] border border-black/10 text-xs font-mono font-bold transition-colors cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Projects</span>
            </button>

            <div className="flex items-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-full text-xs font-mono font-bold border border-black/10 hover:bg-surface text-[#191c1d] transition-all flex items-center gap-2"
                >
                  <span>Visit Live Store</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={() => {
                  onClose();
                  onStartProject();
                }}
                className="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-full text-xs font-mono font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Build Similar Architecture</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
