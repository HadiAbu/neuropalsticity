import { useState } from 'react';
import { LevelHub } from '@/hub/LevelHub';
import { MotorCortexLevel } from '@levels/motor-cortex/MotorCortexLevel';
import { SimulationProvider } from '@levels/motor-cortex/useSimulation';

export default function App() {
  const [levelId, setLevelId] = useState<string | null>(null);

  if (levelId !== 'motor-cortex') {
    return <LevelHub onEnter={setLevelId} />;
  }

  // Unmounting the provider on exit resets the simulation for free.
  return (
    <SimulationProvider key={levelId}>
      <MotorCortexLevel onExit={() => setLevelId(null)} />
    </SimulationProvider>
  );
}
