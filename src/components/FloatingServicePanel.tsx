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
      subtitle: 'E-Commerce',
      icon: Store,
      bgIcon: 'bg-secondary-fixed/50 group-hover:bg-secondary-fixed',
      textIcon: 'text-secondary',
    },
    {
      id: 'web-dev',
      title: 'Web Dev',
      subtitle: 'Custom Apps',
      icon: Code2,
      bgIcon: 'bg-tertiary-fixed/50 group-hover:bg-tertiary-fixed',
      textIcon: 'text-tertiary',
    },
    {
      id: 'marketing',
      title: 'Marketing',
      subtitle: 'Growth Strategy',
      icon: Megaphone,
      bgIcon: 'bg-primary-fixed/50 group-hover:bg-primary-fixed',
      textIcon: 'text-primary',
    },
    {
      id: 'seo',
      title: 'SEO',
      subtitle: 'Optimization',
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
      className="glass-panel rounded-2xl mx-auto max-w-5xl -mt-16 sm:-mt-20 relative z-20 p-4 sm:p-5 flex flex-wrap md:flex-nowrap justify-between gap-2.5 shadow-glass border border-white/80"
    >
      {categories.map((item, index) => {
        const Icon = item.icon;
        const isSelected = selectedCategory === item.id;
        return (
          <React.Fragment key={item.id}>
            <button
              onClick={() => handleClick(item.id)}
              data-cursor-text="EXPLORE"
              className={`flex items-center gap-3.5 w-[calc(50%-0.5rem)] md:w-auto p-3 rounded-xl transition-all duration-300 cursor-pointer group text-left ${
                isSelected
                  ? 'bg-gradient-to-r from-primary-fixed/60 via-white to-secondary-fixed/40 shadow-sm ring-1.5 ring-primary/30 scale-[1.02]'
                  : 'hover:bg-white/70 hover:shadow-xs'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-full ${item.bgIcon} flex items-center justify-center transition-all duration-300 group-hover:scale-110 shrink-0`}
              >
                <Icon className={`w-5 h-5 ${item.textIcon}`} />
              </div>
              <div>
                <h4 className="font-mono text-xs sm:text-sm font-bold text-[#191c1d] group-hover:text-primary transition-colors whitespace-nowrap">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#594139] whitespace-nowrap">{item.subtitle}</p>
              </div>
            </button>

            {index < categories.length - 1 && (
              <div className="hidden md:block w-px bg-surface-variant/80 h-10 self-center" />
            )}
          </React.Fragment>
        );
      })}
    </motion.div>
  );
};
