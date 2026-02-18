import { MonthReport, MonthSummary } from './types';

export const avg = (arr: number[]) =>
  arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;

export const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

export function monthSummary(report: MonthReport): MonthSummary {
  return {
    appts:  sum(report.weeks.map(w => w.appts)),
    booked: avg(report.weeks.map(w => w.bookedRate)).toFixed(1),
    vvs:    avg(report.weeks.map(w => w.vvsOver20)).toFixed(2),
    avail:  avg(report.weeks.map(w => w.availability)).toFixed(1),
  };
}

export function labelToId(label: string): string {
  const months = [
    'january','february','march','april','may','june',
    'july','august','september','october','november','december'
  ];
  const parts = label.toLowerCase().trim().split(/\s+/);
  const mIdx = months.indexOf(parts[0]);
  const yr = parts[1] ?? new Date().getFullYear().toString();
  return mIdx >= 0
    ? `${yr}-${String(mIdx + 1).padStart(2, '0')}`
    : `${yr}-${Date.now()}`;
}

export function dotBg(v: number | null): string {
  if (v === null || v === undefined) return 'var(--surface2)';
  if (v >= 70) return 'rgba(63,185,80,0.6)';
  if (v >= 50) return 'rgba(227,179,65,0.5)';
  return 'rgba(247,129,102,0.5)';
}

export function dotColor(v: number | null): string {
  if (v === null || v === undefined) return 'var(--muted)';
  return '#fff';
}

export function pillStyle(v: number): { bg: string; color: string } {
  if (v >= 70) return { bg: 'rgba(63,185,80,0.15)',   color: '#3fb950' };
  if (v >= 50) return { bg: 'rgba(227,179,65,0.15)',  color: '#e3b341' };
  return            { bg: 'rgba(247,129,102,0.15)', color: '#f78166' };
}

// true = higher is better, false = lower is better
export const METRIC_DIRECTION: Record<string, boolean> = {
  appts:        true,
  bookedRate:   true,
  vvsOver20:    false,
  availability: false,
};

/**
 * Returns attainment % and status for a metric vs its goal.
 * status: 'met' | 'close' | 'missed' | null (no goal set)
 */
export function goalAttainment(
  actual: number,
  goal: number | null,
  higherIsBetter = true
): { pct: number; status: 'met' | 'close' | 'missed' } | null {
  if (goal === null || goal === undefined || goal === 0) return null;
  const pct = higherIsBetter
    ? Math.round((actual / goal) * 100)
    : Math.round((goal / actual) * 100);  // invert for metrics where lower = better
  const status = pct >= 100 ? 'met' : pct >= 90 ? 'close' : 'missed';
  return { pct, status };
}

export function attainmentColor(status: 'met' | 'close' | 'missed'): string {
  return status === 'met' ? '#3fb950' : status === 'close' ? '#e3b341' : '#f78166';
}

export function attainmentBg(status: 'met' | 'close' | 'missed'): string {
  return status === 'met'
    ? 'rgba(63,185,80,0.15)'
    : status === 'close'
    ? 'rgba(227,179,65,0.15)'
    : 'rgba(247,129,102,0.15)';
}
