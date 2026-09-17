# Amygdala Slice — Design

## What Generalizes and What Stays Bespoke

The first slice's rule was "content is data, mechanics are bespoke, extract shared code only
when a second level demonstrates the need". This is that second level. Two things are
demonstrably shared and move to `src/lib/`; everything about *how the amygdala simulates*
stays under `src/levels/amygdala/`.

```
src/lib/
  simulation/machine.ts          generic SimState<Site, Choice>, phases, reducer
  simulation/createSimulation.tsx factory → { SimulationProvider, useSimulation }
  scene/BrainScene.tsx           Canvas + Suspense + Lighting + SceneLoader shell
  scene/CameraRig.tsx            flies to framing[phase]; inert in overview
  scene/Lighting.tsx
  ui/SceneLoader.tsx
  ui/ProgressRail.tsx            steps from FLOW_STEPS; jump-back via prop

src/levels/motor-cortex/         unchanged mechanics; imports move to lib
src/levels/amygdala/
  simulation/resolveResponse.ts  pure: (stimulusId, content) → { intact, damaged, correctChoice }
  scene/AmygdalaBrainMesh.tsx    translucent-on-focus cortex, glowing amygdalae, click target
  ui/StimulusChooser.tsx         three stimuli (keyboard twin of nothing 3D — stimuli are UI)
  ui/PredictionPrompt.tsx        four choices, skip
  ui/ResponseDashboard.tsx       intact vs damaged: gauges + lines
  ui/CompensationTimeline.tsx    plasticity beat
  AmygdalaLevel.tsx
```

---

## Content Schema

```ts
export interface RegionBase {
  id: string; name: string; plainName: string;
  overview: string; insight: string;
  plasticity: PlasticityBeat; sources: Source[];
}

export interface SomatotopicMechanic {
  kind: 'somatotopic';
  territories: Territory[];
  scenarios: Scenario[];            // unchanged from slice 1
}

export type Sweat = 'none' | 'mild' | 'strong';

export interface ResponseProfile {
  heartRateBpm: number;
  sweat: Sweat;
  behavior: string;
  report: string;
  fearRecognized?: boolean;         // only meaningful for social stimuli
}

export interface PredictionChoice { id: string; label: string; correct: boolean }

export interface ThreatStimulus {
  id: string; label: string; description: string;
  choices: PredictionChoice[];      // exactly four, one correct
  intact: ResponseProfile;
  damaged: ResponseProfile;
  explanation: string;              // why the damaged outcome happens
  dayToDay: string;
  sources: Source[];
}

export interface ThreatMechanic {
  kind: 'threat';
  premise: string;                  // "both amygdalae are damaged", and why bilateral
  stimuli: ThreatStimulus[];
}

export type SomatotopicContent = RegionBase & SomatotopicMechanic;
export type ThreatContent = RegionBase & ThreatMechanic;
export type RegionContent = SomatotopicContent | ThreatContent;
```

`validateRegionContent` = `validateBase` + `switch (content.kind)`. The motor content file
adds one line, `kind: 'somatotopic'`, and its type becomes `SomatotopicContent`.

### Why intact-vs-damaged is authored, not computed

Same reasoning as the motor slice's deficits: the real findings (calm with a snake, blind to
fear in faces, no personal space, but *knows* danger) are clinical facts, not derivable from a
parameter. Content carries both profiles; the pure function only looks them up and identifies
the correct choice.

---

## Generic State Machine

```ts
export type Phase = 'overview' | 'focused' | 'predicting' | 'revealed' | 'rehab';

export interface SimState<Site extends string = string, Choice extends string = string> {
  phase: Phase;
  hemisphere: Hemisphere;
  site: Site | null;                // motor: BodyPart lesion site; amygdala: stimulus id
  prediction: Choice | null;
  rehabWeek: number;
}
// actions: FOCUS, RETURN_TO_OVERVIEW, SELECT_SITE, SUBMIT_PREDICTION, SKIP_PREDICTION,
//          ADVANCE_TO_REHAB, SET_REHAB_WEEK, RESET_SCENARIO
```

The reducer is unchanged in behaviour; `lesionSite` becomes `site`, `FOCUS_STRIP` becomes
`FOCUS`, `SELECT_LESION` becomes `SELECT_SITE`, `stripFocused` becomes `focused`. The motor
level's tests are updated for the renames only.

`createSimulation<Site, Choice>()` returns a typed `{ SimulationProvider, useSimulation }`.
Each level exports its own instance:

```ts
// levels/motor-cortex/useSimulation.ts
export const { SimulationProvider, useSimulation } = createSimulation<BodyPart, BodyPart>();
// levels/amygdala/useSimulation.ts
export const { SimulationProvider, useSimulation } = createSimulation<StimulusId, string>();
```

so import paths inside each level do not change.

---

## Shared Scene Shell

`BrainScene` takes `orbitEnabled: boolean` and children; the level supplies its own mesh
component as a child because materials and click semantics differ per level. `CameraRig`
takes `framing: Partial<Record<Phase, Framing>>` and the current `phase`; phases without a
framing (overview) leave the camera to OrbitControls. `ProgressRail` takes `phase` and
`onJump(phase)`.

---

## Amygdala Mesh and Translucency

`scripts/build-brain-glb.mjs` rebuilds `public/models/brain.glb` from BodyParts3D STL parts
using the same steps the first slice narrated — STL load, merge vertices, −90° X rotation,
recentre on the **same** combined bounding box as before, GLTF export, Draco — now with
`Amygdala_L` / `Amygdala_R` (FMA61841 / FMA61842) added. One GLB, one frame, no drift.

`AmygdalaBrainMesh` restyles nodes by name: cortex/cerebellum get the shared base material
which switches to `transparent, opacity 0.18, depthWrite false` outside `overview`; the
precentral gyri get the base material too (they are not this level's story); the amygdalae get
an emissive amber material, brighter when hovered in overview. Clicking any brain node in
`overview` dispatches `FOCUS`.

Framing for focused phases looks slightly upward into the temporal lobes from the front-left:
`position [90, 20, 190]`, `target [0, -10, 0]` — tuned by eye.

---

## Response Dashboard

Two columns, "Intact" and "Damaged", each a small card: a heart-rate gauge (SVG arc, number
in bpm, label "resting" / "elevated" / "racing" by band), a sweat indicator with text, a
behaviour line, a quoted report line, and — for the fearful face — a "Recognised fear: yes /
no" row. Colour supports the text, never replaces it.

---

## Plasticity as Compensation

`CompensationTimeline` scrubs `plasticity.timeline` exactly like the motor `RehabTimeline`,
but the label reads "learned safety behaviours adopted" and the copy is explicit that fear
itself does not return. Content supplies `mechanism` (cortical routes, explicit knowledge,
rules learned from others) and a `caveat` that says repair is not what is happening.

---

## Testing

| Tested | How |
|---|---|
| shared validator + threat checks (req 1.5) | Vitest |
| motor content still valid with `kind` | existing tests |
| generic reducer renames | existing machine tests, updated |
| `resolveResponse` lookup + correct choice | Vitest |
| amygdala content conforms; 3 stimuli; each has one correct choice | Vitest |
| registry shows amygdala available | Vitest |
| translucency, glow, framing, dashboard legibility | manual browser check |
