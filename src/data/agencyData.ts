import { ServiceItem, ProjectItem, ProcessStep, StatItem, TestimonialItem, ServiceCategory } from '../types';

import zeynveroImg from '../assets/images/zeynvero_real_screenshot_1787051613095.jpg';
import gulfvibesImg from '../assets/images/gulfvibes_real_screenshot_1787051627201.jpg';
import clevaraImg from '../assets/images/clevara_real_screenshot_1787051641052.jpg';
import furpupImg from '../assets/images/furpup_real_screenshot_1787051654567.jpg';
import pelicanImg from '../assets/images/pelican_real_screenshot_1787051675724.jpg';
import nextvaultImg from '../assets/images/nextvault_real_screenshot_1787051690648.jpg';
import grifigoImg from '../assets/images/grifigo_real_screenshot_1787051703379.jpg';

export const HERO_DATA = {
  badge: 'Digital Agency 2026',
  titlePrimary: 'Build.',
  titleHighlight: 'Grow.',
  titleSecondary: 'Go Beyond.',
  subtitle: 'We engineer high-performance digital experiences that elevate brands and drive exponential growth in the modern web era.',
  ctaPrimary: 'Explore Our Work',
  ctaSecondary: 'Start a Project',
  heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfl0wcWJOJAcgh736AoMGs9-1HoMXkoTCPLQm7qw07IXu56ZmUueuza3a_wyPbxu9TtNhA7EPpIEd2Kmr0TxU4pqZstPnVAz9HfV-7Kf5IYg04Sn2hxub9guPt0x6kjbchs2B6Sdi9jacZ-S05SS4uGr9YlKKgMj3fZOG4hFlgcRCx4GlJ-RhLU_pbDCopgD98IeclowJJrL8R5JQB5lfdXlz8-q87I0x9V8ZsSNA2atXfaStRXebL',
  avatars: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAHx4kKjhScmDIwesHJCWZFK-1iIQvXVt8cHWBhZbSu0TTR_ap7NAAqE8WageOANY-EEmOpsLRe4qz0crWjExluV3XEnt1rVmqUGw0PKEHOxC9SfR9ZHhpSwLMrT1ecDqfsM23dyTfZSq6bhzTtMCqkIteh0VI93SBuJAINR2Hf938B_AN-1klUVUPCQRqadi3NIbaOO6qEvLdqWUvTKui4BFFMT2v_po5_IzxzSB9141k-3Su3C8oD',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAlRXbXRcuhEBi4fw_BHwvl6lA3jqghWXlHdd7899Rd1xu5kkrLFf77lQmN-euj9iFtEp-SwiPim558jZBbCAFIuAMAtRnCcovqNr84SnegKV36vDbgYDqwAaeCcstnafjPG3RX4MXWwe1UXIZF0_HDzy5uZu4w1iC25P_1wG2hED_9rZkC2yEFmmAa98-6BFXgii8ts0jCbn9R2K2c4xzbdEVYnVifAmdix9tRfK7AQql9QYjBX-pb',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBxdIP08X3y2HKyCGx9em75dPVxlspcoqRa6RvnWeKTUca4hrmzTa-bJyBgt2wO3JuVeWNwydg1LDdzHUUd9WJMsT_69rT4hSzfUiGi2RAcHoKWiwz_OK93MGoFOx85Qj5zRQSTS6p7bwBdqXD9X62I_eMHXHLO_IjEZ62bRmVqct_rsfGv6gZze1dAefEteCXyb8wsdXAfipvic1WMYVs1w2UbaR6ClEe-cSEsDONR07_cJFCLmX82'
  ],
  statsBadge: '+50 Brands'
};

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
  id: ServiceCategory;
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

