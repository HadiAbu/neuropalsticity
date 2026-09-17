import type { Phase } from '@levels/motor-cortex/simulation/machine';

export interface FlowStep {
  phase: Phase;
  label: string;
}

/** The five beats every scenario-driven level moves through. */
export const FLOW_STEPS: FlowStep[] = [
  { phase: 'overview', label: 'Explore' },
  { phase: 'stripFocused', label: 'Focus' },
  { phase: 'predicting', label: 'Predict' },
  { phase: 'revealed', label: 'Reveal' },
  { phase: 'rehab', label: 'Rewire' },
];

export const flowCopy = {
  railLabel: 'Level progress',
  exit: 'Exit to levels',
};
