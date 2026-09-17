import { useGLTF } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useSimulation } from '@levels/amygdala/useSimulation';

const MODEL_URL = '/models/brain.glb';
const DRACO_PATH = '/draco/';

const isAmygdala = (name: string) => name.startsWith('Amygdala');

export function AmygdalaBrainMesh() {
  const { scene } = useGLTF(MODEL_URL, DRACO_PATH);
  const { state, dispatch } = useSimulation();
  const [hovered, setHovered] = useState(false);

  const materials = useMemo(
    () => ({
      cortex: new THREE.MeshStandardMaterial({ color: '#d9a8b4', roughness: 0.85, metalness: 0 }),
      cortexHover: new THREE.MeshStandardMaterial({
        color: '#e6b8c3', emissive: '#7a3b52', emissiveIntensity: 0.15, roughness: 0.85,
      }),
      ghost: new THREE.MeshStandardMaterial({
        color: '#d9a8b4', roughness: 0.9, transparent: true, opacity: 0.16, depthWrite: false,
      }),
      amygdala: new THREE.MeshStandardMaterial({
        color: '#fbbf24', emissive: '#f59e0b', emissiveIntensity: 0.9, roughness: 0.4,
      }),
    }),
    []
  );

  useLayoutEffect(() => {
    const focused = state.phase !== 'overview';
    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      if (isAmygdala(child.name)) {
        child.material = materials.amygdala;
        child.renderOrder = 1;
        return;
      }
      child.material = focused ? materials.ghost : hovered ? materials.cortexHover : materials.cortex;
    });
  }, [scene, materials, state.phase, hovered]);

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (state.phase !== 'overview') return;
    e.stopPropagation();
    dispatch({ type: 'FOCUS' });
  };

  return (
    <primitive
      object={scene}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    />
  );
}

useGLTF.preload(MODEL_URL, DRACO_PATH);
