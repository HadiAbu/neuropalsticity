# Motor Cortex Slice — Design

## Architecture Overview

A single-page client-side React app. One route, one level. Three layers:

```
┌─────────────────────────────────────────────────────────┐
│  content/  — typed data. Copy, territories, scenarios,  │
│              deficits, plasticity. No logic, no JSX.    │
├─────────────────────────────────────────────────────────┤
│  levels/motor-cortex/                                   │
│    simulation/  — reducer + pure deficit resolution     │
│    scene/       — R3F components (brain, strip, lesion) │
│    ui/          — 2D overlay: body diagram, panels      │
├─────────────────────────────────────────────────────────┤
│  lib/  — shared 3D helpers, extracted only as needed    │
└─────────────────────────────────────────────────────────┘
```

Content flows down. Nothing in `content/` imports from `levels/`. Nothing in
`simulation/` imports from `scene/` — the simulation must be runnable, and testable,
with no 3D context mounted at all.

---

## 3D Asset Strategy

### The open question

The design assumes an open-licensed anatomical mesh exists that (a) we may legally use and
(b) exposes the precentral gyrus as a separable surface. **This is unverified.** It is the
single largest technical risk in the slice, so it is resolved first, before any other work.

### Spike

Evaluate candidate sources — Z-Anatomy, BodyParts3D, and open neuroimaging-derived
surface meshes are the starting points — against four criteria:

1. **License** permits use here, and its attribution/share-alike terms are acceptable.
2. **Precentral gyrus is separable** as its own mesh, or extractable by label/vertex group.
3. **Poly count** is workable for real-time web after decimation.
4. **Exports cleanly to glTF/GLB.**

Record the chosen model and its full license terms in the repository.

### Fallback

If no model satisfies criterion 2, do not abandon the approach. Use the best available
whole-brain mesh for the anatomical form, and **generate the motor strip procedurally** —
a ribbon geometry following the gyrus path, authored in code and overlaid on the brain.
This preserves anatomical honesty for the overall form while giving full control over the
one surface the level actually needs to be interactive.

The fallback is not a lesser outcome. It may prove easier to art-direct.

---

## Scene Graph

```
<Canvas dpr={[1, 2]}>
  <Suspense fallback={<SceneLoader/>}>
    <Lighting/>
    <CameraRig/>              driven by machine state, not user scroll
    <BrainMesh/>              whole brain, stylized material
    <PrecentralHighlight/>    emissive overlay, visible in overview
    <HomunculusStrip/>        mounts only when focused
      <TerritorySegment/>     one per body part, sized by corticalShare
    <LesionMarker/>           mounts when a site is selected
  </Suspense>
</Canvas>
```

### The body diagram is 2D SVG, not 3D

A deliberate call. The deficit visualization needs crisp, clearly labeled body parts with
three legible severity states, animating on cue. An SVG body diagram does that better than
a 3D body model, costs no asset pipeline work, is trivially accessible, and sidesteps a
second rigging problem entirely. The 3D budget belongs in the brain, which is what the
level is actually about.

---

## Simulation State Machine

```ts
type Phase =
  | 'overview'       // whole brain, precentral highlighted
  | 'stripFocused'   // homunculus revealed, awaiting lesion choice
  | 'predicting'     // site chosen, awaiting prediction
  | 'revealed'       // deficit shown
  | 'rehab';         // plasticity beat

interface SimState {
  phase: Phase;
  hemisphere: Hemisphere;
  lesionSite: BodyPart | null;
  prediction: BodyPart | null;
  rehabWeek: number;
}

type SimAction =
  | { type: 'FOCUS_STRIP' }
  | { type: 'RETURN_TO_OVERVIEW' }
  | { type: 'SELECT_LESION'; site: BodyPart }
  | { type: 'SUBMIT_PREDICTION'; part: BodyPart }
  | { type: 'SKIP_PREDICTION' }
  | { type: 'ADVANCE_TO_REHAB' }
  | { type: 'SET_REHAB_WEEK'; week: number }
  | { type: 'RESET_SCENARIO' };
```

One reducer owns every transition. Components dispatch; they never hold simulation state
in local `useState`. `RESET_SCENARIO` returns to `stripFocused` without a page reload,
satisfying replayability.

The camera is a *consequence* of phase, not an independent input — `CameraRig` reads the
current phase and animates to that phase's framing. This is what makes the transition
skippable: a second interaction advances the phase, and the rig retargets mid-flight.

---

## Content Schema

