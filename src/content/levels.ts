export type LevelStatus = 'available' | 'coming-soon';
export type Theme = 'regions' | 'drugs' | 'disorders';
export type Vec3 = [number, number, number];

/** Where a level lives on the shared brain mesh: real node prefixes, an approximate marker, or both. */
export interface Anatomy {
  nodePrefixes?: string[];
  marker?: Vec3;
}

export interface LevelEntry {
  id: string;
  name: string;
  plainName: string;
  theme: Theme;
  status: LevelStatus;
  anatomy: Anatomy;
  /** Signature hex color for this level's glow — matches the tint used inside the level itself. */
  color: string;
}

export const hubCopy = {
  title: 'neuropalsticity',
  tagline: 'Cause a lesion. Predict what breaks. Watch the brain rewire.',
  comingSoon: 'Coming soon',
  enter: 'Play',
  approximate: 'approximate position',
  hint: 'Drag to turn the brain. Glowing regions are playable.',
};

export const themeTitles: Record<Theme, string> = {
  regions: 'Regions & functions',
  drugs: 'Drugs & the brain',
  disorders: 'Mental illness & brain damage',
};

export const levels: LevelEntry[] = [
  { id: 'motor-cortex', name: 'Primary motor cortex', plainName: 'Movement', theme: 'regions', status: 'available',
    anatomy: { nodePrefixes: ['PrecentralGyrus'] }, color: '#38bdf8' },
  { id: 'somatosensory-cortex', name: 'Somatosensory cortex', plainName: 'Touch', theme: 'regions', status: 'available',
    anatomy: { nodePrefixes: ['PostcentralGyrus'] }, color: '#4ade80' },
  { id: 'visual-cortex', name: 'Visual cortex', plainName: 'Sight', theme: 'regions', status: 'coming-soon',
    anatomy: { marker: [0, 5, -70] }, color: '#f87171' },
  { id: 'speech-areas', name: "Broca's & Wernicke's areas", plainName: 'Speech', theme: 'regions', status: 'coming-soon',
    anatomy: { marker: [-33, 5, 25] }, color: '#fb7185' },
  { id: 'prefrontal-cortex', name: 'Prefrontal cortex', plainName: 'Decisions', theme: 'regions', status: 'coming-soon',
    anatomy: { marker: [0, 25, 55] }, color: '#a3e635' },
  { id: 'hippocampus', name: 'Hippocampus', plainName: 'Memory', theme: 'regions', status: 'available',
    anatomy: { nodePrefixes: ['Hippocampus'] }, color: '#6366f1' },
  { id: 'amygdala', name: 'Amygdala', plainName: 'Fear', theme: 'regions', status: 'available',
    anatomy: { nodePrefixes: ['Amygdala'] }, color: '#fbbf24' },
  { id: 'cerebellum', name: 'Cerebellum', plainName: 'Balance', theme: 'regions', status: 'available',
    anatomy: { nodePrefixes: ['Cerebellum'] }, color: '#5eead4' },
  { id: 'basal-ganglia', name: 'Basal ganglia', plainName: 'Habit & initiation', theme: 'regions', status: 'coming-soon',
    anatomy: { marker: [-22, -8, 8] }, color: '#fb923c' },
  { id: 'brainstem', name: 'Hypothalamus & brainstem', plainName: 'Survival', theme: 'regions', status: 'coming-soon',
    anatomy: { marker: [0, -50, -12] }, color: '#22d3ee' },
  { id: 'drugs-classes', name: 'Alcohol, cocaine, morphine', plainName: 'Chemistry', theme: 'drugs', status: 'available',
    anatomy: { nodePrefixes: ['Caudate', 'Putamen'], marker: [0, -18, -6] }, color: '#f472b6' },
  { id: 'parkinsons', name: "Parkinson's disease", plainName: 'Movement disorder', theme: 'disorders', status: 'available',
    anatomy: { nodePrefixes: ['Caudate', 'Putamen'], marker: [0, -20, -9] }, color: '#fb923c' },
];
