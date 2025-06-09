/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

/* components/ExtraSystems.tsx – i18n-enabled
 * Kell, Duffy, MN systems with translated titles/labels.
 */
import { useState, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n';

/* ---------- types ---------- */
type KellPheno = 'K+' | 'K−';
type MNPheno   = 'M' | 'N' | 'MN';
type DuffyPheno = 'Fy(a+b−)' | 'Fy(a−b+)' | 'Fy(a+b+)' | 'Fy(a−b−)';

/* ---------- allele maps ---------- */
const KELL_ALLELES: Record<KellPheno, ('K' | 'k')[]> = {
  'K+': ['K', 'k'],
  'K−': ['k', 'k'],
};
const MN_ALLELES: Record<MNPheno, ('M' | 'N')[]> = {
  M: ['M', 'M'],
  N: ['N', 'N'],
  MN: ['M', 'N'],
};
const DUFFY_ALLELES: Record<DuffyPheno, ('A' | 'B' | 'O')[]> = {
  'Fy(a+b−)': ['A', 'O'],
  'Fy(a−b+)': ['B', 'O'],
  'Fy(a+b+)': ['A', 'B'],
  'Fy(a−b−)': ['O', 'O'],
};

/* ---------- phenotype resolvers ---------- */
const kellPhenotype = (a: 'K' | 'k', b: 'K' | 'k'): KellPheno => (a === 'K' || b === 'K' ? 'K+' : 'K−');
const mnPhenotype   = (a: 'M' | 'N', b: 'M' | 'N'): MNPheno => (a === b ? a : 'MN');
function duffyPhenotype(a: 'A' | 'B' | 'O', b: 'A' | 'B' | 'O'): DuffyPheno {
  const set = new Set([a, b]);
  const hasA = set.has('A');
  const hasB = set.has('B');
  if (hasA && hasB) return 'Fy(a+b+)';
  if (hasA) return 'Fy(a+b−)';
  if (hasB) return 'Fy(a−b+)';
  return 'Fy(a−b−)';
}

/* ---------- generic combine helper ---------- */
function combine<T1 extends string, T2 extends string, P extends string>(
  a1: T1[],
  a2: T2[],
  toPheno: (x: T1 | T2, y: T1 | T2) => P,
) {
  const counts = new Map<P, number>();
  a1.forEach(x => a2.forEach(y => {
    const p = toPheno(x as any, y as any);
    counts.set(p, (counts.get(p) ?? 0) + 1);
  }));
  const total = a1.length * a2.length;
  return [...counts.entries()].map(([phenotype, n]) => ({ phenotype, prob: n / total }));
}

/* ---------- component ---------- */
export default function ExtraSystems() {
  const t = useTranslation();

  /* state */
  const [kellDad, setKellDad] = useState<KellPheno>('K+');
  const [kellMom, setKellMom] = useState<KellPheno>('K+');
  const [mnDad, setMnDad]     = useState<MNPheno>('M');
  const [mnMom, setMnMom]     = useState<MNPheno>('M');
  const [fyDad, setFyDad]     = useState<DuffyPheno>('Fy(a+b−)');
  const [fyMom, setFyMom]     = useState<DuffyPheno>('Fy(a+b−)');

  /* probabilities */
  const kellProbs = useMemo(() => combine(KELL_ALLELES[kellDad], KELL_ALLELES[kellMom], kellPhenotype), [kellDad, kellMom]);
  const mnProbs   = useMemo(() => combine(MN_ALLELES[mnDad], MN_ALLELES[mnMom], mnPhenotype), [mnDad, mnMom]);
  const fyProbs   = useMemo(() => combine(DUFFY_ALLELES[fyDad], DUFFY_ALLELES[fyMom], duffyPhenotype), [fyDad, fyMom]);

  return (
    <section className="space-y-8">
      <h2 className="text-xl font-semibold">{t('other_systems')}</h2>

      <SystemPanel
        title={t('kell_title')}
        dadLabel={t('selector_father')}
        momLabel={t('selector_mother')}
        dadValue={kellDad}
        momValue={kellMom}
        dadSetter={setKellDad}
        momSetter={setKellMom}
        options={['K+', 'K−']}
        probabilities={kellProbs}
      />

      <SystemPanel
        title={t('mn_title')}
        dadLabel={t('selector_father')}
        momLabel={t('selector_mother')}
        dadValue={mnDad}
        momValue={mnMom}
        dadSetter={setMnDad}
        momSetter={setMnMom}
        options={['M', 'N', 'MN']}
        probabilities={mnProbs}
      />

      <SystemPanel
        title={t('duffy_title')}
        dadLabel={t('selector_father')}
        momLabel={t('selector_mother')}
        dadValue={fyDad}
        momValue={fyMom}
        dadSetter={setFyDad}
        momSetter={setFyMom}
        options={['Fy(a+b−)', 'Fy(a−b+)', 'Fy(a+b+)', 'Fy(a−b−)']}
        probabilities={fyProbs}
      />
    </section>
  );
}

/* ---------- reusable panel ---------- */
type PanelProps<T extends string> = {
  title: string;
  dadLabel: string;
  momLabel: string;
  dadValue: T;
  momValue: T;
  dadSetter: (v: T) => void;
  momSetter: (v: T) => void;
  options: readonly T[];
  probabilities: { phenotype: string; prob: number }[];
};

function SystemPanel<T extends string>({ title, dadLabel, momLabel, dadValue, momValue, dadSetter, momSetter, options, probabilities }: PanelProps<T>) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-3">
        <Selector label={dadLabel} value={dadValue} setValue={dadSetter} options={options} />
        <Selector label={momLabel} value={momValue} setValue={momSetter} options={options} />
      </div>
      <ProbList probabilities={probabilities} />
    </div>
  );
}

function Selector<T extends string>({ label, value, setValue, options }: { label: string; value: T; setValue: (v: T) => void; options: readonly T[] }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium">{label}</span>
      <select value={value} onChange={e => setValue(e.target.value as T)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-gray-700">
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </label>
  );
}

function ProbList({ probabilities }: { probabilities: { phenotype: string; prob: number }[] }) {
  return (
    <ul className="text-sm space-y-1">
      {probabilities.map(p => (
        <li key={p.phenotype}>→ <strong>{p.phenotype}</strong>: {(p.prob * 100).toFixed(1)}%</li>
      ))}
    </ul>
  );
}
