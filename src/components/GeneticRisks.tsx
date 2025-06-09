'use client';
import React from 'react';
import type { Phenotype } from '@/components/BloodCalculator';
import { useTranslation } from '@/lib/i18n';

type Props = {
  father: Phenotype;
  mother: Phenotype;
  babyProbs: { phenotype: Phenotype; prob: number }[];
};

export default function GeneticRisks({ father, mother, babyProbs }: Props) {
  const t = useTranslation();
  const alerts: { title: string; desc: string }[] = [];

  /* Rh incompatibility */
  if (mother.endsWith('−') && babyProbs.some(p => p.phenotype.endsWith('+'))) {
    alerts.push({ title: t('risk_rh_title'), desc: t('risk_rh_desc') });
  }

  /* ABO HDN (Mother O, baby A/B) */
  if (mother.startsWith('O') && babyProbs.some(p => /^A|^B/.test(p.phenotype))) {
    alerts.push({ title: t('risk_abo_title'), desc: t('risk_abo_desc') });
  }

  /* Kell */
  const momKneg = mother.includes('K−');
  const dadKpos = father.includes('K+');
  if (momKneg && dadKpos && babyProbs.some(p => p.phenotype.includes('K+'))) {
    alerts.push({ title: t('risk_kell_title'), desc: t('risk_kell_desc') });
  }

  /* Duffy */
  if (babyProbs.some(p => p.phenotype.includes('Fy(a−b−)'))) {
    alerts.push({ title: t('risk_duffy_title'), desc: t('risk_duffy_desc') });
  }

  if (!alerts.length) return null;

  return (
    <section className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-md space-y-3">
      <h2 className="font-semibold text-lg text-rose-600 dark:text-rose-200">
        {t('genetic_risks')}
      </h2>
      {alerts.map((a, i) => (
        <div key={i} className="pl-2 border-l-4 border-rose-400">
          <p className="font-medium">{a.title}</p>
          <p className="text-sm">{a.desc}</p>
        </div>
      ))}
    </section>
  );
}
