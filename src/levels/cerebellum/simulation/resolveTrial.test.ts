import { describe, it, expect } from 'vitest';
import cerebellum from '@content/regions/cerebellum';
import { resolveTrial, trialIds } from '@levels/cerebellum/simulation/resolveTrial';

describe('trialIds', () => {
  it('lists the authored trials in order', () => {
    expect(trialIds(cerebellum)).toEqual(['finger-to-nose', 'tandem-gait', 'rapid-alternating-and-speech']);
  });
});

describe('resolveTrial', () => {
  it('returns the trial and its correct choice', () => {
    const r = resolveTrial('tandem-gait', cerebellum);
    expect(r.trial.id).toBe('tandem-gait');
    expect(r.correctChoiceId).toBe('staggers');
  });

  it('identifies the correct choice per trial', () => {
    expect(resolveTrial('finger-to-nose', cerebellum).correctChoiceId).toBe('overshoots');
    expect(resolveTrial('rapid-alternating-and-speech', cerebellum).correctChoiceId).toBe('clumsy-choppy');
  });

  it('throws on an unknown trial', () => {
    expect(() => resolveTrial('nonexistent', cerebellum)).toThrow('no trial authored with id "nonexistent"');
  });
});
