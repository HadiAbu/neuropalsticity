import { useMemo } from 'react';
import motorCortex from '@content/regions/motor-cortex';
import type { BodyPart } from '@content/schema';
import { selectableSites } from '@levels/motor-cortex/simulation/resolveDeficit';
import { STRIP_ORIGIN_X, STRIP_ORIGIN_Y, stripLayout } from '@levels/motor-cortex/simulation/stripLayout';
import { TerritorySegment } from '@levels/motor-cortex/scene/TerritorySegment';
import { useSimulation } from '@levels/motor-cortex/useSimulation';

export function HomunculusStrip({ onHover }: { onHover: (id: BodyPart | null) => void }) {
  const { state, dispatch } = useSimulation();
  const selectable = useMemo(() => new Set(selectableSites(motorCortex)), []);
  const segments = useMemo(() => stripLayout(motorCortex), []);

  if (state.phase === 'overview') return null;

  return (
    <group position={[STRIP_ORIGIN_X, STRIP_ORIGIN_Y, 0]}>
      {segments.map(({ territory, offset, length }) => (
        <TerritorySegment
          key={territory.id}
          territory={territory}
          offset={offset}
          length={length}
          selectable={selectable.has(territory.id) && state.phase === 'stripFocused'}
          onSelect={() => dispatch({ type: 'SELECT_LESION', site: territory.id })}
          onHover={onHover}
        />
      ))}
    </group>
  );
}
