import { describe, it, expect } from 'vitest';
import motorCortex from '@content/regions/motor-cortex';
import { resolveDeficit, selectableSites } from '@levels/motor-cortex/simulation/resolveDeficit';

describe('selectableSites', () => {
  it('derives selectable territories from authored scenarios', () => {
    expect(selectableSites(motorCortex).sort()).toEqual(['face', 'hand', 'leg']);
  });
});

describe('resolveDeficit', () => {
  it('produces deficits on the opposite side from a left hemisphere lesion', () => {
    expect(resolveDeficit('hand', motorCortex, 'left').side).toBe('right');
  });

  it('produces deficits on the opposite side from a right hemisphere lesion', () => {
    expect(resolveDeficit('hand', motorCortex, 'right').side).toBe('left');
  });

  it('matches the lesion site to its authored scenario', () => {
    expect(resolveDeficit('face', motorCortex, 'left').scenarioId).toBe('lateral-mca');
    expect(resolveDeficit('leg', motorCortex, 'left').scenarioId).toBe('medial-aca');
  });

  it('orders entries medial to lateral', () => {
    const { entries } = resolveDeficit('leg', motorCortex, 'left');
    const orderOf = (part: string) =>
      motorCortex.territories.find((t) => t.id === part)!.order;
    const orders = entries.map((e) => orderOf(e.part));
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it('carries severity through unchanged', () => {
    const { entries } = resolveDeficit('hand', motorCortex, 'left');
    expect(entries.find((e) => e.part === 'fingers')?.severity).toBe('complete');
    expect(entries.find((e) => e.part === 'arm')?.severity).toBe('spared');
  });

  it('throws when asked for a site with no authored scenario', () => {
    expect(() => resolveDeficit('tongue', motorCortex, 'left')).toThrow(
      'no scenario authored for territory "tongue"'
    );
  });
});
