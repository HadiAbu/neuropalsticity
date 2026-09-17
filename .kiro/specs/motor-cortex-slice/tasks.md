# Motor Cortex Slice — Tasks

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps
> use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the motor cortex vertical slice — 3D brain, homunculus reveal, three lesion
scenarios with a prediction beat, deficit visualization, and a closing neuroplasticity
timeline — proving the full pipeline before scaling to the remaining regions.

**Architecture:** Client-side React app, one route, one level. Content is typed data in
`src/content/`; simulation is a pure reducer plus a pure deficit resolver in
`src/levels/motor-cortex/simulation/`; 3D scene and 2D overlay consume both. The simulation
layer imports nothing from the scene layer, so all logic is testable with no canvas mounted.

**Tech Stack:** React 19, TypeScript (strict), Vite, React Three Fiber + drei, Tailwind CSS,
Vitest.

**Spec:** `.kiro/specs/motor-cortex-slice/requirements.md` and `design.md`
**Steering:** `.kiro/steering/{product,tech,structure}.md`

## Global Constraints

- Client-side only. No backend, no API, no database. _Requirement: 10.1_
- The shipped build makes no LLM API calls. _Requirement: 10.2_
- No progress persistence between sessions. _Requirement: 10.3_
- No state library. Simulation is `useReducer` + context. (steering/tech.md)
- TypeScript strict mode. No `any`.
- All user-facing copy lives in `src/content/`, never inline in a component. _Requirement: 8.1_
- Verification per milestone: `npm run test`, `npm run build`, plus a **manual browser check**
  for all 3D and visual work. No Playwright, no Docker. _Requirement: 10.4_
- Always import via path aliases (`@content/*`, `@levels/*`, `@lib/*`, `@/*`), never relative
  paths that climb directories. Shared types import from `@/types` — there is no `@types`
  alias, as that name collides with TypeScript's ambient package namespace.

## Task Order Note

The spec calls the 3D asset question the project's largest risk and says resolve it first.
Task 1 is nonetheless the scaffold, because the spike's real proof is "this mesh renders in
*our* R3F canvas" — which needs a canvas to exist. Task 1 is small and mechanical; Task 2 is
the risk. Do not proceed past Task 2 without a resolved asset decision.

---

### Task 1: Project scaffold

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`,
  `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`
- Create: `src/lib/smoke.ts`, `src/lib/smoke.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: path aliases `@/*`, `@content/*`, `@levels/*`, `@lib/*`, `@components/*`,
  `@types/*`; scripts `dev`, `build`, `preview`, `test`, `lint`.

- [ ] **Step 1: Scaffold Vite + React + TS**

```bash
npm create vite@latest . -- --template react-ts
npm install
```

- [ ] **Step 2: Install runtime and dev dependencies**

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three vitest @tailwindcss/vite tailwindcss
```

Install current stable versions. Do not pin guessed version numbers.

- [ ] **Step 3: Configure Vite with aliases, Tailwind, and Vitest**

Replace `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@content': fileURLToPath(new URL('./src/content', import.meta.url)),
      '@levels': fileURLToPath(new URL('./src/levels', import.meta.url)),
      '@lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

If `@tailwindcss/vite` is unavailable in the installed Tailwind major, use that version's
documented Vite setup instead and keep the rest of this config identical.

- [ ] **Step 4: Mirror aliases in `tsconfig.app.json`**

Add inside `compilerOptions`:

```json
"baseUrl": ".",
"paths": {
  "@/*": ["src/*"],
  "@content/*": ["src/content/*"],
  "@levels/*": ["src/levels/*"],
  "@lib/*": ["src/lib/*"],
  "@components/*": ["src/components/*"]
}
```

There is deliberately **no `@types/*` alias**. TypeScript treats `@types` as the ambient
package namespace, so an alias by that name invites `@types/index` resolving to
`node_modules/@types`. Shared types are imported as `@/types` instead.

Confirm `"strict": true` is present. Add `"noImplicitAny": true` and
`"strictNullChecks": true` explicitly.

- [ ] **Step 5: Add the `test` script**

In `package.json` `"scripts"`, add:

```json
"test": "vitest run"
```

- [ ] **Step 6: Write a failing smoke test**

Create `src/lib/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { scaffoldOk } from '@lib/smoke';

describe('scaffold', () => {
  it('resolves path aliases and runs vitest', () => {
    expect(scaffoldOk()).toBe(true);
  });
});
```

- [ ] **Step 7: Run it and watch it fail**

Run: `npm run test`
Expected: FAIL — cannot resolve `@lib/smoke`.

- [ ] **Step 8: Make it pass**

Create `src/lib/smoke.ts`:

```ts
export function scaffoldOk(): boolean {
  return true;
}
```

- [ ] **Step 9: Verify test and build both pass**

Run: `npm run test` → Expected: PASS
Run: `npm run build` → Expected: succeeds with no type errors

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TS + R3F + Tailwind + Vitest"
```

_Requirement: 10.1, 10.4_

---

### Task 2: 3D asset spike and license record

This task is an **investigation with a decision as its deliverable**, not a feature. It
resolves the spec's single largest unverified assumption before any dependent work starts.

**Files:**
- Create: `public/models/` (chosen `.glb` lands here)
- Create: `docs/ASSET_LICENSE.md`
- Create: `docs/decisions/001-brain-mesh.md`

**Interfaces:**
- Produces: a committed brain mesh at a known path, and a recorded decision of either
  `separable-gyrus` or `procedural-strip` that Tasks 8–9 branch on.

- [ ] **Step 1: Evaluate candidate meshes against the spec's four criteria**

Starting candidates: Z-Anatomy, BodyParts3D, and open neuroimaging-derived surface meshes.
For each, record:

1. License — does it permit use here, and are its attribution / share-alike terms acceptable?
2. Is the precentral gyrus separable as its own mesh, or extractable by label / vertex group?
3. Poly count after decimation — workable for real-time web?
4. Does it export cleanly to glTF/GLB?

- [ ] **Step 2: Record the decision**

Create `docs/decisions/001-brain-mesh.md` stating the model chosen, its source URL, its
license, the four criteria answers, and — explicitly — `strategy: separable-gyrus` or
`strategy: procedural-strip`.

Per the design, the procedural fallback is **not a lesser outcome**. If no candidate has a
separable gyrus, take the best whole-brain mesh for anatomical form and plan to generate the
motor strip as a ribbon geometry in code.

- [ ] **Step 3: Record the license in full**

Create `docs/ASSET_LICENSE.md` with the model's name, author, source URL, license name, and
the full attribution string the license requires. If the license is share-alike, note what
that obligates for this repository.

- [ ] **Step 4: Commit the mesh and prove it loads**

Place the optimized GLB at `public/models/brain.glb`. Temporarily render it to confirm it
loads in our canvas:

```tsx
// src/App.tsx — temporary verification only, replaced in Task 7
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Brain() {
  const { scene } = useGLTF('/models/brain.glb');
  return <primitive object={scene} />;
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 250] }}>
      <ambientLight intensity={1} />
      <Brain />
      <OrbitControls />
    </Canvas>
  );
}
```

- [ ] **Step 5: Manual browser check**

Run: `npm run dev`
Confirm by eye: the brain loads, is recognizably a brain, and rotates without stutter. Note
its scale and orientation in the decision record — Task 7 needs both for camera placement.

- [ ] **Step 6: Commit**

```bash
git add public/models docs src/App.tsx
git commit -m "feat: add brain mesh, license record, and asset strategy decision"
```

_Requirement: 1.2, 1.3_

---

### Task 3: Shared types and content schema

**Files:**
- Create: `src/types/index.ts`
- Create: `src/content/schema.ts`
- Test: `src/content/schema.test.ts`

**Interfaces:**
- Produces: `BodyPart`, `Severity`, `Hemisphere`, `Source`, `Territory`, `DeficitEntry`,
  `Scenario`, `PlasticityBeat`, `RegionContent`, and
  `validateRegionContent(content: RegionContent): string[]` returning an array of problem
  descriptions — empty means valid.

- [ ] **Step 1: Write the failing test**

Create `src/content/schema.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { validateRegionContent } from '@content/schema';
import type { RegionContent } from '@content/schema';

const minimal: RegionContent = {
  id: 'test',
  name: 'Test Region',
  plainName: 'test region',
  overview: 'overview',
  insight: 'insight',
  territories: [
    { id: 'hand', label: 'Hand', corticalShare: 0.6, order: 0 },
    { id: 'leg', label: 'Leg', corticalShare: 0.4, order: 1 },
  ],
  scenarios: [
    {
      id: 's1',
      label: 'Scenario',
      siteTerritory: 'hand',
      deficits: [{ part: 'hand', severity: 'complete' }],
      dayToDay: 'text',
      sources: [{ claim: 'c', citation: 'cite' }],
    },
  ],
  plasticity: {
    mechanism: 'mechanism',
    timeline: [
      { week: 0, recoveryFraction: 0 },
      { week: 4, recoveryFraction: 0.3 },
    ],
    caveat: 'partial and variable',
  },
  sources: [{ claim: 'c', citation: 'cite' }],
};

