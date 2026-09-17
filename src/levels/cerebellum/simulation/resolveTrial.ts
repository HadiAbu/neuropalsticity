import type { CoordinationContent, CoordinationTrial } from '@content/schema';

export interface TrialResult {
  trial: CoordinationTrial;
  correctChoiceId: string;
}

export function trialIds(content: CoordinationContent): string[] {
  return content.trials.map((t) => t.id);
}

export function resolveTrial(trialId: string, content: CoordinationContent): TrialResult {
  const trial = content.trials.find((t) => t.id === trialId);
  if (!trial) {
    throw new Error(`no trial authored with id "${trialId}"`);
  }
  const correct = trial.choices.find((c) => c.correct);
  if (!correct) {
    throw new Error(`trial "${trialId}" has no correct choice`);
  }
  return { trial, correctChoiceId: correct.id };
}
