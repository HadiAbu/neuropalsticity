import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, type ReactNode } from 'react';
import { Lighting } from '@lib/scene/Lighting';
import { SceneLoader } from '@lib/ui/SceneLoader';

interface Props {
  /** Free orbit is the overview's affordance; focused phases hand the camera to the rig. */
  orbitEnabled: boolean;
  children: ReactNode;
}

export function BrainScene({ orbitEnabled, children }: Props) {
  return (
    <div className="relative h-full w-full">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 250], fov: 45 }}>
        <Suspense fallback={null}>
          <Lighting />
          <OrbitControls enablePan={false} enabled={orbitEnabled} />
          {children}
        </Suspense>
      </Canvas>
      <SceneLoader />
    </div>
  );
}
