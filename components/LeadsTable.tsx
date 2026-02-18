'use client';

import type { LeadData, WeekData } from '@/lib/types';
import { pillStyle } from '@/lib/utils';

interface LeadsTableProps {
  leads: LeadData[];
  weeks: WeekData[];
}

export function LeadsTable({ leads, weeks }: LeadsTableProps) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Lead</th>
          {weeks.map((w) => (
            <th key={w.label} className="right">
              {w.label}
            </th>
          ))}
          <th className="right">Avg</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((l) => {
          const avg = Math.round(l.weeks.reduce((a, b) => a + b, 0) / l.weeks.length);
          return (
            <tr key={l.name}>
              <td style={{ fontWeight: 600 }}>{l.name}</td>
              {l.weeks.map((v, i) => {
                const style = pillStyle(v);
                return (
                  <td key={i} className="right">
                    <span className="pill" style={{ backgroundColor: style.bg, color: style.color }}>
                      {v}%
                    </span>
                  </td>
                );
              })}
              <td className="right muted">{avg}%</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
