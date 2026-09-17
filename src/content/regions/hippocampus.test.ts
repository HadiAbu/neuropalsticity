import { describe, it, expect } from 'vitest';
import { validateRegionContent } from '@content/schema';
import hippocampus from '@content/regions/hippocampus';

describe('hippocampus content', () => {
  it('conforms to the region schema', () => {
    expect(validateRegionContent(hippocampus)).toEqual([]);
  });

  it('ships exactly the three specified trials', () => {
    expect(hippocampus.trials.map((t) => t.id)).toEqual([
      'repeated-introduction', 'mirror-tracing', 'childhood-recall',
    ]);
  });

  it('gives every trial four choices with exactly one correct', () => {
    for (const t of hippocampus.trials) {
      expect(t.choices).toHaveLength(4);
      expect(t.choices.filter((c) => c.correct)).toHaveLength(1);
    }
  });

  it('never forms new memories once damaged, in every trial', () => {
    for (const t of hippocampus.trials) {
      expect(t.damaged.formsNewMemory).toBe(false);
    }
  });

  it('keeps old memories and procedural learning intact despite the damage', () => {
    for (const t of hippocampus.trials) {
      expect(t.damaged.retainsOldMemories).toBe(true);
      expect(t.damaged.learnsSkillsProcedurally).toBe(true);
    }
  });

  it('frames plasticity as compensation that never reaches full recovery', () => {
    const last = hippocampus.plasticity.timeline.at(-1)!;
    expect(last.recoveryFraction).toBeLessThan(1);
    expect(hippocampus.plasticity.caveat).toMatch(/not memory regained/);
  });
});
