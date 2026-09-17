function heartBand(bpm: number): string {
  if (bpm < 80) return 'resting';
  if (bpm < 100) return 'elevated';
  return 'racing';
}

/** Semicircular gauge; the number is always printed so colour never carries the meaning alone. */
export function HeartGauge({ bpm }: { bpm: number }) {
  const fraction = Math.min(1, Math.max(0, (bpm - 40) / 140));
  const angle = Math.PI * (1 - fraction);
  const r = 36;
  const x = 50 + r * Math.cos(angle);
  const y = 50 - r * Math.sin(angle);
  const fill = bpm < 80 ? '#22c55e' : bpm < 100 ? '#f59e0b' : '#dc2626';

  return (
    <svg viewBox="0 0 100 60" className="h-16 w-28" role="img" aria-label={`${bpm} beats per minute, ${heartBand(bpm)}`}>
      <path d="M14 50 A36 36 0 0 1 86 50" fill="none" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
      <path d={`M14 50 A36 36 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}`} fill="none" stroke={fill} strokeWidth="8" strokeLinecap="round" />
      <text x="50" y="48" textAnchor="middle" fill="#f1f5f9" fontSize="16" fontWeight="600">{bpm}</text>
      <text x="50" y="58" textAnchor="middle" fill="#cbd5e1" fontSize="7">bpm · {heartBand(bpm)}</text>
    </svg>
  );
}
