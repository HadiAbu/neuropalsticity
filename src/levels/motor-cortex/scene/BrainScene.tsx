import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, type ReactNode } from 'react';
import { BrainMesh } from '@levels/motor-cortex/scene/BrainMesh';
import { Lighting } from '@levels/motor-cortex/scene/Lighting';
import { SceneLoader } from '@levels/motor-cortex/ui/SceneLoader';
import { useSimulation } from '@levels/motor-cortex/useSimulation';

function PhaseAwareControls() {
  const { state } = useSimulation();
  return <OrbitControls enablePan={false} enabled={state.phase === 'overview'} />;
}

export function BrainScene({ children }: { children?: ReactNode }) {
  return (
    <div className="relative h-full w-full">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 250], fov: 45 }}>
        <Suspense fallback={null}>
          <Lighting />
          <BrainMesh />
          <PhaseAwareControls />
          {children}
        </Suspense>
      </Canvas>
      <SceneLoader />
    </div>
  );
}
