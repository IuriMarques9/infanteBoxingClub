'use client';

import { useLanguage } from '../../contexts/language-context';
import { cn } from '@/lib/utils';

function FlagPT() {
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
      <defs>
        <clipPath id="flag-pt-clip"><circle cx="12" cy="12" r="12" /></clipPath>
      </defs>
      <g clipPath="url(#flag-pt-clip)">
        <rect x="0" y="0" width="9" height="24" fill="#046A38" />
        <rect x="9" y="0" width="15" height="24" fill="#DA291C" />
        <circle cx="9" cy="12" r="3.2" fill="#FFE600" stroke="#FFFFFF" strokeWidth="0.4" />
        <circle cx="9" cy="12" r="1.6" fill="#DA291C" />
      </g>
    </svg>
  );
}

function FlagGB() {
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
      <defs>
        <clipPath id="flag-gb-clip"><circle cx="12" cy="12" r="12" /></clipPath>
      </defs>
      <g clipPath="url(#flag-gb-clip)">
        <rect width="24" height="24" fill="#012169" />
        <path d="M0 0 L24 24 M24 0 L0 24" stroke="#FFFFFF" strokeWidth="3" />
        <path d="M0 0 L24 24 M24 0 L0 24" stroke="#C8102E" strokeWidth="1.5" />
        <path d="M12 0 V24 M0 12 H24" stroke="#FFFFFF" strokeWidth="4" />
        <path d="M12 0 V24 M0 12 H24" stroke="#C8102E" strokeWidth="2" />
      </g>
    </svg>
  );
}

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setLanguage('pt')}
        aria-label="Português"
        aria-pressed={language === 'pt'}
        className={cn(
          "w-7 h-7 rounded-full overflow-hidden transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          language === 'pt'
            ? "ring-2 ring-primary opacity-100 scale-105"
            : "opacity-50 hover:opacity-90"
        )}
      >
        <FlagPT />
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-label="English"
        aria-pressed={language === 'en'}
        className={cn(
          "w-7 h-7 rounded-full overflow-hidden transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          language === 'en'
            ? "ring-2 ring-primary opacity-100 scale-105"
            : "opacity-50 hover:opacity-90"
        )}
      >
        <FlagGB />
      </button>
    </div>
  );
};

export default LanguageSwitcher;
