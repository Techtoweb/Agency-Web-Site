import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useSiteData } from '../data/siteDataContext';
import { STATS_ITEMS } from '../data/agencyData';

const Counter: React.FC<{ target: number; suffix: string }> = ({ target, suffix }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 1600; // ms
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(easeProgress * target);

      setCount(current);

      if (frame >= totalFrames) {
        clearInterval(timer);
        setCount(target);
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

export const StatsSection: React.FC = () => {
  const { siteData } = useSiteData();
  const statsList = siteData?.stats && siteData.stats.length > 0 ? siteData.stats : STATS_ITEMS;

  return (
    <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20 mb-28 md:mb-36">
      <div className="bg-[#191c1d] text-white rounded-[32px] sm:rounded-[40px] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
        {/* Background Ambient Lights */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {statsList.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-left"
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-2 font-mono flex items-baseline">
                <Counter target={item.value} suffix={item.suffix} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">{item.label}</h3>
              <p className="text-xs sm:text-sm text-neutral-400 font-mono">{item.sublabel}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

