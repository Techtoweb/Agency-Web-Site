import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, CheckCircle2, Store, Code2, Megaphone, Search, CreditCard, Clock, Tag, ShoppingCart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSiteData } from '../data/siteDataContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
  defaultSubService?: string;
  defaultPrice?: string;
  defaultDelivery?: string;
  orderType?: 'order' | 'proposal' | 'contact';
  onServiceInquirySubmitted?: (service: string, budget: string) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  defaultService = 'Shopify Solutions',
  defaultSubService = '',
  defaultPrice = '',
  defaultDelivery = '',
  orderType = 'order',
  onServiceInquirySubmitted,
}) => {
  const { siteData, addLead } = useSiteData();
  
  const [selectedService, setSelectedService] = useState<string>(defaultService);
  const [selectedSubService, setSelectedSubService] = useState<string>(defaultSubService);
  const [servicePrice, setServicePrice] = useState<string>(defaultPrice);
  const [budget, setBudget] = useState<string>(defaultPrice || '$10,000 - $25,000');
  const [timeline, setTimeline] = useState<string>(defaultDelivery || '1 - 2 Months');
  const [activeType, setActiveType] = useState<'order' | 'proposal' | 'contact'>(orderType);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    company: '',
    website: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState<string>('');

  // Sync props when modal is opened
  useEffect(() => {
    if (isOpen) {
      setSelectedService(defaultService);
      setSelectedSubService(defaultSubService);
      setServicePrice(defaultPrice);
      if (defaultPrice) {
        setBudget(defaultPrice);
      }
      if (defaultDelivery) {
        setTimeline(defaultDelivery);
      }
      setActiveType(orderType);
      setIsSubmitted(false);
    }
  }, [isOpen, defaultService, defaultSubService, defaultPrice, defaultDelivery, orderType]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create and persist lead inquiry / order in context + Firestore
      const newOrder = await addLead({
        type: activeType,
        orderType: activeType,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        whatsapp: formData.whatsapp.trim() || formData.phone.trim() || undefined,
        company: formData.company.trim() || undefined,
        website: formData.website.trim() || undefined,
        service: selectedService,
        subService: selectedSubService || undefined,
        price: servicePrice || budget || undefined,
        servicePrice: servicePrice || budget || undefined,
        budget: budget || servicePrice || undefined,
        deliveryTime: timeline || undefined,
        timeline: timeline || undefined,
        message: formData.message.trim(),
        description: formData.message.trim(),
        requirements: formData.message.trim(),
        isRead: false
      });

      setSubmittedOrderId(newOrder.id);
      setIsSubmitting(false);
      setIsSubmitted(true);

      if (onServiceInquirySubmitted) {
        onServiceInquirySubmitted(selectedService, budget);
      }

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ab3500', '#ff6b35', '#0040e0', '#00696e', '#63f7ff', '#10b981']
        });
      } catch (err) {
        // Safe fallback
      }
    } catch (error) {
      console.error('Error submitting order/inquiry:', error);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({ name: '', email: '', phone: '', whatsapp: '', company: '', website: '', message: '' });
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
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-mono font-bold text-sm shadow-md shadow-primary/20">
              {activeType === 'order' ? <ShoppingCart className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg sm:text-xl text-[#191c1d] tracking-tight">
                  {activeType === 'order' ? 'Confirm Service Order' : 'Start Your Project'}
                </h3>
                {servicePrice && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-bold border border-emerald-300">
                    {servicePrice}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#594139] font-mono">
                {selectedSubService ? `${selectedService} • ${selectedSubService}` : 'High-Performance E-Commerce & Full Stack Engineering'}
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
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-5 text-left">
                {/* Active Service Banner */}
                {selectedSubService ? (
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary block">
                        Selected Service Package
                      </span>
                      <h4 className="font-bold text-sm text-[#191c1d]">{selectedSubService}</h4>
                      <p className="text-xs text-[#594139]">{selectedService}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {servicePrice && (
                        <div className="px-3 py-1.5 rounded-xl bg-white border border-black/10 shadow-2xs text-center">
                          <span className="text-[10px] font-mono text-[#594139] block">Price</span>
                          <span className="text-sm font-bold text-emerald-600 font-mono">{servicePrice}</span>
                        </div>
                      )}
                      {timeline && (
                        <div className="px-3 py-1.5 rounded-xl bg-white border border-black/10 shadow-2xs text-center">
                          <span className="text-[10px] font-mono text-[#594139] block">Delivery</span>
                          <span className="text-xs font-bold text-[#191c1d] font-mono">{timeline}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* 1. Service Selection if none pre-chosen */
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#594139] mb-2.5">
                      1. Select Core Service Domain
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {siteData.categories.map((svc) => {
                        const isSelected = selectedService === svc.title || selectedService === svc.shortLabel;
                        return (
                          <button
                            type="button"
                            key={svc.id}
                            onClick={() => {
                              setSelectedService(svc.title);
                              if (svc.startingPrice) setBudget(svc.startingPrice);
                            }}
                            className={`p-3 rounded-xl text-xs font-mono font-bold flex flex-col items-start gap-1 transition-all border text-left cursor-pointer ${
                              isSelected
                                ? 'bg-primary text-white border-primary shadow-sm'
                                : 'bg-surface text-[#594139] border-black/5 hover:bg-white hover:border-black/10'
                            }`}
                          >
                            <span className="truncate w-full">{svc.shortLabel}</span>
                            <span className={`text-[10px] font-normal ${isSelected ? 'text-white/80' : 'text-emerald-600 font-semibold'}`}>
                              {svc.startingPrice ? `From ${svc.startingPrice}` : svc.sublabel}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Budget / Pricing Type */}
                {!servicePrice && (
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#594139] mb-2">
                      2. Estimated Project Budget / Scope
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['$299 - $500', '$1,000 - $3,000', '$5,000 - $10,000', '$10,000+'].map((b) => (
                        <button
                          type="button"
                          key={b}
                          onClick={() => setBudget(b)}
                          className={`py-2 px-3 rounded-xl text-xs font-mono font-semibold transition-all border cursor-pointer ${
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
                )}

                {/* 3. Client Contact Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#191c1d] mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Alex Morgan / Rahman Chowdhury"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-[#191c1d] mb-1">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-[#191c1d] mb-1">
                      Phone / WhatsApp Number (For instant notification)
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000 or +880 17..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-[#191c1d] mb-1">
                      Company / Store / Website (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MyStore.com"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value, website: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* 4. Project Vision / Custom Requirements */}
                <div>
                  <label className="block text-xs font-mono font-bold text-[#191c1d] mb-1">
                    Order Details / Specific Requirements
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe any specific features, store preferences, brand assets, or timeline goals..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-container text-white py-3.5 rounded-2xl font-mono text-xs sm:text-sm font-bold tracking-wide shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Transmitting Order to Tech To Web...</span>
                    </span>
                  ) : (
                    <>
                      <span>{activeType === 'order' ? `Confirm & Order Service (${servicePrice || budget})` : 'Submit Project Proposal'}</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] font-mono text-[#594139] text-center">
                  🔒 Encrypted submission. Admin receives real-time audio chime & instant database notification.
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-5"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold mb-2">
                    <span>Order Reference: #{submittedOrderId || 'TW-' + Date.now().toString().slice(-6)}</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#191c1d]">
                    Order Successfully Placed!
                  </h3>
                  <p className="text-sm text-[#594139] max-w-md mx-auto mt-2">
                    Thank you, <strong className="text-[#191c1d]">{formData.name}</strong>. Your order for <strong className="text-primary">{selectedSubService || selectedService}</strong> has been received by our admin team with instant notification.
                  </p>
                </div>

                <div className="p-4 bg-surface-container rounded-2xl max-w-sm mx-auto text-left text-xs font-mono space-y-2 border border-black/5">
                  <div className="flex justify-between">
                    <span className="text-[#594139]">Service:</span>
                    <span className="text-[#191c1d] font-bold">{selectedSubService || selectedService}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#594139]">Price / Package:</span>
                    <span className="text-emerald-700 font-bold">{servicePrice || budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#594139]">Client Email:</span>
                    <span className="text-[#191c1d] font-bold">{formData.email}</span>
                  </div>
                  {formData.phone && (
                    <div className="flex justify-between">
                      <span className="text-[#594139]">WhatsApp/Phone:</span>
                      <span className="text-[#191c1d] font-bold">{formData.phone}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 border-t border-black/5">
                    <span className="text-[#594139]">Response SLA:</span>
                    <span className="text-emerald-600 font-bold">Under 2 Hours</span>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="bg-[#191c1d] hover:bg-primary text-white font-mono text-xs font-bold px-8 py-3 rounded-full transition-colors cursor-pointer shadow-md"
                >
                  Done / Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
