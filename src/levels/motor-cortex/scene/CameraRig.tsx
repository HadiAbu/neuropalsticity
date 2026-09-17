import { useFrame, useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { Phase } from '@levels/motor-cortex/simulation/machine';
import { useSimulation } from '@levels/motor-cortex/useSimulation';

type Vec3 = [number, number, number];
interface Framing { position: Vec3; target: Vec3 }

const FOCUSED: Framing = { position: [80, 50, 215], target: [45, 15, 0] };

const FRAMING: Record<Exclude<Phase, 'overview'>, Framing> = {
  stripFocused: FOCUSED,
  predicting: FOCUSED,
  revealed: FOCUSED,
  rehab: FOCUSED,
};

/**
 * The camera is a consequence of phase. In `overview` OrbitControls owns it;
 * in every other phase this rig flies it to that phase's framing. Advancing the
 * phase mid-flight simply retargets the lerp, which is what makes it skippable.
 */
export function CameraRig() {
  const { state } = useSimulation();
  const { camera } = useThree();
  const reducedMotion = usePrefersReducedMotion();
  const target = useMemo(() => new THREE.Vector3(), []);
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    if (state.phase === 'overview') return;
    const framing = FRAMING[state.phase];
    target.set(...framing.position);
    lookAt.set(...framing.target);
    const k = reducedMotion ? 1 : 1 - Math.pow(0.001, delta);
    camera.position.lerp(target, k);
    camera.lookAt(lookAt);
  });

  return null;
}
