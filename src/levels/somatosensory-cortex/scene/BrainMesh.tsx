import { useGLTF } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import type { Hemisphere } from '@content/schema';
import { useSimulation } from '@lib/somatotopic/useSimulation';

const MODEL_URL = '/models/brain.glb';
const DRACO_PATH = '/draco/';

const isGyrus = (name: string) => name.startsWith('PostcentralGyrus');
const gyrusFor = (h: Hemisphere) => (h === 'left' ? 'PostcentralGyrus_L' : 'PostcentralGyrus_R');

export function BrainMesh() {
  const { scene } = useGLTF(MODEL_URL, DRACO_PATH);
  const { state, dispatch } = useSimulation();
  const [hovered, setHovered] = useState(false);

  const materials = useMemo(
    () => ({
      cortex: new THREE.MeshStandardMaterial({ color: '#d9a8b4', roughness: 0.85, metalness: 0 }),
      gyrusIdle: new THREE.MeshStandardMaterial({
        color: '#86efac', emissive: '#15803d', emissiveIntensity: 0.3, roughness: 0.5,
      }),
      gyrusActive: new THREE.MeshStandardMaterial({
        color: '#4ade80', emissive: '#16a34a', emissiveIntensity: 0.8, roughness: 0.5,
      }),
      gyrusHover: new THREE.MeshStandardMaterial({
        color: '#bbf7d0', emissive: '#16a34a', emissiveIntensity: 1.2, roughness: 0.5,
      }),
    }),
    []
  );

  useLayoutEffect(() => {
    const active = gyrusFor(state.hemisphere);
    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      if (!isGyrus(child.name)) {
        child.material = materials.cortex;
        return;
      }
      const isActive = child.name === active;
      child.material = isActive
        ? hovered && state.phase === 'overview' ? materials.gyrusHover : materials.gyrusActive
        : materials.gyrusIdle;
    });
  }, [scene, materials, state.hemisphere, state.phase, hovered]);

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (state.phase !== 'overview' || !isGyrus(e.object.name)) return;
    e.stopPropagation();
    dispatch({ type: 'FOCUS' });
  };

  return (
    <primitive
      object={scene}
      onClick={onClick}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => setHovered(isGyrus(e.object.name))}
      onPointerOut={() => setHovered(false)}
    />
  );
}

useGLTF.preload(MODEL_URL, DRACO_PATH);