export const SERVICES_CATEGORIES: ServiceCategoryDetail[] = [
  {
    id: 'shopify',
    title: 'Shopify Solutions',
    shortLabel: 'Shopify',
    sublabel: 'E-Commerce',
    icon: 'Store',
    color: '#ab3500',
    bgColor: 'bg-[#ffdbd0]/50',
    badgeColor: 'text-[#ab3500] bg-[#ffdbd0]/40',
    description: 'Enterprise-grade Shopify and Shopify Plus e-commerce solutions built for high-volume merchants. From bespoke liquid themes and Hydrogen headless builds to automated backend syncing.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCm5CCzsVPK3KCJg7rHQzYqIJvDd2Fgd32Gk7E6EVVCB8iCLlKTEpr51Up5e2wagV9ctaPTm-wNp3bTXUJramnU4XBajLIIUsiPEC0_P-jDMml4eZfzfezmObgTvpYQCuigtUQfEictdjnmtIDGCjmzWAdhwywKMTtdmazXgpaE50Basc5GbhfBHX2AC5dI30I-lLGA87d2nA4v6s7jCvsAkKa9TK_KadVSEe7rDt4ZyLeUfl-Rsc2k',
    stats: { label: 'Avg GMV Lift', value: '+142%' },
    startingPrice: '$199',
    deliveryTime: '3-7 Days',
    subServices: [
      {
        id: 'shopify-store-design',
        name: 'Shopify Store Design',
        desc: 'Bespoke, conversion-focused UI/UX tailored to your brand identity with custom typography, intuitive navigation, and high-converting product pages.',
        tags: ['Custom UI/UX', 'Figma to Shopify', 'Mobile-First', 'Brand Identity'],
        icon: 'Layout',
        price: '$299',
        deliveryTime: '3-5 Days',
        pricingType: 'starting',
        badge: 'Popular',
        deliverables: ['Custom Figma Prototype', 'Design System & Component Library', 'Responsive Mobile Layouts', 'Brand Asset Guide']
      },
      {
        id: 'shopify-store-development',
        name: 'Shopify Store Development',
        desc: 'Custom Liquid & Hydrogen 2.0 headless architecture engineered for sub-second speeds, modular customization, and effortless scalability.',
        tags: ['Liquid & JSON', 'Hydrogen 2.0', 'Headless Storefront', 'Oxygen Edge Hosting'],
        icon: 'Code2',
        price: '$499',
        deliveryTime: '5-7 Days',
        pricingType: 'starting',
        badge: 'Best Value',
        deliverables: ['Clean Semantic Codebase', 'Fast TTFB (<200ms)', 'Modular Section Builder', 'Git Version Control']
      },
      {
        id: 'shopify-theme-customization',
        name: 'Shopify Theme Customization',
        desc: 'Fine-tuning existing themes (Dawn, Prestige, Warehouse, Impulse) with tailored liquid sections, custom drawer carts, and micro-interactions.',
        tags: ['Theme 2.0', 'Custom Sections', 'Drawer Cart', 'Micro-Interactions'],
        icon: 'Sliders',
        price: '$199',
        deliveryTime: '2-3 Days',
        pricingType: 'fixed',
        deliverables: ['Custom Drag-and-Drop Blocks', 'Ajax Cart & Upsell Flow', 'Custom PDP Accordions', 'Speed Optimization']
      },
      {
        id: 'shopify-store-setup',
        name: 'Shopify Store Setup & Configuration',
        desc: 'End-to-end launch readiness including Stripe/PayPal gateways, multi-currency geo-markets, dynamic shipping matrices, and tax compliance.',
        tags: ['Shopify Markets', 'Payment Gateways', 'Tax Compliance', 'Shipping Rules'],
        icon: 'Settings',
        price: '$249',
        deliveryTime: '3-4 Days',
        pricingType: 'fixed',
        deliverables: ['Multi-currency Setup', 'Stripe & PayPal Integration', 'Automated Email Templates', 'Domain & SSL Verification']
      },
      {
        id: 'product-upload-catalog',
        name: 'Product Upload & Catalog Architecture',
        desc: 'Structured inventory management, variant matrices, smart automated collections, meta-fields, and bulk CSV/API synchronization.',
        tags: ['Metafields', 'Variant Matrix', 'Smart Collections', 'Bulk Import/Export'],
        icon: 'Layers',
        price: '$149',
        deliveryTime: '2 Days',
        pricingType: 'starting',
        deliverables: ['Normalized Taxonomy', 'Custom Metafield Definitions', 'SEO-friendly URLs', 'Variant Image Matrix']
      },
      {
        id: 'store-optimization-cro',
        name: 'Store Optimization & Conversion (CRO)',
        desc: 'Core Web Vitals tuning, checkout funnel friction reduction, dynamic 1-click buy buttons, and intelligent product recommendation engines.',
        tags: ['Core Web Vitals', 'CRO Audits', 'A/B Testing', 'Sub-second Load'],
        icon: 'Zap',
        price: '$299',
        deliveryTime: '3 Days',
        pricingType: 'fixed',
        badge: 'Top Rated',
        deliverables: ['95+ Mobile Lighthouse Score', 'Optimized Checkout Path', 'Asset Compression Pipeline', 'A/B Test Roadmap']
      },
      {
        id: 'shopify-app-integration',
        name: 'Shopify App Integration & Private Apps',
        desc: 'Seamless integration with Klaviyo, Gorgias, Recharge subscriptions, ERPs, and bespoke private Shopify apps using GraphQL Admin API.',
        tags: ['Admin GraphQL API', 'Klaviyo / Recharge', 'Private Custom Apps', 'Webhooks'],
        icon: 'Cpu',
        price: '$349',
        deliveryTime: '4-5 Days',
        pricingType: 'starting',
        deliverables: ['Clean App Embed Architecture', 'Custom Webhook Listeners', 'Zero-conflict Scripting', 'ERP/CRM Data Sync']
      },
      {
        id: 'shopify-migration',
        name: 'Shopify Migration & Replatforming',
        desc: 'Zero-downtime database migration from WooCommerce, Magento, BigCommerce, or custom platforms with complete 301 redirect SEO safety.',
        tags: ['Zero Downtime', '301 SEO Safeguard', 'Order History Sync', 'Customer Data Export'],
        icon: 'ArrowRightLeft',
        price: '$399',
        deliveryTime: '4-6 Days',
        pricingType: 'starting',
        deliverables: ['100% Data Integrity Guarantee', 'Automated 301 Redirect Matrix', 'Preserved Organic Rankings', 'Customer Password Reset Funnel']
      }
    ]
  },
  {
    id: 'web-dev',
    title: 'Web Dev Solutions',
    shortLabel: 'Web Dev',
    sublabel: 'Custom Apps',
    icon: 'Code2',
    color: '#0040e0',
    bgColor: 'bg-[#dde1ff]/50',
    badgeColor: 'text-[#0040e0] bg-[#dde1ff]/40',
    description: 'Modern, high-performance web applications, custom digital platforms, and responsive interfaces engineered with React, Next.js, TypeScript, and modern APIs.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfl0wcWJOJAcgh736AoMGs9-1HoMXkoTCPLQm7qw07IXu56ZmUueuza3a_wyPbxu9TtNhA7EPpIEd2Kmr0TxU4pqZstPnVAz9HfV-7Kf5IYg04Sn2hxub9guPt0x6kjbchs2B6Sdi9jacZ-S05SS4uGr9YlKKgMj3fZOG4hFlgcRCx4GlJ-RhLU_pbDCopgD98IeclowJJrL8R5JQB5lfdXlz8-q87I0x9V8ZsSNA2atXfaStRXebL',
    stats: { label: 'Lighthouse Score', value: '99/100' },
    startingPrice: '$249',
    deliveryTime: '4-10 Days',
    subServices: [
      {
        id: 'ecommerce-website-dev',
        name: 'E-Commerce Website Development',
        desc: 'Custom multi-vendor marketplaces, B2B wholesale portals, and bespoke D2C shopping platforms engineered for ultra-high transaction volume.',
        tags: ['Multi-Vendor', 'B2B Wholesale', 'Stripe Connect', 'Real-time Inventory'],
        icon: 'ShoppingBag',
        price: '$699',
        deliveryTime: '7-12 Days',
        pricingType: 'starting',
        badge: 'Enterprise',
        deliverables: ['Custom Shopping Cart & Checkout', 'Admin Vendor Dashboard', 'Automated Invoicing Engine', 'Multi-tenant Security']
      },
      {
        id: 'custom-website-dev',
        name: 'Custom Web Application Development',
        desc: 'Tailored single-page applications (SPAs) and Progressive Web Apps (PWAs) built with React 19, Next.js App Router, and serverless backends.',
        tags: ['React 19', 'Next.js App Router', 'TypeScript', 'Serverless APIs'],
        icon: 'Laptop',
        price: '$599',
        deliveryTime: '7-10 Days',
        pricingType: 'starting',
        badge: 'Popular',
        deliverables: ['Type-safe Full-Stack Logic', 'Modular Component Architecture', 'PWA Offline Capabilities', 'Role-Based Access Control']
      },
      {
        id: 'business-website-dev',
        name: 'Business Website Development',
        desc: 'Corporate enterprise portals with bespoke branding, intuitive CMS integrations (Sanity/Strapi), multi-lingual support, and lead capture funnels.',
        tags: ['Corporate Portal', 'Headless CMS', 'Lead Generation', 'Security Hardened'],
        icon: 'Building2',
        price: '$399',
        deliveryTime: '5-7 Days',
        pricingType: 'starting',
        deliverables: ['Custom CMS Authoring Hub', 'Dynamic Blog & Case Studies', 'Contact Lead Pipelines', 'Enterprise SLA Support']
      },
      {
        id: 'agency-website-dev',
        name: 'Agency & Portfolio Website Development',
        desc: 'Avant-garde digital showcase websites featuring cinematic micro-interactions, smooth WebGL canvas shaders, and fluid typography.',
        tags: ['Creative Direction', 'WebGL Shaders', 'Smooth Scroll', 'Interactive Portfolios'],
        icon: 'Sparkles',
        price: '$349',
        deliveryTime: '4-6 Days',
        pricingType: 'starting',
        deliverables: ['60fps Fluid Interactions', 'Award-Winning Aesthetics', 'Dynamic Media Showcases', 'Case Study Builder']
      },
      {
        id: 'landing-page-dev',
        name: 'Landing Page Development',
        desc: 'High-velocity promotional landing funnels engineered with A/B testing variants, instant load times, and precision conversion triggers.',
        tags: ['High CRO', 'A/B Funnels', 'Heatmap Ready', 'Sub-second Load'],
        icon: 'Target',
        price: '$249',
        deliveryTime: '2-3 Days',
        pricingType: 'fixed',
        badge: 'Fast Delivery',
        deliverables: ['Instant (<1s) Load Performance', 'Pixel & Analytics Integration', 'Custom Form Validation', 'Dynamic Headline Swapping']
      },
      {
        id: 'responsive-web-dev',
        name: 'Responsive & Mobile-First Web Development',
        desc: 'Pixel-perfect fluidity across all viewports—from compact mobile screens and foldables to 4K ultra-wide monitors.',
        tags: ['Mobile First', 'Adaptive Layouts', 'Touch Optimized', 'Fluid Typography'],
        icon: 'Smartphone',
        price: '$199',
        deliveryTime: '2-4 Days',
        pricingType: 'fixed',
        deliverables: ['Cross-Device Fluidity', 'Touch-friendly UI Targets', 'Retina Vector Graphics', 'Browser Compatibility Matrix']
      },
      {
        id: 'website-optimization-speed',
        name: 'Website Speed & Core Web Vitals Optimization',
        desc: 'Sub-second TTFB, edge CDN distribution, asset minification, critical CSS inlining, and guaranteed 95+ Google Lighthouse scores.',
        tags: ['Core Web Vitals', 'Edge CDN', 'LCP / FID / CLS', 'Asset Compression'],
        icon: 'Zap',
        price: '$220',
        deliveryTime: '2-3 Days',
        pricingType: 'fixed',
        badge: 'Guaranteed 95+',
        deliverables: ['Green Lighthouse Scorecard', 'Image Next-Gen (AVIF/WebP)', 'Edge Caching Rules', 'Reduced Server TTFB']
      },
      {
        id: 'api-backend-dev',
        name: 'API Integration & Custom Backend Architecture',
        desc: 'Scalable REST and GraphQL APIs, real-time WebSockets, cloud database integration (PostgreSQL / Firestore), and third-party webhook handling.',
        tags: ['GraphQL / REST', 'WebSockets', 'PostgreSQL / Node', 'OAuth 2.0'],
        icon: 'Database',
        price: '$450',
        deliveryTime: '4-7 Days',
        pricingType: 'starting',
        deliverables: ['Documented Swagger/OpenAPI Spec', 'Secure Authentication & JWT', 'High-throughput Query Caching', 'Cloud Ingress Deployment']
      }
    ]
  },
  {
    id: 'marketing',
    title: 'Digital Marketing & Growth',
    shortLabel: 'Marketing',
    sublabel: 'Growth Strategy',
    icon: 'Megaphone',
    color: '#ff6b35',
    bgColor: 'bg-[#ffdbd0]/50',
    badgeColor: 'text-[#ff6b35] bg-[#ffdbd0]/40',
    description: 'Data-driven performance marketing, multi-channel growth systems, creative ad testing, and paid media funnels engineered for maximum return on ad spend (ROAS).',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo6PqjZ7lOWQU5GvvrwrnhSnvInFx5AsdQ-bZNXF8hJEEuCZ4UXwyc-o8iPD7TBIrCbMovGjlK_-RjoLiCUIjPtu8y4bbfed9lWDQD0eAUTSoAOVwlCuSWWgRBaFH0lWO3Q7t0szICQiiaP7RsRGljPIpuuUMNt8GKWSYa3GjQpzYxyXQMt3hnXw87J7RqxMlHjatwir6H5L9hEL3LRar_R_Ry0vmNwMmkmrznLzWpsLI0F1QRNipD',
    stats: { label: 'Average ROAS', value: '4.4x' },
    startingPrice: '$299/mo',
    deliveryTime: 'Monthly Retainer',
    subServices: [
      {
        id: 'facebook-marketing',
        name: 'Facebook Marketing & Scaling',
        desc: 'Advanced audience modeling, CBO scaling strategies, Advantage+ shopping campaigns, and Conversions API (CAPI) server-side tracking.',
        tags: ['Meta CAPI', 'Advantage+ Campaigns', 'Audience Modeling', 'CBO Scaling'],
        icon: 'Share2',
        price: '$350/mo',
        deliveryTime: 'Monthly Management',
        pricingType: 'monthly',
        badge: 'High ROAS',
        deliverables: ['Full-Funnel Campaign Setup', 'Server-Side CAPI Gateway', 'Custom & Lookalike Audiences', 'Weekly Performance Reports']
      },
      {
        id: 'instagram-marketing',
        name: 'Instagram Marketing & Reels Strategy',
        desc: 'Visual brand storytelling, high-engagement Reels content, shoppable Instagram feeds, and creator influencer amplification partnerships.',
        tags: ['Reels Growth', 'Shoppable Feed', 'Influencer Collabs', 'Visual Branding'],
        icon: 'Instagram',
        price: '$299/mo',
        deliveryTime: 'Monthly Retainer',
        pricingType: 'monthly',
        deliverables: ['Monthly Content Matrix', 'Creator Outreach Management', 'Direct Message Automation', 'Shoppable Tag Optimization']
      },
      {
        id: 'social-media-marketing',
        name: 'Omnichannel Social Media Marketing',
        desc: 'Holistic cross-platform social presence across LinkedIn, X (Twitter), Pinterest, and TikTok with structured brand voice governance.',
        tags: ['Omnichannel', 'Content Calendars', 'Community Growth', 'Brand Voice'],
        icon: 'MessageSquare',
        price: '$450/mo',
        deliveryTime: 'Monthly Retainer',
        pricingType: 'monthly',
        deliverables: ['30-Day Content Calendar', 'Creative Asset Production', 'Community Moderation Flow', 'Audience Sentiment Analytics']
      },
      {
        id: 'meta-paid-ads',
        name: 'Facebook & Instagram Paid Ads Matrix',
        desc: 'Rigorous 3-phase creative testing (Hooks, Body, CTAs), automated rule-based bid adjustments, and high-velocity dynamic retargeting.',
        tags: ['Ad Creative Testing', 'Dynamic Retargeting', 'High ROAS', 'Bid Strategies'],
        icon: 'PieChart',
        price: '$399/mo',
        deliveryTime: 'Monthly Retainer',
        pricingType: 'monthly',
        badge: 'Popular',
        deliverables: ['Iterative Video & Image Ad Sets', 'Ad Copywriting Variations', 'Retargeting Funnel Sequences', 'Real-Time ROI Dashboard']
      },
      {
        id: 'growth-strategy',
        name: 'Digital Marketing Growth Strategy',
        desc: 'Full-funnel customer acquisition roadmaps, unit economics modeling (CAC vs. LTV), channel diversification, and retention frameworks.',
        tags: ['Full Funnel Roadmap', 'CAC / LTV Optimization', 'Attribution Modeling', 'Retention Loops'],
        icon: 'TrendingUp',
        price: '$499',
        deliveryTime: '7-10 Days',
        pricingType: 'fixed',
        deliverables: ['Custom 90-Day Growth Blueprint', 'Unit Economics Financial Model', 'Multi-Touch Attribution', 'Executive Strategy Decks']
      },
      {
        id: 'youtube-marketing',
        name: 'YouTube Marketing & Video Ads',
        desc: 'Intent-driven YouTube In-Stream and Shorts ad campaigns, YouTube SEO keyword targeting, and creator sponsorship integration.',
        tags: ['In-Stream Video Ads', 'YouTube Shorts', 'Search Intent Targeting', 'Sponsorships'],
        icon: 'Video',
        price: '$380/mo',
        deliveryTime: 'Monthly Retainer',
        pricingType: 'monthly',
        deliverables: ['Video Scripting Frameworks', 'Custom Thumbnail Design', 'Audience Placements & Exclusions', 'Cross-Device Conversion Tracking']
      },
      {
        id: 'email-marketing-automation',
        name: 'Email Marketing & Automated Funnels',
        desc: 'Klaviyo and Omnisend automated lifecycle flows: Welcome Series, Abandoned Checkout, Post-Purchase Upsell, and VIP loyalty segments.',
        tags: ['Klaviyo Flows', 'Abandoned Cart', 'Lifecycle Segments', 'SMS Marketing'],
        icon: 'Mail',
        price: '$320',
        deliveryTime: '4-6 Days',
        pricingType: 'starting',
        badge: 'High Revenue',
        deliverables: ['Automated Revenue Flows', 'Responsive HTML Email Templates', 'List Hygiene & Deliverability', 'SMS Drip Sequences']
      },
      {
        id: 'cro-funnel-marketing',
        name: 'Conversion Rate Optimization (CRO)',
        desc: 'User behavior heatmaps (Hotjar/Clarity), checkout friction audits, micro-copy testing, and multi-variant landing page optimization.',
        tags: ['Heatmap Analysis', 'Checkout CRO', 'Friction Audits', 'A/B Testing'],
        icon: 'BarChart3',
        price: '$299',
        deliveryTime: '5 Days',
        pricingType: 'fixed',
        deliverables: ['Full Funnel Drop-off Analysis', 'Heuristic UX Audit Report', 'Live A/B Testing Execution', 'Measurable Conversion Uplift']
      }
    ]
  },
  {
    id: 'seo',
    title: 'SEO & Organic Growth',
    shortLabel: 'SEO',
    sublabel: 'Optimization',
    icon: 'Search',
    color: '#00696e',
    bgColor: 'bg-[#63f7ff]/20',
    badgeColor: 'text-[#00696e] bg-[#63f7ff]/30',
    description: 'Dominating search engine results through deep technical optimization, high-intent keyword mapping, authoritative content clusters, and natural link acquisition.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDB3EdmJtK_wvZdh-WzEaUUZCvJWgE_zxxz4g1qICYZnkoEivoBO7WhahNWuACJYlbXHx-HI191aGLY8N_id0_7g2raIAJ2lO770RzFpi5phkvnqRS5BG6rhDRQWIpnIgFrMMhELXH8t-jLKFbDlNOH2agPQm02YPJmOVs-krxr5vkOpt_R3S_COrKOtHMdnJ9pgLCgrdsIjaoT8sJ15bp74nsh8F-dXOwIbA6zX03CFVWcYG-LW0Ez',
    stats: { label: 'Top 3 Rankings', value: '88%+' },
    startingPrice: '$199',
    deliveryTime: 'Monthly / One-Time',
    subServices: [
      {
        id: 'keyword-research',
        name: 'In-Depth Keyword Research & Mapping',
        desc: 'High-commercial intent keyword discovery, topical authority pillar clustering, search volume forecasting, and competitor gap mapping.',
        tags: ['Topical Clusters', 'Commercial Intent', 'Search Volume Modeling', 'Competitor Gap'],
        icon: 'Search',
        price: '$150',
        deliveryTime: '2-3 Days',
        pricingType: 'fixed',
        deliverables: ['Master Keyword Master Sheet', 'Topic Cluster Content Blueprint', 'Search Intent Tagging', 'Difficulty vs. Opportunity Matrix']
      },
      {
        id: 'on-page-seo',
        name: 'On-Page SEO Optimization',
        desc: 'Semantic HTML5 structure, title/meta optimization, structured JSON-LD schema markup, internal linking silos, and NLP content depth.',
        tags: ['JSON-LD Schema', 'Semantic Hierarchy', 'Internal Silos', 'NLP Content Optimization'],
        icon: 'FileCode2',
        price: '$199',
        deliveryTime: '3-4 Days',
        pricingType: 'fixed',
        badge: 'Recommended',
        deliverables: ['Custom Schema Implementations', 'Meta Title & Description Overhaul', 'Internal Linking Architecture', 'Image Alt & Semantic Tagging']
      },
      {
        id: 'technical-seo',
        name: 'Technical SEO Audit & Architecture',
        desc: 'Crawl budget optimization, canonical tags, XML sitemaps, robots.txt directives, indexing fixes, and Core Web Vitals remediation.',
        tags: ['Crawl Budget', 'Indexing Fixes', 'Robots & Sitemaps', 'Canonicalization'],
        icon: 'Cpu',
        price: '$250',
        deliveryTime: '3-5 Days',
        pricingType: 'fixed',
        deliverables: ['150+ Point Technical Health Audit', 'Sitemap & Robots.txt Rebuild', 'Broken Link & Redirect Remediation', 'Google Search Console Verification']
      },
      {
        id: 'off-page-seo',
        name: 'High-Authority Off-Page SEO & PR',
        desc: 'Digital PR campaigns, editorial high-DA contextual backlinks, brand mention acquisition, and authoritative citation building.',
        tags: ['Digital PR', 'Editorial Backlinks', 'High DA/DR (60+)', 'Brand Authority'],
        icon: 'Link2',
        price: '$399/mo',
        deliveryTime: 'Monthly Campaign',
        pricingType: 'monthly',
        badge: 'High DA 60+',
        deliverables: ['Manual Outreach Link Campaign', 'Editorial Backlink Portfolio', 'Toxic Backlink Disavow', 'Brand Mention Tracking']
      },
      {
        id: 'ecommerce-seo',
        name: 'E-Commerce SEO Architecture',
        desc: 'Faceted navigation indexing control, product schema with review stars, category page ranking frameworks, and out-of-stock SEO handling.',
        tags: ['Faceted Navigation', 'Product Schema', 'Category SEO', 'Review Snippets'],
        icon: 'Store',
        price: '$349',
        deliveryTime: '5-7 Days',
        pricingType: 'starting',
        deliverables: ['Faceted URL Canonical Logic', 'Rich Product Schema Markup', 'Category Hierarchy Optimization', 'Review Star Search Snippets']
      },
      {
        id: 'local-seo',
        name: 'Local SEO & Google Business Profile',
        desc: 'Dominating Google Maps local 3-pack, NAP consistency across 50+ local directories, geo-tagged content, and automated review capture.',
        tags: ['Google Maps 3-Pack', 'NAP Citations', 'Local Schema', 'Review Funnels'],
        icon: 'MapPin',
        price: '$220',
        deliveryTime: '3-5 Days',
        pricingType: 'fixed',
        deliverables: ['Google Business Profile Optimization', '50+ High Authority Citations', 'Geo-Targeted Landing Pages', 'Automated Review Request Flow']
      },
      {
        id: 'seo-audit-monitoring',
        name: 'Continuous SEO Telemetry & Audits',
        desc: 'Weekly keyword rank tracking across desktop & mobile, competitor movement alerts, algorithmic update protection, and monthly ROI reports.',
        tags: ['Rank Tracking', 'Algorithm Alerts', 'Competitor Radar', 'Live Telemetry'],
        icon: 'Activity',
        price: '$180/mo',
        deliveryTime: 'Ongoing Tracking',
        pricingType: 'monthly',
        deliverables: ['Daily Rank Tracking Dashboard', 'Monthly Executive Health Report', 'Algorithmic Impact Safeguard', 'Actionable SEO Roadmap']
      },
      {
        id: 'international-seo',
        name: 'International & Multi-Regional SEO',
        desc: 'Hreflang implementation, ccTLD vs subfolder architecture, localized search engine optimization (Baidu, Yandex, Google global).',
        tags: ['Hreflang Tags', 'Multi-Language', 'Geo-Targeting', 'Global Indexing'],
        icon: 'Globe',
        price: '$450',
        deliveryTime: '7-10 Days',
        pricingType: 'starting',
        deliverables: ['Hreflang XML Sitemap Integration', 'Geo-Targeting Setup in GSC', 'Localized URL Taxonomy', 'Content Localization Strategy']
      }
    ]
  },
  {
    id: 'payment-gateway',
    title: 'Payment Gateway Solutions',
    shortLabel: 'Payment Gateway',
    sublabel: 'USA LLC & UK LTD',
    icon: 'CreditCard',
    color: '#059669',
    bgColor: 'bg-[#d1fae5]/60',
    badgeColor: 'text-[#059669] bg-[#d1fae5]/70',
    description: 'International merchant architecture and non-resident business structuring for global e-commerce. From 100% legal USA LLC and UK LTD company formation to verified Stripe, PayPal, and multi-currency business banking integration.',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    stats: { label: 'Approval Rate', value: '99.8%' },
    startingPrice: '$299',
    deliveryTime: '5-14 Days',
    subServices: [
      {
        id: 'usa-llc-payment-gateway',
        name: 'USA LLC Formation & Payment Gateway Setup',
        desc: 'Complete non-resident USA LLC registration (Wyoming/Delaware/New Mexico), official IRS EIN tax number issuance, US business bank accounts (Mercury Bank, Relay, Wise Business), and verified Stripe US & PayPal US merchant gateway integration for global Shopify & custom stores.',
        tags: ['USA LLC Formation', 'IRS EIN Tax Number', 'Mercury / Wise Bank', 'Stripe US & PayPal US'],
        icon: 'Building',
        price: '$450',
        deliveryTime: '10-14 Business Days',
        pricingType: 'fixed',
        badge: 'Most Popular',
        deliverables: ['State LLC Certificate of Formation', 'Official IRS EIN Confirmation Letter', 'US Virtual Office & Registered Agent (1 Year)', 'Live Stripe US & PayPal US Merchant Account', 'Mercury / Relay US Business Bank Account']
      },
      {
        id: 'uk-ltd-payment-gateway',
        name: 'UK LTD Formation & Payment Gateway Integration',
        desc: 'UK Companies House LTD registration for international founders, UK prestigious registered office address, Wise Business / Tide / Revolut Business onboarding, and full Stripe UK & PayPal UK merchant gateway activation with multi-currency GBP/USD/EUR checkout.',
        tags: ['UK Companies House', 'Registered UK Address', 'Wise / Tide UK Bank', 'Stripe UK & PayPal UK'],
        icon: 'Landmark',
        price: '$320',
        deliveryTime: '3-5 Business Days',
        pricingType: 'fixed',
        badge: 'Fast Setup',
        deliverables: ['Official UK Certificate of Incorporation', 'UK Registered Office Address & Mail Forwarding', 'Wise Business / Tide UK Account Setup', 'Active Stripe UK & PayPal UK Merchant Accounts', 'Full VAT & Corporation Tax Compliance Guidance']
      },
      {
        id: 'stripe-paypal-multi-currency',
        name: 'Stripe & PayPal Multi-Currency Gateway Architecture',
        desc: 'Zero-friction checkout integration, Apple Pay & Google Pay 1-click buy, Klarna/Afterpay Buy Now Pay Later (BNPL), anti-fraud radar rules, and multi-currency payout routing.',
        tags: ['Apple Pay & Google Pay', 'Klarna / Afterpay BNPL', 'Anti-Fraud Radar', 'Zero-Friction Checkout'],
        icon: 'ShieldCheck',
        price: '$199',
        deliveryTime: '2-3 Days',
        pricingType: 'fixed',
        deliverables: ['1-Click Accelerated Checkout Setup', 'Cross-Border Currency Conversion Engine', 'Custom Stripe Webhook Listeners', 'Fraud Prevention & Chargeback Safeguards']
      },
      {
        id: 'international-banking-payouts',
        name: 'Cross-Border Banking & Automated Payout Pipeline',
        desc: 'Setup and automated linking of Mercury Bank, Wise Business, Payoneer, and local bank wire transfers for zero-delay profit repatriation and currency conversion.',
        tags: ['Mercury Bank', 'Wise Business', 'Payoneer Integration', 'Automated Payouts'],
        icon: 'ArrowRightLeft',
        price: '$180',
        deliveryTime: '2-4 Days',
        pricingType: 'fixed',
        deliverables: ['Multi-Currency Digital IBANs (USD, EUR, GBP)', 'Automated Payout Schedule Matrix', 'Bank-to-Local Wire Integration', 'Zero Delay Currency Exchange Setup']
      }
    ]
  }
];


