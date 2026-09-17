import type { BodyPart, Hemisphere, Severity, Source } from '@/types';

export type { BodyPart, Hemisphere, Severity, Source };

// ---------------------------------------------------------------------------
// Shared envelope
// ---------------------------------------------------------------------------

export interface RecoveryPoint {
  week: number;
  recoveryFraction: number;
}

export interface PlasticityBeat {
  mechanism: string;
  timeline: RecoveryPoint[];
  caveat: string;
}

export interface RegionBase {
  id: string;
  name: string;
  plainName: string;
  overview: string;
  insight: string;
  plasticity: PlasticityBeat;
  sources: Source[];
}

// ---------------------------------------------------------------------------
// Somatotopic mechanic (motor cortex)
// ---------------------------------------------------------------------------

export interface Territory {
  id: BodyPart;
  label: string;
  /** 0–1 share of strip length. Encodes the homunculus distortion. */
  corticalShare: number;
  /** Position along the strip, medial (0) → lateral. */
  order: number;
}

export interface DeficitEntry {
  part: BodyPart;
  severity: Severity;
}

export interface Scenario {
  id: string;
  label: string;
  siteTerritory: BodyPart;
  deficits: DeficitEntry[];
  dayToDay: string;
  surprise?: string;
  sources: Source[];
}

export interface SomatotopicMechanic {
  kind: 'somatotopic';
  territories: Territory[];
  scenarios: Scenario[];
}

// ---------------------------------------------------------------------------
// Threat mechanic (amygdala)
// ---------------------------------------------------------------------------

export type Sweat = 'none' | 'mild' | 'strong';

export interface ResponseProfile {
  heartRateBpm: number;
  sweat: Sweat;
  behavior: string;
  report: string;
  /** Only meaningful for social stimuli such as a fearful face. */
  fearRecognized?: boolean;
}

export interface PredictionChoice {
  id: string;
  label: string;
  correct: boolean;
}

/**
 * The shared shape behind every "predict how a damaged region responds to a scenario"
 * mechanic: a situation, a guess, and the intact-vs-damaged comparison that follows.
 * Threat (amygdala) and memory (hippocampus) both build on this; the domain-specific
 * meaning lives in `Profile`, not in this envelope.
 */
export interface ScenarioTrial<Profile> {
  id: string;
  label: string;
  description: string;
  choices: PredictionChoice[];
  intact: Profile;
  damaged: Profile;
  explanation: string;
  dayToDay: string;
  sources: Source[];
}

export type ThreatStimulus = ScenarioTrial<ResponseProfile>;

export interface ThreatMechanic {
  kind: 'threat';
  premise: string;
  stimuli: ThreatStimulus[];
}

// ---------------------------------------------------------------------------
// Memory mechanic (hippocampus)
// ---------------------------------------------------------------------------

export interface MemoryProfile {
  formsNewMemory: boolean;
  retainsOldMemories: boolean;
  learnsSkillsProcedurally: boolean;
  behavior: string;
  report: string;
}

export type MemoryTrial = ScenarioTrial<MemoryProfile>;

export interface MemoryMechanic {
  kind: 'memory';
  premise: string;
  trials: MemoryTrial[];
}

// ---------------------------------------------------------------------------
// Pharmacologic mechanic (drugs & the brain)
// ---------------------------------------------------------------------------

export type Transmitter = 'GABA' | 'dopamine' | 'endorphin';
export type DrugAction = 'enhances-receptor' | 'blocks-reuptake' | 'mimics-transmitter';
export type DrugClass = 'depressant' | 'stimulant' | 'opioid';

export interface SynapseState {
  /** 0–1: transmitter sitting in the cleft. */
  transmitterInCleft: number;
  /** 0–1: fraction of expressed receptors currently activated. */
  receptorActivation: number;
  /** 0–1: receptors the postsynaptic cell expresses (1 = normal; tolerance pulls it down). */
  receptorDensity: number;
}

