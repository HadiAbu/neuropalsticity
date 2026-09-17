import { createSimulation } from '@lib/simulation/createSimulation';

/** Site is a stimulus id; choice is a prediction choice id. */
export const { SimulationProvider, useSimulation } = createSimulation<string, string>();
