import React from 'react';
import { ArrowUpRight, Heart, Mail, Phone, MapPin } from 'lucide-react';
import { useSiteData } from '../data/siteDataContext';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onStartProject: () => void;
  onSelectService: (serviceId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onStartProject, onSelectService }) => {
  const { siteData } = useSiteData();
  const settings = siteData?.siteSettings || {
    agencyName: 'Tech To Web',
    tagline: 'Intelligence, avant-garde, and meticulously polished digital solutions.',
    email: 'contact@techtoweb.com',
    phone: '+1 (555) 019-2834',
    whatsapp: '+1 (555) 019-2834',
    address: 'San Francisco, CA & Remote Worldwide',
    footerNote: 'Built with modern precision for high-growth brands worldwide.'
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
              className="inline-flex items-center mb-4 group transition-transform duration-300 hover:scale-[1.02]"
            >
              <BrandLogo
                logoUrl={settings.logoUrl}
                agencyName={settings.agencyName}
                size="md"
              />
            </a>
            <p className="text-sm text-[#594139] leading-relaxed mb-6">
              {settings.tagline}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-bold border border-emerald-200">
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

          {/* Col 3: Company & Direct Contact */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#191c1d] mb-4">
              Direct Contact
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="text-[#594139] hover:text-primary transition-colors duration-200 text-left flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span className="truncate">{settings.email}</span>
                </a>
              </li>
              {settings.phone && (
                <li>
                  <a
                    href={`tel:${settings.phone}`}
                    className="text-[#594139] hover:text-primary transition-colors duration-200 text-left flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <span>{settings.phone}</span>
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="text-xs text-[#594139] flex items-center gap-1.5 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{settings.address}</span>
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

