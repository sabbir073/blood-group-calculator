/* components/RelativeDonationWarning.tsx */
'use client';
import { useTranslation } from '@/lib/i18n';

export default function RelativeDonationWarning() {
  const t = useTranslation();
  return (
    <div className="mt-4 rounded-md border border-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 text-sm">
      <p className="font-medium text-amber-800 dark:text-amber-200">
        {t('relative_donation_title')}
      </p>
      <p className="mt-1 text-amber-700 dark:text-amber-300">
        {t('relative_donation_body')}
      </p>
    </div>
  );
}
