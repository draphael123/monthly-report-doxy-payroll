'use client';

interface ChangeIndicatorProps {
  current: number;
  previous: number | null;
  higherIsBetter?: boolean;
  format?: (value: number) => string;
}

export function ChangeIndicator({ 
  current, 
  previous, 
  higherIsBetter = true,
  format = (v) => v.toLocaleString()
}: ChangeIndicatorProps) {
  if (previous === null || previous === 0) return null;

  const change = current - previous;
  const percent = Math.round((change / previous) * 100);
  const isPositive = higherIsBetter ? change > 0 : change < 0;

  if (change === 0) {
    return (
      <span className="change-indicator change-neutral">
        <span>→</span>
        <span>0%</span>
      </span>
    );
  }

  return (
    <span className={`change-indicator ${isPositive ? 'change-positive' : 'change-negative'}`}>
      <span>{isPositive ? '↑' : '↓'}</span>
      <span>{Math.abs(percent)}%</span>
    </span>
  );
}