```ts
export type Severity = 'complete' | 'partial' | 'spared';
export type Hemisphere = 'left' | 'right';
export type BodyPart =
  | 'toes' | 'leg' | 'hip' | 'trunk' | 'shoulder' | 'arm'
  | 'hand' | 'fingers' | 'thumb' | 'neck' | 'face' | 'lips' | 'jaw' | 'tongue';

export interface Source { claim: string; citation: string; url?: string }

export interface Territory {
  id: BodyPart;
  label: string;          // plain-language display name
  corticalShare: number;  // 0–1, share of strip length — encodes the distortion
  order: number;          // medial → lateral
}

export interface Scenario {
  id: string;
  label: string;
  siteTerritory: BodyPart;
  deficits: { part: BodyPart; severity: Severity }[];
  dayToDay: string;       // what this means for a person, plain language
  surprise?: string;      // the counter-intuitive fact, where there is one
  sources: Source[];
}

export interface PlasticityBeat {
  mechanism: string;                                  // named in plain language
  timeline: { week: number; recoveryFraction: number }[];
  caveat: string;                                     // partial and variable
}

export interface RegionContent {
  id: string;
  name: string;           // clinical
  plainName: string;      // lay
  overview: string;
  insight: string;        // the level's central "why"
  territories: Territory[];
  scenarios: Scenario[];
  plasticity: PlasticityBeat;
  sources: Source[];
}
```

### Why deficits are authored, not computed

A tempting design is to compute deficits from lesion position via an adjacency rule. It
would be wrong. Real deficit patterns follow vascular territories and clinical reality,
not tidy geometric spread — the leg is spared in an MCA stroke because of *blood supply*,
not because it is far along the strip.

So clinical truth lives in content, author-controlled and individually sourced. The pure
function's job is narrower and genuinely testable: match site to scenario, apply the
contralateral crossing, and order the results.

```ts
function resolveDeficit(
  site: BodyPart,
  content: RegionContent,
  hemisphere: Hemisphere
): { side: Hemisphere; entries: { part: BodyPart; severity: Severity }[] }
```

`side` is always the opposite of `hemisphere`. That inversion is one line of code and the
single most misunderstood fact in the level, so it gets its own test.

The selectable lesion sites are derived — `content.scenarios.map(s => s.siteTerritory)` —
so a fourth authored scenario becomes selectable with no component change. Territories
outside that set render as non-selectable rather than silently ignoring clicks, which
means `resolveDeficit` is only ever called with a site it can match.

---

## Component Design

### Scene (`levels/motor-cortex/scene/`)
- `BrainMesh` — loads the GLB, applies the stylized material.
- `PrecentralHighlight` — emissive region-of-interest overlay; the click target in overview.
- `HomunculusStrip` — lays out `TerritorySegment`s along the gyrus path, each sized by
  `corticalShare`. The distortion emerges from the data rather than being hand-placed.
- `TerritorySegment` — hover/focus/selected states; dispatches `SELECT_LESION`.
- `LesionMarker` — marks the chosen site once selected.
- `CameraRig` — animates framing from the current phase, and owns orbit-control enablement:
  free rotation in `overview`, locked once focused on the strip.

### UI (`levels/motor-cortex/ui/`)
- `BodyDiagram` — SVG body, renders severity per part, mirrors territory hover.
- `InsightPanel` — surfaces `content.insight`; the "why is it distorted" explanation.
- `PredictionPrompt` — concrete choices, a skip control, explanatory feedback.
- `DeficitPanel` — `dayToDay` text, the `surprise` callout, contralateral explanation.
- `RehabTimeline` — scrubbing control over `plasticity.timeline`; drives `SET_REHAB_WEEK`.

---

## Accessibility

Territory selection and prediction are real focusable controls with keyboard handlers, not
raycast-only 3D interactions — the 3D mesh is the *presentation* of a control, never its
only affordance. Severity carries a label and a pattern, never color alone.
`prefers-reduced-motion` swaps camera flights and deficit animations for immediate cuts,
which the phase-driven `CameraRig` makes straightforward: same target, zero duration.

---

## Testing

Per the project verification policy — Vitest over pure logic, and eyes on everything
visual.

| Tested | How |
|---|---|
| `resolveDeficit` site→scenario matching | Vitest, per scenario |
| Contralateral inversion | Vitest, both hemispheres |
| Reducer transitions, including skip and reset | Vitest over the reducer alone |
| Content conforms to `RegionContent` | Vitest schema validation over `content/regions/*` |
| `corticalShare` values sum to 1 | Vitest |
| Mesh loading, materials, lighting | manual browser check |
| Camera framing and flight feel | manual browser check |
| Homunculus layout legibility | manual browser check |

The simulation is deliberately decoupled from R3F so the first four rows need no 3D
context, no canvas, and no headless browser.
