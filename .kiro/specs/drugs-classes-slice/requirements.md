# Drugs & the Brain — Requirements

## Overview

The first Theme B level and the third mechanic family. Every psychoactive drug acts at the
synapse; this level shows three ways in — enhance the brake (alcohol on GABA), jam the
recycling pump (cocaine on the dopamine transporter), impersonate the messenger (morphine at
opioid receptors) — and then shows the brain adapting, which is tolerance and dependence.

**In scope:** `pharmacologic` content kind + validation, striatum meshes and an approximate
VTA marker, translucent-brain focus, animated synapse view, three substances with prediction,
sober-vs-acute effect dashboard, tolerance/recovery plasticity beat, hub section for Theme B.

**Out of scope:** dose curves, overdose simulation, polydrug interactions, other substances.

---

### 1. Content Kind

**1.1** `PharmacologicContent = RegionBase & { kind: 'pharmacologic'; pathway; substances[] }`.

**1.2** Each substance carries: scenario, class, transmitter, action
(`enhances-receptor | blocks-reuptake | mimics-transmitter`), three synapse states
(`baseline`, `acute`, `tolerant`; each `transmitterInCleft`, `receptorActivation`,
`receptorDensity` in 0–1), four prediction choices (one correct), `sober` and `acute`
effect profiles (heart rate, reaction time, mood, behaviour, report), explanation, adaptation,
day-to-day, sources.

**1.3** Validation rejects: duplicate substance ids; fewer than two choices; zero or multiple
correct choices; heart rates outside 30–220; any synapse value outside 0–1; no sources.

### 2. 3D Presence

**2.1** Add caudate and putamen (L/R) from BodyParts3D via the committed pipeline, same frame.

**2.2** On focus the brain turns translucent; the striatum glows and a small marker shows the
VTA's approximate position, labelled as approximate in the UI.

### 3. Synapse View

**3.1** An SVG synapse driven entirely by a `SynapseState`: transmitter dots proportional to
`transmitterInCleft`, receptor slots proportional to `receptorDensity`, activated receptors
proportional to `receptorActivation`, a reuptake pump.

**3.2** When the drug is active the view shows its action: molecules blocking the pump,
attached beside receptors, or sitting in receptors, according to `action`.

**3.3** The view has a text summary (aria-label) so it is never colour-only.

### 4. Flow

**4.1** `focused`: synapse at baseline + substance chooser. `predicting`: four choices, skip.
`revealed`: synapse at `acute` with drug active; dashboard sober vs acute; explanation.
`rehab`: synapse interpolates from `tolerant` toward baseline density as the slider advances;
adaptation text; tolerance/dependence framing; recovery caveat.

**4.2** Every interaction has a keyboard path. Reduced motion respected.

### 5. Hub

**5.1** Registry gains `drugs-classes` under theme `drugs`, available. The hub groups cards by
theme with a heading per theme; empty themes are hidden.

### 6. Constraints

Client-side only; no LLM calls; no persistence; Vitest for logic; build + lint clean; visuals
by human walkthrough. Existing 70 tests keep passing.