describe('validateRegionContent', () => {
  it('accepts well-formed content', () => {
    expect(validateRegionContent(minimal)).toEqual([]);
  });

  it('rejects cortical shares that do not sum to 1', () => {
    const bad = {
      ...minimal,
      territories: [{ id: 'hand', label: 'Hand', corticalShare: 0.5, order: 0 }],
    } satisfies RegionContent;
    expect(validateRegionContent(bad)).toContain(
      'territory corticalShare values must sum to 1 (got 0.5)'
    );
  });

  it('rejects a scenario whose site is not a declared territory', () => {
    const bad = {
      ...minimal,
      scenarios: [{ ...minimal.scenarios[0], siteTerritory: 'tongue' as const }],
    } satisfies RegionContent;
    expect(validateRegionContent(bad)).toContain(
      'scenario s1 targets territory "tongue" which is not declared'
    );
  });

  it('rejects duplicate territory order values', () => {
    const bad = {
      ...minimal,
      territories: [
        { id: 'hand', label: 'Hand', corticalShare: 0.6, order: 0 },
        { id: 'leg', label: 'Leg', corticalShare: 0.4, order: 0 },
      ],
    } satisfies RegionContent;
    expect(validateRegionContent(bad)).toContain('territory order values must be unique');
  });

  it('rejects a scenario with no sourced claims', () => {
    const bad = {
      ...minimal,
      scenarios: [{ ...minimal.scenarios[0], sources: [] }],
    } satisfies RegionContent;
    expect(validateRegionContent(bad)).toContain('scenario s1 has no sources');
  });

  it('rejects a plasticity timeline that does not start at week 0', () => {
    const bad = {
      ...minimal,
      plasticity: {
        ...minimal.plasticity,
        timeline: [{ week: 2, recoveryFraction: 0.1 }],
      },
    } satisfies RegionContent;
    expect(validateRegionContent(bad)).toContain('plasticity timeline must start at week 0');
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npm run test`
Expected: FAIL — cannot resolve `@content/schema`.

- [ ] **Step 3: Write the types**

Create `src/types/index.ts`:

```ts
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
```

- [ ] **Step 4: Write the schema and validator**

Create `src/content/schema.ts`:

```ts
import type { BodyPart, Hemisphere, Severity, Source } from '@/types';

export type { BodyPart, Hemisphere, Severity, Source };

export interface Territory {
  id: BodyPart;
  label: string;
  /** 0–1 share of strip length. Encodes the homunculus distortion. */
  corticalShare: number;
  /** Position along the strip, medial (0) → lateral. */
  order: number;
}

export interface DeficitEntry {
  part: BodyPart;
  severity: Severity;
}

export interface Scenario {
  id: string;
  label: string;
  siteTerritory: BodyPart;
  deficits: DeficitEntry[];
  dayToDay: string;
  surprise?: string;
  sources: Source[];
}

export interface RecoveryPoint {
  week: number;
  recoveryFraction: number;
}

export interface PlasticityBeat {
  mechanism: string;
  timeline: RecoveryPoint[];
  caveat: string;
}

export interface RegionContent {
  id: string;
  name: string;
  plainName: string;
  overview: string;
  insight: string;
  territories: Territory[];
  scenarios: Scenario[];
  plasticity: PlasticityBeat;
  sources: Source[];
}

const SHARE_TOLERANCE = 1e-6;

export function validateRegionContent(content: RegionContent): string[] {
  const problems: string[] = [];
  const declared = new Set(content.territories.map((t) => t.id));

  const shareSum = content.territories.reduce((sum, t) => sum + t.corticalShare, 0);
  if (Math.abs(shareSum - 1) > SHARE_TOLERANCE) {
    problems.push(`territory corticalShare values must sum to 1 (got ${shareSum})`);
  }

  const orders = content.territories.map((t) => t.order);
  if (new Set(orders).size !== orders.length) {
    problems.push('territory order values must be unique');
  }

  for (const scenario of content.scenarios) {
    if (!declared.has(scenario.siteTerritory)) {
      problems.push(
        `scenario ${scenario.id} targets territory "${scenario.siteTerritory}" which is not declared`
      );
    }
    if (scenario.sources.length === 0) {
      problems.push(`scenario ${scenario.id} has no sources`);
    }
    for (const deficit of scenario.deficits) {
      if (!declared.has(deficit.part)) {
        problems.push(
          `scenario ${scenario.id} describes a deficit in "${deficit.part}" which is not declared`
        );
      }
    }
  }

  const timeline = content.plasticity.timeline;
  if (timeline.length === 0 || timeline[0].week !== 0) {
    problems.push('plasticity timeline must start at week 0');
  }
  for (let i = 1; i < timeline.length; i++) {
    if (timeline[i].week <= timeline[i - 1].week) {
      problems.push('plasticity timeline weeks must strictly increase');
      break;
    }
  }

  return problems;
}
```

- [ ] **Step 5: Run the tests**

Run: `npm run test`
Expected: PASS — all six schema cases.

- [ ] **Step 6: Commit**

```bash
git add src/types src/content
git commit -m "feat: add shared types and region content schema with validation"
```

_Requirement: 8.2, 8.3, 8.4_

---

### Task 4: Motor cortex content file

**Files:**
- Create: `src/content/regions/motor-cortex.ts`
- Test: `src/content/regions/motor-cortex.test.ts`

**Interfaces:**
- Consumes: `RegionContent`, `validateRegionContent` from Task 3.
- Produces: default export `motorCortex: RegionContent` with 14 territories and exactly three
  scenarios with ids `hand-knob`, `lateral-mca`, `medial-aca`.

- [ ] **Step 1: Write the failing test**

Create `src/content/regions/motor-cortex.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { validateRegionContent } from '@content/schema';
import motorCortex from '@content/regions/motor-cortex';

describe('motor cortex content', () => {
  it('conforms to the region schema', () => {
    expect(validateRegionContent(motorCortex)).toEqual([]);
  });

  it('declares all 14 territories in medial-to-lateral order', () => {
    const ordered = [...motorCortex.territories].sort((a, b) => a.order - b.order);
    expect(ordered.map((t) => t.id)).toEqual([
      'toes', 'leg', 'hip', 'trunk', 'shoulder', 'arm',
      'hand', 'fingers', 'thumb', 'neck', 'face', 'lips', 'jaw', 'tongue',
    ]);
  });

  it('gives hand, fingers and face more cortical territory than trunk and hip', () => {
    const share = (id: string) =>
      motorCortex.territories.find((t) => t.id === id)!.corticalShare;
    expect(share('hand')).toBeGreaterThan(share('trunk'));
    expect(share('fingers')).toBeGreaterThan(share('hip'));
    expect(share('face')).toBeGreaterThan(share('trunk'));
  });

  it('ships exactly the three specified scenarios', () => {
    expect(motorCortex.scenarios.map((s) => s.id)).toEqual([
      'hand-knob', 'lateral-mca', 'medial-aca',
    ]);
  });

  it('spares the leg in the lateral MCA scenario', () => {
    const mca = motorCortex.scenarios.find((s) => s.id === 'lateral-mca')!;
    expect(mca.deficits.find((d) => d.part === 'leg')?.severity).toBe('spared');
  });

  it('spares the hand in the medial ACA scenario', () => {
    const aca = motorCortex.scenarios.find((s) => s.id === 'medial-aca')!;
    expect(aca.deficits.find((d) => d.part === 'hand')?.severity).toBe('spared');
  });

  it('describes recovery as steepest early and never complete', () => {
    const t = motorCortex.plasticity.timeline;
    const firstGain = t[1].recoveryFraction - t[0].recoveryFraction;
    const lastGain = t[t.length - 1].recoveryFraction - t[t.length - 2].recoveryFraction;
    expect(firstGain).toBeGreaterThan(lastGain);
    expect(t[t.length - 1].recoveryFraction).toBeLessThan(1);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npm run test`
Expected: FAIL — cannot resolve `@content/regions/motor-cortex`.

- [ ] **Step 3: Author the content**

Create `src/content/regions/motor-cortex.ts`:

```ts
import type { RegionContent } from '@content/schema';

const motorCortex: RegionContent = {
  id: 'motor-cortex',
  name: 'Primary motor cortex (precentral gyrus)',
  plainName: 'the motor cortex',
  overview:
    'A strip of cortex running over the top of your brain, just in front of the deep ' +
    'groove that separates the front half from the back. It sends the commands that ' +
    'move your body.',
  insight:
    'The strip is a map of your body — but a wildly distorted one. Cortical space is ' +
    'handed out by precision of control, not by body size. Your hand and lips need ' +
    'exquisitely fine control, so they command huge stretches of cortex. Your torso, ' +
    'which mostly moves in bulk, barely gets a sliver.',
  territories: [
    { id: 'toes',     label: 'Toes',     corticalShare: 0.03, order: 0 },
    { id: 'leg',      label: 'Leg',      corticalShare: 0.05, order: 1 },
    { id: 'hip',      label: 'Hip',      corticalShare: 0.03, order: 2 },
    { id: 'trunk',    label: 'Trunk',    corticalShare: 0.04, order: 3 },
    { id: 'shoulder', label: 'Shoulder', corticalShare: 0.04, order: 4 },
    { id: 'arm',      label: 'Arm',      corticalShare: 0.05, order: 5 },
    { id: 'hand',     label: 'Hand',     corticalShare: 0.13, order: 6 },
    { id: 'fingers',  label: 'Fingers',  corticalShare: 0.12, order: 7 },
    { id: 'thumb',    label: 'Thumb',    corticalShare: 0.08, order: 8 },
    { id: 'neck',     label: 'Neck',     corticalShare: 0.03, order: 9 },
    { id: 'face',     label: 'Face',     corticalShare: 0.11, order: 10 },
    { id: 'lips',     label: 'Lips',     corticalShare: 0.13, order: 11 },
    { id: 'jaw',      label: 'Jaw',      corticalShare: 0.07, order: 12 },
    { id: 'tongue',   label: 'Tongue',   corticalShare: 0.09, order: 13 },
  ],
  scenarios: [
    {
      id: 'hand-knob',
      label: 'A small stroke in the hand-knob',
      siteTerritory: 'hand',
      deficits: [
        { part: 'hand', severity: 'complete' },
        { part: 'fingers', severity: 'complete' },
        { part: 'thumb', severity: 'partial' },
        { part: 'arm', severity: 'spared' },
        { part: 'shoulder', severity: 'spared' },
        { part: 'face', severity: 'spared' },
        { part: 'leg', severity: 'spared' },
        { part: 'toes', severity: 'spared' },
      ],
      dayToDay:
        'Buttons, keys and cutlery become impossible on that side, while the arm itself ' +
        'lifts and reaches normally. People often assume they have trapped a nerve in ' +
        'their wrist.',
      surprise:
        'A lesion the size of a pea, in the right spot, can paralyse just the fingers — ' +
        'so convincingly that it mimics a pinched nerve in the arm rather than a stroke ' +
        'in the brain.',
      sources: [
        {
          claim:
            'Small lesions of the hand-knob area of motor cortex can produce isolated hand ' +
            'weakness resembling a peripheral nerve palsy.',
          citation: 'Selective hand motor cortex lesions masquerading as peripheral palsy',
          url: 'https://journals.lww.com/annalsofian/fulltext/2020/23050/selective_hand_motor_cortex_lesions_masquerading.25.aspx',
        },
      ],
    },
    {
      id: 'lateral-mca',
      label: 'A middle cerebral artery stroke',
      siteTerritory: 'face',
      deficits: [
        { part: 'face', severity: 'complete' },
        { part: 'lips', severity: 'complete' },
        { part: 'jaw', severity: 'partial' },
        { part: 'tongue', severity: 'partial' },
        { part: 'neck', severity: 'partial' },
        { part: 'arm', severity: 'complete' },
        { part: 'hand', severity: 'partial' },
        { part: 'fingers', severity: 'partial' },
        { part: 'thumb', severity: 'partial' },
        { part: 'shoulder', severity: 'partial' },
        { part: 'trunk', severity: 'spared' },
        { part: 'hip', severity: 'spared' },
        { part: 'leg', severity: 'spared' },
        { part: 'toes', severity: 'spared' },
      ],
      dayToDay:
        'One side of the face droops and the arm hangs heavy, but the person can often ' +
        'still walk — which is exactly why this pattern is so frequently missed at first.',
      surprise:
        'The leg is spared for a reason that has nothing to do with the map: the leg ' +
        'territory sits over the midline and is fed by a different artery entirely.',
      sources: [
        {
          claim:
            'Middle cerebral artery strokes affecting the lateral motor strip cause ' +
            'contralateral face and arm weakness with relative sparing of the leg.',
          citation: 'Stroke in the motor cortex — patterns of deficit',
          url: 'https://www.flintrehab.com/stroke-in-the-motor-cortex/',
        },
      ],
    },
    {
      id: 'medial-aca',
      label: 'An anterior cerebral artery stroke',
      siteTerritory: 'leg',
      deficits: [
        { part: 'toes', severity: 'complete' },
        { part: 'leg', severity: 'complete' },
        { part: 'hip', severity: 'partial' },
        { part: 'trunk', severity: 'partial' },
        { part: 'shoulder', severity: 'spared' },
        { part: 'arm', severity: 'spared' },
        { part: 'hand', severity: 'spared' },
        { part: 'fingers', severity: 'spared' },
        { part: 'face', severity: 'spared' },
        { part: 'lips', severity: 'spared' },
      ],
      dayToDay:
        'The leg gives way and walking becomes unsafe, while the hand on that same side ' +
        'still writes and grips normally — the mirror image of the more familiar stroke.',
      sources: [
        {
          claim:
            'Lesions of the medial motor strip, in anterior cerebral artery territory, ' +
            'produce contralateral leg-dominant weakness.',
          citation: 'Primary motor cortex — somatotopic organisation and lesion effects',
          url: 'https://www.sciencedirect.com/topics/medicine-and-dentistry/primary-motor-cortex',
        },
      ],
    },
  ],
  plasticity: {
    mechanism:
      'Use-dependent plasticity. Cortex next door to the damage gradually takes over ' +
      'some of the lost territory — but only for movements that are actually practised, ' +
      'over and over. This is why rehab is repetitive to the point of tedium.',
    timeline: [
      { week: 0, recoveryFraction: 0 },
      { week: 1, recoveryFraction: 0.08 },
      { week: 2, recoveryFraction: 0.18 },
      { week: 4, recoveryFraction: 0.35 },
      { week: 8, recoveryFraction: 0.52 },
      { week: 12, recoveryFraction: 0.63 },
      { week: 24, recoveryFraction: 0.7 },
    ],
    caveat:
      'Recovery is partial and varies enormously between people. The steepest gains come ' +
      'early, and progress slows rather than stopping. This is a hopeful picture, not a ' +
      'promised one.',
  },
  sources: [
    {
      claim:
        'The motor homunculus allocates cortical area by precision of control rather than ' +
        'body size.',
      citation: 'Primary motor cortex — somatotopic organisation',
      url: 'https://www.sciencedirect.com/topics/medicine-and-dentistry/primary-motor-cortex',
    },
  ],
};

export default motorCortex;
```

- [ ] **Step 4: Run the tests**

Run: `npm run test`
Expected: PASS — all seven content cases plus the schema suite.

- [ ] **Step 5: Commit**

```bash
git add src/content/regions
git commit -m "feat: author motor cortex region content with sourced scenarios"
```

_Requirement: 3.2, 3.3, 4.1, 4.5, 7.4, 8.1, 8.5_

---

### Task 5: Deficit resolution and selectable sites

**Files:**
- Create: `src/levels/motor-cortex/simulation/resolveDeficit.ts`
- Test: `src/levels/motor-cortex/simulation/resolveDeficit.test.ts`

**Interfaces:**
- Consumes: `RegionContent`, `BodyPart`, `Hemisphere`, `DeficitEntry` from Task 3;
  `motorCortex` from Task 4.
- Produces:
  - `resolveDeficit(site: BodyPart, content: RegionContent, hemisphere: Hemisphere): DeficitResult`
  - `interface DeficitResult { side: Hemisphere; scenarioId: string; entries: DeficitEntry[] }`
  - `selectableSites(content: RegionContent): BodyPart[]`

- [ ] **Step 1: Write the failing test**

Create `src/levels/motor-cortex/simulation/resolveDeficit.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import motorCortex from '@content/regions/motor-cortex';
import { resolveDeficit, selectableSites } from '@levels/motor-cortex/simulation/resolveDeficit';

describe('selectableSites', () => {
  it('derives selectable territories from authored scenarios', () => {
    expect(selectableSites(motorCortex).sort()).toEqual(['face', 'hand', 'leg']);
  });
});

describe('resolveDeficit', () => {
  it('produces deficits on the opposite side from a left hemisphere lesion', () => {
    expect(resolveDeficit('hand', motorCortex, 'left').side).toBe('right');
  });

  it('produces deficits on the opposite side from a right hemisphere lesion', () => {
    expect(resolveDeficit('hand', motorCortex, 'right').side).toBe('left');
  });

  it('matches the lesion site to its authored scenario', () => {
    expect(resolveDeficit('face', motorCortex, 'left').scenarioId).toBe('lateral-mca');
    expect(resolveDeficit('leg', motorCortex, 'left').scenarioId).toBe('medial-aca');
  });

  it('orders entries medial to lateral', () => {
    const { entries } = resolveDeficit('leg', motorCortex, 'left');
    const orderOf = (part: string) =>
      motorCortex.territories.find((t) => t.id === part)!.order;
    const orders = entries.map((e) => orderOf(e.part));
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it('carries severity through unchanged', () => {
    const { entries } = resolveDeficit('hand', motorCortex, 'left');
    expect(entries.find((e) => e.part === 'fingers')?.severity).toBe('complete');
    expect(entries.find((e) => e.part === 'arm')?.severity).toBe('spared');
  });

  it('throws when asked for a site with no authored scenario', () => {
    expect(() => resolveDeficit('tongue', motorCortex, 'left')).toThrow(
      'no scenario authored for territory "tongue"'
    );
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npm run test`
Expected: FAIL — cannot resolve `resolveDeficit`.

- [ ] **Step 3: Implement**

Create `src/levels/motor-cortex/simulation/resolveDeficit.ts`:

```ts
import type { BodyPart, DeficitEntry, Hemisphere, RegionContent } from '@content/schema';

export interface DeficitResult {
  /** Always contralateral to the lesioned hemisphere. */
  side: Hemisphere;
  scenarioId: string;
  /** Ordered medial → lateral, matching the strip. */
  entries: DeficitEntry[];
}

export function selectableSites(content: RegionContent): BodyPart[] {
  return content.scenarios.map((s) => s.siteTerritory);
}

export function resolveDeficit(
  site: BodyPart,
  content: RegionContent,
  hemisphere: Hemisphere
): DeficitResult {
  const scenario = content.scenarios.find((s) => s.siteTerritory === site);
  if (!scenario) {
    throw new Error(`no scenario authored for territory "${site}"`);
  }

  const orderOf = new Map(content.territories.map((t) => [t.id, t.order]));
  const entries = [...scenario.deficits].sort(
    (a, b) => (orderOf.get(a.part) ?? 0) - (orderOf.get(b.part) ?? 0)
  );

  return {
    side: hemisphere === 'left' ? 'right' : 'left',
    scenarioId: scenario.id,
    entries,
  };
}
```

- [ ] **Step 4: Run the tests**

Run: `npm run test`
Expected: PASS — all seven cases.

- [ ] **Step 5: Commit**

```bash
git add src/levels/motor-cortex/simulation
git commit -m "feat: add pure deficit resolution with contralateral mapping"
```

_Requirement: 4.2.1, 4.3, 6.5_

---

### Task 6: Simulation state machine

**Files:**
- Create: `src/levels/motor-cortex/simulation/machine.ts`
- Test: `src/levels/motor-cortex/simulation/machine.test.ts`

**Interfaces:**
- Consumes: `BodyPart`, `Hemisphere` from Task 3.
- Produces: `Phase`, `SimState`, `SimAction`, `initialState`,
  `simReducer(state: SimState, action: SimAction): SimState`.

- [ ] **Step 1: Write the failing test**

Create `src/levels/motor-cortex/simulation/machine.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { simReducer, initialState } from '@levels/motor-cortex/simulation/machine';
import type { SimState } from '@levels/motor-cortex/simulation/machine';

const at = (phase: SimState['phase'], overrides: Partial<SimState> = {}): SimState => ({
  ...initialState,
  phase,
  ...overrides,
});

describe('simReducer', () => {
  it('starts in overview with nothing selected', () => {
    expect(initialState.phase).toBe('overview');
    expect(initialState.lesionSite).toBeNull();
    expect(initialState.prediction).toBeNull();
  });

  it('focuses the strip from overview', () => {
    expect(simReducer(initialState, { type: 'FOCUS_STRIP' }).phase).toBe('stripFocused');
  });

  it('returns to overview and clears the scenario', () => {
    const state = at('revealed', { lesionSite: 'hand', prediction: 'arm' });
    const next = simReducer(state, { type: 'RETURN_TO_OVERVIEW' });
    expect(next.phase).toBe('overview');
    expect(next.lesionSite).toBeNull();
    expect(next.prediction).toBeNull();
  });

  it('selects a lesion and moves to predicting', () => {
    const next = simReducer(at('stripFocused'), { type: 'SELECT_LESION', site: 'hand' });
    expect(next.phase).toBe('predicting');
    expect(next.lesionSite).toBe('hand');
  });

  it('records a prediction and reveals', () => {
    const next = simReducer(at('predicting', { lesionSite: 'hand' }), {
      type: 'SUBMIT_PREDICTION',
      part: 'fingers',
    });
    expect(next.phase).toBe('revealed');
    expect(next.prediction).toBe('fingers');
  });

  it('skips prediction straight to revealed with no prediction recorded', () => {
    const next = simReducer(at('predicting', { lesionSite: 'hand' }), {
      type: 'SKIP_PREDICTION',
    });
    expect(next.phase).toBe('revealed');
    expect(next.prediction).toBeNull();
  });

  it('advances to rehab at week 0', () => {
    const next = simReducer(at('revealed', { lesionSite: 'hand' }), {
      type: 'ADVANCE_TO_REHAB',
    });
    expect(next.phase).toBe('rehab');
    expect(next.rehabWeek).toBe(0);
  });

  it('scrubs the rehab week', () => {
    const next = simReducer(at('rehab', { lesionSite: 'hand' }), {
      type: 'SET_REHAB_WEEK',
      week: 8,
    });
    expect(next.rehabWeek).toBe(8);
  });

  it('resets to stripFocused without leaving the level', () => {
    const state = at('rehab', { lesionSite: 'hand', prediction: 'arm', rehabWeek: 12 });
    const next = simReducer(state, { type: 'RESET_SCENARIO' });
    expect(next.phase).toBe('stripFocused');
    expect(next.lesionSite).toBeNull();
    expect(next.prediction).toBeNull();
    expect(next.rehabWeek).toBe(0);
  });

  it('ignores actions that do not apply to the current phase', () => {
    const state = at('overview');
    expect(simReducer(state, { type: 'SELECT_LESION', site: 'hand' })).toBe(state);
    expect(simReducer(state, { type: 'SET_REHAB_WEEK', week: 4 })).toBe(state);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npm run test`
Expected: FAIL — cannot resolve `machine`.

- [ ] **Step 3: Implement**

Create `src/levels/motor-cortex/simulation/machine.ts`:

```ts
import type { BodyPart, Hemisphere } from '@content/schema';

export type Phase = 'overview' | 'stripFocused' | 'predicting' | 'revealed' | 'rehab';

export interface SimState {
  phase: Phase;
  hemisphere: Hemisphere;
  lesionSite: BodyPart | null;
  prediction: BodyPart | null;
  rehabWeek: number;
}

export type SimAction =
  | { type: 'FOCUS_STRIP' }
  | { type: 'RETURN_TO_OVERVIEW' }
  | { type: 'SELECT_LESION'; site: BodyPart }
  | { type: 'SUBMIT_PREDICTION'; part: BodyPart }
  | { type: 'SKIP_PREDICTION' }
  | { type: 'ADVANCE_TO_REHAB' }
  | { type: 'SET_REHAB_WEEK'; week: number }
  | { type: 'RESET_SCENARIO' };

export const initialState: SimState = {
  phase: 'overview',
  hemisphere: 'left',
  lesionSite: null,
  prediction: null,
  rehabWeek: 0,
};

export function simReducer(state: SimState, action: SimAction): SimState {
  switch (action.type) {
    case 'FOCUS_STRIP':
      return state.phase === 'overview' ? { ...state, phase: 'stripFocused' } : state;

    case 'RETURN_TO_OVERVIEW':
      return { ...initialState, hemisphere: state.hemisphere };

    case 'SELECT_LESION':
      return state.phase === 'stripFocused'
        ? { ...state, phase: 'predicting', lesionSite: action.site }
        : state;

    case 'SUBMIT_PREDICTION':
      return state.phase === 'predicting'
        ? { ...state, phase: 'revealed', prediction: action.part }
        : state;

    case 'SKIP_PREDICTION':
      return state.phase === 'predicting' ? { ...state, phase: 'revealed' } : state;

    case 'ADVANCE_TO_REHAB':
      return state.phase === 'revealed' ? { ...state, phase: 'rehab', rehabWeek: 0 } : state;

    case 'SET_REHAB_WEEK':
      return state.phase === 'rehab' ? { ...state, rehabWeek: action.week } : state;

    case 'RESET_SCENARIO':
      return {
        ...initialState,
        phase: 'stripFocused',
        hemisphere: state.hemisphere,
      };
  }
}
```

- [ ] **Step 4: Run the tests**

Run: `npm run test`
Expected: PASS — all ten transition cases.

- [ ] **Step 5: Commit**

```bash
git add src/levels/motor-cortex/simulation/machine.ts src/levels/motor-cortex/simulation/machine.test.ts
git commit -m "feat: add simulation state machine with skip and reset transitions"
```

_Requirement: 2.3, 4.6, 5.3_

---

### Task 7: Scene foundation

**Files:**
- Create: `src/levels/motor-cortex/scene/BrainScene.tsx`, `BrainMesh.tsx`, `Lighting.tsx`
- Create: `src/levels/motor-cortex/ui/SceneLoader.tsx`
- Modify: `src/App.tsx` (replace the Task 2 temporary verification render)

**Interfaces:**
- Consumes: `public/models/brain.glb` and the orientation/scale notes from Task 2.
- Produces: `<BrainScene />` — a self-contained canvas that any phase-aware content mounts
  inside.

- [ ] **Step 1: Build the loading fallback**

Create `src/levels/motor-cortex/ui/SceneLoader.tsx`:

```tsx
export function SceneLoader() {
  return (
    <div
      role="status"
      aria-label="Loading the brain model"
      className="absolute inset-0 grid place-items-center text-slate-400"
    >
      Loading the brain…
    </div>
  );
}
```

This renders outside the canvas, so the page never shows a blank canvas while assets load.

- [ ] **Step 2: Build the lighting**

Create `src/levels/motor-cortex/scene/Lighting.tsx`:

```tsx
export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <directionalLight position={[-6, -2, -4]} intensity={0.4} />
    </>
  );
}
```

Key light plus a cool fill. Stylized, readable form — not a clinical flat render.

- [ ] **Step 3: Build the brain mesh with a stylized material**

Create `src/levels/motor-cortex/scene/BrainMesh.tsx`:

```tsx
import { useGLTF } from '@react-three/drei';
import { useLayoutEffect, useMemo } from 'react';
import * as THREE from 'three';

export function BrainMesh() {
  const { scene } = useGLTF('/models/brain.glb');

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#d9a8b4',
        roughness: 0.85,
        metalness: 0,
      }),
    []
  );

  useLayoutEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });
  }, [scene, material]);

  return <primitive object={scene} />;
}

useGLTF.preload('/models/brain.glb');
```

A single shared material instance across all meshes, per the steering performance note.
Tune `color` and `roughness` by eye in Step 5 — stylized but honest, not photoreal.

- [ ] **Step 4: Compose the canvas**

Create `src/levels/motor-cortex/scene/BrainScene.tsx`:

```tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, type ReactNode } from 'react';
import { BrainMesh } from '@levels/motor-cortex/scene/BrainMesh';
import { Lighting } from '@levels/motor-cortex/scene/Lighting';
import { SceneLoader } from '@levels/motor-cortex/ui/SceneLoader';

export function BrainScene({ children }: { children?: ReactNode }) {
  return (
    <div className="relative h-full w-full">
      <Suspense fallback={<SceneLoader />}>
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 250], fov: 45 }}>
          <Lighting />
          <BrainMesh />
          <OrbitControls enablePan={false} />
          {children}
        </Canvas>
      </Suspense>
    </div>
  );
}
```

`dpr={[1, 2]}` caps retina rendering. Adjust `camera.position` to the scale recorded in the
Task 2 decision record.

- [ ] **Step 5: Wire it into the app and check it by eye**

Replace `src/App.tsx`:

```tsx
import { BrainScene } from '@levels/motor-cortex/scene/BrainScene';

export default function App() {
  return (
    <main className="h-screen w-screen bg-slate-900">
      <BrainScene />
    </main>
  );
}
```

Run: `npm run dev`
Confirm by eye: the brain is framed sensibly on load, rotates smoothly, the material reads as
stylized rather than plastic or photoreal, and the loading text appears before the mesh does.
Iterate on material and light values until it looks right. **Do not skip this** — no unit test
can tell you the brain looks good.

- [ ] **Step 6: Verify the build**

Run: `npm run build` → Expected: succeeds with no type errors.

- [ ] **Step 7: Commit**

```bash
git add src/levels/motor-cortex src/App.tsx
git commit -m "feat: add 3D scene foundation with stylized brain material"
```

_Requirement: 1.1, 1.4, 1.5, 1.6_

---

### Task 8: Region highlight, camera rig, and focus transition

**Files:**
- Create: `src/levels/motor-cortex/scene/PrecentralHighlight.tsx`, `CameraRig.tsx`
- Create: `src/levels/motor-cortex/useSimulation.ts`
- Create: `src/hooks/usePrefersReducedMotion.ts`
- Modify: `src/levels/motor-cortex/scene/BrainScene.tsx` (accept a `controlsEnabled` prop)

**Interfaces:**
- Consumes: `simReducer`, `initialState`, `SimState`, `SimAction` from Task 6.
- Produces: `useSimulation()` returning `{ state, dispatch }` from context;
  `<SimulationProvider>`; `usePrefersReducedMotion(): boolean`.

- [ ] **Step 1: Build the simulation context hook**

Create `src/levels/motor-cortex/useSimulation.ts`:

```tsx
import { createContext, useContext, useReducer, type ReactNode } from 'react';
import { simReducer, initialState, type SimAction, type SimState } from '@levels/motor-cortex/simulation/machine';

const SimContext = createContext<{ state: SimState; dispatch: React.Dispatch<SimAction> } | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(simReducer, initialState);
  return <SimContext.Provider value={{ state, dispatch }}>{children}</SimContext.Provider>;
}

export function useSimulation() {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error('useSimulation must be used inside SimulationProvider');
  return ctx;
}
```

Rename the file to `useSimulation.tsx` since it contains JSX.

- [ ] **Step 2: Build the reduced-motion hook**

Create `src/hooks/usePrefersReducedMotion.ts`:

```ts
import { useEffect, useState } from 'react';

export function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefers(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return prefers;
}
```

- [ ] **Step 3: Build the camera rig**

Create `src/levels/motor-cortex/scene/CameraRig.tsx`:

```tsx
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulation } from '@levels/motor-cortex/useSimulation';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const FRAMING: Record<string, { position: [number, number, number]; target: [number, number, number] }> = {
  overview: { position: [0, 0, 250], target: [0, 0, 0] },
  stripFocused: { position: [140, 90, 90], target: [0, 40, 0] },
  predicting: { position: [140, 90, 90], target: [0, 40, 0] },
  revealed: { position: [150, 80, 110], target: [0, 35, 0] },
  rehab: { position: [150, 80, 110], target: [0, 35, 0] },
};

export function CameraRig() {
  const { state } = useSimulation();
  const { camera } = useThree();
  const reducedMotion = usePrefersReducedMotion();

  useFrame((_, delta) => {
    const framing = FRAMING[state.phase];
    const target = new THREE.Vector3(...framing.position);
    // Reduced motion: cut straight to the target instead of flying.
    const lerpFactor = reducedMotion ? 1 : 1 - Math.pow(0.001, delta);
    camera.position.lerp(target, lerpFactor);
    camera.lookAt(new THREE.Vector3(...framing.target));
  });

  return null;
}
```

The camera is a consequence of phase, never an independent input. This is what makes the
transition skippable: advancing the phase mid-flight simply retargets the lerp.

Tune the `FRAMING` values by eye in Step 6 against the model's actual scale.

- [ ] **Step 4: Build the precentral highlight**

Create `src/levels/motor-cortex/scene/PrecentralHighlight.tsx`:

```tsx
import { useGLTF } from '@react-three/drei';
import { useState } from 'react';
import * as THREE from 'three';
import { useSimulation } from '@levels/motor-cortex/useSimulation';

export function PrecentralHighlight() {
  const { state, dispatch } = useSimulation();
  const { nodes } = useGLTF('/models/brain.glb');
  const [hovered, setHovered] = useState(false);

  if (state.phase !== 'overview') return null;

  // Task 2 decision record names this node. If the strategy is `procedural-strip`,
  // replace this with the generated ribbon geometry instead.
  const gyrus = nodes['precentral_gyrus'] as THREE.Mesh | undefined;
  if (!gyrus) return null;

  return (
    <mesh
      geometry={gyrus.geometry}
      position={gyrus.position}
      rotation={gyrus.rotation}
      onClick={() => dispatch({ type: 'FOCUS_STRIP' })}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial
        color={hovered ? '#6ee7ff' : '#38bdf8'}
        emissive={hovered ? '#0ea5e9' : '#0284c7'}
        emissiveIntensity={hovered ? 0.8 : 0.4}
        roughness={0.5}
      />
    </mesh>
  );
}
```

- [ ] **Step 5: Lock orbit controls once focused**

In `BrainScene.tsx`, replace the hard-coded `<OrbitControls enablePan={false} />` with a
phase-aware version. Add to the imports:

```tsx
import { useSimulation } from '@levels/motor-cortex/useSimulation';
```

and replace the controls line with a small component defined in the same file:

```tsx
function PhaseAwareControls() {
  const { state } = useSimulation();
  return <OrbitControls enablePan={false} enabled={state.phase === 'overview'} />;
}
```

Free rotation in overview, locked once focused on the strip.

- [ ] **Step 6: Wire the provider and check by eye**

Update `src/App.tsx`:

```tsx
import { BrainScene } from '@levels/motor-cortex/scene/BrainScene';
import { CameraRig } from '@levels/motor-cortex/scene/CameraRig';
import { PrecentralHighlight } from '@levels/motor-cortex/scene/PrecentralHighlight';
import { SimulationProvider } from '@levels/motor-cortex/useSimulation';

export default function App() {
  return (
    <SimulationProvider>
      <main className="h-screen w-screen bg-slate-900">
        <BrainScene>
          <CameraRig />
          <PrecentralHighlight />
        </BrainScene>
      </main>
    </SimulationProvider>
  );
}
```

Run: `npm run dev`
Confirm by eye: the precentral gyrus is visibly distinct on load and brightens on hover;
clicking it flies the camera to frame the strip; rotation locks once focused; and enabling
"reduce motion" in OS settings makes the transition an instant cut rather than a flight.

- [ ] **Step 7: Verify and commit**

Run: `npm run test && npm run build` → Expected: both pass.

```bash
git add src/levels/motor-cortex src/hooks src/App.tsx
git commit -m "feat: add region highlight, phase-driven camera rig, and focus transition"
```

_Requirement: 2.1, 2.2, 2.3, 2.4, 9.4_

---

### Task 9: Homunculus strip and territories

**Files:**
- Create: `src/levels/motor-cortex/simulation/stripLayout.ts`
- Test: `src/levels/motor-cortex/simulation/stripLayout.test.ts`
- Create: `src/levels/motor-cortex/scene/HomunculusStrip.tsx`, `TerritorySegment.tsx`
- Create: `src/levels/motor-cortex/ui/InsightPanel.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `motorCortex` (Task 4), `selectableSites` (Task 5), `useSimulation` (Task 8).
- Produces: `STRIP_LENGTH`, `StripSegment`, `stripLayout(content): StripSegment[]`,
  `segmentCenter(content, part): number | null`, `<HomunculusStrip />`, `<InsightPanel />`.

- [ ] **Step 1: Write the failing test for strip layout**

Three components need to place things along the strip — the segments, the lesion marker, and
the rehab halo. Computing offsets in each of them would guarantee drift, so the geometry is
one pure, tested function.

Create `src/levels/motor-cortex/simulation/stripLayout.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import motorCortex from '@content/regions/motor-cortex';
import {
  STRIP_LENGTH, stripLayout, segmentCenter,
} from '@levels/motor-cortex/simulation/stripLayout';

describe('stripLayout', () => {
  it('lays segments out medial to lateral with no gaps', () => {
    const segments = stripLayout(motorCortex);
    expect(segments[0].territory.id).toBe('toes');
    expect(segments[0].offset).toBe(0);
    for (let i = 1; i < segments.length; i++) {
      expect(segments[i].offset).toBeCloseTo(segments[i - 1].offset + segments[i - 1].length);
    }
  });

  it('fills exactly the strip length', () => {
    const segments = stripLayout(motorCortex);
    const last = segments[segments.length - 1];
    expect(last.offset + last.length).toBeCloseTo(STRIP_LENGTH);
  });

  it('gives the hand a longer segment than the trunk', () => {
    const lengthOf = (id: string) =>
      stripLayout(motorCortex).find((s) => s.territory.id === id)!.length;
    expect(lengthOf('hand')).toBeGreaterThan(lengthOf('trunk'));
  });

  it('returns the midpoint of a territory', () => {
    const segment = stripLayout(motorCortex).find((s) => s.territory.id === 'face')!;
    expect(segmentCenter(motorCortex, 'face')).toBeCloseTo(segment.offset + segment.length / 2);
  });

  it('returns null for a part with no territory', () => {
    const empty = { ...motorCortex, territories: [] };
    expect(segmentCenter(empty, 'face')).toBeNull();
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npm run test`
Expected: FAIL — cannot resolve `stripLayout`.

- [ ] **Step 3: Implement strip layout**

Create `src/levels/motor-cortex/simulation/stripLayout.ts`:

```ts
import type { BodyPart, RegionContent, Territory } from '@content/schema';

export const STRIP_LENGTH = 120;

export interface StripSegment {
  territory: Territory;
  /** Start of this segment along the strip, medial end at 0. */
  offset: number;
  length: number;
}

export function stripLayout(content: RegionContent): StripSegment[] {
  const ordered = [...content.territories].sort((a, b) => a.order - b.order);
  let cursor = 0;
  return ordered.map((territory) => {
    const length = territory.corticalShare * STRIP_LENGTH;
    const segment: StripSegment = { territory, offset: cursor, length };
    cursor += length;
    return segment;
  });
}

export function segmentCenter(content: RegionContent, part: BodyPart): number | null {
  const segment = stripLayout(content).find((s) => s.territory.id === part);
  return segment ? segment.offset + segment.length / 2 : null;
}
```

- [ ] **Step 4: Run the tests**

Run: `npm run test`
Expected: PASS — all five layout cases.

- [ ] **Step 5: Build the territory segment**

Create `src/levels/motor-cortex/scene/TerritorySegment.tsx`:

```tsx
import { useState } from 'react';
import type { Territory } from '@content/schema';

interface Props {
  territory: Territory;
  /** Position along the strip, in world units. */
  offset: number;
  length: number;
  selectable: boolean;
  onSelect: () => void;
  onHover: (id: Territory['id'] | null) => void;
}

export function TerritorySegment({
  territory, offset, length, selectable, onSelect, onHover,
}: Props) {
  const [hovered, setHovered] = useState(false);

  const color = !selectable ? '#64748b' : hovered ? '#fbbf24' : '#f59e0b';

  return (
    <mesh
      position={[0, offset + length / 2, 0]}
      onClick={() => selectable && onSelect()}
      onPointerOver={() => { setHovered(true); onHover(territory.id); }}
      onPointerOut={() => { setHovered(false); onHover(null); }}
    >
      <boxGeometry args={[12, length, 12]} />
      <meshStandardMaterial
        color={color}
        emissive={hovered ? color : '#000000'}
        emissiveIntensity={hovered ? 0.4 : 0}
        roughness={0.6}
        opacity={selectable ? 1 : 0.55}
        transparent={!selectable}
      />
    </mesh>
  );
}
```

Non-selectable territories are dimmed and desaturated — visible and informative, but
clearly not lesion sites.

- [ ] **Step 6: Build the strip**

Create `src/levels/motor-cortex/scene/HomunculusStrip.tsx`:

```tsx
import { useMemo } from 'react';
import motorCortex from '@content/regions/motor-cortex';
import { selectableSites } from '@levels/motor-cortex/simulation/resolveDeficit';
import { STRIP_LENGTH, stripLayout } from '@levels/motor-cortex/simulation/stripLayout';
import { TerritorySegment } from '@levels/motor-cortex/scene/TerritorySegment';
import { useSimulation } from '@levels/motor-cortex/useSimulation';
import type { BodyPart } from '@content/schema';

export function HomunculusStrip({
  onHover,
}: {
  onHover: (id: BodyPart | null) => void;
}) {
  const { state, dispatch } = useSimulation();
  const selectable = useMemo(() => new Set(selectableSites(motorCortex)), []);
  const segments = useMemo(() => stripLayout(motorCortex), []);

  if (state.phase === 'overview') return null;

  return (
    <group position={[0, -STRIP_LENGTH / 2 + 40, 0]}>
      {segments.map(({ territory, offset, length }) => (
        <TerritorySegment
          key={territory.id}
          territory={territory}
          offset={offset}
          length={length}
          selectable={selectable.has(territory.id)}
          onSelect={() => dispatch({ type: 'SELECT_LESION', site: territory.id })}
          onHover={onHover}
        />
      ))}
    </group>
  );
}
```

Segment lengths come straight from `corticalShare`, so the distortion emerges from the
content rather than being hand-placed. Ordering is medial (bottom) → lateral (top).

- [ ] **Step 7: Build the insight panel**

Create `src/levels/motor-cortex/ui/InsightPanel.tsx`:

```tsx
import motorCortex from '@content/regions/motor-cortex';

export function InsightPanel() {
  return (
    <aside className="max-w-sm rounded-lg bg-slate-800/90 p-5 text-slate-100 shadow-lg">
      <h2 className="mb-2 text-lg font-semibold">Why is the map so lopsided?</h2>
      <p className="text-sm leading-relaxed text-slate-300">{motorCortex.insight}</p>
    </aside>
  );
}
```

The central insight is stated outright, never left for the user to infer.

- [ ] **Step 8: Wire both in**

In `src/App.tsx`, add hover state, render `<HomunculusStrip onHover={setHoveredPart} />`
inside `<BrainScene>`, and render `<InsightPanel />` in an absolutely positioned overlay
outside the canvas. Hold `hoveredPart` with `useState<BodyPart | null>(null)` in `App` —
Task 10 reads it to mirror the highlight onto the body diagram.

- [ ] **Step 9: Check by eye**

Run: `npm run dev`
Confirm by eye: after focusing, the strip appears with fourteen segments whose sizes are
visibly, dramatically unequal — hand, fingers, lips and face dominating. Only hand, face and
leg respond to clicks; the rest are dimmed. The insight panel is legible against the scene.

- [ ] **Step 10: Verify and commit**

Run: `npm run test && npm run build` → Expected: both pass.

```bash
git add src/levels/motor-cortex src/App.tsx
git commit -m "feat: add homunculus strip with data-driven territory sizing"
```

_Requirement: 3.1, 3.2, 3.3, 3.4, 4.2, 4.2.2_

---

### Task 10: Body diagram

**Files:**
- Create: `src/levels/motor-cortex/ui/BodyDiagram.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `BodyPart`, `Severity`, `DeficitEntry` from Task 3.
- Produces: `<BodyDiagram entries={DeficitEntry[]} side={Hemisphere | null} highlighted={BodyPart | null} />`.

- [ ] **Step 1: Build the diagram**

Create `src/levels/motor-cortex/ui/BodyDiagram.tsx`:

```tsx
import type { BodyPart, DeficitEntry, Hemisphere, Severity } from '@content/schema';

const SEVERITY_FILL: Record<Severity, string> = {
  complete: '#dc2626',
  partial: '#f59e0b',
  spared: '#334155',
};

const SEVERITY_LABEL: Record<Severity, string> = {
  complete: 'no movement',
  partial: 'weakened',
  spared: 'unaffected',
};

/** Simple front-facing body. Each part is one shape, keyed by BodyPart. */
const PART_SHAPES: Partial<Record<BodyPart, { cx: number; cy: number; rx: number; ry: number }>> = {
  face:     { cx: 100, cy: 30,  rx: 18, ry: 20 },
  lips:     { cx: 100, cy: 40,  rx: 7,  ry: 4 },
  jaw:      { cx: 100, cy: 48,  rx: 12, ry: 6 },
  tongue:   { cx: 100, cy: 42,  rx: 4,  ry: 3 },
  neck:     { cx: 100, cy: 58,  rx: 8,  ry: 8 },
  shoulder: { cx: 100, cy: 74,  rx: 32, ry: 10 },
  trunk:    { cx: 100, cy: 108, rx: 26, ry: 30 },
  arm:      { cx: 136, cy: 108, rx: 9,  ry: 32 },
  hand:     { cx: 136, cy: 146, rx: 9,  ry: 10 },
  fingers:  { cx: 136, cy: 158, rx: 8,  ry: 6 },
  thumb:    { cx: 127, cy: 150, rx: 4,  ry: 6 },
  hip:      { cx: 100, cy: 142, rx: 22, ry: 12 },
  leg:      { cx: 100, cy: 190, rx: 11, ry: 38 },
  toes:     { cx: 100, cy: 232, rx: 10, ry: 6 },
};

interface Props {
  entries: DeficitEntry[];
  side: Hemisphere | null;
  highlighted: BodyPart | null;
}

export function BodyDiagram({ entries, side, highlighted }: Props) {
  const severityOf = new Map(entries.map((e) => [e.part, e.severity]));

  return (
    <figure className="flex flex-col items-center">
      <svg viewBox="0 0 200 250" className="h-80 w-auto" role="img"
           aria-label={side ? `Body diagram showing deficits on the ${side} side` : 'Body diagram'}>
        {/* Mirror so the affected side appears on the viewer's correct side. */}
        <g transform={side === 'left' ? 'scale(-1,1) translate(-200,0)' : undefined}>
          {Object.entries(PART_SHAPES).map(([part, shape]) => {
            const severity = severityOf.get(part as BodyPart) ?? 'spared';
            const isHighlighted = highlighted === part;
            return (
              <ellipse
                key={part}
                cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry}
                fill={SEVERITY_FILL[severity]}
                stroke={isHighlighted ? '#fbbf24' : '#0f172a'}
                strokeWidth={isHighlighted ? 3 : 1}
              >
                <title>{`${part}: ${SEVERITY_LABEL[severity]}`}</title>
              </ellipse>
            );
          })}
        </g>
      </svg>

      <figcaption className="mt-3 flex gap-4 text-xs text-slate-300">
        {(['complete', 'partial', 'spared'] as Severity[]).map((severity) => (
          <span key={severity} className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm"
                  style={{ backgroundColor: SEVERITY_FILL[severity] }} />
            {SEVERITY_LABEL[severity]}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
```

Every part carries a `<title>` naming its severity in words, so severity is never conveyed by
colour alone.

- [ ] **Step 2: Wire it in**

Render `<BodyDiagram>` in the overlay beside the canvas in `App.tsx`. Pass
`entries={[]}` and `side={null}` for now — Task 12 supplies real values — and
`highlighted={hoveredPart}` from the state added in Task 9.

- [ ] **Step 3: Check by eye**

Run: `npm run dev`
Confirm by eye: the body reads as a body at a glance, all fourteen parts are distinguishable,
the legend is legible, and hovering a strip territory outlines the matching body part. Adjust
`PART_SHAPES` coordinates until the proportions look right.

- [ ] **Step 4: Verify and commit**

Run: `npm run test && npm run build` → Expected: both pass.

```bash
git add src/levels/motor-cortex/ui src/App.tsx
git commit -m "feat: add SVG body diagram with severity legend and hover mirroring"
```

_Requirement: 3.5, 6.2, 6.3, 9.2_

---

### Task 11: Lesion marker and prediction prompt

**Files:**
- Create: `src/levels/motor-cortex/scene/LesionMarker.tsx`
- Create: `src/levels/motor-cortex/ui/PredictionPrompt.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useSimulation` (Task 8), `resolveDeficit` (Task 5), `motorCortex` (Task 4).
- Produces: `<LesionMarker />`, `<PredictionPrompt />`.

- [ ] **Step 1: Build the lesion marker**

Create `src/levels/motor-cortex/scene/LesionMarker.tsx`:

```tsx
import { useMemo } from 'react';
import motorCortex from '@content/regions/motor-cortex';
import { STRIP_LENGTH, segmentCenter } from '@levels/motor-cortex/simulation/stripLayout';
import { useSimulation } from '@levels/motor-cortex/useSimulation';

export function LesionMarker() {
  const { state } = useSimulation();

  const offset = useMemo(
    () => (state.lesionSite ? segmentCenter(motorCortex, state.lesionSite) : null),
    [state.lesionSite]
  );

  if (offset === null) return null;

  return (
    <group position={[0, -STRIP_LENGTH / 2 + 40, 0]}>
      <mesh position={[0, offset, 8]}>
        <sphereGeometry args={[7, 24, 24]} />
        <meshStandardMaterial color="#7f1d1d" emissive="#dc2626" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}
```

- [ ] **Step 2: Build the prediction prompt**

Create `src/levels/motor-cortex/ui/PredictionPrompt.tsx`:

```tsx
import { useMemo } from 'react';
import motorCortex from '@content/regions/motor-cortex';
import { useSimulation } from '@levels/motor-cortex/useSimulation';
import type { BodyPart } from '@content/schema';

/** Offer the true worst-affected part plus three plausible decoys. */
function choicesFor(site: BodyPart): BodyPart[] {
  const scenario = motorCortex.scenarios.find((s) => s.siteTerritory === site);
  if (!scenario) return [];
  const worst = scenario.deficits.find((d) => d.severity === 'complete')?.part ?? site;
  const decoys = scenario.deficits
    .filter((d) => d.severity === 'spared')
    .slice(0, 3)
    .map((d) => d.part);
  return [worst, ...decoys].sort();
}

export function PredictionPrompt() {
  const { state, dispatch } = useSimulation();
  const choices = useMemo(
    () => (state.lesionSite ? choicesFor(state.lesionSite) : []),
    [state.lesionSite]
  );

  if (state.phase !== 'predicting') return null;

  const labelOf = (part: BodyPart) =>
    motorCortex.territories.find((t) => t.id === part)?.label ?? part;

  return (
    <section className="max-w-sm rounded-lg bg-slate-800/95 p-5 text-slate-100 shadow-lg">
      <h2 className="mb-1 text-lg font-semibold">Before you look — what stops working?</h2>
      <p className="mb-4 text-sm text-slate-400">
        Commit to a guess. Getting it wrong is the interesting outcome.
      </p>
      <ul className="flex flex-col gap-2">
        {choices.map((part) => (
          <li key={part}>
            <button
              type="button"
              onClick={() => dispatch({ type: 'SUBMIT_PREDICTION', part })}
              className="w-full rounded-md bg-slate-700 px-4 py-2 text-left hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              {labelOf(part)}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => dispatch({ type: 'SKIP_PREDICTION' })}
        className="mt-3 text-sm text-slate-400 underline hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        Just show me
      </button>
    </section>
  );
}
```

Real `<button>` elements, so keyboard navigation works without extra handlers. No score, no
streak, no gating.

- [ ] **Step 3: Wire both in**

Add `<LesionMarker />` inside `<BrainScene>` and `<PredictionPrompt />` to the overlay in
`App.tsx`.

- [ ] **Step 4: Check by eye**

Run: `npm run dev`
Confirm by eye: clicking hand, face or leg drops a visible marker on that segment and raises
the prompt; choices are tabbable with a visible focus ring; "Just show me" advances without
recording a prediction.

- [ ] **Step 5: Verify and commit**

Run: `npm run test && npm run build` → Expected: both pass.

```bash
git add src/levels/motor-cortex src/App.tsx
git commit -m "feat: add lesion marker and prediction prompt"
```

_Requirement: 4.2, 5.1, 5.2, 5.3, 5.5, 6.1_

---

### Task 12: Deficit reveal

**Files:**
- Create: `src/levels/motor-cortex/ui/DeficitPanel.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `resolveDeficit`, `DeficitResult` (Task 5); `useSimulation` (Task 8);
  `<BodyDiagram>` (Task 10).
- Produces: `<DeficitPanel />`, and the wiring that feeds real `entries` and `side` into
  `<BodyDiagram>`.

- [ ] **Step 1: Build the deficit panel**

Create `src/levels/motor-cortex/ui/DeficitPanel.tsx`:

```tsx
import motorCortex from '@content/regions/motor-cortex';
import { resolveDeficit } from '@levels/motor-cortex/simulation/resolveDeficit';
import { useSimulation } from '@levels/motor-cortex/useSimulation';

export function DeficitPanel() {
  const { state, dispatch } = useSimulation();
  if (state.phase !== 'revealed' || !state.lesionSite) return null;

  const result = resolveDeficit(state.lesionSite, motorCortex, state.hemisphere);
  const scenario = motorCortex.scenarios.find((s) => s.id === result.scenarioId)!;

  const predictedPart = state.prediction;
  const predictedSeverity = predictedPart
    ? result.entries.find((e) => e.part === predictedPart)?.severity
    : null;
  const wasRight = predictedSeverity === 'complete';

  return (
    <section className="max-w-sm rounded-lg bg-slate-800/95 p-5 text-slate-100 shadow-lg">
      <h2 className="mb-2 text-lg font-semibold">{scenario.label}</h2>

      {predictedPart && (
        <p className="mb-3 rounded-md bg-slate-700/60 p-3 text-sm">
          {wasRight
            ? 'You called it.'
            : `You picked the ${predictedPart}, which is ${predictedSeverity ?? 'unaffected'} here. Here is why:`}
        </p>
      )}

      <p className="mb-3 text-sm leading-relaxed text-slate-300">{scenario.dayToDay}</p>

      <p className="mb-3 rounded-md border-l-2 border-amber-400 bg-slate-900/60 p-3 text-sm text-slate-300">
        The damage is in the <strong>{state.hemisphere}</strong> hemisphere, but the
        weakness shows up on the <strong>{result.side}</strong> side of the body. Almost
        every motor pathway crosses the midline on its way down, so each half of the brain
        drives the opposite half of the body.
      </p>

      {scenario.surprise && (
        <p className="mb-4 text-sm leading-relaxed text-amber-200">{scenario.surprise}</p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => dispatch({ type: 'ADVANCE_TO_REHAB' })}
          className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          What happens next?
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'RESET_SCENARIO' })}
          className="rounded-md px-4 py-2 text-sm text-slate-300 underline hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          Try another site
        </button>
      </div>
    </section>
  );
}
```

The contralateral crossing is explained in place, every time it is shown.

- [ ] **Step 2: Feed real deficits to the body diagram**

In `App.tsx`, compute the result when `state.lesionSite` is set and the phase is `revealed`
or `rehab`, and pass `entries={result.entries}` and `side={result.side}` to `<BodyDiagram>`.
Keep passing `entries={[]}` and `side={null}` in earlier phases.

- [ ] **Step 3: Check by eye**

Run: `npm run dev`
Confirm by eye, for each of the three scenarios: the body diagram lights up the correct parts
on the correct side, the hand-knob case visibly spares the arm, the MCA case visibly spares
the leg, and the ACA case visibly spares the hand. "Try another site" returns to the strip
without a reload.

- [ ] **Step 4: Verify and commit**

Run: `npm run test && npm run build` → Expected: both pass.

```bash
git add src/levels/motor-cortex/ui src/App.tsx
git commit -m "feat: add deficit reveal with contralateral explanation"
```

_Requirement: 4.3, 4.4, 4.6, 5.4, 6.1, 6.2, 6.3, 6.4_

---

### Task 13: Neuroplasticity beat

**Files:**
- Create: `src/levels/motor-cortex/simulation/recovery.ts`
- Test: `src/levels/motor-cortex/simulation/recovery.test.ts`
- Create: `src/levels/motor-cortex/ui/RehabTimeline.tsx`
- Modify: `src/levels/motor-cortex/scene/LesionMarker.tsx`, `src/App.tsx`

**Interfaces:**
- Consumes: `motorCortex.plasticity` (Task 4); `useSimulation` (Task 8); `resolveDeficit`
  (Task 5); `segmentCenter` (Task 9).
- Produces: `recoveryAt(content, week): number` and
  `applyRecovery(entries, recoveryFraction): DeficitEntry[]`, plus `<RehabTimeline />`.

- [ ] **Step 1: Write the failing test for recovery**

Recovery is the level's closing argument, so it is pure logic with tests rather than a
transform buried in a component.

Create `src/levels/motor-cortex/simulation/recovery.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import motorCortex from '@content/regions/motor-cortex';
import { recoveryAt, applyRecovery } from '@levels/motor-cortex/simulation/recovery';
import type { DeficitEntry } from '@content/schema';

describe('recoveryAt', () => {
  it('is zero at week 0', () => {
    expect(recoveryAt(motorCortex, 0)).toBe(0);
  });

  it('reads the authored fraction for a known week', () => {
    expect(recoveryAt(motorCortex, 8)).toBe(0.52);
  });

  it('falls back to the nearest earlier week for an unauthored one', () => {
    expect(recoveryAt(motorCortex, 5)).toBe(0.35);
  });

  it('never reaches full recovery', () => {
    const last = motorCortex.plasticity.timeline.at(-1)!;
    expect(recoveryAt(motorCortex, last.week)).toBeLessThan(1);
  });
});

describe('applyRecovery', () => {
  const entries: DeficitEntry[] = [
    { part: 'hand', severity: 'complete' },
    { part: 'thumb', severity: 'partial' },
    { part: 'leg', severity: 'spared' },
  ];

  it('changes nothing at week zero', () => {
    expect(applyRecovery(entries, 0)).toEqual(entries);
  });

  it('softens complete loss to partial past the halfway mark', () => {
    expect(applyRecovery(entries, 0.55).find((e) => e.part === 'hand')?.severity).toBe('partial');
  });

  it('restores partial weakness once recovery is substantial', () => {
    expect(applyRecovery(entries, 0.65).find((e) => e.part === 'thumb')?.severity).toBe('spared');
  });

  it('leaves spared parts spared', () => {
    expect(applyRecovery(entries, 0.7).find((e) => e.part === 'leg')?.severity).toBe('spared');
  });

  it('never fully restores a completely lost part at the authored maximum', () => {
    const max = motorCortex.plasticity.timeline.at(-1)!.recoveryFraction;
    expect(applyRecovery(entries, max).find((e) => e.part === 'hand')?.severity).not.toBe('spared');
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npm run test`
Expected: FAIL — cannot resolve `recovery`.

- [ ] **Step 3: Implement recovery**

Create `src/levels/motor-cortex/simulation/recovery.ts`:

```ts
import type { DeficitEntry, RegionContent } from '@content/schema';

export function recoveryAt(content: RegionContent, week: number): number {
  const timeline = content.plasticity.timeline;
  let fraction = 0;
  for (const point of timeline) {
    if (point.week <= week) fraction = point.recoveryFraction;
    else break;
  }
  return fraction;
}

export function applyRecovery(
  entries: DeficitEntry[],
  recoveryFraction: number
): DeficitEntry[] {
  return entries.map((entry) => {
    if (entry.severity === 'complete' && recoveryFraction >= 0.5) {
      return { ...entry, severity: 'partial' };
    }
    if (entry.severity === 'partial' && recoveryFraction >= 0.6) {
      return { ...entry, severity: 'spared' };
    }
    return entry;
  });
}
```

A completely lost part can soften to `partial` but never reaches `spared`, because the
authored timeline tops out below the threshold that would allow it. The diagram therefore
cannot show a fully recovered body — which is the honest outcome.

- [ ] **Step 4: Run the tests**

Run: `npm run test`
Expected: PASS — all nine recovery cases.

- [ ] **Step 5: Build the timeline**

Create `src/levels/motor-cortex/ui/RehabTimeline.tsx`:

```tsx
import motorCortex from '@content/regions/motor-cortex';
import { useSimulation } from '@levels/motor-cortex/useSimulation';

export function RehabTimeline() {
  const { state, dispatch } = useSimulation();
  if (state.phase !== 'rehab') return null;

  const { timeline, mechanism, caveat } = motorCortex.plasticity;
  const currentIndex = Math.max(0, timeline.findIndex((p) => p.week === state.rehabWeek));
  const current = timeline[currentIndex];

  return (
    <section className="max-w-sm rounded-lg bg-slate-800/95 p-5 text-slate-100 shadow-lg">
      <h2 className="mb-2 text-lg font-semibold">The brain starts rewiring</h2>
      <p className="mb-4 text-sm leading-relaxed text-slate-300">{mechanism}</p>

      <label htmlFor="rehab-week" className="mb-1 block text-sm font-medium">
        Week {current.week} — {Math.round(current.recoveryFraction * 100)}% of lost function
        regained
      </label>
      <input
        id="rehab-week"
        type="range"
        min={0}
        max={timeline.length - 1}
        step={1}
        value={currentIndex}
        onChange={(e) =>
          dispatch({ type: 'SET_REHAB_WEEK', week: timeline[Number(e.target.value)].week })
        }
        className="w-full accent-amber-400"
      />

      <p className="mt-4 rounded-md border-l-2 border-slate-500 bg-slate-900/60 p-3 text-sm text-slate-400">
        {caveat}
      </p>

      <button
        type="button"
        onClick={() => dispatch({ type: 'RESET_SCENARIO' })}
        className="mt-4 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
      >
        Try another site
      </button>
    </section>
  );
}
```

A native range input, so it is keyboard-operable with no extra work.

- [ ] **Step 6: Soften the body diagram as recovery progresses**

In `App.tsx`, when the phase is `rehab`, map the resolved entries through recovery before
passing them to `<BodyDiagram>`:

```tsx
import { applyRecovery, recoveryAt } from '@levels/motor-cortex/simulation/recovery';

// where `result` is the DeficitResult computed in Task 12:
const entries =
  state.phase === 'rehab'
    ? applyRecovery(result.entries, recoveryAt(motorCortex, state.rehabWeek))
    : result.entries;
```

- [ ] **Step 7: Show neighbouring cortex taking over**

In `LesionMarker.tsx`, render a translucent halo around the marker during rehab, growing with
the recovery fraction — adjacent territory absorbing the lost function. Add to the imports:

```tsx
import { recoveryAt } from '@levels/motor-cortex/simulation/recovery';
```

and inside the component, before the return:

```tsx
const haloRadius = 7 + recoveryAt(motorCortex, state.rehabWeek) * 10;
```

then add this sibling to the existing marker mesh, inside the same `<group>`:

```tsx
{state.phase === 'rehab' && (
  <mesh position={[0, offset, 8]}>
    <sphereGeometry args={[haloRadius, 24, 24]} />
    <meshStandardMaterial color="#22c55e" transparent opacity={0.25} />
  </mesh>
)}
```

- [ ] **Step 8: Check by eye**

Run: `npm run dev`
Confirm by eye: dragging the slider visibly softens deficits on the body diagram and grows the
green halo on the strip; the final week still shows residual impairment; the caveat is plainly
visible rather than buried.

- [ ] **Step 9: Verify and commit**

Run: `npm run test && npm run build` → Expected: both pass.

```bash
git add src/levels/motor-cortex src/App.tsx
git commit -m "feat: add neuroplasticity rehab timeline with partial recovery"
```

_Requirement: 7.1, 7.2, 7.3, 7.4, 7.5_

---

### Task 14: Accessibility pass and final verification

**Files:**
- Modify: `src/levels/motor-cortex/scene/HomunculusStrip.tsx`,
  `src/levels/motor-cortex/ui/*`, `src/App.tsx`, `src/index.css`

**Interfaces:**
- Consumes: everything from Tasks 7–13.
- Produces: a keyboard-navigable level meeting the spec's accessibility requirements.

- [ ] **Step 1: Add a keyboard path to territory selection**

3D meshes cannot receive focus. Add a visually compact but fully focusable list of selectable
territories to the overlay, rendered whenever the phase is `stripFocused`, dispatching the
same `SELECT_LESION` action as the mesh:

```tsx
<nav aria-label="Choose a lesion site">
  <ul className="flex gap-2">
    {selectableSites(motorCortex).map((site) => (
      <li key={site}>
        <button
          type="button"
          onClick={() => dispatch({ type: 'SELECT_LESION', site })}
          onFocus={() => setHoveredPart(site)}
          onBlur={() => setHoveredPart(null)}
          className="rounded-md bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          {motorCortex.territories.find((t) => t.id === site)?.label}
        </button>
      </li>
    ))}
  </ul>
</nav>
```

The mesh is the *presentation* of this control, never its only affordance.

- [ ] **Step 2: Add a "back to whole brain" control**

Render a button in the overlay whenever the phase is not `overview`, dispatching
`RETURN_TO_OVERVIEW`, labelled "Back to the whole brain".

- [ ] **Step 3: Audit contrast**

Open DevTools and check every text colour against its background with the contrast inspector.
Any pairing below WCAG AA (4.5:1 for body text, 3:1 for large text) gets its foreground
lightened until it passes. The `text-slate-400`-on-`bg-slate-800` pairings are the likely
failures — check them first.

- [ ] **Step 4: Full keyboard pass**

With the mouse untouched, Tab through the entire flow: focus the strip, choose a site, make a
prediction, advance to rehab, scrub the slider with arrow keys, and reset. Every step must be
reachable and every focused element must show a visible ring. Fix whatever is not.

- [ ] **Step 5: Reduced-motion pass**

Enable "reduce motion" in OS settings and replay the full loop. Camera moves must be instant
cuts. Confirm nothing is left mid-animation or unreachable.

- [ ] **Step 6: Layout check**

Resize to a 1280×800 laptop viewport and a 1024×768 tablet viewport. The canvas and overlay
must both remain usable and non-overlapping at each. Phone width is explicitly out of scope.

- [ ] **Step 7: Full-loop verification**

Run: `npm run test` → Expected: PASS, all suites.
Run: `npm run build` → Expected: succeeds with no type errors.
Run: `npm run dev`, then play all three scenarios start to finish — explore, focus, predict,
reveal, rehab, reset — and confirm each behaves as the spec describes.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add keyboard navigation, contrast, and reduced-motion support"
```

_Requirement: 2.4, 9.1, 9.2, 9.3, 9.4, 9.5, 10.4_

---

## Requirement Coverage

| Requirement | Task |
|---|---|
| 1.1, 1.4, 1.5, 1.6 | 7 |
| 1.2, 1.3 | 2 |
| 2.1, 2.2, 2.3 | 8 |
| 2.4 | 8, 14 |
| 3.1, 3.2, 3.3, 3.4 | 9 (data authored in 4) |
| 3.5 | 9, 10 |
| 4.1, 4.5 | 4 |
| 4.2 | 9, 11 |
| 4.2.1 | 5 |
| 4.2.2 | 9 |
| 4.3 | 5, 12 |
| 4.4 | 12 |
| 4.6 | 6, 12 |
| 5.1, 5.2, 5.5 | 11 |
| 5.3 | 6, 11 |
| 5.4 | 12 |
| 6.1 | 11, 12 |
| 6.2, 6.3 | 10, 12 |
| 6.4 | 12 |
| 6.5 | 5 |
| 7.1–7.5 | 13 (data authored in 4) |
| 8.1 | 4 |
| 8.2, 8.3, 8.4 | 3 |
| 8.5 | 4 |
| 9.1, 9.3, 9.5 | 14 |
| 9.2 | 10, 14 |
| 9.4 | 8, 14 |
| 10.1 | 1 |
| 10.2 | global constraint — no LLM dependency is introduced by any task |
| 10.3 | global constraint — no persistence is introduced by any task |
| 10.4 | every task's verify step; 14 |
