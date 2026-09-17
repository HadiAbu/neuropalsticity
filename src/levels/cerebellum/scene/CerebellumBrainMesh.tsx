import { useGLTF } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useSimulation } from '@levels/cerebellum/useSimulation';

const MODEL_URL = '/models/brain.glb';
const DRACO_PATH = '/draco/';

const isCerebellum = (name: string) => name.startsWith('Cerebellum');

export function CerebellumBrainMesh() {
  const { scene } = useGLTF(MODEL_URL, DRACO_PATH);
  const { state, dispatch } = useSimulation();
  const [hovered, setHovered] = useState(false);

  const materials = useMemo(
    () => ({
      cortex: new THREE.MeshStandardMaterial({ color: '#d9a8b4', roughness: 0.85, metalness: 0 }),
      cerebellumIdle: new THREE.MeshStandardMaterial({
        color: '#5eead4', emissive: '#0d9488', emissiveIntensity: 0.4, roughness: 0.6,
      }),
      cerebellumHover: new THREE.MeshStandardMaterial({
        color: '#99f6e4', emissive: '#14b8a6', emissiveIntensity: 1, roughness: 0.6,
      }),
    }),
    []
  );

  useLayoutEffect(() => {
    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      if (isCerebellum(child.name)) {
        child.material = hovered && state.phase === 'overview' ? materials.cerebellumHover : materials.cerebellumIdle;
        child.renderOrder = 1;
        return;
      }
      child.material = materials.cortex;
    });
  }, [scene, materials, state.phase, hovered]);

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (state.phase !== 'overview' || !isCerebellum(e.object.name)) return;
    e.stopPropagation();
    dispatch({ type: 'FOCUS' });
  };

  return (
    <primitive
      object={scene}
      onClick={onClick}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => setHovered(isCerebellum(e.object.name))}
      onPointerOut={() => setHovered(false)}
    />
  );
}

useGLTF.preload(MODEL_URL, DRACO_PATH);
