import { describe, it, expect } from 'vitest';
import parkinsons from '@content/regions/parkinsons';
import { resolveTrial, trialIds } from '@levels/parkinsons/simulation/resolveTrial';

describe('trialIds', () => {
  it('lists the authored trials in order', () => {
    expect(trialIds(parkinsons)).toEqual(['resting-tremor', 'rigidity', 'finger-tapping']);
  });
});

describe('resolveTrial', () => {
  it('returns the trial and its correct choice', () => {
    const r = resolveTrial('resting-tremor', parkinsons);
    expect(r.trial.id).toBe('resting-tremor');
    expect(r.correctChoiceId).toBe('pill-rolling');
  });

  it('identifies the correct choice per trial', () => {
    expect(resolveTrial('rigidity', parkinsons).correctChoiceId).toBe('cogwheel');
    expect(resolveTrial('finger-tapping', parkinsons).correctChoiceId).toBe('decrementing');
  });

  it('throws on an unknown trial', () => {
    expect(() => resolveTrial('nonexistent', parkinsons)).toThrow('no trial authored with id "nonexistent"');
  });
});
