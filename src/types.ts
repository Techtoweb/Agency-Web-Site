export type ServiceCategory = 'shopify' | 'web-dev' | 'marketing' | 'seo' | string;

export interface SubServiceItem {
  id: string;
  name: string;
  desc: string;
  tags: string[];
  icon: string;
  deliverables: string[];
  price?: string;
  deliveryTime?: string;
  pricingType?: 'fixed' | 'starting' | 'monthly' | 'hourly' | 'custom';
  badge?: string;
}

export interface ServiceCategoryDetail {
  id: string;
  title: string;
  shortLabel: string;
  sublabel: string;
  icon: string;
  color: string;
  bgColor: string;
  badgeColor: string;
  description: string;
  image: string;
  stats: { label: string; value: string };
  startingPrice?: string;
  deliveryTime?: string;
  subServices: SubServiceItem[];
}

export interface ServiceItem {
  id: string;
  category: ServiceCategory;
  categoryTitle: string;
  title: string;
  shortDesc: string;
  iconName: string;
  features: string[];
  metrics: string;
  color: string;
  accentBg: string;
  price?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: ServiceCategory;
  categoryLabel: string;
  client: string;
  year: string;
  image: string;
  description: string;
  challenge: string;
  solution: string;
  impact: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  link?: string;
  liveUrl?: string;
  isLive?: boolean;
  liveStatus?: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  desc: string;
  detail: string;
  duration: string;
  deliverables: string[];
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  metrics: string;
  rating: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  company?: string;
  role?: string;
  serviceInterest?: string;
  activeServices?: string[];
  joinedAt?: string;
}

export type AuthTab = 'login' | 'signup';

export interface HeroContentConfig {
  badge: string;
  titlePrimary: string;
  titleHighlight: string;
  titleSecondary: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  heroImage: string;
  statsBadge: string;
}

export interface SiteSettingsConfig {
  agencyName: string;
  tagline: string;
  logoUrl?: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  footerNote: string;
  notificationSound?: boolean;
}

export interface CustomPageSection {
  id: string;
  title: string;
  badge?: string;
  subtitle?: string;
  content: string;
  ctaText?: string;
  ctaLink?: string;
  enabled: boolean;
}

export interface SectionVisibilityConfig {
  hero: boolean;
  stats: boolean;
  services: boolean;
  portfolio: boolean;
  digitalExp: boolean;
  process: boolean;
  testimonials: boolean;
  cta: boolean;
  footer: boolean;
}

export interface LeadInquiry {
  id: string;
  type?: 'contact' | 'proposal' | 'order';
  orderType?: 'contact' | 'proposal' | 'order';
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  company?: string;
  website?: string;
  service: string;
  subService?: string;
  price?: string;
  servicePrice?: string;
  budget?: string;
  deliveryTime?: string;
  timeline?: string;
  message?: string;
  description?: string;
  requirements?: string;
  notes?: string;
  status: 'new' | 'contacted' | 'in_progress' | 'completed' | 'cancelled';
  isRead?: boolean;
  createdAt: string;
  timestamp?: number;
}

export interface SiteDataState {
  lastUpdated?: number;
  hero: HeroContentConfig;
  siteSettings: SiteSettingsConfig;
  categories: ServiceCategoryDetail[];
  projects: ProjectItem[];
  stats: StatItem[];
  processSteps: ProcessStep[];
  testimonials: TestimonialItem[];
  sectionsVisibility: SectionVisibilityConfig;
  customSections: CustomPageSection[];
  leads: LeadInquiry[];
}

export const ADMIN_EMAILS = ['techtowebadmin@gmail.com', 'techtoweadmin@gmail.com'];

export const isAuthorizedAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((adm) => adm.toLowerCase() === clean);
};


