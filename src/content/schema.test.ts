import { describe, it, expect } from 'vitest';
import { validateRegionContent } from '@content/schema';
import type { PharmacologicContent, SomatotopicContent, ThreatContent } from '@content/schema';

const minimal: SomatotopicContent = {
  kind: 'somatotopic',
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

const threatMinimal: ThreatContent = {
  kind: 'threat',
  id: 'threat-test',
  name: 'Threat Region',
  plainName: 'fear',
  overview: 'overview',
  insight: 'insight',
  premise: 'both sides damaged',
  stimuli: [
    {
      id: 'snake',
      label: 'A snake',
      description: 'within reach',
      choices: [
        { id: 'flee', label: 'Backs away', correct: false },
        { id: 'calm', label: 'Picks it up', correct: true },
      ],
      intact: { heartRateBpm: 120, sweat: 'strong', behavior: 'freezes', report: 'terrified' },
      damaged: { heartRateBpm: 72, sweat: 'none', behavior: 'touches it', report: 'curious' },
      explanation: 'why',
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
    caveat: 'compensation, not repair',
  },
  sources: [{ claim: 'c', citation: 'cite' }],
};

describe('validateRegionContent — somatotopic', () => {
  it('accepts well-formed content', () => {
    expect(validateRegionContent(minimal)).toEqual([]);
  });

  it('rejects cortical shares that do not sum to 1', () => {
    const bad = {
      ...minimal,
      territories: [{ id: 'hand', label: 'Hand', corticalShare: 0.5, order: 0 }],
    } satisfies SomatotopicContent;
    expect(validateRegionContent(bad)).toContain('territory corticalShare values must sum to 1 (got 0.5)');
  });

  it('rejects a corticalShare outside 0..1', () => {
    const bad = {
      ...minimal,
      territories: [
        { id: 'hand', label: 'Hand', corticalShare: 1.6, order: 0 },
        { id: 'leg', label: 'Leg', corticalShare: -0.6, order: 1 },
      ],
    } satisfies SomatotopicContent;
    expect(validateRegionContent(bad)).toContain(
      'territory "hand" corticalShare must be between 0 and 1 (got 1.6)'
    );
  });

  it('rejects duplicate territory ids', () => {
    const bad = {
      ...minimal,
      territories: [
        { id: 'hand', label: 'Hand', corticalShare: 0.5, order: 0 },
        { id: 'hand', label: 'Hand again', corticalShare: 0.5, order: 1 },
      ],
    } satisfies SomatotopicContent;
    expect(validateRegionContent(bad)).toContain('territory ids must be unique');
  });

  it('rejects a scenario whose site is not a declared territory', () => {
    const bad = {
      ...minimal,
      scenarios: [{ ...minimal.scenarios[0], siteTerritory: 'tongue' as const }],
    } satisfies SomatotopicContent;
    expect(validateRegionContent(bad)).toContain(
      'scenario s1 targets territory "tongue" which is not declared'
    );
  });

  it('rejects a deficit in an undeclared part', () => {
    const bad = {
      ...minimal,
      scenarios: [{ ...minimal.scenarios[0], deficits: [{ part: 'tongue' as const, severity: 'complete' as const }] }],
    } satisfies SomatotopicContent;
    expect(validateRegionContent(bad)).toContain(
      'scenario s1 describes a deficit in "tongue" which is not declared'
    );
  });

  it('rejects duplicate territory order values', () => {
    const bad = {
      ...minimal,
      territories: [
        { id: 'hand', label: 'Hand', corticalShare: 0.6, order: 0 },
        { id: 'leg', label: 'Leg', corticalShare: 0.4, order: 0 },
      ],
    } satisfies SomatotopicContent;
    expect(validateRegionContent(bad)).toContain('territory order values must be unique');
  });

  it('rejects a scenario with no sourced claims', () => {
    const bad = {
      ...minimal,
      scenarios: [{ ...minimal.scenarios[0], sources: [] }],
    } satisfies SomatotopicContent;
    expect(validateRegionContent(bad)).toContain('scenario s1 has no sources');
  });
});

describe('validateRegionContent — shared plasticity checks', () => {
  it('rejects a plasticity timeline that does not start at week 0', () => {
    const bad = {
      ...minimal,
      plasticity: { ...minimal.plasticity, timeline: [{ week: 2, recoveryFraction: 0.1 }] },
    } satisfies SomatotopicContent;
    expect(validateRegionContent(bad)).toContain('plasticity timeline must start at week 0');
  });

  it('rejects a recoveryFraction outside 0..1', () => {
    const bad = {
      ...minimal,
      plasticity: {
        ...minimal.plasticity,
        timeline: [{ week: 0, recoveryFraction: 0 }, { week: 4, recoveryFraction: 30 }],
      },
    } satisfies SomatotopicContent;
    expect(validateRegionContent(bad)).toContain(
      'plasticity recoveryFraction must be between 0 and 1 (got 30 at week 4)'
    );
  });
});

describe('validateRegionContent — threat', () => {
  it('accepts well-formed threat content', () => {
    expect(validateRegionContent(threatMinimal)).toEqual([]);
  });

  it('rejects a stimulus with no correct choice', () => {
    const bad = {
      ...threatMinimal,
      stimuli: [{ ...threatMinimal.stimuli[0], choices: threatMinimal.stimuli[0].choices.map((c) => ({ ...c, correct: false })) }],
    } satisfies ThreatContent;
    expect(validateRegionContent(bad)).toContain('stimulus snake must have exactly one correct choice (got 0)');
  });

  it('rejects a stimulus with two correct choices', () => {
    const bad = {
      ...threatMinimal,
      stimuli: [{ ...threatMinimal.stimuli[0], choices: threatMinimal.stimuli[0].choices.map((c) => ({ ...c, correct: true })) }],
    } satisfies ThreatContent;
    expect(validateRegionContent(bad)).toContain('stimulus snake must have exactly one correct choice (got 2)');
  });

  it('rejects a stimulus with fewer than two choices', () => {
    const bad = {
      ...threatMinimal,
      stimuli: [{ ...threatMinimal.stimuli[0], choices: [{ id: 'only', label: 'Only', correct: true }] }],
    } satisfies ThreatContent;
    expect(validateRegionContent(bad)).toContain('stimulus snake must have at least two choices');
  });

  it('rejects an implausible heart rate', () => {
    const bad = {
      ...threatMinimal,
      stimuli: [{ ...threatMinimal.stimuli[0], damaged: { ...threatMinimal.stimuli[0].damaged, heartRateBpm: 300 } }],
    } satisfies ThreatContent;
    expect(validateRegionContent(bad)).toContain(
      'stimulus snake damaged heartRateBpm must be between 30 and 220 (got 300)'
    );
  });

  it('rejects a stimulus with no sources', () => {
    const bad = {
      ...threatMinimal,
      stimuli: [{ ...threatMinimal.stimuli[0], sources: [] }],
    } satisfies ThreatContent;
    expect(validateRegionContent(bad)).toContain('stimulus snake has no sources');
  });

  it('rejects duplicate stimulus ids', () => {
    const bad = {
      ...threatMinimal,
      stimuli: [threatMinimal.stimuli[0], { ...threatMinimal.stimuli[0] }],
    } satisfies ThreatContent;
    expect(validateRegionContent(bad)).toContain('stimulus ids must be unique');
  });
});

const drugMinimal: PharmacologicContent = {
  kind: 'pharmacologic',
  id: 'drug-test',
  name: 'Drugs',
  plainName: 'chemistry',
  overview: 'overview',
  insight: 'insight',
  pathway: 'reward pathway',
  substances: [
    {
      id: 'cocaine',
      label: 'Cocaine',
      drugClass: 'stimulant',
      scenario: 'a line',
      transmitter: 'dopamine',
      action: 'blocks-reuptake',
      synapse: {
        baseline: { transmitterInCleft: 0.3, receptorActivation: 0.3, receptorDensity: 1 },
        acute: { transmitterInCleft: 0.9, receptorActivation: 0.9, receptorDensity: 1 },
        tolerant: { transmitterInCleft: 0.9, receptorActivation: 0.5, receptorDensity: 0.6 },
      },
      choices: [
        { id: 'a', label: 'Euphoric', correct: true },
        { id: 'b', label: 'Sleepy', correct: false },
      ],
      sober: { heartRateBpm: 70, reactionTimeMs: 250, mood: 'steady', behavior: 'normal', report: 'fine' },
      acute: { heartRateBpm: 120, reactionTimeMs: 210, mood: 'euphoric', behavior: 'restless', report: 'amazing' },
      explanation: 'why',
      adaptation: 'how it adapts',
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
    caveat: 'partial',
  },
  sources: [{ claim: 'c', citation: 'cite' }],
};

describe('validateRegionContent — pharmacologic', () => {
  it('accepts well-formed pharmacologic content', () => {
    expect(validateRegionContent(drugMinimal)).toEqual([]);
  });

  it('rejects a substance with no correct choice', () => {
    const bad = {
      ...drugMinimal,
      substances: [{ ...drugMinimal.substances[0], choices: drugMinimal.substances[0].choices.map((c) => ({ ...c, correct: false })) }],
    } satisfies PharmacologicContent;
    expect(validateRegionContent(bad)).toContain('substance cocaine must have exactly one correct choice (got 0)');
  });

  it('rejects a synapse value outside 0..1', () => {
    const bad = {
      ...drugMinimal,
      substances: [{
        ...drugMinimal.substances[0],
        synapse: { ...drugMinimal.substances[0].synapse, acute: { transmitterInCleft: 1.4, receptorActivation: 0.9, receptorDensity: 1 } },
      }],
    } satisfies PharmacologicContent;
    expect(validateRegionContent(bad)).toContain(
      'substance cocaine synapse.acute.transmitterInCleft must be between 0 and 1 (got 1.4)'
    );
  });

  it('rejects an implausible acute heart rate', () => {
    const bad = {
      ...drugMinimal,
      substances: [{ ...drugMinimal.substances[0], acute: { ...drugMinimal.substances[0].acute, heartRateBpm: 260 } }],
    } satisfies PharmacologicContent;
    expect(validateRegionContent(bad)).toContain('substance cocaine acute heartRateBpm must be between 30 and 220 (got 260)');
  });

  it('rejects a substance with no sources', () => {
    const bad = {
      ...drugMinimal,
      substances: [{ ...drugMinimal.substances[0], sources: [] }],
    } satisfies PharmacologicContent;
    expect(validateRegionContent(bad)).toContain('substance cocaine has no sources');
  });

  it('rejects duplicate substance ids', () => {
    const bad = {
      ...drugMinimal,
      substances: [drugMinimal.substances[0], { ...drugMinimal.substances[0] }],
    } satisfies PharmacologicContent;
    expect(validateRegionContent(bad)).toContain('substance ids must be unique');
  });
});
