import { describe, it, expect } from 'vitest';
import amygdala from '@content/regions/amygdala';
import { resolveResponse, stimulusIds } from '@levels/amygdala/simulation/resolveResponse';

describe('stimulusIds', () => {
  it('lists the authored stimuli in order', () => {
    expect(stimulusIds(amygdala)).toEqual(['snake', 'fearful-face', 'stranger-close']);
  });
});

describe('resolveResponse', () => {
  it('returns both profiles and the correct choice for a stimulus', () => {
    const result = resolveResponse('snake', amygdala);
    expect(result.stimulus.id).toBe('snake');
    expect(result.intact.heartRateBpm).toBe(118);
    expect(result.damaged.heartRateBpm).toBe(74);
    expect(result.correctChoiceId).toBe('calm');
  });

  it('identifies the correct choice per stimulus', () => {
    expect(resolveResponse('fearful-face', amygdala).correctChoiceId).toBe('misreads');
    expect(resolveResponse('stranger-close', amygdala).correctChoiceId).toBe('fine');
  });

  it('throws on an unknown stimulus', () => {
    expect(() => resolveResponse('spider', amygdala)).toThrow('no stimulus authored with id "spider"');
  });
});
