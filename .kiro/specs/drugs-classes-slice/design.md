# Drugs & the Brain — Design

## Shape

```
src/content/regions/drugs.ts              PharmacologicContent (3 substances)
src/levels/drugs/
  simulation/resolveEffect.ts            pure: substance lookup, correct choice, rehab synapse interpolation
  scene/DrugsBrainMesh.tsx               translucent on focus; Caudate/Putamen glow; VTA marker
  ui/SynapseView.tsx                     SVG driven by SynapseState + action + drugActive
  ui/SubstanceChooser.tsx / PredictionPrompt.tsx / EffectDashboard.tsx / ToleranceTimeline.tsx
  DrugsLevel.tsx / useSimulation.ts
src/lib/ui/HeartGauge.tsx                extracted from the amygdala dashboard (second consumer)
```

## Synapse state per phase

| Phase | State | Drug active |
|---|---|---|
| focused, predicting | `baseline` | no |
| revealed | `acute` | yes |
| rehab | `lerp(tolerant → baseline density, recoveryFraction)`, activation = baseline × density | no |

`rehabSynapse(substance, fraction)` is a pure function: density moves from `tolerant` back
toward 1; the cleft holds baseline transmitter; activation scales with density. At week 0 the
abstinent brain is flat — fewer receptors, ordinary signal — which is the felt meaning of
withdrawal and anhedonia. As the slider advances, density recovers.

## Synapse rendering

Fixed geometry: presynaptic bulb top, cleft middle, postsynaptic membrane bottom. Ten receptor
slots; `round(density × 10)` drawn, `round(activation × drawn)` lit. Twenty-four transmitter
positions; `round(cleft × 24)` drawn. One pump on the presynaptic membrane. Drug molecules are
hexagons in a distinct colour: over the pump for `blocks-reuptake`, beside lit receptors for
`enhances-receptor`, inside lit receptors (replacing transmitter) for `mimics-transmitter`.
Transitions on opacity only; reduced motion disables them.

## 3D

`DrugsBrainMesh` mirrors `AmygdalaBrainMesh` with node prefixes `Caudate` / `Putamen` glowing.
A `VtaMarker` sphere sits at the midbrain's approximate position `(0, -18, -6)` in the mesh
frame; the UI labels it approximate. Framing looks in from the front-left at the striatum.

## Plasticity

Level-wide beat: adaptation to a drug is tolerance; its shadow is dependence. Per-substance
`adaptation` copy names what specifically changes. The timeline is receptor availability
recovering after use stops (imaging-study timescales), partial at one year; caveat says
craving can outlast it.