export interface EffectProfile {
  heartRateBpm: number;
  reactionTimeMs: number;
  mood: string;
  behavior: string;
  report: string;
}

export interface Substance {
  id: string;
  label: string;
  drugClass: DrugClass;
  scenario: string;
  transmitter: Transmitter;
  action: DrugAction;
  synapse: { baseline: SynapseState; acute: SynapseState; tolerant: SynapseState };
  choices: PredictionChoice[];
  sober: EffectProfile;
  acute: EffectProfile;
  explanation: string;
  adaptation: string;
  dayToDay: string;
  sources: Source[];
}

export interface PharmacologicMechanic {
  kind: 'pharmacologic';
  pathway: string;
  substances: Substance[];
}

// ---------------------------------------------------------------------------
// Union
// ---------------------------------------------------------------------------

export type SomatotopicContent = RegionBase & SomatotopicMechanic;
export type ThreatContent = RegionBase & ThreatMechanic;
export type PharmacologicContent = RegionBase & PharmacologicMechanic;
export type MemoryContent = RegionBase & MemoryMechanic;
export type RegionContent = SomatotopicContent | ThreatContent | PharmacologicContent | MemoryContent;

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const SHARE_TOLERANCE = 1e-6;
const HEART_RATE_MIN = 30;
const HEART_RATE_MAX = 220;

function validateBase(content: RegionBase): string[] {
  const problems: string[] = [];
  const timeline = content.plasticity.timeline;

  if (timeline.length === 0 || timeline[0].week !== 0) {
    problems.push('plasticity timeline must start at week 0');
  }
  for (let i = 1; i < timeline.length; i++) {
    if (timeline[i].week <= timeline[i - 1].week) {
      problems.push('plasticity timeline weeks must strictly increase');
      break;
    }
  }
  for (const p of timeline) {
    if (p.recoveryFraction < 0 || p.recoveryFraction > 1) {
      problems.push(
        `plasticity recoveryFraction must be between 0 and 1 (got ${p.recoveryFraction} at week ${p.week})`
      );
    }
  }
  return problems;
}

function validateSomatotopic(content: SomatotopicContent): string[] {
  const problems: string[] = [];
  const ids = content.territories.map((t) => t.id);
  const declared = new Set(ids);

  if (declared.size !== ids.length) {
    problems.push('territory ids must be unique');
  }

  const shareSum = content.territories.reduce((sum, t) => sum + t.corticalShare, 0);
  if (Math.abs(shareSum - 1) > SHARE_TOLERANCE) {
    problems.push(`territory corticalShare values must sum to 1 (got ${shareSum})`);
  }
  for (const t of content.territories) {
    if (t.corticalShare < 0 || t.corticalShare > 1) {
      problems.push(`territory "${t.id}" corticalShare must be between 0 and 1 (got ${t.corticalShare})`);
    }
  }

  const orders = content.territories.map((t) => t.order);
  if (new Set(orders).size !== orders.length) {
    problems.push('territory order values must be unique');
  }

  for (const scenario of content.scenarios) {
    if (!declared.has(scenario.siteTerritory)) {
      problems.push(
        `scenario ${scenario.id} targets territory "${scenario.siteTerritory}" which is not declared`
      );
    }
    if (scenario.sources.length === 0) {
      problems.push(`scenario ${scenario.id} has no sources`);
    }
    for (const deficit of scenario.deficits) {
      if (!declared.has(deficit.part)) {
        problems.push(
          `scenario ${scenario.id} describes a deficit in "${deficit.part}" which is not declared`
        );
      }
    }
  }
  return problems;
}

function heartRateProblem(label: string, bpm: number): string[] {
  if (bpm < HEART_RATE_MIN || bpm > HEART_RATE_MAX) {
    return [`${label} heartRateBpm must be between ${HEART_RATE_MIN} and ${HEART_RATE_MAX} (got ${bpm})`];
  }
  return [];
}

