'use client';

/* components/LanguageToggle.tsx – minimalist two‑state toggle (English | বাংলা) */
import { useLanguage } from '@/lib/i18n';

export default function LanguageToggle() {
  const { lang, toggle } = useLanguage();
  const isBn = lang === 'bn';

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={isBn}
      className="relative flex h-9 w-44 items-center rounded-full border border-gray-400 bg-white/80 dark:bg-gray-800/60 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      {/* slider */}
      <span
        className={`absolute top-0.5 left-0.5 h-7 w-21 rounded-full bg-gray-200 dark:bg-gray-700 shadow transition-transform duration-200 ease-out ${isBn ? 'translate-x-[88px]' : 'translate-x-0'}`}
      />

      <span className="z-10 flex-1 text-center text-sm font-medium select-none">
        English
      </span>
      <span className="z-10 flex-1 text-center text-sm font-medium select-none">
        বাংলা
      </span>
    </button>
  );
}
