import React, { useState } from 'react';
import { ArrowUpRight, Heart, Mail, Phone, MapPin, MessageCircle, Copy, Check, Headphones } from 'lucide-react';
import { useSiteData } from '../data/siteDataContext';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onStartProject: () => void;
  onSelectService: (serviceId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onStartProject, onSelectService }) => {
  const { siteData } = useSiteData();
  const [copiedType, setCopiedType] = useState<'whatsapp' | 'email' | null>(null);

  const settings = siteData?.siteSettings || {
    agencyName: 'Tech To Web',
    tagline: 'Intelligence, avant-garde, and meticulously polished digital solutions.',
    email: 'techtowebadmin@gmail.com',
    phone: '+1 (800) 555-0199',
    whatsapp: '+1 (800) 555-0199',
    address: 'San Francisco, CA & Remote Worldwide',
    footerNote: 'Built with modern precision for high-growth brands worldwide.'
  };

  const rawWhatsapp = settings.whatsapp || settings.phone || '+1 (800) 555-0199';
  const cleanWhatsapp = rawWhatsapp.replace(/[^0-9]/g, '');

  const handleCopy = (text: string, type: 'whatsapp' | 'email') => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      // fallback
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 90;
      const pos = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top: pos, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-surface-container-lowest w-full pt-16 sm:pt-24 pb-10 border-t border-surface-variant/70">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 pb-16">
          {/* Col 1: Brand */}
          <div className="md:col-span-1">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('home');
              }}
              className="inline-flex items-center mb-3 sm:mb-4 group transition-transform duration-300 hover:scale-[1.02] max-w-full"
            >
              <BrandLogo
                logoUrl={settings.logoUrl}
                agencyName={settings.agencyName}
                size="sm"
              />
            </a>
            <p className="text-xs sm:text-sm text-[#594139] leading-relaxed mb-5 sm:mb-6">
              {settings.tagline}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[11px] sm:text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Accepting New Client Projects</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#191c1d] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="#services"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('services');
                  }}
                  className="text-[#594139] hover:text-primary transition-colors duration-200"
                >
                  Expertise
                </a>
              </li>
              <li>
                <a
                  href="#work"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('work');
                  }}
                  className="text-[#594139] hover:text-primary transition-colors duration-200"
                >
                  Case Studies
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('about');
                  }}
                  className="text-[#594139] hover:text-primary transition-colors duration-200"
                >
                  Journal & Method
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Direct Support */}
          <div>
            <div className="flex items-center gap-1.5 mb-4">
              <Headphones className="w-3.5 h-3.5 text-primary" />
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#191c1d]">
                Live Support & Inquiries
              </h4>
            </div>

            <ul className="space-y-3 text-sm">
              {/* WhatsApp Support Item */}
              <li className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    WhatsApp Live Chat
                  </span>
                  <button
                    onClick={() => handleCopy(rawWhatsapp, 'whatsapp')}
                    className="text-[10px] font-mono text-emerald-700 hover:text-emerald-900 p-0.5 cursor-pointer"
                    title="Copy WhatsApp"
                  >
                    {copiedType === 'whatsapp' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello Tech To Web Support, I am visiting your website and would like to get in touch.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs font-bold text-emerald-950 hover:text-[#25D366] transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-current shrink-0" />
                  <span className="truncate">{rawWhatsapp}</span>
                </a>
              </li>

              {/* Email Support Item */}
              <li className="p-2.5 rounded-xl bg-surface-container border border-black/5">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-mono font-bold text-[#594139] flex items-center gap-1">
                    <Mail className="w-3 h-3 text-primary" />
                    Official Email
                  </span>
                  <button
                    onClick={() => handleCopy(settings.email, 'email')}
                    className="text-[10px] font-mono text-[#594139] hover:text-primary p-0.5 cursor-pointer"
                    title="Copy Email"
                  >
                    {copiedType === 'email' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <a
                  href={`mailto:${settings.email}?subject=${encodeURIComponent('Support & Project Inquiry - Tech To Web')}&body=${encodeURIComponent('Hi Tech To Web Support Team,\n\nI would like to inquire about...')}`}
                  className="font-mono text-xs font-bold text-[#191c1d] hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate">{settings.email}</span>
                </a>
              </li>

              {settings.address && (
                <li className="text-xs text-[#594139] flex items-center gap-1.5 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="text-[11px]">{settings.address}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Capabilities */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#191c1d] mb-4">
              Specialties
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => {
                    onSelectService('shopify');
                    scrollTo('services');
                  }}
                  className="text-[#594139] hover:text-primary transition-colors duration-200 text-left cursor-pointer"
                >
                  Shopify Store Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectService('web-dev');
                    scrollTo('services');
                  }}
                  className="text-[#594139] hover:text-primary transition-colors duration-200 text-left cursor-pointer"
                >
                  Custom Web Development
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectService('marketing');
                    scrollTo('services');
                  }}
                  className="text-[#594139] hover:text-primary transition-colors duration-200 text-left cursor-pointer"
                >
                  Performance Paid Media
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectService('seo');
                    scrollTo('services');
                  }}
                  className="text-[#594139] hover:text-primary transition-colors duration-200 text-left cursor-pointer"
                >
                  Technical & Organic SEO
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-surface-variant flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs font-mono text-[#594139]">
          <p>© {new Date().getFullYear()} {settings.agencyName}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            {settings.footerNote}
          </p>
        </div>
      </div>
    </footer>
  );
};

