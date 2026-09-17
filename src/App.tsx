import { MotorCortexLevel } from '@levels/motor-cortex/MotorCortexLevel';
import { SimulationProvider } from '@levels/motor-cortex/useSimulation';

export default function App() {
  return (
    <SimulationProvider>
      <MotorCortexLevel />
    </SimulationProvider>
  );
}
