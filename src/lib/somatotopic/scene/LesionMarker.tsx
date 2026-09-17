import { useMemo } from 'react';
import type { SomatotopicContent } from '@content/schema';
import { recoveryAt } from '@lib/simulation/recovery';
import { STRIP_ORIGIN_X, STRIP_ORIGIN_Y, segmentCenter } from '@lib/somatotopic/simulation/stripLayout';
import { useSimulation } from '@lib/somatotopic/useSimulation';

export function LesionMarker({ content }: { content: SomatotopicContent }) {
  const { state } = useSimulation();

  const offset = useMemo(
    () => (state.site ? segmentCenter(content, state.site) : null),
    [content, state.site]
  );

  if (offset === null) return null;

  const haloRadius = 7 + recoveryAt(content, state.rehabWeek) * 10;

  return (
    <group position={[STRIP_ORIGIN_X, STRIP_ORIGIN_Y, 0]}>
      <mesh position={[0, offset, 8]}>
        <sphereGeometry args={[7, 24, 24]} />
        <meshStandardMaterial color="#7f1d1d" emissive="#dc2626" emissiveIntensity={0.6} />
      </mesh>
      {state.phase === 'rehab' && (
        <mesh position={[0, offset, 8]}>
          <sphereGeometry args={[haloRadius, 24, 24]} />
          <meshStandardMaterial color="#22c55e" transparent opacity={0.25} />
        </mesh>
      )}
    </group>
  );
}
