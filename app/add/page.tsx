'use client';

import Link from 'next/link';
import { AddMonthForm } from '@/components/AddMonthForm';

export default function AddReportPage() {
  return (
    <main className="page">
      <Link href="/" className="btn btn-sm" style={{ marginBottom: 16, display: 'inline-block' }}>
        ← Back
      </Link>
      <h1 className="font-display font-semibold" style={{ fontSize: 22, marginBottom: 8, color: 'var(--text)' }}>
        Add Monthly Report
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 32 }}>
        Fill in the steps below to add a new month. Goals and context notes are optional.
      </p>
      <AddMonthForm />
    </main>
  );
}
