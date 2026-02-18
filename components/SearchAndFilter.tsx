'use client';

import React, { useState, useCallback } from 'react';
import type { MonthReport } from '@/lib/types';

interface SearchAndFilterProps {
  reports: MonthReport[];
  onFilter: (filtered: MonthReport[]) => void;
}

export function SearchAndFilter({ reports, onFilter }: SearchAndFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      onFilter(reports);
      return;
    }

    const filtered = reports.filter((r) =>
      r.label.toLowerCase().includes(term.toLowerCase()) ||
      r.id.toLowerCase().includes(term.toLowerCase())
    );
    onFilter(filtered);
  }, [reports, onFilter]);

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ position: 'relative', maxWidth: 400 }}>
        <input
          type="text"
          placeholder="Search months..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="form-input"
          style={{
            paddingLeft: '40px',
            fontSize: '14px',
            height: '44px',
            borderRadius: '10px',
            border: '1.5px solid var(--border)',
          }}
        />
        <span
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--muted)',
            fontSize: '18px',
          }}
        >
          🔍
        </span>
        {searchTerm && (
          <button
            onClick={() => handleSearch('')}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: 'var(--muted)',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '4px',
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

