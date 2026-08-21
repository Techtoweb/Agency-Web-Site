import React from 'react';

interface BrandLogoProps {
  logoUrl?: string;
  agencyName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isDarkBg?: boolean;
  className?: string;
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  logoUrl,
  agencyName = 'Tech To Web',
  size = 'md',
  isDarkBg = false,
  className = '',
  showText = true,
}) => {
  // Render stylized 3-color brand text:
  // "Tech" -> Logo color (Vibrant Electric Cyan / Blue #0284c7 / #2563eb)
  // "TO"   -> Off-white (#e2e8f0 / #cbd5e1 / #f1f5f9)
  // "Web"  -> Logo color (Vibrant Warm Coral/Orange #ff6b35)
  const renderStyledBrandName = () => {
    const raw = agencyName?.trim() || 'Tech To Web';
    const parts = raw.split(/\s+/);

    if (parts.length === 3) {
      return (
        <span className="font-extrabold tracking-tighter inline-flex items-center gap-1.5 select-none uppercase">
          <span className="text-[#38bdf8] drop-shadow-[0_1px_3px_rgba(56,189,248,0.35)]">{parts[0]}</span>
          <span className={isDarkBg ? "text-[#f1f5f9] font-medium opacity-90" : "text-[#64748b] font-medium"}>{parts[1]}</span>
          <span className="text-[#ff6b35] drop-shadow-[0_1px_3px_rgba(255,107,53,0.35)]">{parts[2]}</span>
        </span>
      );
    }

    if (parts.length === 2) {
      return (
        <span className="font-extrabold tracking-tighter inline-flex items-center gap-1.5 select-none uppercase">
          <span className="text-[#38bdf8]">{parts[0]}</span>
          <span className="text-[#ff6b35]">{parts[1]}</span>
        </span>
      );
    }

    return (
      <span className={`font-extrabold tracking-tighter select-none ${isDarkBg ? 'text-white' : 'text-[#191c1d]'}`}>
        {raw}
      </span>
    );
  };

  // Dimension scaling: Carefully balanced for mobile and desktop screens
  const imgSizeClasses = {
    sm: 'h-8 sm:h-9 max-w-[120px] sm:max-w-[150px]',
    md: 'h-8 sm:h-11 max-w-[140px] sm:max-w-[200px]',
    lg: 'h-11 sm:h-16 max-w-[180px] sm:max-w-[260px]',
    xl: 'h-14 sm:h-20 max-w-[220px] sm:max-w-[320px]',
  }[size];

  const monogramSizeClasses = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] sm:text-xs',
    md: 'w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl text-xs sm:text-sm',
    lg: 'w-11 h-11 sm:w-15 sm:h-15 rounded-xl sm:rounded-2xl text-sm sm:text-base',
    xl: 'w-14 h-14 sm:w-18 sm:h-18 rounded-2xl text-base sm:text-xl',
  }[size];

  const textSizeClasses = {
    sm: 'text-sm sm:text-base leading-tight font-bold',
    md: 'text-base sm:text-2xl leading-tight font-bold',
    lg: 'text-xl sm:text-3xl leading-tight font-bold',
    xl: 'text-2xl sm:text-4xl leading-tight font-bold',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-2.5 max-w-full ${className}`}>
      {/* Uploaded Logo Image or Default Monogram */}
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={agencyName}
          className={`${imgSizeClasses} object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-xs shrink-0`}
        />
      ) : (
        <div
          className={`${monogramSizeClasses} bg-gradient-to-br from-[#2563eb] via-[#0f172a] to-[#ff6b35] p-[1.5px] sm:p-[2px] shadow-sm group-hover:rotate-6 transition-transform duration-300 shrink-0 flex items-center justify-center`}
        >
          <div className="w-full h-full rounded-[inherit] bg-[#0f172a] flex items-center justify-center gap-0.5 font-mono font-black tracking-tighter">
            <span className="text-[#38bdf8] drop-shadow-[0_0_6px_rgba(56,189,248,0.7)]">T</span>
            <span className="text-[#ff6b35] drop-shadow-[0_0_6px_rgba(255,107,53,0.7)]">W</span>
          </div>
        </div>
      )}

      {showText && (
        <div className={`${textSizeClasses} truncate`}>
          {renderStyledBrandName()}
        </div>
      )}
    </div>
  );
};
