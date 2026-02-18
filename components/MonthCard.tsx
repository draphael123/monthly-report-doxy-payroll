'use client';

import Link from 'next/link';
import type { MonthReport } from '@/lib/types';
import { monthSummary, calculateChange } from '@/lib/utils';
import { ChangeIndicator } from './ChangeIndicator';

interface MonthCardProps {
  report: MonthReport;
  previousReport?: MonthReport | null;
}

export function MonthCard({ report, previousReport }: MonthCardProps) {
  const summary = monthSummary(report);
  const prevSummary = previousReport ? monthSummary(previousReport) : null;

  return (
    <Link
      href={`/report/${report.id}`}
      className="card block fade-in"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div style={{ padding: '24px' }}>
        <div
          className="font-display font-semibold"
          style={{ fontSize: 18, marginBottom: 16, color: 'var(--text)' }}
        >
          {report.label}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 16,
            fontSize: 13,
          }}
        >
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, color: 'var(--muted)' }}>
              Appointments
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 16 }}>
                {Number(summary.appts).toLocaleString()}
              </div>
              {prevSummary && (
                <ChangeIndicator
                  current={Number(summary.appts)}
                  previous={Number(prevSummary.appts)}
                  higherIsBetter={true}
                />
              )}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, color: 'var(--muted)' }}>
              Booked Rate
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: 16 }}>
                {summary.booked}%
              </div>
              {prevSummary && (
                <ChangeIndicator
                  current={parseFloat(summary.booked)}
                  previous={parseFloat(prevSummary.booked)}
                  higherIsBetter={true}
                />
              )}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, color: 'var(--muted)' }}>
              VV &gt;20 Min
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: 16 }}>
                {summary.vvs}%
              </div>
              {prevSummary && (
                <ChangeIndicator
                  current={parseFloat(summary.vvs)}
                  previous={parseFloat(prevSummary.vvs)}
                  higherIsBetter={false}
                />
              )}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, color: 'var(--muted)' }}>
              Availability
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: 16 }}>
                {summary.avail}d
              </div>
              {prevSummary && (
                <ChangeIndicator
                  current={parseFloat(summary.avail)}
                  previous={parseFloat(prevSummary.avail)}
                  higherIsBetter={false}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
