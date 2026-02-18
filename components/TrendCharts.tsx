'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { MonthReport } from '@/lib/types';
import { monthSummary } from '@/lib/utils';

interface TrendChartsProps {
  reports: MonthReport[];
}

export function TrendCharts({ reports }: TrendChartsProps) {
  const data = reports.map((r) => {
    const s = monthSummary(r);
    return {
      id: r.id,
      label: r.label,
      appts: Number(s.appts),
      booked: parseFloat(s.booked),
      vvs: parseFloat(s.vvs),
      avail: parseFloat(s.avail),
    };
  });

  if (data.length === 0) return null;

  return (
    <div className="card-pad" style={{ marginTop: 24 }}>
      <div className="section-label">Month-over-Month Trends</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ height: 260 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>Total Appointments</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--muted)' }} stroke="var(--muted)" />
              <Tooltip
                contentStyle={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: 'var(--text)' }}
              />
              <Line
                type="monotone"
                dataKey="appts"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={{ fill: 'var(--accent)', r: 4 }}
                name="Appointments"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ height: 260 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>Avg Booked Rate %</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--muted)' }} stroke="var(--muted)" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: 'var(--text)' }}
                formatter={(value: number) => [`${value}%`, 'Booked Rate']}
              />
              <Line
                type="monotone"
                dataKey="booked"
                stroke="var(--green)"
                strokeWidth={2}
                dot={{ fill: 'var(--green)', r: 4 }}
                name="Booked %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 16 }}>
        <div style={{ height: 260 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>Avg VV &gt;20 Min %</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--muted)' }} stroke="var(--muted)" />
              <Tooltip
                contentStyle={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: 'var(--text)' }}
                formatter={(value: number) => [`${value}%`, 'VV >20%']}
              />
              <Line
                type="monotone"
                dataKey="vvs"
                stroke="var(--red)"
                strokeWidth={2}
                dot={{ fill: 'var(--red)', r: 4 }}
                name="VV >20%"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ height: 260 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>Avg Availability (days)</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--muted)' }} stroke="var(--muted)" />
              <Tooltip
                contentStyle={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: 'var(--text)' }}
                formatter={(value: number) => [`${value}d`, 'Availability']}
              />
              <Line
                type="monotone"
                dataKey="avail"
                stroke="var(--yellow)"
                strokeWidth={2}
                dot={{ fill: 'var(--yellow)', r: 4 }}
                name="Avail (d)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
