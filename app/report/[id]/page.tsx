'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { KpiCards } from '@/components/KpiCards';
import { WeeklyTable } from '@/components/WeeklyTable';
import { ProviderTable } from '@/components/ProviderTable';
import { UtilizationRanking } from '@/components/UtilizationRanking';
import { ProviderHeatmap } from '@/components/ProviderHeatmap';
import { LeadsTable } from '@/components/LeadsTable';
import { NotesSection } from '@/components/NotesSection';
import type { MonthReport } from '@/lib/types';

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : params.id?.[0] ?? '';
  const [report, setReport] = useState<MonthReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetch(`/api/reports/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(setReport)
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleExportPdf = () => {
    window.open(`/api/reports/export/${id}`, '_blank');
  };

  const handleDelete = async () => {
    if (!confirm('Delete this report? This cannot be undone.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/');
        router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="page">
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</div>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="page">
        <p style={{ color: 'var(--muted)' }}>Report not found.</p>
        <Link href="/" className="btn" style={{ marginTop: 16, display: 'inline-block' }}>
          Back to Dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="page">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <Link href="/" className="btn btn-sm" style={{ marginBottom: 8, display: 'inline-block' }}>
            ← Back
          </Link>
          <h1 className="font-display font-semibold" style={{ fontSize: 28, color: 'var(--text)', letterSpacing: '-0.5px' }}>
            {report.label}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>
            Created {report.createdAt}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a
            href={`/api/reports/export/${id}/csv`}
            className="btn"
            download
          >
            📊 Export CSV
          </a>
          <button type="button" className="btn" onClick={handleExportPdf}>
            📄 Export PDF
          </button>
          <button
            type="button"
            className="btn btn-sm"
            style={{ color: 'var(--red)' }}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="section-label">Monthly Summary</div>
      <KpiCards report={report} />

      <div className="section-label">Week-by-Week Performance</div>
      <div className="card" style={{ overflowX: 'auto' }}>
        <WeeklyTable weeks={report.weeks} />
      </div>

      <div className="section-label">Notes</div>
      <NotesSection
        planning={report.planning}
        variables={report.variables}
        recommendations={report.recommendations}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div className="section-label">Top Performers — Utilization</div>
          <UtilizationRanking providers={report.providers} limit={10} />
        </div>
        <div>
          <div className="section-label">Provider Utilization Heatmap</div>
          <ProviderHeatmap providers={report.providers} weeks={report.weeks} />
        </div>
      </div>

      {report.leads.length > 0 && (
        <>
          <div className="section-label">Lead Performance</div>
          <div className="card" style={{ overflowX: 'auto' }}>
            <LeadsTable leads={report.leads} weeks={report.weeks} />
          </div>
        </>
      )}
    </main>
  );
}
