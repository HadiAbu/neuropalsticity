import type { BodyPart } from '@content/schema';
import { createSimulation } from '@lib/simulation/createSimulation';

export const { SimulationProvider, useSimulation } = createSimulation<BodyPart, BodyPart>();
