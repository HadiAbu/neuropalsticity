import { describe, it, expect } from 'vitest';
import motorCortex from '@content/regions/motor-cortex';
import { recoveryAt, applyRecovery } from '@lib/simulation/recovery';
import type { DeficitEntry } from '@content/schema';

describe('recoveryAt', () => {
  it('is zero at week 0', () => {
    expect(recoveryAt(motorCortex, 0)).toBe(0);
  });

  it('reads the authored fraction for a known week', () => {
    expect(recoveryAt(motorCortex, 8)).toBe(0.52);
  });

  it('falls back to the nearest earlier week for an unauthored one', () => {
    expect(recoveryAt(motorCortex, 5)).toBe(0.35);
  });

  it('never reaches full recovery', () => {
    const last = motorCortex.plasticity.timeline.at(-1)!;
    expect(recoveryAt(motorCortex, last.week)).toBeLessThan(1);
  });
});

describe('applyRecovery', () => {
  const entries: DeficitEntry[] = [
    { part: 'hand', severity: 'complete' },
    { part: 'thumb', severity: 'partial' },
    { part: 'leg', severity: 'spared' },
  ];

  it('changes nothing at week zero', () => {
    expect(applyRecovery(entries, 0)).toEqual(entries);
  });

  it('softens complete loss to partial past the halfway mark', () => {
    expect(applyRecovery(entries, 0.55).find((e) => e.part === 'hand')?.severity).toBe('partial');
  });

  it('restores partial weakness once recovery is substantial', () => {
    expect(applyRecovery(entries, 0.65).find((e) => e.part === 'thumb')?.severity).toBe('spared');
  });

  it('leaves spared parts spared', () => {
    expect(applyRecovery(entries, 0.7).find((e) => e.part === 'leg')?.severity).toBe('spared');
  });

  it('never fully restores a completely lost part at the authored maximum', () => {
    const max = motorCortex.plasticity.timeline.at(-1)!.recoveryFraction;
    expect(applyRecovery(entries, max).find((e) => e.part === 'hand')?.severity).not.toBe('spared');
  });
});
