'use client';

import type { MonthReport } from '@/lib/types';
import { monthSummary } from '@/lib/utils';
import { GoalAttainmentBar } from './GoalAttainmentBar';

interface KpiCardsProps {
  report: MonthReport;
}

const cardAccents = ['var(--accent)', 'var(--green)', 'var(--red)', 'var(--yellow)'] as const;

export function KpiCards({ report }: KpiCardsProps) {
  const summary = monthSummary(report);
  const appts = Number(summary.appts);
  const booked = parseFloat(summary.booked);
  const vvs = parseFloat(summary.vvs);
  const avail = parseFloat(summary.avail);

  const cards = [
    {
      label: 'Total Appointments',
      value: appts.toLocaleString(),
      goal: report.monthApptGoal,
      actual: appts,
      higherIsBetter: true,
      color: cardAccents[0],
    },
    {
      label: 'Avg Booked Rate',
      value: `${summary.booked}%`,
      goal: report.monthBookedRateGoal,
      actual: booked,
      higherIsBetter: true,
      color: cardAccents[1],
    },
    {
      label: 'Avg VV &gt;20 Min',
      value: `${summary.vvs}%`,
      goal: null,
      actual: vvs,
      higherIsBetter: false,
      color: cardAccents[2],
    },
    {
      label: 'Avg Availability',
      value: `${summary.avail}d`,
      goal: null,
      actual: avail,
      higherIsBetter: false,
      color: cardAccents[3],
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
      }}
    >
      {cards.map((c) => (
        <div
          key={c.label}
          className="card-pad"
          style={{ borderTop: `2px solid ${c.color}` }}
        >
          <div
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              color: 'var(--muted)',
              marginBottom: 6,
            }}
          >
            {c.label}
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, color: c.color }}>
            {c.value}
          </div>
          <GoalAttainmentBar
            actual={c.actual}
            goal={c.goal}
            label={c.label}
            higherIsBetter={c.higherIsBetter}
          />
        </div>
      ))}
    </div>
  );
}
