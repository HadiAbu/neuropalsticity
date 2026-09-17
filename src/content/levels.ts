export type LevelStatus = 'available' | 'coming-soon';
export type Theme = 'regions' | 'drugs' | 'disorders';

export interface LevelEntry {
  id: string;
  name: string;
  plainName: string;
  theme: Theme;
  status: LevelStatus;
}

export const hubCopy = {
  title: 'neuropalsticity',
  tagline: 'Cause a lesion. Predict what breaks. Watch the brain rewire.',
  comingSoon: 'Coming soon',
  enter: 'Play',
};

export const themeTitles: Record<Theme, string> = {
  regions: 'Regions & functions',
  drugs: 'Drugs & the brain',
  disorders: 'Mental illness & brain damage',
};

export const levels: LevelEntry[] = [
  { id: 'motor-cortex', name: 'Primary motor cortex', plainName: 'Movement', theme: 'regions', status: 'available' },
  { id: 'somatosensory-cortex', name: 'Somatosensory cortex', plainName: 'Touch', theme: 'regions', status: 'coming-soon' },
  { id: 'visual-cortex', name: 'Visual cortex', plainName: 'Sight', theme: 'regions', status: 'coming-soon' },
  { id: 'speech-areas', name: "Broca's & Wernicke's areas", plainName: 'Speech', theme: 'regions', status: 'coming-soon' },
  { id: 'prefrontal-cortex', name: 'Prefrontal cortex', plainName: 'Decisions', theme: 'regions', status: 'coming-soon' },
  { id: 'hippocampus', name: 'Hippocampus', plainName: 'Memory', theme: 'regions', status: 'coming-soon' },
  { id: 'amygdala', name: 'Amygdala', plainName: 'Fear', theme: 'regions', status: 'available' },
  { id: 'cerebellum', name: 'Cerebellum', plainName: 'Balance', theme: 'regions', status: 'coming-soon' },
  { id: 'basal-ganglia', name: 'Basal ganglia', plainName: 'Habit & initiation', theme: 'regions', status: 'coming-soon' },
  { id: 'brainstem', name: 'Hypothalamus & brainstem', plainName: 'Survival', theme: 'regions', status: 'coming-soon' },
  { id: 'drugs-classes', name: 'Alcohol, cocaine, morphine', plainName: 'Chemistry', theme: 'drugs', status: 'available' },
];
