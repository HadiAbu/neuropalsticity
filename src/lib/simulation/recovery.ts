import type { DeficitEntry, RegionBase } from '@content/schema';

export function recoveryAt(content: RegionBase, week: number): number {
  const timeline = content.plasticity.timeline;
  let fraction = 0;
  for (const point of timeline) {
    if (point.week <= week) fraction = point.recoveryFraction;
    else break;
  }
  return fraction;
}

export function applyRecovery(
  entries: DeficitEntry[],
  recoveryFraction: number
): DeficitEntry[] {
  return entries.map((entry) => {
    if (entry.severity === 'complete' && recoveryFraction >= 0.5) {
      return { ...entry, severity: 'partial' };
    }
    if (entry.severity === 'partial' && recoveryFraction >= 0.6) {
      return { ...entry, severity: 'spared' };
    }
    return entry;
  });
}
