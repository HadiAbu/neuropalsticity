import type { BodyPart, RegionContent, Territory } from '@content/schema';

export const STRIP_LENGTH = 120;
export const STRIP_ORIGIN_Y = -STRIP_LENGTH / 2 + 40;

export interface StripSegment {
  territory: Territory;
  /** Start of this segment along the strip, medial end at 0. */
  offset: number;
  length: number;
}

export function stripLayout(content: RegionContent): StripSegment[] {
  const ordered = [...content.territories].sort((a, b) => a.order - b.order);
  let cursor = 0;
  return ordered.map((territory) => {
    const length = territory.corticalShare * STRIP_LENGTH;
    const segment: StripSegment = { territory, offset: cursor, length };
    cursor += length;
    return segment;
  });
}

export function segmentCenter(content: RegionContent, part: BodyPart): number | null {
  const segment = stripLayout(content).find((s) => s.territory.id === part);
  return segment ? segment.offset + segment.length / 2 : null;
}
