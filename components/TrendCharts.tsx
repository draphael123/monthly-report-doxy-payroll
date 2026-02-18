'use client';

import {
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import type { MonthReport } from '@/lib/types';
import { monthSummary } from '@/lib/utils';

interface TrendChartsProps {
  reports: MonthReport[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'var(--surface)',
          border: '1.5px solid var(--border)',
          borderRadius: '10px',
          padding: '12px',
          boxShadow: 'var(--shadow-lg)',
          fontSize: '13px',
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>
          {label}
        </div>
        {payload.map((entry: any, index: number) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '4px',
              color: entry.color,
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '2px',
                background: entry.color,
              }}
            />
            <span style={{ color: 'var(--text)' }}>
              {entry.name}: <strong>{entry.value}{entry.unit || ''}</strong>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function TrendCharts({ reports }: TrendChartsProps) {
  const data = reports.map((r) => {
    const s = monthSummary(r);
    return {
      id: r.id,
      label: r.label,
      appts: Number(s.appts),
      apptGoal: r.monthApptGoal,
      booked: parseFloat(s.booked),
      bookedGoal: r.monthBookedRateGoal,
      vvs: parseFloat(s.vvs),
      avail: parseFloat(s.avail),
    };
  });

  if (data.length === 0) return null;

  return (
    <div className="card-pad" style={{ marginTop: 24 }}>
      <div className="section-label">Month-over-Month Trends</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        {/* Appointments Chart */}
        <div style={{ height: 280 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
            Total Appointments
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 11, fill: 'var(--muted)' }}
                style={{ fontSize: '11px' }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: 'var(--muted)' }} 
                stroke="var(--muted)"
                style={{ fontSize: '11px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              {(() => {
                const goalValue = data.find(d => d.apptGoal)?.apptGoal;
                return goalValue != null ? (
                  <ReferenceLine
                    y={goalValue}
                    stroke="var(--yellow)"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    label={{ value: 'Goal', position: 'right', fill: 'var(--yellow)', fontSize: 11 }}
                  />
                ) : null;
              })()}
              <Area
                type="monotone"
                dataKey="appts"
                stroke="var(--accent)"
                strokeWidth={3}
                fill="url(#colorAppts)"
                dot={{ fill: 'var(--accent)', r: 5, strokeWidth: 2, stroke: 'var(--surface)' }}
                activeDot={{ r: 7 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Booked Rate Chart */}
        <div style={{ height: 280 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
            Avg Booked Rate %
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorBooked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--green)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--green)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 11, fill: 'var(--muted)' }}
                style={{ fontSize: '11px' }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: 'var(--muted)' }} 
                stroke="var(--muted)"
                domain={[0, 100]}
                style={{ fontSize: '11px' }}
              />
              <Tooltip 
                content={<CustomTooltip />}
                formatter={(value: number) => [`${value}%`, 'Booked Rate']}
              />
              {(() => {
                const goalValue = data.find(d => d.bookedGoal)?.bookedGoal;
                return goalValue != null ? (
                  <ReferenceLine
                    y={goalValue}
                    stroke="var(--yellow)"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    label={{ value: 'Goal', position: 'right', fill: 'var(--yellow)', fontSize: 11 }}
                  />
                ) : null;
              })()}
              <Area
                type="monotone"
                dataKey="booked"
                stroke="var(--green)"
                strokeWidth={3}
                fill="url(#colorBooked)"
                dot={{ fill: 'var(--green)', r: 5, strokeWidth: 2, stroke: 'var(--surface)' }}
                activeDot={{ r: 7 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* VV >20% Chart */}
        <div style={{ height: 280 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
            Avg VV &gt;20 Min %
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorVVs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--red)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--red)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 11, fill: 'var(--muted)' }}
                style={{ fontSize: '11px' }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: 'var(--muted)' }} 
                stroke="var(--muted)"
                style={{ fontSize: '11px' }}
              />
              <Tooltip 
                content={<CustomTooltip />}
                formatter={(value: number) => [`${value}%`, 'VV >20%']}
              />
              <Area
                type="monotone"
                dataKey="vvs"
                stroke="var(--red)"
                strokeWidth={3}
                fill="url(#colorVVs)"
                dot={{ fill: 'var(--red)', r: 5, strokeWidth: 2, stroke: 'var(--surface)' }}
                activeDot={{ r: 7 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Availability Chart */}
        <div style={{ height: 280 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
            Avg Availability (days)
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorAvail" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--yellow)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--yellow)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 11, fill: 'var(--muted)' }}
                style={{ fontSize: '11px' }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: 'var(--muted)' }} 
                stroke="var(--muted)"
                style={{ fontSize: '11px' }}
              />
              <Tooltip 
                content={<CustomTooltip />}
                formatter={(value: number) => [`${value}d`, 'Availability']}
              />
              <Area
                type="monotone"
                dataKey="avail"
                stroke="var(--yellow)"
                strokeWidth={3}
                fill="url(#colorAvail)"
                dot={{ fill: 'var(--yellow)', r: 5, strokeWidth: 2, stroke: 'var(--surface)' }}
                activeDot={{ r: 7 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
