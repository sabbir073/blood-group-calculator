'use client';

/* app/page.tsx
 * Home page wrapper: shows title + LanguageToggle + BloodCalculator.
 * All static text pulled via useTranslation() for i18n.
 */

import BloodCalculator from '@/components/BloodCalculator';
import LanguageToggle from '@/components/LanguageToggle';
import { useTranslation } from '@/lib/i18n';

export default function Home() {
  const t = useTranslation();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      {/* language switch centred under title */}
      <div className="flex justify-center mb-8">
        <LanguageToggle />
      </div>
      {/* title */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
        {t('title')}
      </h1>
      <BloodCalculator />
    </main>
  );
}
