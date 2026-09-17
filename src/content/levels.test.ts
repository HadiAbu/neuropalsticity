import { describe, it, expect } from 'vitest';
import { levels } from '@content/levels';
import { FLOW_STEPS } from '@content/flow';
import type { Phase } from '@lib/simulation/machine';

describe('level registry', () => {
  it('has unique ids', () => {
    const ids = levels.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('offers exactly the motor cortex as available today', () => {
    expect(levels.filter((l) => l.status === 'available').map((l) => l.id)).toEqual(['motor-cortex']);
  });

  it('names every level in both clinical and plain terms', () => {
    for (const level of levels) {
      expect(level.name.length).toBeGreaterThan(0);
      expect(level.plainName.length).toBeGreaterThan(0);
    }
  });
});

describe('flow steps', () => {
  it('covers every simulation phase exactly once, in order', () => {
    const phases: Phase[] = ['overview', 'focused', 'predicting', 'revealed', 'rehab'];
    expect(FLOW_STEPS.map((s) => s.phase)).toEqual(phases);
  });
});
