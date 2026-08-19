import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, CheckCircle2, Store, Code2, Megaphone, Search, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
  onServiceInquirySubmitted?: (service: string, budget: string) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  defaultService = 'Shopify Solutions',
  onServiceInquirySubmitted,
}) => {
  const [selectedService, setSelectedService] = useState<string>(defaultService);
  const [budget, setBudget] = useState<string>('$10,000 - $25,000');
  const [timeline, setTimeline] = useState<string>('1 - 2 Months');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate fast server response
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      if (onServiceInquirySubmitted) {
        onServiceInquirySubmitted(selectedService, budget);
      }

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ab3500', '#ff6b35', '#0040e0', '#00696e', '#63f7ff']
        });
      } catch (err) {
        // Safe fallback
      }
    }, 600);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({ name: '', email: '', company: '', website: '', message: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl border border-white/40 my-8 relative"
      >
        {/* Modal Header */}
        <div className="p-6 bg-surface-container flex items-center justify-between border-b border-black/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-mono font-bold text-sm shadow-md shadow-primary/20">
              TW
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl text-[#191c1d] tracking-tight">
                Start Your Project
              </h3>
              <p className="text-xs text-[#594139] font-mono">
                2026 Digital Agency Engineering Proposal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface text-[#191c1d] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Service Selection */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#594139] mb-2.5">
                    1. Select Core Service
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: 'Shopify Plus', icon: Store },
                      { label: 'Web Dev', icon: Code2 },
                      { label: 'Marketing', icon: Megaphone },
                      { label: 'Technical SEO', icon: Search },
                    ].map((svc) => {
                      const Icon = svc.icon;
                      const isSelected = selectedService.includes(svc.label) || selectedService === svc.label;
                      return (
                        <button
                          type="button"
                          key={svc.label}
                          onClick={() => setSelectedService(svc.label)}
                          className={`p-3 rounded-xl text-xs font-mono font-bold flex flex-col items-center gap-1.5 transition-all border ${
                            isSelected
                              ? 'bg-primary text-white border-primary shadow-sm'
                              : 'bg-surface text-[#594139] border-black/5 hover:bg-white'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{svc.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Budget Selection */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#594139] mb-2.5">
                    2. Estimated Project Budget
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['$5k - $10k', '$10k - $25k', '$25k - $50k', '$50k+'].map((b) => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setBudget(b)}
                        className={`py-2 px-3 rounded-xl text-xs font-mono font-semibold transition-all border ${
                          budget === b
                            ? 'bg-[#191c1d] text-white border-[#191c1d] shadow-sm'
                            : 'bg-surface text-[#594139] border-black/5 hover:bg-white'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Client Details Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#191c1d] mb-1.5">
                      Your Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-[#191c1d] mb-1.5">
                      Work Email *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-[#191c1d] mb-1.5">
                      Company / Brand Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Corp"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-[#191c1d] mb-1.5">
                      Current Website (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* 4. Project Vision Message */}
                <div>
                  <label className="block text-xs font-mono font-bold text-[#191c1d] mb-1.5">
                    Project Vision & Goals
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your objectives, current challenges, or specific milestones you want to achieve..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-container text-white py-4 rounded-full font-mono text-sm font-bold tracking-wide shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Transmitting Inquiry...</span>
                    </span>
                  ) : (
                    <>
                      <span>Submit Project Proposal</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center space-y-5"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-[#191c1d]">
                    Inquiry Received!
                  </h3>
                  <p className="text-sm text-[#594139] max-w-md mx-auto mt-2">
                    Thank you, <strong className="text-[#191c1d]">{formData.name}</strong>. Our senior technical architects are reviewing your {selectedService} scope and will respond within 2 hours.
                  </p>
                </div>

                <div className="p-4 bg-surface rounded-2xl max-w-sm mx-auto text-left text-xs font-mono space-y-1.5 border border-black/5">
                  <div className="text-neutral-500">Service: <span className="text-[#191c1d] font-bold">{selectedService}</span></div>
                  <div className="text-neutral-500">Budget Range: <span className="text-[#191c1d] font-bold">{budget}</span></div>
                  <div className="text-neutral-500">Priority SLA: <span className="text-emerald-600 font-bold">Under 2 Hours</span></div>
                </div>

                <button
                  onClick={handleReset}
                  className="bg-[#191c1d] hover:bg-primary text-white font-mono text-xs font-bold px-8 py-3 rounded-full transition-colors"
                >
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
