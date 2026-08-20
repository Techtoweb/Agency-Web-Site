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

  // Dimension scaling: Logo graphic/image enlarged for prominent visibility
  const imgSizeClasses = {
    sm: 'h-10 sm:h-11 max-w-[160px]',
    md: 'h-12 sm:h-14 max-w-[220px] sm:max-w-[260px]',
    lg: 'h-16 sm:h-20 max-w-[300px]',
    xl: 'h-24 max-w-[380px]',
  }[size];

  const monogramSizeClasses = {
    sm: 'w-10 h-10 rounded-xl text-xs',
    md: 'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl text-sm',
    lg: 'w-16 h-16 sm:w-18 sm:h-18 rounded-2xl text-base',
    xl: 'w-22 h-22 rounded-3xl text-xl',
  }[size];

  const textSizeClasses = {
    sm: 'text-lg sm:text-xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl',
    xl: 'text-4xl sm:text-5xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Uploaded Logo Image or Default Monogram (slightly larger than text) */}
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={agencyName}
          className={`${imgSizeClasses} object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-xs shrink-0`}
        />
      ) : (
        <div
          className={`${monogramSizeClasses} bg-gradient-to-br from-[#2563eb] via-[#0f172a] to-[#ff6b35] p-[2px] shadow-lg shadow-black/10 group-hover:rotate-6 transition-transform duration-300 shrink-0 flex items-center justify-center`}
        >
          <div className="w-full h-full rounded-[inherit] bg-[#0f172a] flex items-center justify-center gap-0.5 font-mono font-black tracking-tighter">
            <span className="text-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]">T</span>
            <span className="text-[#ff6b35] drop-shadow-[0_0_8px_rgba(255,107,53,0.7)]">W</span>
          </div>
        </div>
      )}

      {showText && (
        <div className={textSizeClasses}>
          {renderStyledBrandName()}
        </div>
      )}
    </div>
  );
};
