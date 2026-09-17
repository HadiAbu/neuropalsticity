import { describe, it, expect } from 'vitest';
import { validateRegionContent } from '@content/schema';
import cerebellum from '@content/regions/cerebellum';

describe('cerebellum content', () => {
  it('conforms to the region schema', () => {
    expect(validateRegionContent(cerebellum)).toEqual([]);
  });

  it('ships exactly the three specified trials', () => {
    expect(cerebellum.trials.map((t) => t.id)).toEqual([
      'finger-to-nose', 'tandem-gait', 'rapid-alternating-and-speech',
    ]);
  });

  it('gives every trial four choices with exactly one correct', () => {
    for (const t of cerebellum.trials) {
      expect(t.choices).toHaveLength(4);
      expect(t.choices.filter((c) => c.correct)).toHaveLength(1);
    }
  });

  it('shows the classic ataxic triad once damaged, in every trial', () => {
    for (const t of cerebellum.trials) {
      expect(t.damaged.gait).toBe('wide-based and unsteady');
      expect(t.damaged.intentionTremor).toBe(true);
      expect(t.damaged.rapidAlternatingMovements).toBe('irregular');
      expect(t.damaged.speechQuality).toBe('scanning');
    }
  });

  it('keeps the intact profile fully normal in every trial', () => {
    for (const t of cerebellum.trials) {
      expect(t.intact.gait).toBe('steady');
      expect(t.intact.intentionTremor).toBe(false);
    }
  });

  it('frames recovery as partial, plateauing below full function', () => {
    const last = cerebellum.plasticity.timeline.at(-1)!;
    expect(last.recoveryFraction).toBeLessThan(1);
    expect(cerebellum.plasticity.caveat).toMatch(/often remain/);
  });
});