export const PORTFOLIO_PROJECTS: ProjectItem[] = [
  {
    id: 'zeynvero-shop',
    title: 'Zeynvero Fashion Store',
    category: 'shopify',
    categoryLabel: 'Shopify Store Design & Dev',
    client: 'Zeynvero Streetwear Ltd.',
    year: '2026',
    image: zeynveroImg,
    liveUrl: 'https://www.zeynvero.shop',
    isLive: true,
    liveStatus: 'Running / Live Store',
    description: 'Modern luxury streetwear & lifestyle Shopify storefront featuring bespoke Liquid 2.0 sections, rapid AJAX side-drawer cart, and instant mobile-first conversion funnel.',
    challenge: 'Legacy store suffered from high checkout friction, slow mobile rendering, and weak visual brand identity.',
    solution: 'Designed and developed a custom Shopify theme with micro-interactions, responsive lookbook layouts, and sub-second asset caching.',
    impact: 'Increased mobile checkout conversion rate by +240% and generated over $185,000 in monthly sales volume.',
    tags: ['Shopify Theme 2.0', 'Custom Liquid', 'Mobile First', 'AJAX Cart', 'Live Project'],
    metrics: [
      { label: 'Mobile Conversion', value: '+240%' },
      { label: 'Lighthouse Speed', value: '98/100' },
      { label: 'Live Status', value: 'Active 🟢' }
    ]
  },
  {
    id: 'gulfvibes-store',
    title: 'Gulf Vibes Fragrance & Lifestyle',
    category: 'shopify',
    categoryLabel: 'Shopify Multi-Currency & Markets',
    client: 'Gulf Vibes Official',
    year: '2026',
    image: gulfvibesImg,
    liveUrl: 'https://www.gulfvibes.store',
    isLive: true,
    liveStatus: 'Running / Live Store',
    description: 'Opulent Arabian perfumery and lifestyle e-commerce portal equipped with multi-currency geo-markets, dynamic gift bundle builder, and fast GCC localized checkout.',
    challenge: 'Targeting multi-country Gulf markets required localized currency conversion, custom regional shipping rules, and regional gateway integration.',
    solution: 'Configured Shopify Markets architecture, custom gift set configurator, Tabby/Tamara installment flows, and high-contrast luxury UI styling.',
    impact: 'Boosted average order value (AOV) by +65% and expanded direct GCC market sales across 6 countries.',
    tags: ['Shopify Markets', 'Multi-Currency', 'Luxury UI/UX', 'Bundle Builder', 'Live Project'],
    metrics: [
      { label: 'AOV Growth', value: '+65%' },
      { label: 'GCC Markets', value: '6 Regions' },
      { label: 'Live Status', value: 'Active 🟢' }
    ]
  },
  {
    id: 'clevara-home',
    title: 'Clevara Home Decor & Living',
    category: 'shopify',
    categoryLabel: 'Shopify Store Design & CRO',
    client: 'Clevara Home Inc.',
    year: '2026',
    image: clevaraImg,
    liveUrl: 'https://clevarahome.myshopify.com',
    isLive: true,
    liveStatus: 'Running / Live Store',
    description: 'Aesthetic Scandinavian interior design and home living Shopify store with high-res product galleries, sticky buy-bar, and automated upsell triggers.',
    challenge: 'High image payload from 4K furniture photos caused slow initial page loads and high bounce rates on mobile devices.',
    solution: 'Engineered WebP next-gen compression pipeline, progressive image loading, and frictionless 1-click buy checkout accelerators.',
    impact: 'Reduced mobile bounce rate by 44% and achieved a 3.4x surge in add-to-cart conversions.',
    tags: ['Shopify Plus', 'Conversion CRO', 'Visual Merchandising', 'Fast TTFB', 'Live Project'],
    metrics: [
      { label: 'Bounce Rate', value: '-44%' },
      { label: 'Mobile Speed', value: '0.8s' },
      { label: 'Live Status', value: 'Active 🟢' }
    ]
  },
  {
    id: 'the-fur-pup',
    title: 'The Fur Pup Pet Brand',
    category: 'shopify',
    categoryLabel: 'Shopify D2C & Subscriptions',
    client: 'The Fur Pup LLC',
    year: '2026',
    image: furpupImg,
    liveUrl: 'https://www.thefurpup.com',
    isLive: true,
    liveStatus: 'Running / Live Store',
    description: 'Playful, high-velocity D2C pet essentials brand featuring live personalized engraving visualizers, subscription box recurring orders, and SMS automations.',
    challenge: 'Required seamless customer name customization on pet collars with live preview and automated recurring delivery billing.',
    solution: 'Built custom Liquid line-item properties generator and integrated Recharge recurring subscription billing with branded customer portal.',
    impact: 'Added $52,000 in monthly recurring subscription revenue (MRR) with 94% retention rate.',
    tags: ['Recharge Subscriptions', 'Product Customizer', 'D2C E-Commerce', 'Klaviyo SMS', 'Live Project'],
    metrics: [
      { label: 'Subscription MRR', value: '+$52k' },
      { label: 'Customer Retention', value: '94%' },
      { label: 'Live Status', value: 'Active 🟢' }
    ]
  },
  {
    id: 'pelican-mart',
    title: 'Pelican Mart Trending Goods',
    category: 'shopify',
    categoryLabel: 'Shopify Megastore & Scaling',
    client: 'Pelican Mart Global',
    year: '2026',
    image: pelicanImg,
    liveUrl: 'https://www.pelicanmart.shop',
    isLive: true,
    liveStatus: 'Running / Live Store',
    description: 'High-throughput multi-category e-commerce storefront with dynamic flash sale countdown timers, instant predictive search, and tiered volume discounts.',
    challenge: 'Managing high-velocity multi-category inventory without slowing down catalog filtering during promotional viral ad spikes.',
    solution: 'Implemented indexed catalog navigation, dynamic quantity-break pricing widgets, and automated inventory sync pipelines.',
    impact: 'Processed over 30,000 orders in Q1 with zero downtime and a sustained 4.7% checkout conversion rate.',
    tags: ['Catalog Scale', 'Bulk Discount Matrix', 'Flash Sale Funnels', 'High TTFB', 'Live Project'],
    metrics: [
      { label: 'Orders Processed', value: '30k+' },
      { label: 'Cart Conversion', value: '4.7%' },
      { label: 'Live Status', value: 'Active 🟢' }
    ]
  },
  {
    id: 'nextvault-store',
    title: 'NextVault Tech & EDC Store',
    category: 'web-dev',
    categoryLabel: 'Tech Gadgets & Custom E-Commerce',
    client: 'NextVault Security Systems',
    year: '2026',
    image: nextvaultImg,
    liveUrl: 'https://nextvault.store',
    isLive: true,
    liveStatus: 'Running / Live Store',
    description: 'Cyberpunk futuristic tech and everyday carry (EDC) storefront with interactive specification tabs, 360-degree product explorer, and encrypted checkout.',
    challenge: 'Needed to communicate complex smart security hardware specifications with sleek visual clarity and tech-forward aesthetics.',
    solution: 'Designed custom dark-mode UI with interactive spec matrix, video hero displays, and instant digital wallet integration.',
    impact: 'Average customer session duration increased by +310% and ad campaign ROAS reached 4.9x.',
    tags: ['Custom E-Commerce', 'Dark UI Architecture', '360 Product View', 'High ROAS', 'Live Project'],
    metrics: [
      { label: 'Session Duration', value: '+310%' },
      { label: 'Ad Blended ROAS', value: '4.9x' },
      { label: 'Live Status', value: 'Active 🟢' }
    ]
  },
  {
    id: 'grifigo-shop',
    title: 'Grifigo Urban Streetwear',
    category: 'shopify',
    categoryLabel: 'Shopify Fashion & Lookbook',
    client: 'Grifigo Apparel Worldwide',
    year: '2026',
    image: grifigoImg,
    liveUrl: 'https://www.grifigo.shop',
    isLive: true,
    liveStatus: 'Running / Live Store',
    description: 'Trendsetting streetwear & urban footwear online boutique featuring interactive shoppable lookbooks, real-time scarcity badges, and VIP rewards.',
    challenge: 'Creating a high-end streetwear editorial lookbook experience that converts traffic rapidly on mobile devices.',
    solution: 'Engineered shoppable hotspots on editorial photos, intelligent size recommender, and automated back-in-stock notifications.',
    impact: 'Achieved 105% increase in repeat customer orders and maintained a 4.9/5 star satisfaction score across 2,000+ reviews.',
    tags: ['Shoppable Lookbook', 'Fit Predictor', 'VIP Loyalty', 'High Velocity', 'Live Project'],
    metrics: [
      { label: 'Repeat Orders', value: '+105%' },
      { label: 'Customer Rating', value: '4.9/5' },
      { label: 'Live Status', value: 'Active 🟢' }
    ]
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    desc: 'Deep architecture audit, market benchmark, and requirement alignment.',
    detail: 'We dissect your market position, analyze competitor bottlenecks, inspect tech stacks, and formulate explicit KPIs.',
    duration: 'Week 1',
    deliverables: ['Technical Audit', 'Competitor Gap Matrix', 'Project Blueprint']
  },
  {
    number: '02',
    title: 'Strategy',
    desc: 'Bespoke roadmap, technical stack design, and conversion architecture.',
    detail: 'We craft modular site maps, user journey flows, and high-level database and marketing funnel specifications.',
    duration: 'Week 1-2',
    deliverables: ['Information Architecture', 'Growth Roadmap', 'Conversion Blueprints']
  },
  {
    number: '03',
    title: 'Design',
    desc: 'Award-winning UI/UX with micro-interactions, responsive states, and design system.',
    detail: 'We build interactive Figma prototypes with pixel-perfect typography, harmonious palette tokens, and bespoke component kits.',
    duration: 'Week 2-3',
    deliverables: ['Design System', 'High-Fidelity Prototypes', 'Motion Specs']
  },
  {
    number: '04',
    title: 'Develop',
    desc: 'Production-ready code, clean APIs, modern frameworks, and sub-second speeds.',
    detail: 'We build with modern TypeScript, React, Shopify Liquid/Hydrogen, clean component models, and edge CDN configurations.',
    duration: 'Week 3-5',
    deliverables: ['Clean Codebase', 'API Integrations', 'Staging Deployments']
  },
  {
    number: '05',
    title: 'Optimize',
    desc: 'Core Web Vitals tuning, tracking pixel validation, and cross-browser stress testing.',
    detail: 'Rigorous automated testing, security compliance, 100/100 Lighthouse benchmark checks, and tracking tag QA.',
    duration: 'Week 5-6',
    deliverables: ['Speed Optimization', 'Cross-Device QA', 'Analytics & Pixel Setup']
  },
  {
    number: '06',
    title: 'Launch',
    desc: 'Zero-downtime deployment, continuous monitoring, and ongoing growth scaling.',
    detail: 'Seamless DNS switchover, search engine indexing push, live analytics telemetry, and 24/7 hypercare support.',
    duration: 'Ongoing',
    deliverables: ['Zero-Downtime Launch', 'Index Submissions', '24/7 SLA Support']
  }
];

