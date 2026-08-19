import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Sparkles, TrendingUp, ExternalLink, Globe, Radio } from 'lucide-react';
import { useSiteData } from '../data/siteDataContext';
import { PORTFOLIO_PROJECTS } from '../data/agencyData';
import { ProjectItem, ServiceCategory } from '../types';

interface PortfolioSectionProps {
  onSelectProject: (project: ProjectItem) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onSelectProject }) => {
  const { siteData } = useSiteData();
  const projectsList = siteData?.projects && siteData.projects.length > 0 ? siteData.projects : PORTFOLIO_PROJECTS;
  const [filter, setFilter] = useState<'all' | 'live' | ServiceCategory>('all');

  const filteredProjects =
    filter === 'all'
      ? projectsList
      : filter === 'live'
      ? projectsList.filter((p) => p.isLive || !!p.liveUrl)
      : projectsList.filter((p) => p.category === filter);

  return (
    <section id="work" className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20 mb-28 md:mb-36">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 font-mono text-xs font-semibold mb-4 border border-emerald-500/30"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span>Live Client Projects & Running Stores</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-[56px] font-extrabold text-[#191c1d] tracking-tight leading-tight"
          >
            Live Projects in Production
          </motion.h2>
          <p className="text-sm sm:text-base text-[#594139] mt-2 max-w-xl">
            Explore live commercial Shopify stores and custom web platforms designed, developed, and scaled by Tech To Web.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/80 shadow-glass">
          {[
            { id: 'all', label: `All Projects (${projectsList.length})` },
            { id: 'live', label: '🟢 Live Stores' },
            { id: 'shopify', label: 'Shopify Stores' },
            { id: 'web-dev', label: 'Custom Web Dev' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as any)}
              data-cursor-text="FILTER"
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-300 cursor-pointer ${
                filter === item.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-[#594139] hover:text-[#191c1d] hover:bg-surface'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence>
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              onClick={() => onSelectProject(project)}
              data-cursor-text="VIEW PROJECT ↗"
              className="glass-card rounded-3xl overflow-hidden border border-white/80 shadow-glass group cursor-pointer flex flex-col justify-between hover:shadow-glass-lg transition-all duration-500 bg-white/60 backdrop-blur-sm"
            >
              {/* Image Container with Zoom & Live URL Ribbon */}
              <div className="relative h-64 sm:h-76 overflow-hidden bg-neutral-950">
                {/* Browser top-bar mockup indicator */}
                <div className="absolute top-0 inset-x-0 z-20 bg-neutral-900/90 backdrop-blur-md border-b border-white/10 px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  {project.liveUrl && (
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-neutral-800/80 border border-white/10 text-[11px] font-mono text-neutral-300 truncate max-w-[200px] sm:max-w-[280px]">
                      <Globe className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{project.liveUrl.replace('https://', '')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-mono font-bold">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    <span>LIVE</span>
                  </div>
                </div>

                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top pt-8 transform transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />

                {/* Floating Bottom Metrics Badge */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white text-xs font-mono font-bold border border-white/20">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{project.metrics[0].label}: {project.metrics[0].value}</span>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-[#191c1d] group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-md">
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#594139] mb-2">
                    <span>{project.client} • {project.year}</span>
                    <span className="text-primary font-bold">{project.categoryLabel}</span>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-[#191c1d] group-hover:text-primary transition-colors mb-2.5">
                    {project.title}
                  </h3>

                  <p className="text-sm text-[#594139] leading-relaxed line-clamp-2 mb-6">
                    {project.description}
                  </p>
                </div>

                {/* Tags & Quick Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-black/5">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-surface text-[11px] font-mono text-[#594139] border border-black/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary-fixed/40 hover:bg-primary hover:text-white text-primary text-[11px] font-mono font-bold transition-all duration-200"
                    >
                      <span>Visit Live Store</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
