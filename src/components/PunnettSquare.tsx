/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

/* components/PunnettSquare.tsx – i18n‑enabled
 * Shows ABO & Rh Punnett squares with human‑readable summaries.
 */
import React, { useMemo } from 'react';
import { useTranslation } from '@/lib/i18n';

/* ---------- helpers ---------- */
function aboPhenotype(a: string, b: string) {
  const combo = [a, b].sort().join('');
  if (/AA|AO|OA/.test(combo)) return 'A';
  if (/BB|BO|OB/.test(combo)) return 'B';
  if (/AB|BA/.test(combo))    return 'AB';
  return 'O';
}

/* colour maps */
const ABO_COLORS: Record<string, string> = {
  A  : 'bg-red-200 dark:bg-red-600/40',
  B  : 'bg-blue-200 dark:bg-blue-600/40',
  AB : 'bg-purple-200 dark:bg-purple-600/40',
  O  : 'bg-gray-200 dark:bg-gray-700/40',
};
const RH_COLORS: Record<'+' | '-', string> = {
  '+': 'bg-green-200 dark:bg-green-600/40',
  '-': 'bg-rose-200  dark:bg-rose-600/40',
};

/* util – join array nicely */
// NEW – inject translated “or”
function humanJoin(arr: string[], t: (k: any) => string) {
  if (arr.length === 1) return arr[0];
  const orWord = t('or');        // ← add this key in i18n dict: { en: 'or', bn: 'অথবা' }
  if (arr.length === 2) return `${arr[0]} ${orWord} ${arr[1]}`;
  return arr.slice(0, -1).join(', ') + `, ${orWord} ` + arr[arr.length - 1];
}

/* legend chip */
function Chip({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={`${className} inline-block px-2 py-0.5 rounded text-xs font-semibold text-gray-800 dark:text-gray-100 mr-2 mb-2`}
    >
      {label}
    </span>
  );
}

/* ---------- props ---------- */
type Props = {
  fatherABO: string[];
  motherABO: string[];
  fatherRh: ('+' | '-')[];
  motherRh: ('+' | '-')[];
};

export default function PunnettSquare({
  fatherABO,
  motherABO,
  fatherRh,
  motherRh,
}: Props) {
  const t = useTranslation();

  /* grids */
  const aboGrid = useMemo(
    () => motherABO.map(m => fatherABO.map(f => aboPhenotype(f, m))),
    [fatherABO, motherABO],
  );

  const rhGrid = useMemo(
    () => motherRh.map(m => fatherRh.map(f => (f === '+' || m === '+') ? '+' : '-')),
    [fatherRh, motherRh],
  );

  /* unique gametes for text */
  const mumABO = [...new Set(motherABO)];
  const dadABO = [...new Set(fatherABO)];
  const mumRh  = [...new Set(motherRh)];
  const dadRh  = [...new Set(fatherRh)];

  return (
    <section className="space-y-12">
      {/* ────────── ABO ────────── */}
      <div className="md:flex md:space-x-6">
        {/* square */}
        <div className="md:w-1/2">
          <h2 className="font-semibold text-lg mb-2">{t('abo_square_title')}</h2>
          <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">
            {t('abo_square_desc')}
          </p>

          {/* legend */}
          <div className="mb-2">
            {Object.entries(ABO_COLORS).map(([ph, cls]) => (
              <Chip key={ph} label={ph} className={cls} />
            ))}
          </div>

          {/* table */}
          <div className="overflow-x-auto">
            <table className="border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border p-1"></th>
                  {fatherABO.map(a => (
                    <th key={a} className="border px-3 py-1 font-mono">{a}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {motherABO.map((mAllele, rowIdx) => (
                  <tr key={mAllele}>
                    <th className="border px-3 py-1 font-mono">{mAllele}</th>
                    {fatherABO.map((_, colIdx) => {
                      const pheno = aboGrid[rowIdx][colIdx];
                      return (
                        <td
                          key={colIdx}
                          className={`border px-4 py-2 text-center font-semibold ${ABO_COLORS[pheno]}`}
                        >
                          {pheno}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* explanatory text */}
        <div className="md:w-1/2 mt-6 md:mt-0">
          <h3 className="font-medium mb-2">{t('parents_pass_title')}</h3>
          <ul className="text-sm space-y-1">
            <li>
              • {t('mother_can_pass')}{' '}<strong>{humanJoin(mumABO, t)}</strong>.
            </li>
            <li>
              • {t('father_can_pass')}{' '}<strong>{humanJoin(dadABO, t)}</strong>.
            </li>
            <li>• {t('each_cell_shows')}</li>
          </ul>
        </div>
      </div>

      {/* ────────── Rh ────────── */}
      <div className="md:flex md:space-x-6">
        <div className="md:w-1/2">
          <h2 className="font-semibold text-lg mb-2">{t('rh_square_title')}</h2>
          <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">
            {t('rh_square_desc')}
          </p>

          {/* legend */}
          <div className="mb-2">
            <Chip label="Rh +" className={RH_COLORS['+']} />
            <Chip label="Rh −" className={RH_COLORS['-']} />
          </div>

          {/* table */}
          <div className="overflow-x-auto">
            <table className="border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border p-1"></th>
                  {fatherRh.map(r => (
                    <th key={r} className="border px-4 py-1 font-mono">{r}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {motherRh.map((mAllele, rowIdx) => (
                  <tr key={mAllele}>
                    <th className="border px-4 py-1 font-mono">{mAllele}</th>
                    {fatherRh.map((_, colIdx) => {
                      const rh = rhGrid[rowIdx][colIdx] as '+' | '-';
                      return (
                        <td
                          key={colIdx}
                          className={`border px-4 py-2 text-center font-bold ${RH_COLORS[rh]}`}
                        >
                          {rh}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* explanatory text */}
        <div className="md:w-1/2 mt-6 md:mt-0">
          <h3 className="font-medium mb-2">{t('parents_pass_title')}</h3>
          <ul className="text-sm space-y-1">
            <li>
              • {t('mother_can_pass')} {' '} <strong>{humanJoin(mumRh, t)}</strong>.
            </li>
            <li>
              • {t('father_can_pass')} {' '} <strong>{humanJoin(dadRh, t)}</strong>.
            </li>
            <li>• {t('green_boxes_positive')}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
