import type { ResponseProfile, ThreatContent, ThreatStimulus } from '@content/schema';

export interface ResponseResult {
  stimulus: ThreatStimulus;
  intact: ResponseProfile;
  damaged: ResponseProfile;
  correctChoiceId: string;
}

export function stimulusIds(content: ThreatContent): string[] {
  return content.stimuli.map((s) => s.id);
}

export function resolveResponse(stimulusId: string, content: ThreatContent): ResponseResult {
  const stimulus = content.stimuli.find((s) => s.id === stimulusId);
  if (!stimulus) {
    throw new Error(`no stimulus authored with id "${stimulusId}"`);
  }
  const correct = stimulus.choices.find((c) => c.correct);
  if (!correct) {
    throw new Error(`stimulus "${stimulusId}" has no correct choice`);
  }
  return { stimulus, intact: stimulus.intact, damaged: stimulus.damaged, correctChoiceId: correct.id };
}
