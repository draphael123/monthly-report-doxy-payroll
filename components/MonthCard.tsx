'use client';

import Link from 'next/link';
import type { MonthReport } from '@/lib/types';
import { monthSummary } from '@/lib/utils';

interface MonthCardProps {
  report: MonthReport;
}

export function MonthCard({ report }: MonthCardProps) {
  const summary = monthSummary(report);
  return (
    <Link
      href={`/report/${report.id}`}
      className="card block fade-in"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div style={{ padding: '20px' }}>
        <div
          className="font-display font-semibold"
          style={{ fontSize: 16, marginBottom: 12, color: 'var(--text)' }}
        >
          {report.label}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
            fontSize: 12,
            color: 'var(--muted)',
          }}
        >
          <div>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>
              Appts
            </div>
            <div style={{ color: 'var(--accent)', fontWeight: 500 }}>
              {Number(summary.appts).toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>
              Booked
            </div>
            <div style={{ color: 'var(--text)' }}>{summary.booked}%</div>
          </div>
          <div>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>
              VV &gt;20%
            </div>
            <div style={{ color: 'var(--text)' }}>{summary.vvs}%</div>
          </div>
          <div>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>
              Avail
            </div>
            <div style={{ color: 'var(--text)' }}>{summary.avail}d</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
