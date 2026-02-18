'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import type { MonthReport } from '@/lib/types';
import { monthSummary } from '@/lib/utils';

interface ProviderVisitPieChartProps {
  reports: MonthReport[];
}

const COLORS = [
  'var(--accent)',
  'var(--green)',
  'var(--yellow)',
  'var(--red)',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f59e0b',
  '#ef4444',
  '#3b82f6',
  '#10b981',
  '#f97316',
  '#6366f1',
  '#a855f7',
  '#06b6d4',
  '#84cc16',
  '#eab308',
  '#22c55e',
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
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
        <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--text)' }}>
          {data.name}
        </div>
        <div style={{ color: data.payload.fill }}>
          Visits: <strong>{data.value.toLocaleString()}</strong>
        </div>
        <div style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '4px' }}>
          {data.payload.percentage}% of total
        </div>
      </div>
    );
  }
  return null;
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  if (percent < 0.03) return null; // Don't show labels for slices < 3%
  
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
    </text>
  );
};

export function ProviderVisitPieChart({ reports }: ProviderVisitPieChartProps) {
  if (reports.length === 0) return null;

  // Calculate total visits per provider across all months
  const providerVisits = new Map<string, number>();

  reports.forEach((report) => {
    const totalAppts = Number(monthSummary(report).appts);
    
    report.providers.forEach((provider) => {
      // Calculate provider's average utilization for this month
      const validWeeks = provider.weeks.filter((v): v is number => v !== null);
      if (validWeeks.length === 0) return;
      
      const avgUtilization = validWeeks.reduce((a, b) => a + b, 0) / validWeeks.length;
      
      // Estimate visits based on utilization percentage
      // This is an approximation: we distribute total appointments based on utilization
      const providerShare = avgUtilization / 100;
      const estimatedVisits = totalAppts * providerShare;
      
      const current = providerVisits.get(provider.name) || 0;
      providerVisits.set(provider.name, current + estimatedVisits);
    });
  });

  // Convert to array and sort by visits (descending)
  const chartData = Array.from(providerVisits.entries())
    .map(([name, visits]) => ({
      name,
      value: Math.round(visits),
      percentage: 0, // Will calculate after
    }))
    .sort((a, b) => b.value - a.value);

  // Calculate total and percentages
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  chartData.forEach((item) => {
    item.percentage = total > 0 ? (item.value / total) * 100 : 0;
  });

  if (chartData.length === 0) return null;

  return (
    <div className="card-pad" style={{ marginTop: 24 }}>
      <div className="section-label">Provider Visit Distribution</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 20 }}>
        <div style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 20 }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>
            Top Providers by Visits
          </div>
          {chartData.slice(0, 10).map((item, index) => (
            <div
              key={item.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 12px',
                background: index < 3 ? 'rgba(74, 158, 255, 0.05)' : 'transparent',
                border: index < 3 ? '1px solid var(--border)' : 'none',
                borderRadius: 6,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  background: COLORS[index % COLORS.length],
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, fontSize: 13, fontWeight: index < 3 ? 600 : 500 }}>
                {item.name}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>
                {item.value.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', minWidth: 50, textAlign: 'right' }}>
                {item.percentage.toFixed(1)}%
              </div>
            </div>
          ))}
          {chartData.length > 10 && (
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8, fontStyle: 'italic' }}>
              +{chartData.length - 10} more providers
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

