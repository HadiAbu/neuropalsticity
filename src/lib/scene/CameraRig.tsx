import { useFrame, useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { Phase } from '@lib/simulation/machine';

export type Vec3 = [number, number, number];
export interface Framing { position: Vec3; target: Vec3 }

interface Props {
  phase: Phase;
  /** Phases without an entry (typically overview) leave the camera to OrbitControls. */
  framing: Partial<Record<Phase, Framing>>;
}

/**
 * The camera is a consequence of phase. Advancing the phase mid-flight simply
 * retargets the lerp, which is what makes the transition skippable.
 */
export function CameraRig({ phase, framing }: Props) {
  const { camera } = useThree();
  const reducedMotion = usePrefersReducedMotion();
  const target = useMemo(() => new THREE.Vector3(), []);
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const f = framing[phase];
    if (!f) return;
    target.set(...f.position);
    lookAt.set(...f.target);
    const k = reducedMotion ? 1 : 1 - Math.pow(0.001, delta);
    camera.position.lerp(target, k);
    camera.lookAt(lookAt);
  });

  return null;
}
