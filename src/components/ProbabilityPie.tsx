'use client';

/* components/ProbabilityPie.tsx – i18n-ready
 * Doughnut chart + translated bullet explanation.
 */
import { useEffect, useRef } from 'react';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useTranslation } from '@/lib/i18n';

Chart.register(ArcElement, Tooltip, Legend);

/* ---------- types ---------- */
type Probability = { phenotype: string; prob: number };

export default function ProbabilityPie({ probabilities }: { probabilities: Probability[] }) {
  const chartRef = useRef<Chart<'doughnut'> | null>(null);
  const t = useTranslation();

  /* chart config */
  const data: ChartData<'doughnut'> = {
    labels: probabilities.map(p => `${p.phenotype} (${(p.prob * 100).toFixed(1)}%)`),
    datasets: [
      {
        data: probabilities.map(p => Number((p.prob * 100).toFixed(2))),
        backgroundColor: [
          '#f87171',
          '#60a5fa',
          '#c084fc',
          '#fbbf24',
          '#34d399',
          '#f472b6',
          '#a3e635',
          '#facc15',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: { position: 'right', labels: { boxWidth: 16 } },
      tooltip: {
        callbacks: {
          label(ctx) {
            const v = ctx.parsed as number;
            return `${v.toFixed(1)} %`;
          },
        },
      },
    },
  };

  /* cleanup */
  useEffect(() => () => chartRef.current?.destroy(), []);

  return (
    <section>
      <h2 className="font-semibold text-lg mb-3">{t('outcome_probabilities')}</h2>

      <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
        {/* chart */}
        <div className="max-w-xs mx-auto">
          <Doughnut ref={chartRef} data={data} options={options} />
        </div>

        {/* bullets */}
        <ul className="mt-6 md:mt-0 flex-1 space-y-1 text-sm leading-5">
          {probabilities.map(p => (
            <li key={p.phenotype}>
              • {t('probability_bullet_prefix')}&nbsp;
              <strong>{(p.prob * 100).toFixed(1)} %</strong>&nbsp;
              {t('probability_bullet_suffix')}&nbsp;
              <span className="font-medium">{p.phenotype}</span>.
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