function validateProfile(stimulusId: string, which: 'intact' | 'damaged', profile: ResponseProfile | undefined): string[] {
  if (!profile) return [`stimulus ${stimulusId} is missing a ${which} profile`];
  return heartRateProblem(`stimulus ${stimulusId} ${which}`, profile.heartRateBpm);
}

function validateChoices(label: string, choices: PredictionChoice[]): string[] {
  const problems: string[] = [];
  if (choices.length < 2) problems.push(`${label} must have at least two choices`);
  const correct = choices.filter((c) => c.correct).length;
  if (correct !== 1) problems.push(`${label} must have exactly one correct choice (got ${correct})`);
  return problems;
}

/**
 * The checks every ScenarioTrial needs regardless of its Profile type: unique ids,
 * a well-formed choice set, and at least one source per trial. Domain-specific profile
 * checks (heart rate ranges, etc.) are the caller's job — pass them as `validateProfiles`.
 */
function validateScenarioTrials<Profile>(
  idNoun: string,
  trials: ScenarioTrial<Profile>[],
  validateProfiles: (label: string, trial: ScenarioTrial<Profile>) => string[]
): string[] {
  const problems: string[] = [];
  const ids = trials.map((t) => t.id);
  if (new Set(ids).size !== ids.length) {
    problems.push(`${idNoun} ids must be unique`);
  }

  for (const trial of trials) {
    const label = `${idNoun} ${trial.id}`;
    problems.push(...validateChoices(label, trial.choices));
    problems.push(...validateProfiles(label, trial));
    if (trial.sources.length === 0) {
      problems.push(`${label} has no sources`);
    }
  }
  return problems;
}

function validatePharmacologic(content: PharmacologicContent): string[] {
  const problems: string[] = [];
  const ids = content.substances.map((s) => s.id);
  if (new Set(ids).size !== ids.length) {
    problems.push('substance ids must be unique');
  }

  for (const s of content.substances) {
    const label = `substance ${s.id}`;
    problems.push(...validateChoices(label, s.choices));
    problems.push(...heartRateProblem(`${label} sober`, s.sober.heartRateBpm));
    problems.push(...heartRateProblem(`${label} acute`, s.acute.heartRateBpm));
    for (const stateName of ['baseline', 'acute', 'tolerant'] as const) {
      const state = s.synapse[stateName];
      for (const field of ['transmitterInCleft', 'receptorActivation', 'receptorDensity'] as const) {
        const v = state[field];
        if (v < 0 || v > 1) {
          problems.push(`${label} synapse.${stateName}.${field} must be between 0 and 1 (got ${v})`);
        }
      }
    }
    if (s.sources.length === 0) {
      problems.push(`${label} has no sources`);
    }
  }
  return problems;
}

function validateThreat(content: ThreatContent): string[] {
  return validateScenarioTrials('stimulus', content.stimuli, (_label, stimulus) => [
    ...validateProfile(stimulus.id, 'intact', stimulus.intact),
    ...validateProfile(stimulus.id, 'damaged', stimulus.damaged),
  ]);
}

function validateMemory(content: MemoryContent): string[] {
  return validateScenarioTrials('trial', content.trials, (_label, trial) => {
    const problems: string[] = [];
    if (!trial.intact) problems.push(`trial ${trial.id} is missing an intact profile`);
    if (!trial.damaged) problems.push(`trial ${trial.id} is missing a damaged profile`);
    return problems;
  });
}

export function validateRegionContent(content: RegionContent): string[] {
  const problems = validateBase(content);
  switch (content.kind) {
    case 'somatotopic':
      problems.push(...validateSomatotopic(content));
      break;
    case 'threat':
      problems.push(...validateThreat(content));
      break;
    case 'pharmacologic':
      problems.push(...validatePharmacologic(content));
      break;
    case 'memory':
      problems.push(...validateMemory(content));
      break;
  }
  return problems;
}
