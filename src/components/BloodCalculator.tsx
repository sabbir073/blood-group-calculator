/* eslint-disable @typescript-eslint/no-explicit-any */
/* components/BloodCalculator.tsx (i18n‑ready)
 * All user‑visible strings are now fetched via useTranslation().
 */
'use client';

import { useState, useMemo } from 'react';
import PunnettSquare   from '@/components/PunnettSquare';
import ProbabilityPie  from '@/components/ProbabilityPie';
import ExtraSystems    from '@/components/ExtraSystems';
import GeneticRisks    from '@/components/GeneticRisks';
import { useTranslation } from '@/lib/i18n';
import RelativeDonationWarning from '@/components/RelativeDonationWarning';

/* ---------------- constants ---------------- */
export const BLOOD_OPTIONS = [
  'A+','A−','B+','B−','AB+','AB−','O+','O−',
] as const;
export type Phenotype = (typeof BLOOD_OPTIONS)[number];

const ABO_ALLELES: Record<string, string[]> = {
  A : ['A','O'],
  B : ['B','O'],
  AB: ['A','B'],
  O : ['O'],
};
const RH_ALLELES: Record<'+'|'-', ('+'|'-')[]> = {
  '+': ['+','-'],
  '-': ['-'],
};

/* ---------------- helper fns ---------------- */
function splitPhenotype(p: Phenotype) {
  const type = p.replace(/[+\-−]/g, '');
  const rh   = p.endsWith('+') ? '+' : '-';
  return { type, rh };
}

function phenotypeFromAlleles(
  aboA: string, aboB: string, rhA: string, rhB: string,
): Phenotype {
  const combo = [aboA, aboB].sort().join('');
  let abo: string = 'O';
  if (/AA|AO|OA/.test(combo))      abo = 'A';
  else if (/BB|BO|OB/.test(combo)) abo = 'B';
  else if (/AB|BA/.test(combo))    abo = 'AB';

  const rh = rhA === '+' || rhB === '+' ? '+' : '−';
  return `${abo}${rh}` as Phenotype;
}

function computeProbabilities(father: Phenotype, mother: Phenotype) {
  const dad = splitPhenotype(father);
  const mom = splitPhenotype(mother);

  const dadABO = ABO_ALLELES[dad.type];
  const momABO = ABO_ALLELES[mom.type];
  const dadRh = RH_ALLELES[dad.rh as '+' | '-'];
  const momRh = RH_ALLELES[mom.rh as '+' | '-'];


  const counts: Record<Phenotype, number> = BLOOD_OPTIONS.reduce((acc, p) => {
    acc[p] = 0;
    return acc;
  }, {} as Record<Phenotype, number>);

  dadABO.forEach(a1 => momABO.forEach(a2 =>
    dadRh.forEach(r1 => momRh.forEach(r2 => {
      counts[phenotypeFromAlleles(a1, a2, r1, r2)]++;
    }))));

  const total = dadABO.length * momABO.length * dadRh.length * momRh.length;
  const probs = BLOOD_OPTIONS.map(p => ({ phenotype: p, prob: counts[p] / total }))
    .filter(x => x.prob > 0);

  return { probs, dadABO, momABO, dadRh, momRh };
}

/* ---------------- component ---------------- */
export default function BloodCalculator() {
  const t = useTranslation();

  const [father, setFather] = useState<Phenotype | ''>('');
  const [mother, setMother] = useState<Phenotype | ''>('');
  const [showExtra, setShowExtra] = useState(false);

  const data = useMemo(() => {
    if (!father || !mother) return null;
    return computeProbabilities(father as Phenotype, mother as Phenotype);
  }, [father, mother]);

  const rhRisk = useMemo(() => {
    if (!data || !mother) return false;
    return mother.endsWith('−') && data.probs.some(p => p.phenotype.endsWith('+'));
  }, [data, mother]);

  return (
    <div className="space-y-8">
      {/* selectors */}
      <section className="grid md:grid-cols-2 gap-6">
        {[t('father_blood_group'), t('mother_blood_group')].map((lbl, i) => (
          <div key={lbl}>
            <label className="block font-semibold mb-1">{lbl}</label>
            <select
              value={i ? mother : father}
              onChange={e => (i ? setMother : setFather)(e.target.value as Phenotype)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
            >
              <option value="">{t('select_placeholder')}</option>
              {BLOOD_OPTIONS.map(opt => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
      </section>

      {/* Rh warning */}
      {rhRisk && (
        <div className="p-4 rounded-md bg-yellow-100 dark:bg-yellow-800/30 text-yellow-700 dark:text-yellow-100">
          ⚠️ <strong>{t('rh_warning_title')}</strong> {t('rh_warning_body')}
        </div>
      )}

      {!data && (
        <p className="italic text-center text-gray-600 dark:text-gray-400">
          {t('prompt_select_parents')}
        </p>
      )}

      {data && (
        <>
          <PunnettSquare
            fatherABO={data.dadABO}
            motherABO={data.momABO}
            fatherRh={data.dadRh}
            motherRh={data.momRh}
          />

          <ProbabilityPie probabilities={data.probs} />

          <CompatibilityCard probs={data.probs} t={t} />

          <RelativeDonationWarning />

          <GeneticRisks
            father={father as Phenotype}
            mother={mother as Phenotype}
            babyProbs={data.probs}
          />

          {/* advanced toggle */}
          <div className="text-center">
            <button
              onClick={() => setShowExtra(v => !v)}
              className="mt-6 px-4 py-2 rounded-md font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow"
            >
              {showExtra ? t('hide_advanced') : t('show_advanced')}
            </button>
          </div>

          {showExtra && (
            <div className="mt-8">
              <ExtraSystems />
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ---------- compatibility helper ---------- */
function CompatibilityCard({ probs, t }: { probs: { phenotype: Phenotype; prob: number }[]; t: (k:any)=>string }) {
  const babyTypes = probs.map(p => p.phenotype);

  function canDonate(donor: Phenotype, recipient: Phenotype) {
    const { type: dType, rh: dRh } = splitPhenotype(donor);
    const { type: rType, rh: rRh } = splitPhenotype(recipient);

    const aboOK =
      rType === 'AB' ? true :
      rType === 'A'  ? (dType === 'A' || dType === 'O') :
      rType === 'B'  ? (dType === 'B' || dType === 'O') :
      dType === 'O';

    const rhOK = !(dRh === '+' && rRh === '-');
    return aboOK && rhOK;
  }

  return (
    <section className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
      <h2 className="font-semibold mb-3 text-lg">{t('compatibility_checker')}</h2>
      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
        {t('possible_baby_types')}
      </p>
      <ul className="space-y-1 text-sm">
        {babyTypes.map(type => (
          <li key={type}>
            <strong>{type}</strong> {t('receive_from')}&nbsp;
            {BLOOD_OPTIONS.filter(d => canDonate(d, type)).join(', ')}&nbsp;
            {t('donate_to')}&nbsp;
            {BLOOD_OPTIONS.filter(r => canDonate(type, r)).join(', ')}.
          </li>
        ))}
      </ul>
    </section>
  );
}
