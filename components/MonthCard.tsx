'use client';

import React from 'react';
import Link from 'next/link';
import type { MonthReport } from '@/lib/types';
import { monthSummary } from '@/lib/utils';
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
      <div style={{ padding: '28px' }}>
        <div
          className="font-display font-semibold"
          style={{ fontSize: 20, marginBottom: 20, color: 'var(--text)', letterSpacing: '-0.3px' }}
        >
          {report.label}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5px, marginBottom: 8, color: 'var(--muted)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              Appointments
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 20 }}>
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
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5px, marginBottom: 8, color: 'var(--muted)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              Booked Rate
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 20 }}>
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
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5px, marginBottom: 8, color: 'var(--muted)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              VV &gt;20 Min
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 20 }}>
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
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5px, marginBottom: 8, color: 'var(--muted)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              Availability
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 20 }}>
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
