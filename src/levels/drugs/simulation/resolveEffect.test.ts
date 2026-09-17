import { describe, it, expect } from 'vitest';
import drugs from '@content/regions/drugs';
import { rehabSynapse, resolveEffect, substanceIds } from '@levels/drugs/simulation/resolveEffect';

describe('substanceIds', () => {
  it('lists the authored substances in order', () => {
    expect(substanceIds(drugs)).toEqual(['alcohol', 'cocaine', 'morphine']);
  });
});

describe('resolveEffect', () => {
  it('returns the substance and its correct choice', () => {
    const r = resolveEffect('cocaine', drugs);
    expect(r.substance.id).toBe('cocaine');
    expect(r.correctChoiceId).toBe('euphoric');
  });

  it('throws on an unknown substance', () => {
    expect(() => resolveEffect('caffeine', drugs)).toThrow('no substance authored with id "caffeine"');
  });
});

describe('rehabSynapse', () => {
  const cocaine = drugs.substances.find((s) => s.id === 'cocaine')!;

  it('starts at the tolerant receptor density with an ordinary signal', () => {
    const s = rehabSynapse(cocaine, 0);
    expect(s.receptorDensity).toBe(cocaine.synapse.tolerant.receptorDensity);
    expect(s.transmitterInCleft).toBe(cocaine.synapse.baseline.transmitterInCleft);
    expect(s.receptorActivation).toBeLessThan(cocaine.synapse.baseline.receptorActivation);
  });

  it('returns to baseline at full recovery', () => {
    const s = rehabSynapse(cocaine, 1);
    expect(s.receptorDensity).toBeCloseTo(1);
    expect(s.receptorActivation).toBeCloseTo(cocaine.synapse.baseline.receptorActivation);
  });

  it('is monotonic in recovery', () => {
    const a = rehabSynapse(cocaine, 0.2).receptorDensity;
    const b = rehabSynapse(cocaine, 0.6).receptorDensity;
    expect(b).toBeGreaterThan(a);
  });

  it('clamps out-of-range fractions', () => {
    expect(rehabSynapse(cocaine, 5).receptorDensity).toBeCloseTo(1);
    expect(rehabSynapse(cocaine, -1).receptorDensity).toBe(cocaine.synapse.tolerant.receptorDensity);
  });
});
