import { describe, it, expect } from 'vitest';
import { validateRegionContent } from '@content/schema';
import somatosensoryCortex from '@content/regions/somatosensory-cortex';

describe('somatosensory cortex content', () => {
  it('conforms to the region schema', () => {
    expect(validateRegionContent(somatosensoryCortex)).toEqual([]);
  });

  it('declares all 14 territories in medial-to-lateral order', () => {
    const ordered = [...somatosensoryCortex.territories].sort((a, b) => a.order - b.order);
    expect(ordered.map((t) => t.id)).toEqual([
      'toes', 'leg', 'hip', 'trunk', 'shoulder', 'arm',
      'hand', 'fingers', 'thumb', 'neck', 'face', 'lips', 'jaw', 'tongue',
    ]);
  });

  it('gives lips, fingers, and tongue more cortical territory than trunk and hip', () => {
    const share = (id: string) =>
      somatosensoryCortex.territories.find((t) => t.id === id)!.corticalShare;
    expect(share('lips')).toBeGreaterThan(share('trunk'));
    expect(share('fingers')).toBeGreaterThan(share('hip'));
    expect(share('tongue')).toBeGreaterThan(share('trunk'));
  });

  it('ships exactly the three specified scenarios', () => {
    expect(somatosensoryCortex.scenarios.map((s) => s.id)).toEqual([
      'hand-astereognosis', 'lateral-mca', 'medial-aca',
    ]);
  });

  it('spares the leg in the lateral MCA scenario', () => {
    const mca = somatosensoryCortex.scenarios.find((s) => s.id === 'lateral-mca')!;
    expect(mca.deficits.find((d) => d.part === 'leg')?.severity).toBe('spared');
  });

  it('spares the hand in the medial ACA scenario', () => {
    const aca = somatosensoryCortex.scenarios.find((s) => s.id === 'medial-aca')!;
    expect(aca.deficits.find((d) => d.part === 'hand')?.severity).toBe('spared');
  });

  it('describes recovery as steepest early and never complete', () => {
    const t = somatosensoryCortex.plasticity.timeline;
    const firstGain = t[1].recoveryFraction - t[0].recoveryFraction;
    const lastGain = t[t.length - 1].recoveryFraction - t[t.length - 2].recoveryFraction;
    expect(firstGain).toBeGreaterThan(lastGain);
    expect(t[t.length - 1].recoveryFraction).toBeLessThan(1);
  });
});
