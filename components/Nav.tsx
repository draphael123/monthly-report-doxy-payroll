'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';
import { useState } from 'react';

export function Nav() {
  const [logoError, setLogoError] = useState(false);

  return (
    <nav className="nav">
      <Link
        href="/"
        style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none',
        }}
      >
        {!logoError && (
          <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0 }}>
            <Image
              src="/fountain-logo-new.png"
              alt="Fountain Vitality Logo"
              width={40}
              height={40}
              style={{ objectFit: 'contain' }}
              onError={() => setLogoError(true)}
              priority
            />
          </div>
        )}
        <span
          className="font-display font-semibold"
          style={{ 
            fontSize: 22, 
            letterSpacing: '-0.5px',
            color: 'var(--text)',
          }}
        >
          Fountain <span style={{ color: 'var(--accent)' }}>Vitality</span>
        </span>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/" className="btn btn-sm">
          Dashboard
        </Link>
        <Link href="/add" className="btn-primary">
          + Add Report
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
