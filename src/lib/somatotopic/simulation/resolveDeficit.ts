import type { BodyPart, DeficitEntry, Hemisphere, SomatotopicContent } from '@content/schema';

export interface DeficitResult {
  /** Always contralateral to the lesioned hemisphere. */
  side: Hemisphere;
  scenarioId: string;
  /** Ordered medial → lateral, matching the strip. */
  entries: DeficitEntry[];
}

export function selectableSites(content: SomatotopicContent): BodyPart[] {
  return content.scenarios.map((s) => s.siteTerritory);
}

export function resolveDeficit(
  site: BodyPart,
  content: SomatotopicContent,
  hemisphere: Hemisphere
): DeficitResult {
  const scenario = content.scenarios.find((s) => s.siteTerritory === site);
  if (!scenario) {
    throw new Error(`no scenario authored for territory "${site}"`);
  }

  const orderOf = new Map(content.territories.map((t) => [t.id, t.order]));
  const entries = [...scenario.deficits].sort(
    (a, b) => (orderOf.get(a.part) ?? 0) - (orderOf.get(b.part) ?? 0)
  );

  return {
    side: hemisphere === 'left' ? 'right' : 'left',
    scenarioId: scenario.id,
    entries,
  };
}
