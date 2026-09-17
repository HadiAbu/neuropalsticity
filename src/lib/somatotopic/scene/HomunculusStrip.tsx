import { useMemo } from 'react';
import type { BodyPart, SomatotopicContent } from '@content/schema';
import { selectableSites } from '@lib/somatotopic/simulation/resolveDeficit';
import { STRIP_ORIGIN_X, STRIP_ORIGIN_Y, stripLayout } from '@lib/somatotopic/simulation/stripLayout';
import { TerritorySegment } from '@lib/somatotopic/scene/TerritorySegment';
import { useSimulation } from '@lib/somatotopic/useSimulation';

export function HomunculusStrip({ content, onHover }: { content: SomatotopicContent; onHover: (id: BodyPart | null) => void }) {
  const { state, dispatch } = useSimulation();
  const selectable = useMemo(() => new Set(selectableSites(content)), [content]);
  const segments = useMemo(() => stripLayout(content), [content]);

  if (state.phase === 'overview') return null;

  return (
    <group position={[STRIP_ORIGIN_X, STRIP_ORIGIN_Y, 0]}>
      {segments.map(({ territory, offset, length }) => (
        <TerritorySegment
          key={territory.id}
          territory={territory}
          offset={offset}
          length={length}
          selectable={selectable.has(territory.id) && state.phase === 'focused'}
          onSelect={() => dispatch({ type: 'SELECT_SITE', site: territory.id })}
          onHover={onHover}
        />
      ))}
    </group>
  );
}
