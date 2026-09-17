import { describe, it, expect } from 'vitest';
import { validateRegionContent } from '@content/schema';
import parkinsons from '@content/regions/parkinsons';

describe('parkinsons content', () => {
  it('conforms to the region schema', () => {
    expect(validateRegionContent(parkinsons)).toEqual([]);
  });

  it('ships exactly the three specified trials', () => {
    expect(parkinsons.trials.map((t) => t.id)).toEqual([
      'resting-tremor', 'rigidity', 'finger-tapping',
    ]);
  });

  it('gives every trial four choices with exactly one correct', () => {
    for (const t of parkinsons.trials) {
      expect(t.choices).toHaveLength(4);
      expect(t.choices.filter((c) => c.correct)).toHaveLength(1);
    }
  });

  it('shows the classic parkinsonian signs once damaged, in every trial', () => {
    for (const t of parkinsons.trials) {
      expect(t.damaged.restingTremor).toBe(true);
      expect(t.damaged.rigidity).toBe('cogwheel');
      expect(t.damaged.movementSpeed).toBe('bradykinetic');
    }
  });

  it('keeps the intact profile fully normal in every trial', () => {
    for (const t of parkinsons.trials) {
      expect(t.intact.restingTremor).toBe(false);
      expect(t.intact.rigidity).toBe('normal');
    }
  });

  it('models levodopa response rising then wearing off over years, never reaching full control', () => {
    const t = parkinsons.plasticity.timeline;
    const peak = Math.max(...t.map((p) => p.recoveryFraction));
    const last = t.at(-1)!.recoveryFraction;
    expect(peak).toBeGreaterThan(t[0].recoveryFraction);
    expect(last).toBeLessThan(peak);
    expect(last).toBeGreaterThan(0);
  });
});
