import type { BodyPart, Hemisphere, Severity, Source } from '@/types';

export type { BodyPart, Hemisphere, Severity, Source };

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

export interface RecoveryPoint {
  week: number;
  recoveryFraction: number;
}

export interface PlasticityBeat {
  mechanism: string;
  timeline: RecoveryPoint[];
  caveat: string;
}

export interface RegionContent {
  id: string;
  name: string;
  plainName: string;
  overview: string;
  insight: string;
  territories: Territory[];
  scenarios: Scenario[];
  plasticity: PlasticityBeat;
  sources: Source[];
}

const SHARE_TOLERANCE = 1e-6;

export function validateRegionContent(content: RegionContent): string[] {
  const problems: string[] = [];
  const declared = new Set(content.territories.map((t) => t.id));

  const shareSum = content.territories.reduce((sum, t) => sum + t.corticalShare, 0);
  if (Math.abs(shareSum - 1) > SHARE_TOLERANCE) {
    problems.push(`territory corticalShare values must sum to 1 (got ${shareSum})`);
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

  return problems;
}
