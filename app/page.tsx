'use client';

import { useEffect, useState } from 'react';
import { MonthCard } from '@/components/MonthCard';
import { KpiCards } from '@/components/KpiCards';
import { TrendCharts } from '@/components/TrendCharts';
import type { MonthReport } from '@/lib/types';

export default function DashboardPage() {
  const [reports, setReports] = useState<MonthReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports')
      .then((res) => {
        if (!res.ok) {
          console.error('Failed to fetch reports:', res.status, res.statusText);
          return [];
        }
        return res.json();
      })
      .then((data: MonthReport[]) => {
        if (Array.isArray(data)) {
          setReports(data);
        } else {
          console.error('Invalid data format received:', data);
          setReports([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching reports:', error);
        setReports([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="page">
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</div>
      </main>
    );
  }

  const latestReport = reports.length > 0 ? reports[reports.length - 1] : null;

  return (
    <main className="page">
      <h1 className="font-display font-semibold" style={{ fontSize: 24, marginBottom: 8, color: 'var(--text)' }}>
        Clinical Operations Dashboard
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 32 }}>
        Monthly reporting — appointments, booked rate, and trends
      </p>

      {latestReport && (
        <>
          <div className="section-label">Latest month — {latestReport.label}</div>
          <KpiCards report={latestReport} />
        </>
      )}

      <div className="section-label">All months</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {reports.map((r) => (
          <MonthCard key={r.id} report={r} />
        ))}
      </div>

      {reports.length > 0 && <TrendCharts reports={reports} />}
    </main>
  );
}
