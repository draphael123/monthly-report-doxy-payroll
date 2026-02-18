'use client';

import type { ProviderData, WeekData } from '@/lib/types';
import { dotBg, dotColor } from '@/lib/utils';

interface ProviderTableProps {
  providers: ProviderData[];
  weeks: WeekData[];
}

export function ProviderTable({ providers, weeks }: ProviderTableProps) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Provider</th>
          {weeks.map((w) => (
            <th key={w.label} className="right">
              {w.label}
            </th>
          ))}
          <th className="right">Avg</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {providers.map((p) => {
          const valid = p.weeks.filter((v): v is number => v !== null);
          const avg = valid.length > 0 ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : null;
          return (
            <tr key={p.name}>
              <td style={{ fontWeight: 600 }}>{p.name}</td>
              {p.weeks.map((v, i) => (
                <td key={i} className="right">
                  <span
                    className="pill"
                    style={{
                      backgroundColor: dotBg(v),
                      color: dotColor(v),
                      padding: '3px 8px',
                      fontSize: 11,
                    }}
                  >
                    {v !== null ? `${v}%` : '—'}
                  </span>
                </td>
              ))}
              <td className="right">
                <span
                  className="pill"
                  style={{
                    backgroundColor: dotBg(avg),
                    color: dotColor(avg),
                    padding: '3px 8px',
                    fontSize: 11,
                  }}
                >
                  {avg !== null ? `${avg}%` : '—'}
                </span>
              </td>
              <td className="muted" style={{ fontSize: 11, fontStyle: 'italic' }}>
                {p.notes || '—'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
