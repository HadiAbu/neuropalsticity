import { describe, it, expect } from 'vitest';
import hippocampus from '@content/regions/hippocampus';
import { resolveTrial, trialIds } from '@levels/hippocampus/simulation/resolveTrial';

describe('trialIds', () => {
  it('lists the authored trials in order', () => {
    expect(trialIds(hippocampus)).toEqual(['repeated-introduction', 'mirror-tracing', 'childhood-recall']);
  });
});

describe('resolveTrial', () => {
  it('returns the trial and its correct choice', () => {
    const r = resolveTrial('mirror-tracing', hippocampus);
    expect(r.trial.id).toBe('mirror-tracing');
    expect(r.correctChoiceId).toBe('improves-forgets');
  });

  it('identifies the correct choice per trial', () => {
    expect(resolveTrial('repeated-introduction', hippocampus).correctChoiceId).toBe('stranger');
    expect(resolveTrial('childhood-recall', hippocampus).correctChoiceId).toBe('childhood-only');
  });

  it('throws on an unknown trial', () => {
    expect(() => resolveTrial('nonexistent', hippocampus)).toThrow('no trial authored with id "nonexistent"');
  });
});
