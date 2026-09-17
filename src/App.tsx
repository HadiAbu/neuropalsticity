import { useState } from 'react';
import { LevelHub } from '@/hub/LevelHub';
import { AmygdalaLevel } from '@levels/amygdala/AmygdalaLevel';
import { SimulationProvider as AmygdalaSimulation } from '@levels/amygdala/useSimulation';
import { MotorCortexLevel } from '@levels/motor-cortex/MotorCortexLevel';
import { SimulationProvider as MotorSimulation } from '@levels/motor-cortex/useSimulation';

export default function App() {
  const [levelId, setLevelId] = useState<string | null>(null);
  const exit = () => setLevelId(null);

  // Unmounting a level's provider on exit resets its simulation for free.
  switch (levelId) {
    case 'motor-cortex':
      return (
        <MotorSimulation key={levelId}>
          <MotorCortexLevel onExit={exit} />
        </MotorSimulation>
      );
    case 'amygdala':
      return (
        <AmygdalaSimulation key={levelId}>
          <AmygdalaLevel onExit={exit} />
        </AmygdalaSimulation>
      );
    default:
      return <LevelHub onEnter={setLevelId} />;
  }
}
