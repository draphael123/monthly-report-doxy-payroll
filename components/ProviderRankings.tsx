'use client';

import type { MonthReport } from '@/lib/types';
import { getProviderAverage } from '@/lib/utils';

interface ProviderRankingsProps {
  report: MonthReport;
}

export function ProviderRankings({ report }: ProviderRankingsProps) {
  const providersWithAvg = report.providers
    .map((p) => ({
      ...p,
      avg: getProviderAverage(p),
    }))
    .filter((p) => p.avg !== null)
    .sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0))
    .slice(0, 10); // Top 10

  if (providersWithAvg.length === 0) return null;

  const getRankClass = (index: number) => {
    if (index === 0) return 'rank-1';
    if (index === 1) return 'rank-2';
    if (index === 2) return 'rank-3';
    return 'rank-other';
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return null;
  };

  return (
    <div className="card-pad">
      <div className="section-label" style={{ marginTop: 0 }}>Top Performers — Utilization</div>
      <div style={{ display: 'grid', gap: 12 }}>
        {providersWithAvg.map((provider, index) => (
          <div
            key={provider.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              background: index < 3 ? 'rgba(74, 158, 255, 0.05)' : 'transparent',
              border: index < 3 ? '1px solid var(--border)' : 'none',
              borderRadius: 8,
            }}
          >
            <span className={`rank-badge ${getRankClass(index)}`}>
              {getRankIcon(index) || index + 1}
            </span>
            <div style={{ flex: 1, fontWeight: index < 3 ? 600 : 500 }}>
              {provider.name}
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: index < 3 ? 'var(--accent)' : 'var(--text)',
              }}
            >
              {provider.avg}%
            </div>
            {provider.notes && (
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--muted)',
                  fontStyle: 'italic',
                  maxWidth: 200,
                }}
              >
                {provider.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

