'use client';

import Link from 'next/link';

export function Nav() {
  return (
    <nav className="nav">
      <Link
        href="/"
        className="font-display font-semibold text-[17px] tracking-tight"
        style={{ color: 'var(--text)' }}
      >
        Fountain <span style={{ color: 'var(--accent)' }}>Vitality</span>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/" className="btn btn-sm">
          Dashboard
        </Link>
        <Link href="/add" className="btn-primary">
          + Add Report
        </Link>
      </div>
    </nav>
  );
}
