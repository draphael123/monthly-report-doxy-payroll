'use client';

import { useEffect, useState } from 'react';
import { MonthCard } from '@/components/MonthCard';
import { KpiCards } from '@/components/KpiCards';
import { TrendCharts } from '@/components/TrendCharts';
import { ProviderRankings } from '@/components/ProviderRankings';
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
      <div style={{ marginBottom: 48 }}>
        <h1 className="font-display font-semibold" style={{ fontSize: 36, marginBottom: 12, color: 'var(--text)', letterSpacing: '-0.8px', lineHeight: 1.2 }}>
          Clinical Operations Dashboard
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.6 }}>
          Monthly reporting — appointments, booked rate, and trends
        </p>
      </div>

      {latestReport && (
        <>
          <div className="section-label">Latest month — {latestReport.label}</div>
          <KpiCards report={latestReport} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
            <ProviderRankings report={latestReport} />
            <div className="card-pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>Export Data</div>
              <a
                href={`/api/reports/export/${latestReport.id}/csv`}
                className="btn btn-primary"
                download
                style={{ textDecoration: 'none' }}
              >
                📊 Export to CSV
              </a>
            </div>
          </div>
        </>
      )}

      <div className="section-label">All months</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 20,
        }}
      >
        {reports.map((r, index) => (
          <MonthCard 
            key={r.id} 
            report={r} 
            previousReport={index > 0 ? reports[index - 1] : null}
          />
        ))}
      </div>

      {reports.length > 0 && <TrendCharts reports={reports} />}
    </main>
  );
}
