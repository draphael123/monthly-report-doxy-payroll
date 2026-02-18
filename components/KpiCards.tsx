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
      label: 'Avg VV >20 Min',
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
      {cards.map((c) => {
        return (
          <div
            key={c.label}
            className="card-pad"
            style={{ 
              borderLeft: `4px solid ${c.color}`,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div
              style={{
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--muted)',
                marginBottom: 12,
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
              }}
            >
              {c.label}
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: c.color, marginBottom: 12, lineHeight: 1.2 }}>
              {c.value}
            </div>
            <GoalAttainmentBar
              actual={c.actual}
              goal={c.goal}
              label={c.label}
              higherIsBetter={c.higherIsBetter}
            />
          </div>
        );
      })}
    </div>
  );
}
