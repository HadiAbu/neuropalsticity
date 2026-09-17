import { describe, it, expect } from 'vitest';
import { validateRegionContent } from '@content/schema';
import type { RegionContent } from '@content/schema';

const minimal: RegionContent = {
  id: 'test',
  name: 'Test Region',
  plainName: 'test region',
  overview: 'overview',
  insight: 'insight',
  territories: [
    { id: 'hand', label: 'Hand', corticalShare: 0.6, order: 0 },
    { id: 'leg', label: 'Leg', corticalShare: 0.4, order: 1 },
  ],
  scenarios: [
    {
      id: 's1',
      label: 'Scenario',
      siteTerritory: 'hand',
      deficits: [{ part: 'hand', severity: 'complete' }],
      dayToDay: 'text',
      sources: [{ claim: 'c', citation: 'cite' }],
    },
  ],
  plasticity: {
    mechanism: 'mechanism',
    timeline: [
      { week: 0, recoveryFraction: 0 },
      { week: 4, recoveryFraction: 0.3 },
    ],
    caveat: 'partial and variable',
  },
  sources: [{ claim: 'c', citation: 'cite' }],
};

describe('validateRegionContent', () => {
  it('accepts well-formed content', () => {
    expect(validateRegionContent(minimal)).toEqual([]);
  });

  it('rejects cortical shares that do not sum to 1', () => {
    const bad = {
      ...minimal,
      territories: [{ id: 'hand', label: 'Hand', corticalShare: 0.5, order: 0 }],
    } satisfies RegionContent;
    expect(validateRegionContent(bad)).toContain(
      'territory corticalShare values must sum to 1 (got 0.5)'
    );
  });

  it('rejects a scenario whose site is not a declared territory', () => {
    const bad = {
      ...minimal,
      scenarios: [{ ...minimal.scenarios[0], siteTerritory: 'tongue' as const }],
    } satisfies RegionContent;
    expect(validateRegionContent(bad)).toContain(
      'scenario s1 targets territory "tongue" which is not declared'
    );
  });

  it('rejects duplicate territory order values', () => {
    const bad = {
      ...minimal,
      territories: [
        { id: 'hand', label: 'Hand', corticalShare: 0.6, order: 0 },
        { id: 'leg', label: 'Leg', corticalShare: 0.4, order: 0 },
      ],
    } satisfies RegionContent;
    expect(validateRegionContent(bad)).toContain('territory order values must be unique');
  });

  it('rejects a scenario with no sourced claims', () => {
    const bad = {
      ...minimal,
      scenarios: [{ ...minimal.scenarios[0], sources: [] }],
    } satisfies RegionContent;
    expect(validateRegionContent(bad)).toContain('scenario s1 has no sources');
  });

  it('rejects a plasticity timeline that does not start at week 0', () => {
    const bad = {
      ...minimal,
      plasticity: {
        ...minimal.plasticity,
        timeline: [{ week: 2, recoveryFraction: 0.1 }],
      },
    } satisfies RegionContent;
    expect(validateRegionContent(bad)).toContain('plasticity timeline must start at week 0');
  });

  it('rejects a corticalShare outside 0..1', () => {
    const bad = {
      ...minimal,
      territories: [
        { id: 'hand', label: 'Hand', corticalShare: 1.6, order: 0 },
        { id: 'leg', label: 'Leg', corticalShare: -0.6, order: 1 },
      ],
    } satisfies RegionContent;
    expect(validateRegionContent(bad)).toContain(
      'territory "hand" corticalShare must be between 0 and 1 (got 1.6)'
    );
  });

  it('rejects duplicate territory ids', () => {
    const bad = {
      ...minimal,
      territories: [
        { id: 'hand', label: 'Hand', corticalShare: 0.5, order: 0 },
        { id: 'hand', label: 'Hand', corticalShare: 0.5, order: 1 },
      ],
    } satisfies RegionContent;
    expect(validateRegionContent(bad)).toContain('territory ids must be unique');
  });

  it('rejects a recoveryFraction outside 0..1', () => {
    const bad = {
      ...minimal,
      plasticity: {
        ...minimal.plasticity,
        timeline: [
          { week: 0, recoveryFraction: 0 },
          { week: 4, recoveryFraction: 30 },
        ],
      },
    } satisfies RegionContent;
    expect(validateRegionContent(bad)).toContain(
      'plasticity recoveryFraction must be between 0 and 1 (got 30 at week 4)'
    );
  });

  it('rejects a deficit in an undeclared part', () => {
    const bad = {
      ...minimal,
      scenarios: [{ ...minimal.scenarios[0], deficits: [{ part: 'tongue' as const, severity: 'complete' }] }],
    } satisfies RegionContent;
    expect(validateRegionContent(bad)).toContain(
      'scenario s1 describes a deficit in "tongue" which is not declared'
    );
  });
});
