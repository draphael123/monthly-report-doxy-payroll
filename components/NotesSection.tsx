'use client';

interface NotesSectionProps {
  planning: string;
  variables: string;
  recommendations: string;
}

export function NotesSection({ planning, variables, recommendations }: NotesSectionProps) {
  const items = [
    { label: 'Planning', content: planning },
    { label: 'Variables', content: variables },
    { label: 'Recommendations', content: recommendations },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
      }}
    >
      {items.map(({ label, content }) => (
        <div key={label} className="card-pad">
          <div
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              color: 'var(--accent)',
              marginBottom: 10,
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--muted)',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}
          >
            {(content ?? '').trim() || '—'}
          </div>
        </div>
      ))}
    </div>
  );
}
