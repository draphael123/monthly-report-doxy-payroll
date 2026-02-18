'use client';

import type { ProviderData, WeekData } from '@/lib/types';

interface ProviderHeatmapProps {
  providers: ProviderData[];
  weeks: WeekData[];
}

function getHeatmapColor(value: number | null): string {
  if (value === null) return 'var(--surface2)';
  if (value >= 80) return 'rgba(16, 185, 129, 0.8)'; // Green
  if (value >= 70) return 'rgba(16, 185, 129, 0.5)'; // Light green
  if (value >= 60) return 'rgba(251, 191, 36, 0.6)'; // Yellow
  if (value >= 50) return 'rgba(251, 191, 36, 0.4)'; // Light yellow
  return 'rgba(239, 68, 68, 0.5)'; // Red
}

function getTextColor(value: number | null): string {
  if (value === null) return 'var(--muted)';
  if (value >= 70) return '#fff';
  if (value >= 50) return '#000';
  return '#fff';
}

export function ProviderHeatmap({ providers, weeks }: ProviderHeatmapProps) {
  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ position: 'sticky', left: 0, zIndex: 10, background: 'var(--surface2)' }}>
              Provider
            </th>
            {weeks.map((w) => (
              <th key={w.label} className="right" style={{ minWidth: 80 }}>
                {w.label}
              </th>
            ))}
            <th className="right" style={{ minWidth: 80 }}>Avg</th>
            <th style={{ minWidth: 200 }}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((p) => {
            const valid = p.weeks.filter((v): v is number => v !== null);
            const avg = valid.length > 0
              ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length)
              : null;
            
            return (
              <tr key={p.name}>
                <td 
                  style={{ 
                    fontWeight: 600,
                    position: 'sticky',
                    left: 0,
                    zIndex: 5,
                    background: 'var(--surface)',
                    borderRight: '2px solid var(--border)',
                  }}
                >
                  {p.name}
                </td>
                {p.weeks.map((v, i) => (
                  <td 
                    key={i} 
                    className="right"
                    style={{
                      background: getHeatmapColor(v),
                      color: getTextColor(v),
                      fontWeight: 600,
                      fontSize: '13px',
                      padding: '12px 16px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.zIndex = '10';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.zIndex = '1';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {v !== null ? `${v}%` : '—'}
                  </td>
                ))}
                <td 
                  className="right"
                  style={{
                    background: getHeatmapColor(avg),
                    color: getTextColor(avg),
                    fontWeight: 700,
                    fontSize: '14px',
                    borderLeft: '2px solid var(--border)',
                  }}
                >
                  {avg !== null ? `${avg}%` : '—'}
                </td>
                <td 
                  className="muted" 
                  style={{ 
                    fontSize: 12, 
                    fontStyle: 'italic',
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p.notes || '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ padding: '16px', borderTop: '1px solid var(--border)', background: 'var(--surface2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--muted)' }}>
          <span style={{ fontWeight: 600 }}>Legend:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', background: 'rgba(16, 185, 129, 0.8)', borderRadius: '4px' }} />
            <span>80%+</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', background: 'rgba(251, 191, 36, 0.6)', borderRadius: '4px' }} />
            <span>60-79%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', background: 'rgba(239, 68, 68, 0.5)', borderRadius: '4px' }} />
            <span>&lt;60%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

