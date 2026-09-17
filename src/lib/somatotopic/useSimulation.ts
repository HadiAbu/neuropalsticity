import type { BodyPart } from '@content/schema';
import { createSimulation } from '@lib/simulation/createSimulation';

/** Shared by every somatotopic level: site and prediction are both a BodyPart. */
export const { SimulationProvider, useSimulation } = createSimulation<BodyPart, BodyPart>();
