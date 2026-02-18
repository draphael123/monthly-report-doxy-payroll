'use client';

import React from 'react';
import type { WeekData } from '@/lib/types';

interface WeeklyTableProps {
  weeks: WeekData[];
}

export function WeeklyTable({ weeks }: WeeklyTableProps) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Week</th>
          <th className="right">Appts</th>
          <th className="right">Appt Goal</th>
          <th className="right">Booked %</th>
          <th className="right">Booked Goal %</th>
          <th className="right">VVs &gt;20%</th>
          <th className="right">Availability</th>
          <th>Session</th>
          <th>States &gt;7d</th>
          <th>Context Note</th>
        </tr>
      </thead>
      <tbody>
        {weeks.map((w) => {
          return (
            <React.Fragment key={w.label}>
              <tr>
                <td style={{ fontWeight: 600 }}>{w.label}</td>
                <td className="right">{w.appts.toLocaleString()}</td>
                <td className="right muted">{w.apptGoal != null ? w.apptGoal.toLocaleString() : '—'}</td>
                <td className="right">{w.bookedRate}%</td>
                <td className="right muted">{w.bookedRateGoal != null ? `${w.bookedRateGoal}%` : '—'}</td>
                <td className="right">{w.vvsOver20}%</td>
                <td className="right">{w.availability}</td>
                <td>{w.sessionTime}</td>
                <td>{w.statesOver7Days}</td>
                <td style={{ minWidth: 200 }}>
                  {w.contextNote ? (
                    <span className="muted" style={{ fontSize: 11, fontStyle: 'italic' }}>
                      {w.contextNote}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
              {w.contextNote && (
                <tr>
                  <td colSpan={10} style={{ padding: 0, borderBottom: '1px solid var(--border)', verticalAlign: 'top' }}>
                    <div
                      style={{
                        borderLeft: '2px solid var(--accent)',
                        background: 'rgba(88,166,255,0.06)',
                        padding: '6px 16px 6px 28px',
                        fontSize: 11,
                        fontStyle: 'italic',
                        color: 'var(--muted)',
                      }}
                    >
                      💬 {w.contextNote}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
