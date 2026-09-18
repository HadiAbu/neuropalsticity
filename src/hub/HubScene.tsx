import { Html, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { Suspense, useLayoutEffect, useMemo } from 'react';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { hubCopy, levels, type LevelEntry, type Vec3 } from '@content/levels';
import { Lighting } from '@lib/scene/Lighting';
import { SceneLoader } from '@lib/ui/SceneLoader';

const MODEL_URL = '/models/brain.glb';
const DRACO_PATH = '/draco/';

interface HoverProps {
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onEnter: (id: string) => void;
}

const levelForNode = (name: string): LevelEntry | undefined =>
  levels.find((l) => l.anatomy.nodePrefixes?.some((p) => name.startsWith(p)));

function HubBrain({ hoveredId, onHover, onEnter }: HoverProps) {
  const { scene } = useGLTF(MODEL_URL, DRACO_PATH);

  const materials = useMemo(() => {
    const ghost = new THREE.MeshStandardMaterial({ color: '#d9a8b4', roughness: 0.9, transparent: true, opacity: 0.22, depthWrite: false });
    const dim = new THREE.MeshStandardMaterial({ color: '#64748b', emissive: '#334155', emissiveIntensity: 0.25, roughness: 0.8 });
    const dimHover = new THREE.MeshStandardMaterial({ color: '#94a3b8', emissive: '#475569', emissiveIntensity: 0.5, roughness: 0.8 });

    // Each available level gets its own signature color (matching the tint it uses once
    // you're inside it), so regions read as distinct structures at a glance instead of one
    // undifferentiated glowing mass once several levels are unlocked.
    const glowByLevel = new Map<string, THREE.MeshStandardMaterial>();
    const glowHoverByLevel = new Map<string, THREE.MeshStandardMaterial>();
    for (const level of levels) {
      if (level.status !== 'available') continue;
      // A moderate emissive intensity keeps hues legible rather than blown out; the hub's
      // level colors are lower-intensity than the old single uniform-amber value.
      const color = new THREE.Color(level.color);
      glowByLevel.set(level.id, new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.32, roughness: 0.5 }));
      glowHoverByLevel.set(level.id, new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.85, roughness: 0.5 }));
    }

    return { ghost, dim, dimHover, glowByLevel, glowHoverByLevel };
  }, []);

  /** Label anchors for node-based levels: centroid of their matched meshes. */
  const centroids = useMemo(() => {
    const boxes = new Map<string, THREE.Box3>();
    scene.updateMatrixWorld(true);
    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const level = levelForNode(child.name);
      if (!level) return;
      const box = new THREE.Box3().setFromObject(child);
      const existing = boxes.get(level.id);
      boxes.set(level.id, existing ? existing.union(box) : box);
    });
    const out = new Map<string, Vec3>();
    for (const [id, box] of boxes) {
      const c = box.getCenter(new THREE.Vector3());
      out.set(id, [c.x, c.y, c.z]);
    }
    return out;
  }, [scene]);

  useLayoutEffect(() => {
    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const level = levelForNode(child.name);
      if (!level) {
        child.material = materials.ghost;
        return;
      }
      const hovered = level.id === hoveredId;
      child.material =
        level.status === 'available'
          ? (hovered ? materials.glowHoverByLevel : materials.glowByLevel).get(level.id)!
          : hovered ? materials.dimHover : materials.dim;
      child.renderOrder = 1;
    });
  }, [scene, materials, hoveredId]);

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    const level = levelForNode(e.object.name);
    if (level) {
      e.stopPropagation();
      onHover(level.id);
    }
  };
  const onOut = (e: ThreeEvent<PointerEvent>) => {
    const level = levelForNode(e.object.name);
    if (level && level.id === hoveredId) onHover(null);
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    const level = levelForNode(e.object.name);
    if (level?.status === 'available') {
      e.stopPropagation();
      onEnter(level.id);
    }
  };

  const hovered = hoveredId ? levels.find((l) => l.id === hoveredId) : undefined;
  const labelAt: Vec3 | undefined = hovered ? hovered.anatomy.marker ?? centroids.get(hovered.id) : undefined;

  return (
    <>
      <primitive object={scene} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick} />

      {levels
        .filter((l) => l.anatomy.marker)
        .map((l) => {
          const available = l.status === 'available';
          const isHovered = l.id === hoveredId;
          return (
            <mesh
              key={l.id}
              position={l.anatomy.marker}
              renderOrder={2}
              onPointerOver={(e) => { e.stopPropagation(); onHover(l.id); }}
              onPointerOut={() => { if (hoveredId === l.id) onHover(null); }}
              onClick={(e) => { if (available) { e.stopPropagation(); onEnter(l.id); } }}
            >
              <sphereGeometry args={[isHovered ? 5.5 : 4.5, 20, 20]} />
              <meshStandardMaterial
                color={available ? l.color : '#64748b'}
                emissive={available ? l.color : '#334155'}
                emissiveIntensity={isHovered ? 1.3 : available ? 0.55 : 0.6}
              />
            </mesh>
          );
        })}

      {hovered && labelAt && (
        <Html position={labelAt} center distanceFactor={220} style={{ pointerEvents: 'none' }}>
          <div className="whitespace-nowrap rounded-md bg-slate-900/90 px-2.5 py-1.5 text-xs text-slate-100 shadow-lg ring-1 ring-slate-600">
            <span className="font-semibold">{hovered.name}</span>
            {hovered.status !== 'available' && <span className="ml-2 text-slate-400">{hubCopy.comingSoon}</span>}
            {hovered.anatomy.marker && !hovered.anatomy.nodePrefixes && (
              <span className="block text-[10px] text-slate-400">{hubCopy.approximate}</span>
            )}
          </div>
        </Html>
      )}
    </>
  );
}

useGLTF.preload(MODEL_URL, DRACO_PATH);

export function HubScene(props: HoverProps) {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <div className="relative h-full w-full">
      <Canvas dpr={[1, 2]} camera={{ position: [40, 30, 260], fov: 45 }}>
        <Suspense fallback={null}>
          <Lighting />
          <OrbitControls
            enablePan={false}
            autoRotate={!reducedMotion && props.hoveredId === null}
            autoRotateSpeed={0.5}
            minDistance={150}
            maxDistance={400}
          />
          <HubBrain {...props} />
        </Suspense>
      </Canvas>
      <SceneLoader />
    </div>
  );
}
