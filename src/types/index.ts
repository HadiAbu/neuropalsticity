export type Severity = 'complete' | 'partial' | 'spared';
export type Hemisphere = 'left' | 'right';

export type BodyPart =
  | 'toes' | 'leg' | 'hip' | 'trunk' | 'shoulder' | 'arm'
  | 'hand' | 'fingers' | 'thumb' | 'neck' | 'face' | 'lips' | 'jaw' | 'tongue';

export interface Source {
  claim: string;
  citation: string;
  url?: string;
}
