import type { PharmacologicContent, Substance, SynapseState } from '@content/schema';

export interface EffectResult {
  substance: Substance;
  correctChoiceId: string;
}

export function substanceIds(content: PharmacologicContent): string[] {
  return content.substances.map((s) => s.id);
}

export function resolveEffect(substanceId: string, content: PharmacologicContent): EffectResult {
  const substance = content.substances.find((s) => s.id === substanceId);
  if (!substance) {
    throw new Error(`no substance authored with id "${substanceId}"`);
  }
  const correct = substance.choices.find((c) => c.correct);
  if (!correct) {
    throw new Error(`substance "${substanceId}" has no correct choice`);
  }
  return { substance, correctChoiceId: correct.id };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * The abstinent synapse during recovery. Receptor density climbs back from the tolerant
 * level toward normal as `recoveryFraction` rises; the cleft carries ordinary transmitter;
 * activation is what those receptors can do with an ordinary signal.
 */
export function rehabSynapse(substance: Substance, recoveryFraction: number): SynapseState {
  const t = Math.min(1, Math.max(0, recoveryFraction));
  const { baseline, tolerant } = substance.synapse;
  const receptorDensity = lerp(tolerant.receptorDensity, baseline.receptorDensity, t);
  return {
    transmitterInCleft: baseline.transmitterInCleft,
    receptorDensity,
    receptorActivation: baseline.receptorActivation * receptorDensity,
  };
}
