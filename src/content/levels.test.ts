import { describe, it, expect } from 'vitest';
import { levels } from '@content/levels';
import { FLOW_STEPS } from '@content/flow';
import type { Phase } from '@lib/simulation/machine';

describe('level registry', () => {
  it('has unique ids', () => {
    const ids = levels.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('offers exactly the available levels built so far', () => {
    expect(levels.filter((l) => l.status === 'available').map((l) => l.id)).toEqual([
      'motor-cortex', 'somatosensory-cortex', 'amygdala', 'drugs-classes',
    ]);
  });

  it('places every level on the brain by node prefix or marker', () => {
    for (const level of levels) {
      const { nodePrefixes, marker } = level.anatomy;
      expect((nodePrefixes?.length ?? 0) > 0 || marker !== undefined).toBe(true);
    }
  });

  it('gives every available level real mesh nodes to glow', () => {
    for (const level of levels.filter((l) => l.status === 'available')) {
      expect(level.anatomy.nodePrefixes?.length ?? 0).toBeGreaterThan(0);
    }
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
