'use client';

import { useState } from 'react';
import type { ProviderData } from '@/lib/types';

interface UtilizationRankingProps {
  providers: ProviderData[];
  /** Number of providers to show in the list (e.g. 10) */
  limit?: number;
}

type SortMode = 'highest' | 'lowest';

export function UtilizationRanking({ providers, limit = 10 }: UtilizationRankingProps) {
  const [mode, setMode] = useState<SortMode>('highest');

  const withAvg = providers
    .map((p) => {
      const valid = p.weeks.filter((v): v is number => v !== null);
      const avg = valid.length > 0 ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : null;
      return { ...p, avg };
    })
    .filter((p) => p.avg !== null) as (ProviderData & { avg: number })[];

  const sorted =
    mode === 'highest'
      ? [...withAvg].sort((a, b) => b.avg - a.avg).slice(0, limit)
      : [...withAvg].sort((a, b) => a.avg - b.avg).slice(0, limit);

  const sectionTitle =
    mode === 'highest' ? 'TOP PERFORMERS — UTILIZATION' : 'LOWEST UTILIZATION';

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '1.5px',
            color: 'var(--muted)',
            textTransform: 'uppercase',
          }}
        >
          {sectionTitle}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            type="button"
            onClick={() => setMode('highest')}
            style={{
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 500,
              border: '1px solid var(--border)',
              borderRadius: 6,
              background: mode === 'highest' ? 'var(--accent)' : 'transparent',
              color: mode === 'highest' ? '#fff' : 'var(--text)',
              cursor: 'pointer',
            }}
          >
            Highest
          </button>
          <button
            type="button"
            onClick={() => setMode('lowest')}
            style={{
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 500,
              border: '1px solid var(--border)',
              borderRadius: 6,
              background: mode === 'lowest' ? 'var(--accent)' : 'transparent',
              color: mode === 'lowest' ? '#fff' : 'var(--text)',
              cursor: 'pointer',
            }}
          >
            Lowest
          </button>
        </div>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {sorted.map((p, i) => {
          const rank = i + 1;
          const isHighlight = rank <= 3;
          return (
            <li
              key={p.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 18px',
                borderBottom: i < sorted.length - 1 ? '1px solid var(--border)' : 'none',
                backgroundColor: isHighlight ? 'rgba(88, 166, 255, 0.08)' : 'transparent',
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: isHighlight ? 'var(--accent)' : 'var(--surface2)',
                  color: isHighlight ? '#fff' : 'var(--muted)',
                  fontSize: 11,
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {rank}
              </span>
              <span style={{ fontWeight: 600, flex: 1 }}>{p.name}</span>
              <span
                style={{
                  fontWeight: 600,
                  color: 'var(--accent)',
                  fontSize: 13,
                  minWidth: 40,
                  textAlign: 'right',
                }}
              >
                {p.avg}%
              </span>
              {p.notes && p.notes.trim() !== '' && (
                <span
                  style={{
                    fontSize: 11,
                    color: 'var(--muted)',
                    fontStyle: 'italic',
                    maxWidth: 180,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p.notes}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
