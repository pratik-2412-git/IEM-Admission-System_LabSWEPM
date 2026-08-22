import React, { useState } from 'react';

interface IEMLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'icon' | 'full' | 'seal';
  className?: string;
  showSubtitle?: boolean;
}

export const IEMLogo: React.FC<IEMLogoProps> = ({
  size = 'md',
  variant = 'icon',
  className = '',
  showSubtitle = true,
}) => {
  const [imgError, setImgError] = useState(false);

  // Official IEM logo image source
  const iemLogoSrc = "https://media.iem.edu.in/uploads/sites/7/2020/10/cropped-logo-2.png";

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const dimensions = {
    sm: 28,
    md: 36,
    lg: 48,
    xl: 64,
  };

  const dim = dimensions[size];

  // Authentic IEM Institutional Crest SVG Vector
  const IEMVectorEmblem = () => (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* Background Rounded Shield / Circle */}
      <defs>
        <linearGradient id="iemGradient" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="tealGlow" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>
        <linearGradient id="goldTorch" x1="60" y1="20" x2="60" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* Outer Border Ring */}
      <circle cx="60" cy="60" r="56" fill="url(#iemGradient)" stroke="url(#tealGlow)" strokeWidth="3" />
      <circle cx="60" cy="60" r="50" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="3 2" />

      {/* Gear / Cogwheel Teeth for Engineering & Technology */}
      <g stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
        <line x1="60" y1="14" x2="60" y2="20" />
        <line x1="60" y1="100" x2="60" y2="106" />
        <line x1="14" y1="60" x2="20" y2="60" />
        <line x1="100" y1="60" x2="106" y2="60" />
        <line x1="27" y1="27" x2="32" y2="32" />
        <line x1="88" y1="88" x2="93" y2="93" />
        <line x1="93" y1="27" x2="88" y2="32" />
        <line x1="27" y1="93" x2="32" y2="88" />
      </g>

      {/* Torch of Knowledge / Wisdom Flame */}
      <path
        d="M60 26C60 26 53 35 53 43C53 47.5 56 50 60 50C64 50 67 47.5 67 43C67 35 60 26 60 26Z"
        fill="url(#goldTorch)"
      />
      <path
        d="M60 32C60 32 56 37 56 42C56 44.5 57.5 46 60 46C62.5 46 64 44.5 64 42C64 37 60 32 60 32Z"
        fill="#FEF08A"
      />

      {/* Torch Handle */}
      <path
        d="M57 50H63L61.5 59H58.5L57 50Z"
        fill="#94A3B8"
      />

      {/* Open Book of Learning */}
      <path
        d="M38 67C46 64 57 66 60 69C63 66 74 64 82 67V78C74 75 63 77 60 80C57 77 46 75 38 78V67Z"
        fill="#F8FAFC"
        stroke="#0F172A"
        strokeWidth="1"
      />
      <line x1="60" y1="69" x2="60" y2="80" stroke="#0F172A" strokeWidth="1.5" />

      {/* IEM Acronym Typography */}
      <text
        x="60"
        y="96"
        textAnchor="middle"
        fill="#2DD4BF"
        fontSize="17"
        fontWeight="900"
        fontFamily="monospace"
        letterSpacing="2.5"
      >
        IEM
      </text>

      {/* Small ESTD Arc text */}
      <text
        x="60"
        y="107"
        textAnchor="middle"
        fill="#94A3B8"
        fontSize="6.5"
        fontWeight="700"
        letterSpacing="1"
        fontFamily="sans-serif"
      >
        ESTD. 1989
      </text>
    </svg>
  );

  if (variant === 'seal') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <IEMVectorEmblem />
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="relative shrink-0 rounded-lg overflow-hidden border border-[#1E293B] bg-[#0F172A] p-1 flex items-center justify-center">
          {!imgError ? (
            <img
              src={iemLogoSrc}
              alt="IEM Kolkata Logo"
              className={`${sizeClasses[size]} object-contain`}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
            />
          ) : (
            <IEMVectorEmblem />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="font-headline font-bold text-base text-[#F8FAFC] tracking-tight leading-tight">
              IEM KOLKATA
            </h1>
            <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
              ESTD 1989
            </span>
          </div>
          {showSubtitle && (
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider truncate mt-0.5">
              Institute of Engineering &amp; Management
            </p>
          )}
        </div>
      </div>
    );
  }

  // Variant 'icon'
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-lg overflow-hidden ${sizeClasses[size]} ${className}`}
    >
      {!imgError ? (
        <img
          src={iemLogoSrc}
          alt="IEM Logo"
          className="w-full h-full object-contain p-0.5 bg-[#0F172A] rounded-lg border border-[#1E293B]"
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <IEMVectorEmblem />
      )}
    </div>
  );
};
