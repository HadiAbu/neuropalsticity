# Amygdala Slice — Requirements

## Overview

The second level of neuropalsticity, and the first that cannot reuse the motor cortex's
mechanics. The amygdala has no body map; it sits at the centre of a threat circuit and
drives an autonomic and behavioural response. So this slice does two things: it
**generalizes the parts of the first slice that were always meant to be shared** (content
envelope, state machine, camera rig, progress rail, scene shell), and it builds a level
whose scenario is *what fear does for us, shown by taking it away*.

Grounded in the bilateral amygdala-damage literature (Urbach–Wiethe disease, patient S.M.):
no fear response to innate threats, impaired recognition of fear in faces, no sense of
personal space, intact knowledge that things are dangerous.

**In scope:** schema generalization, shared runtime extraction to `src/lib/`, amygdala L/R
meshes, translucent-brain focus, three stimulus scenarios, prediction, response dashboard,
compensation-style plasticity beat, hub entry.

**Out of scope:** the hyperactive/PTSD dial, the low-road/high-road circuit animation,
every other region, persistence, sound.

---

## Requirements

### 1. Content Schema Generalization

**1.1** `src/content/schema.ts` shall define a shared `RegionBase` (id, name, plainName,
overview, insight, plasticity, sources) and a `kind`-discriminated mechanic block:
`somatotopic` (territories + lesion scenarios, as today) and `threat` (stimuli with
intact-vs-damaged response profiles).

**1.2** `RegionContent` shall be the union `SomatotopicContent | ThreatContent`.

**1.3** `validateRegionContent` shall run the shared checks for every kind and the
kind-specific checks for the matching kind. Existing somatotopic checks shall be preserved.

**1.4** The motor cortex content shall gain `kind: 'somatotopic'` and otherwise be unchanged;
its 7 content tests and the 10 schema tests shall keep passing.

**1.5** Threat-kind validation shall reject: a stimulus with no `correct` prediction choice,
more than one `correct` choice, fewer than two choices, a missing intact or damaged profile,
a heart rate outside 30–220 bpm, and a stimulus with no sources.

---

### 2. Shared Runtime Extraction

**2.1** The simulation state machine shall move to `src/lib/simulation/machine.ts` and be
generic over the site and choice identifiers (`SimState<Site, Choice>`), with the phase
`stripFocused` renamed to `focused`.

**2.2** `src/lib/simulation/createSimulation.tsx` shall export a factory returning a typed
`SimulationProvider` and `useSimulation` pair, so each level owns a typed instance without
re-implementing the reducer.

**2.3** `CameraRig`, `Lighting`, `SceneLoader`, `BrainScene`, and `ProgressRail` shall move
to `src/lib/` and take their level-specific inputs as props (camera framing per phase; orbit
enablement; the phase and a jump-back handler).

**2.4** `FLOW_STEPS` in `src/content/flow.ts` shall reference the renamed `focused` phase.

**2.5** The motor cortex level shall be behaviourally unchanged after the extraction. All 53
existing tests shall pass, with only import paths and the phase rename adjusted.

---

### 3. Amygdala 3D Presence

**3.1** Left and right amygdala meshes from BodyParts3D shall be added under the existing CC
BY-SA 2.1 JP license, in the **same coordinate frame** as `brain.glb` (same rotation, same
recentering offset), so they sit in their true position deep in the temporal lobes.

**3.2** The conversion pipeline shall be committed as a runnable script
(`scripts/build-brain-glb.mjs`) that regenerates the brain mesh with all parts, closing the
reproducibility gap parked in the first slice.

**3.3** In `overview` the brain shall be opaque with the amygdalae not visible; on focus the
cortex and white matter shall become translucent so both amygdalae are visible glowing
inside.

**3.4** The license record shall list the added parts.

---

### 4. Focus and Damage

**4.1** Clicking the brain or the "Focus" control shall enter `focused`, turning the brain
translucent and revealing the amygdalae.

**4.2** The level's premise — both amygdalae damaged — shall be stated explicitly in
`focused`, with a plain-language line on why it is bilateral (the real cases are).

**4.3** Free rotation shall be disabled once focused, with a labelled control to return.

---

### 5. Stimuli and Prediction

**5.1** The level shall ship exactly three stimuli, each with a source reference:

| Stimulus | Damaged-amygdala outcome |
|---|---|
| A live snake within reach | calm interest; touches it; heart rate flat |
| A face showing fear | cannot name the emotion; other emotions still recognised |
| A stranger stands nose-to-nose | no discomfort at any distance |

**5.2** Selecting a stimulus shall enter `predicting`; the player shall choose from exactly
four concrete outcomes, one correct.

**5.3** Prediction shall be skippable and shall carry no score.

**5.4** Feedback on a wrong prediction shall explain why the real outcome happens.

---

### 6. Response Dashboard

**6.1** On reveal, an intact-vs-damaged dashboard shall show, side by side: heart rate
(bpm, with a visual gauge), sweat response (none / mild / strong), behaviour (one line), and
what the person reports (one line).

**6.2** For the fearful-face stimulus the dashboard shall additionally show whether fear was
recognised.

**6.3** Severity and magnitude shall never be conveyed by colour alone.

**6.4** A plain-language line shall state what this would mean day to day.

---

### 7. Plasticity Beat

**7.1** The beat shall be honest that bilateral amygdala damage does not repair.

**7.2** It shall show compensation instead: over simulated weeks, cortical routes let the
person *learn that* something is dangerous without *feeling* that it is, and adopt explicit
safety rules.

**7.3** The timeline's recovery fraction shall represent "learned safety behaviours adopted",
not restored fear, and the caveat shall say so.

**7.4** The mechanism shall be named in plain language.

---

### 8. Hub and Flow

**8.1** The `amygdala` level shall become `available` in the registry and open from the hub.

**8.2** Exit shall return to the hub and reset the level.

**8.3** The progress rail shall show the same five steps.

---

### 9. Accessibility and Constraints

**9.1** Every 3D interaction shall have a keyboard twin (focus, stimulus choice, prediction).

**9.2** WCAG AA contrast; `prefers-reduced-motion` respected.

**9.3** Client-side only; no LLM calls; no persistence.

**9.4** Verification: Vitest over pure logic, passing build, manual browser check for visuals.
