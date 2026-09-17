import { describe, it, expect } from 'vitest';
import { validateRegionContent } from '@content/schema';
import drugs from '@content/regions/drugs';

describe('drugs content', () => {
  it('conforms to the region schema', () => {
    expect(validateRegionContent(drugs)).toEqual([]);
  });

  it('ships one substance from each class', () => {
    expect(drugs.substances.map((s) => s.drugClass)).toEqual(['depressant', 'stimulant', 'opioid']);
  });

  it('models each action on a different transmitter', () => {
    expect(drugs.substances.map((s) => s.action)).toEqual(['enhances-receptor', 'blocks-reuptake', 'mimics-transmitter']);
    expect(new Set(drugs.substances.map((s) => s.transmitter)).size).toBe(3);
  });

  it('raises receptor activation acutely and lowers receptor density with tolerance', () => {
    for (const s of drugs.substances) {
      expect(s.synapse.acute.receptorActivation).toBeGreaterThan(s.synapse.baseline.receptorActivation);
      expect(s.synapse.tolerant.receptorDensity).toBeLessThan(s.synapse.baseline.receptorDensity);
    }
  });

  it('only cocaine floods the cleft — the others act on the receptor', () => {
    const cocaine = drugs.substances.find((s) => s.id === 'cocaine')!;
    expect(cocaine.synapse.acute.transmitterInCleft).toBeGreaterThan(cocaine.synapse.baseline.transmitterInCleft);
    for (const s of drugs.substances.filter((x) => x.id !== 'cocaine')) {
      expect(s.synapse.acute.transmitterInCleft).toBe(s.synapse.baseline.transmitterInCleft);
    }
  });

  it('slows the heart with morphine and races it with cocaine', () => {
    const by = (id: string) => drugs.substances.find((s) => s.id === id)!;
    expect(by('morphine').acute.heartRateBpm).toBeLessThan(by('morphine').sober.heartRateBpm);
    expect(by('cocaine').acute.heartRateBpm).toBeGreaterThan(by('cocaine').sober.heartRateBpm);
  });

  it('keeps recovery partial at one year', () => {
    expect(drugs.plasticity.timeline.at(-1)!.recoveryFraction).toBeLessThan(1);
  });
});
