import React from 'react';
import { motion } from 'motion/react';
import { Store, Code2, Megaphone, Search, CreditCard } from 'lucide-react';

interface FloatingServicePanelProps {
  onSelectCategory: (categoryId: string) => void;
  selectedCategory?: string;
}

export const FloatingServicePanel: React.FC<FloatingServicePanelProps> = ({
  onSelectCategory,
  selectedCategory
}) => {
  const categories = [
    {
      id: 'shopify',
      title: 'Shopify',
      subtitle: 'E-Commerce Store',
      icon: Store,
      bgIcon: 'bg-secondary-fixed/50 group-hover:bg-secondary-fixed',
      textIcon: 'text-secondary',
    },
    {
      id: 'web-dev',
      title: 'Web Dev',
      subtitle: 'Custom Apps & Web',
      icon: Code2,
      bgIcon: 'bg-tertiary-fixed/50 group-hover:bg-tertiary-fixed',
      textIcon: 'text-tertiary',
    },
    {
      id: 'marketing',
      title: 'Marketing',
      subtitle: 'Growth & Ads Strategy',
      icon: Megaphone,
      bgIcon: 'bg-primary-fixed/50 group-hover:bg-primary-fixed',
      textIcon: 'text-primary',
    },
    {
      id: 'seo',
      title: 'SEO',
      subtitle: 'Organic Optimization',
      icon: Search,
      bgIcon: 'bg-secondary-fixed-dim/50 group-hover:bg-secondary-fixed-dim',
      textIcon: 'text-secondary',
    },
    {
      id: 'payment-gateway',
      title: 'Payment Gateway',
      subtitle: 'USA LLC & UK LTD',
      icon: CreditCard,
      bgIcon: 'bg-emerald-100 group-hover:bg-emerald-200',
      textIcon: 'text-emerald-700',
    },
  ];

  const handleClick = (id: string) => {
    onSelectCategory(id);
    const target = document.getElementById('services');
    if (target) {
      const navOffset = 90;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel rounded-2xl sm:rounded-3xl mx-auto max-w-6xl -mt-14 sm:-mt-18 lg:-mt-20 relative z-20 p-3 sm:p-4 lg:p-5 shadow-glass border border-white/80 w-full overflow-hidden"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5 lg:gap-3 w-full">
        {categories.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedCategory === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              data-cursor-text="EXPLORE"
              className={`flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer group text-left w-full min-w-0 ${
                isSelected
                  ? 'bg-gradient-to-r from-primary-fixed/60 via-white to-secondary-fixed/40 shadow-sm ring-1.5 ring-primary/30 scale-[1.01]'
                  : 'hover:bg-white/75 hover:shadow-xs bg-white/40'
              }`}
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${item.bgIcon} flex items-center justify-center transition-all duration-300 group-hover:scale-105 shrink-0 shadow-2xs`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.textIcon}`} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-mono text-xs sm:text-[13px] lg:text-sm font-bold text-[#191c1d] group-hover:text-primary transition-colors truncate">
                  {item.title}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-[#594139] truncate font-medium">
                  {item.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};
