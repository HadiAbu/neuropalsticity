import { describe, it, expect } from 'vitest';
import motorCortex from '@content/regions/motor-cortex';
import {
  STRIP_LENGTH, stripLayout, segmentCenter,
} from '@levels/motor-cortex/simulation/stripLayout';

describe('stripLayout', () => {
  it('lays segments out medial to lateral with no gaps', () => {
    const segments = stripLayout(motorCortex);
    expect(segments[0].territory.id).toBe('toes');
    expect(segments[0].offset).toBe(0);
    for (let i = 1; i < segments.length; i++) {
      expect(segments[i].offset).toBeCloseTo(segments[i - 1].offset + segments[i - 1].length);
    }
  });

  it('fills exactly the strip length', () => {
    const segments = stripLayout(motorCortex);
    const last = segments[segments.length - 1];
    expect(last.offset + last.length).toBeCloseTo(STRIP_LENGTH);
  });

  it('gives the hand a longer segment than the trunk', () => {
    const lengthOf = (id: string) =>
      stripLayout(motorCortex).find((s) => s.territory.id === id)!.length;
    expect(lengthOf('hand')).toBeGreaterThan(lengthOf('trunk'));
  });

  it('returns the midpoint of a territory', () => {
    const segment = stripLayout(motorCortex).find((s) => s.territory.id === 'face')!;
    expect(segmentCenter(motorCortex, 'face')).toBeCloseTo(segment.offset + segment.length / 2);
  });

  it('returns null for a part with no territory', () => {
    const empty = { ...motorCortex, territories: [] };
    expect(segmentCenter(empty, 'face')).toBeNull();
  });
});
