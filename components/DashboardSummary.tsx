'use client';

import type { MonthReport } from '@/lib/types';
import { monthSummary } from '@/lib/utils';

interface DashboardSummaryProps {
  reports: MonthReport[];
}

export function DashboardSummary({ reports }: DashboardSummaryProps) {
  if (reports.length === 0) return null;

  const latest = reports[reports.length - 1];
  const latestSummary = monthSummary(latest);
  const previous = reports.length > 1 ? reports[reports.length - 2] : null;
  const previousSummary = previous ? monthSummary(previous) : null;

  const totalAppts = reports.reduce((sum, r) => sum + Number(monthSummary(r).appts), 0);
  const avgBooked = reports.reduce((sum, r) => sum + parseFloat(monthSummary(r).booked), 0) / reports.length;
  const totalMonths = reports.length;

  const calculateChange = (current: number, prev: number | null) => {
    if (!prev) return null;
    const change = ((current - prev) / prev) * 100;
    return Math.round(change);
  };

  const apptChange = previousSummary
    ? calculateChange(Number(latestSummary.appts), Number(previousSummary.appts))
    : null;
  const bookedChange = previousSummary
    ? calculateChange(parseFloat(latestSummary.booked), parseFloat(previousSummary.booked))
    : null;

  const stats = [
    {
      label: 'Total Months Tracked',
      value: totalMonths.toString(),
      change: null,
      color: 'var(--accent)',
    },
    {
      label: 'Total Appointments',
      value: totalAppts.toLocaleString(),
      change: null,
      color: 'var(--accent)',
    },
    {
      label: 'Latest Month Appts',
      value: Number(latestSummary.appts).toLocaleString(),
      change: apptChange,
      changeLabel: 'vs previous month',
      color: 'var(--accent)',
    },
    {
      label: 'Avg Booked Rate',
      value: `${avgBooked.toFixed(1)}%`,
      change: bookedChange,
      changeLabel: 'vs previous month',
      color: 'var(--green)',
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="card-pad"
          style={{
            borderLeft: `4px solid ${stat.color}`,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          }}
        >
          <div
            style={{
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: 0.5px,
              color: 'var(--muted)',
              marginBottom: 8,
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
            }}
          >
            {stat.label}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: stat.color, marginBottom: 4 }}>
            {stat.value}
          </div>
          {stat.change !== null && (
            <div
              style={{
                fontSize: 12,
                color: stat.change! >= 0 ? 'var(--green)' : 'var(--red)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>{stat.change! >= 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(stat.change!)}%</span>
              {stat.changeLabel && (
                <span style={{ color: 'var(--muted)', fontSize: 11, marginLeft: 4 }}>
                  {stat.changeLabel}
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

