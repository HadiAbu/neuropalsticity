import { useGLTF } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useSimulation } from '@levels/drugs/useSimulation';

const MODEL_URL = '/models/brain.glb';
const DRACO_PATH = '/draco/';

const isStriatum = (name: string) => name.startsWith('Caudate') || name.startsWith('Putamen');

/** Midbrain position in the mesh frame — approximate, and labelled so in the UI. */
const VTA_POSITION: [number, number, number] = [0, -18, -6];

export function DrugsBrainMesh() {
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
      hidden: new THREE.MeshStandardMaterial({ visible: false }),
      striatum: new THREE.MeshStandardMaterial({
        color: '#f472b6', emissive: '#db2777', emissiveIntensity: 0.7, roughness: 0.45,
      }),
    }),
    []
  );

  useLayoutEffect(() => {
    const focused = state.phase !== 'overview';
    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      if (isStriatum(child.name)) {
        child.material = focused ? materials.striatum : materials.hidden;
        child.renderOrder = 1;
        return;
      }
      if (child.name.startsWith('Amygdala')) {
        child.material = materials.hidden;
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
    <>
      <primitive
        object={scene}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
      {state.phase !== 'overview' && (
        <mesh position={VTA_POSITION} renderOrder={1}>
          <sphereGeometry args={[5, 24, 24]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1} />
        </mesh>
      )}
    </>
  );
}

useGLTF.preload(MODEL_URL, DRACO_PATH);
