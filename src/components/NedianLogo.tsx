import React, { useState, useEffect } from 'react';

interface NedianLogoProps {
  variant?: 'full' | 'compact' | 'symbol';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export const NedianLogo: React.FC<NedianLogoProps> = ({
  variant = 'compact',
  size = 'md',
  className = '',
  showSubtitle = true,
}) => {
  // Check if user uploaded a custom logo image
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('nedian_custom_logo');
    if (saved) {
      setCustomLogo(saved);
    }
  }, []);

  const sizeStyles = {
    sm: { scale: 0.7, height: 'h-9', textMain: 'text-2xl', subText: 'text-[9px]' },
    md: { scale: 0.9, height: 'h-12', textMain: 'text-3xl', subText: 'text-[11px]' },
    lg: { scale: 1.15, height: 'h-16', textMain: 'text-4xl', subText: 'text-[13px]' },
    xl: { scale: 1.4, height: 'h-24', textMain: 'text-5xl', subText: 'text-sm' },
  }[size];

  // If a custom logo was uploaded into localStorage, display it with high fidelity
  if (customLogo) {
    return (
      <div className={`inline-flex items-center ${sizeStyles.height} ${className}`}>
        <img
          src={customLogo}
          alt="NEDIAN Connect Institute Pvt. Ltd."
          className="h-full w-auto object-contain"
        />
      </div>
    );
  }

  // Symbol variant (Icon mark)
  if (variant === 'symbol') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeStyles.height} aspect-square ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          {/* Green N with sweeping curve */}
          <path
            d="M24 78V28C24 24 28 20 34 20L58 68L80 20C86 20 90 24 90 28V78C90 82 86 86 80 86C74 86 70 82 70 78V42L52 82C50 86 46 86 44 82L30 52V78C30 82 26 86 24 78Z"
            fill="#2e7d32"
          />
          {/* Pen accent */}
          <path
            d="M32 10L42 20L34 28L24 18L32 10Z"
            fill="#1e293b"
          />
          {/* Graduation Cap */}
          <polygon points="55,16 75,8 95,16 75,24" fill="#0284c7" />
        </svg>
      </div>
    );
  }

  // Full & Compact Typography + Vector Mark Matching download.png
  return (
    <div className={`inline-flex flex-col select-none leading-none shrink-0 ${className}`}>
      <div className="flex items-baseline relative">
        
        {/* The Green Stylized 'N' with Pen and Flourishing Underline */}
        <div className="relative inline-block mr-0.5">
          {/* Diagonal Stylus/Pen Motif on Top-Left of 'N' */}
          <svg
            className="absolute -top-3 -left-2.5 w-6 h-6 transform -rotate-12 z-10 pointer-events-none drop-shadow-2xs"
            viewBox="0 0 40 40"
            fill="none"
          >
            {/* Pen/Microphone body */}
            <path
              d="M12 6L28 22L22 28L6 12L12 6Z"
              fill="#1e293b"
            />
            {/* Pen nib */}
            <polygon points="28,22 34,28 22,28" fill="#475569" />
            <polygon points="32,26 38,32 26,32" fill="#0f172a" />
            {/* White grip highlights */}
            <line x1="10" y1="14" x2="16" y2="8" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="14" y1="18" x2="20" y2="12" stroke="#cbd5e1" strokeWidth="1.5" />
          </svg>

          {/* Capital N in Vivid Calligraphic Green */}
          <span
            className="font-serif font-black text-green-700 tracking-tight select-none inline-block transform"
            style={{
              fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif",
              fontSize: size === 'xl' ? '68px' : size === 'lg' ? '52px' : size === 'md' ? '40px' : '30px',
              color: '#349b14',
              lineHeight: '0.85',
              textShadow: '0 1px 1px rgba(0,0,0,0.05)',
            }}
          >
            N
          </span>

          {/* Sweeping Green Flourish Tail underneath */}
          <svg
            className="absolute -bottom-2 -left-1 w-24 h-4 pointer-events-none overflow-visible z-0"
            viewBox="0 0 120 20"
            fill="none"
          >
            <path
              d="M6 3C18 10 40 18 110 16C85 14 55 10 32 7C22 5 12 3 6 3Z"
              fill="#349b14"
            />
          </svg>
        </div>

        {/* The Crimson Red Bold Serif "EDIAN" */}
        <div className="relative inline-flex items-baseline">
          {/* "ED" */}
          <span
            className="font-serif font-black tracking-tight"
            style={{
              fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif",
              fontSize: size === 'xl' ? '56px' : size === 'lg' ? '42px' : size === 'md' ? '32px' : '24px',
              color: '#b71c1c',
              lineHeight: '0.9',
            }}
          >
            ED
          </span>

          {/* "I" with Mortarboard (Graduation Cap) placed directly above it */}
          <div className="relative inline-block">
            {/* The Graduation Cap sitting atop the letter 'I' */}
            <svg
              className="absolute -top-3.5 sm:-top-4.5 -left-2.5 sm:-left-3.5 w-6 sm:w-8 h-4 sm:h-5 pointer-events-none z-20 overflow-visible"
              viewBox="0 0 50 30"
              fill="none"
            >
              {/* Cyan Diamond Mortarboard Plate */}
              <polygon
                points="25,5 45,13 25,21 5,13"
                fill="#0097a7"
                stroke="#00838f"
                strokeWidth="0.8"
              />
              {/* Under-cap Skullcap */}
              <path
                d="M17 17V23C17 25.5 25 27 25 27C25 27 33 25.5 33 23V17"
                fill="#006064"
              />
              {/* Hanging Tassel */}
              <circle cx="25" cy="13" r="1.5" fill="#e0f7fa" />
              <path
                d="M25 13L13 18V26"
                stroke="#00acc1"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <circle cx="13" cy="26" r="1.2" fill="#00838f" />
            </svg>

            {/* Letter I */}
            <span
              className="font-serif font-black tracking-tight inline-block"
              style={{
                fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif",
                fontSize: size === 'xl' ? '56px' : size === 'lg' ? '42px' : size === 'md' ? '32px' : '24px',
                color: '#b71c1c',
                lineHeight: '0.9',
              }}
            >
              I
            </span>
          </div>

          {/* "AN" */}
          <span
            className="font-serif font-black tracking-tight"
            style={{
              fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif",
              fontSize: size === 'xl' ? '56px' : size === 'lg' ? '42px' : size === 'md' ? '32px' : '24px',
              color: '#b71c1c',
              lineHeight: '0.9',
            }}
          >
            AN
          </span>
        </div>
      </div>

      {/* Line 2: "Connect Institute Pvt. Ltd." in Cyan/Teal */}
      <div className="flex items-baseline gap-1 mt-0.5 sm:mt-1 pl-1">
        <span
          className="font-bold tracking-tight text-cyan-600"
          style={{
            fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: size === 'xl' ? '22px' : size === 'lg' ? '17px' : size === 'md' ? '13px' : '10.5px',
            color: '#00838f',
            lineHeight: '1',
          }}
        >
          Connect Institute
        </span>
        <span
          className="font-bold tracking-tight text-cyan-700"
          style={{
            fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: size === 'xl' ? '15px' : size === 'lg' ? '12px' : size === 'md' ? '9.5px' : '7.5px',
            color: '#006064',
            lineHeight: '1',
          }}
        >
          Pvt. Ltd.
        </span>
      </div>

      {/* Line 3: Subtitle Location & Division */}
      {showSubtitle && (
        <div
          className="flex items-center gap-1 pl-1 mt-0.5 tracking-tight font-medium"
          style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: size === 'xl' ? '11px' : size === 'lg' ? '9px' : size === 'md' ? '7.5px' : '6px',
            lineHeight: '1.1',
          }}
        >
          <span className="text-slate-600 font-semibold">
            Mayadevi R.M. - 4, Kapilvastu, Nepal
          </span>
          <span className="font-bold text-red-700">
            | AI, Skills, media
          </span>
        </div>
      )}
    </div>
  );
};
