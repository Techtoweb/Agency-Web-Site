import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, Clock, PackageCheck, ArrowRight } from 'lucide-react';
import { useSiteData } from '../data/siteDataContext';
import { PROCESS_STEPS } from '../data/agencyData';

interface ProcessSectionProps {
  onStartProject: () => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ onStartProject }) => {
  const { siteData } = useSiteData();
  const stepsList = siteData?.processSteps && siteData.processSteps.length > 0 ? siteData.processSteps : PROCESS_STEPS;
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = stepsList[activeStepIndex] || stepsList[0] || PROCESS_STEPS[0];

  return (
    <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20 mb-28 md:mb-36">
      <div className="bg-white rounded-[32px] sm:rounded-[40px] p-8 sm:p-12 lg:p-16 border border-white/80 shadow-glass">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-fixed/40 text-primary font-mono text-xs font-semibold mb-4 border border-primary-fixed/70"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Methodology & Velocity</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-[56px] font-extrabold text-[#191c1d] tracking-tight leading-tight mb-4"
          >
            How We Work
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-[#594139] leading-relaxed"
          >
            A disciplined engineering lifecycle that transforms ideas into high-converting digital products.
          </motion.p>
        </div>

        {/* Step Numbers Timeline */}
        <div className="relative mb-12">
          {/* Background Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-4 right-4 h-1 bg-surface-variant -translate-y-1/2 z-0" />
          
          {/* Active Progress Bar */}
          <motion.div
            className="hidden md:block absolute top-1/2 left-4 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500"
            style={{
              width: `${(activeStepIndex / Math.max(1, stepsList.length - 1)) * 95}%`,
            }}
          />

          {/* Steps selector buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 relative z-10">
            {stepsList.map((step, index) => {
              const isSelected = activeStepIndex === index;
              const isPast = activeStepIndex > index;

              return (
                <button
                  key={step.number}
                  onClick={() => setActiveStepIndex(index)}
                  data-cursor-text={`PHASE ${step.number}`}
                  className={`p-4 rounded-2xl transition-all duration-300 flex flex-col items-center text-center cursor-pointer ${
                    isSelected
                      ? 'bg-[#191c1d] text-white shadow-lg scale-105 ring-2 ring-primary/20'
                      : isPast
                      ? 'bg-primary-fixed/30 text-primary border border-primary-fixed/60 hover:bg-primary-fixed/50'
                      : 'bg-surface text-[#594139] border border-black/5 hover:bg-white'
                  }`}
                >
                  <span
                    className={`font-mono text-xs font-bold mb-1.5 px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-primary text-white'
                        : isPast
                        ? 'bg-primary/20 text-primary'
                        : 'bg-surface-variant text-[#594139]'
                    }`}
                  >
                    {step.number}
                  </span>
                  <span className="font-bold text-sm">{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Step Details Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.number}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="glass-card p-6 sm:p-10 rounded-3xl border border-white/80 shadow-glass grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left Col: Step details */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-4xl font-extrabold text-primary">
                  {activeStep.number}
                </span>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#191c1d] tracking-tight">
                    {activeStep.title} Phase
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#594139] mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>Estimated Timeline: {activeStep.duration}</span>
                  </div>
                </div>
              </div>

              <p className="text-base sm:text-lg text-[#191c1d] font-semibold mb-3">
                {activeStep.desc}
              </p>

              <p className="text-sm sm:text-base text-[#594139] leading-relaxed mb-6">
                {activeStep.detail}
              </p>

              {/* Deliverables */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#594139] mb-3 flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-primary" />
                  <span>Phase Deliverables:</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeStep.deliverables.map((del, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-black/5 text-xs font-medium text-[#191c1d]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{del}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Interactive Phase Status Card */}
            <div className="lg:col-span-5 bg-[#191c1d] text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono text-neutral-400">STAGE {activeStepIndex + 1} OF 6</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary text-white">
                    Active Blueprint
                  </span>
                </div>
                <div className="text-xl font-bold mb-2">Quality & Precision Standard</div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Every milestone undergoes strict peer code review, cross-device testing, and Lighthouse score verification before moving to subsequent phases.
                </p>
              </div>

              <div className="pt-6 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (activeStepIndex < PROCESS_STEPS.length - 1) {
                      setActiveStepIndex(activeStepIndex + 1);
                    } else {
                      onStartProject();
                    }
                  }}
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-primary-fixed hover:text-white transition-colors"
                >
                  <span>{activeStepIndex === PROCESS_STEPS.length - 1 ? 'Start Your Project' : 'Next Phase'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex gap-1">
                  {PROCESS_STEPS.map((_, i) => (
                    <span
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${
                        activeStepIndex === i ? 'w-5 bg-primary' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
