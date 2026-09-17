import { describe, it, expect } from 'vitest';
import { validateRegionContent } from '@content/schema';
import amygdala from '@content/regions/amygdala';

describe('amygdala content', () => {
  it('conforms to the region schema', () => {
    expect(validateRegionContent(amygdala)).toEqual([]);
  });

  it('ships exactly the three specified stimuli', () => {
    expect(amygdala.stimuli.map((s) => s.id)).toEqual(['snake', 'fearful-face', 'stranger-close']);
  });

  it('gives every stimulus four choices with exactly one correct', () => {
    for (const s of amygdala.stimuli) {
      expect(s.choices).toHaveLength(4);
      expect(s.choices.filter((c) => c.correct)).toHaveLength(1);
    }
  });

  it('shows a flat heart rate with the snake once the amygdala is gone', () => {
    const snake = amygdala.stimuli.find((s) => s.id === 'snake')!;
    expect(snake.damaged.heartRateBpm).toBeLessThan(snake.intact.heartRateBpm);
    expect(snake.damaged.sweat).toBe('none');
  });

  it('loses fear recognition, and only fear recognition, on the fearful face', () => {
    const face = amygdala.stimuli.find((s) => s.id === 'fearful-face')!;
    expect(face.intact.fearRecognized).toBe(true);
    expect(face.damaged.fearRecognized).toBe(false);
  });

  it('frames plasticity as compensation that never reaches full recovery', () => {
    const last = amygdala.plasticity.timeline.at(-1)!;
    expect(last.recoveryFraction).toBeLessThan(1);
    expect(amygdala.plasticity.caveat).toMatch(/not fear regained/);
  });
});
