'use client';

import { useEffect, useState } from 'react';
import { goalAttainment, attainmentColor } from '@/lib/utils';

interface GoalAttainmentBarProps {
  actual: number;
  goal: number | null;
  label: string;
  higherIsBetter?: boolean;
}

export function GoalAttainmentBar({
  actual,
  goal,
  label,
  higherIsBetter = true,
}: GoalAttainmentBarProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (goal === null || goal === undefined) return null;

  const result = goalAttainment(actual, goal, higherIsBetter);
  if (!result) return null;

  const fillPct = Math.min(result.pct, 100);
  const color = attainmentColor(result.status);

  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          height: 6,
          borderRadius: 3,
          background: 'var(--surface2)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: mounted ? `${fillPct}%` : '0%',
            background: color,
            borderRadius: 3,
            transition: 'width 0.5s ease-out',
          }}
        />
      </div>
      <div
        style={{
          fontSize: 10,
          color: 'var(--muted)',
          marginTop: 4,
        }}
      >
        {typeof actual === 'number' && actual > 1000
          ? `${actual.toLocaleString()} / ${goal.toLocaleString()} goal — ${result.pct}% attained`
          : `${actual} / ${goal} ${label} — ${result.pct}% attained`}
      </div>
    </div>
  );
}