export const STATS_ITEMS: StatItem[] = [
  {
    value: 100,
    suffix: '+',
    label: 'Projects Delivered',
    sublabel: 'With 99.4% client satisfaction'
  },
  {
    value: 50,
    suffix: '+',
    label: 'Global Clients',
    sublabel: 'Across US, UK, EU & APAC'
  },
  {
    value: 4,
    suffix: '',
    label: 'Core Pillars',
    sublabel: 'Shopify, Web, Ads & SEO'
  },
  {
    value: 24,
    suffix: '/7',
    label: 'Support & Monitoring',
    sublabel: 'Dedicated engineering team'
  }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: '1',
    quote: 'Tech To Web completely transformed our Shopify ecosystem. Our site speed went from 3.8s down to under 1 second, and our mobile conversion rate jumped by 140% in the first month.',
    author: 'Elena Vance',
    role: 'Chief Executive Officer',
    company: 'Lumina Living',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHx4kKjhScmDIwesHJCWZFK-1iIQvXVt8cHWBhZbSu0TTR_ap7NAAqE8WageOANY-EEmOpsLRe4qz0crWjExluV3XEnt1rVmqUGw0PKEHOxC9SfR9ZHhpSwLMrT1ecDqfsM23dyTfZSq6bhzTtMCqkIteh0VI93SBuJAINR2Hf938B_AN-1klUVUPCQRqadi3NIbaOO6qEvLdqWUvTKui4BFFMT2v_po5_IzxzSB9141k-3Su3C8oD',
    metrics: '+140% Mobile CR',
    rating: 5
  },
  {
    id: '2',
    quote: 'The level of technical rigor, design polish, and communication from Tech To Web is unmatched. They are not just an agency—they act as a true extension of our core technology team.',
    author: 'Marcus Sterling',
    role: 'VP of Product',
    company: 'Apex Cloud Systems',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlRXbXRcuhEBi4fw_BHwvl6lA3jqghWXlHdd7899Rd1xu5kkrLFf77lQmN-euj9iFtEp-SwiPim558jZBbCAFIuAMAtRnCcovqNr84SnegKV36vDbgYDqwAaeCcstnafjPG3RX4MXWwe1UXIZF0_HDzy5uZu4w1iC25P_1wG2hED_9rZkC2yEFmmAa98-6BFXgii8ts0jCbn9R2K2c4xzbdEVYnVifAmdix9tRfK7AQql9QYjBX-pb',
    metrics: '99.99% Uptime',
    rating: 5
  },
  {
    id: '3',
    quote: 'Our ad spend scaled from $20k to over $150k monthly while maintaining a 4.6x ROAS. Their combination of creative velocity and technical tracking attribution is world-class.',
    author: 'Sophia Chen',
    role: 'Growth Marketing Director',
    company: 'Velocity Global',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxdIP08X3y2HKyCGx9em75dPVxlspcoqRa6RvnWeKTUca4hrmzTa-bJyBgt2wO3JuVeWNwydg1LDdzHUUd9WJMsT_69rT4hSzfUiGi2RAcHoKWiwz_OK93MGoFOx85Qj5zRQSTS6p7bwBdqXD9X62I_eMHXHLO_IjEZ62bRmVqct_rsfGv6gZze1dAefEteCXyb8wsdXAfipvic1WMYVs1w2UbaR6ClEe-cSEsDONR07_cJFCLmX82',
    metrics: '4.6x ROAS',
    rating: 5
  }
];
