import { useState } from 'react';
import { LevelHub } from '@/hub/LevelHub';
import { AmygdalaLevel } from '@levels/amygdala/AmygdalaLevel';
import { SimulationProvider as AmygdalaSimulation } from '@levels/amygdala/useSimulation';
import { DrugsLevel } from '@levels/drugs/DrugsLevel';
import { SimulationProvider as DrugsSimulation } from '@levels/drugs/useSimulation';
import { MotorCortexLevel } from '@levels/motor-cortex/MotorCortexLevel';
import { SomatosensoryCortexLevel } from '@levels/somatosensory-cortex/SomatosensoryCortexLevel';
import { SimulationProvider as SomatotopicSimulation } from '@lib/somatotopic/useSimulation';

export default function App() {
  const [levelId, setLevelId] = useState<string | null>(null);
  const exit = () => setLevelId(null);

  // Unmounting a level's provider on exit resets its simulation for free.
  switch (levelId) {
    case 'motor-cortex':
      return (
        <SomatotopicSimulation key={levelId}>
          <MotorCortexLevel onExit={exit} />
        </SomatotopicSimulation>
      );
    case 'somatosensory-cortex':
      return (
        <SomatotopicSimulation key={levelId}>
          <SomatosensoryCortexLevel onExit={exit} />
        </SomatotopicSimulation>
      );
    case 'amygdala':
      return (
        <AmygdalaSimulation key={levelId}>
          <AmygdalaLevel onExit={exit} />
        </AmygdalaSimulation>
      );
    case 'drugs-classes':
      return (
        <DrugsSimulation key={levelId}>
          <DrugsLevel onExit={exit} />
        </DrugsSimulation>
      );
    default:
      return <LevelHub onEnter={setLevelId} />;
  }
}
