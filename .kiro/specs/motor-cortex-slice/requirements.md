# Motor Cortex Slice — Requirements

## Overview

The first vertical slice of neuropalsticity. It covers a single brain region — the primary
motor cortex — end to end: 3D scene, homunculus reveal, lesion scenarios, prediction
mechanic, deficit visualization, and the closing neuroplasticity beat.

Its purpose is to **prove the whole pipeline works** before scaling to the other ~30
levels. Every architectural decision here is a decision about all future levels, so the
slice must be genuinely complete rather than a prototype — but scoped to one region only.

**In scope:** primary motor cortex (precentral gyrus), three lesion scenarios, one rehab
beat, the content schema, the shared 3D helpers this level happens to need.

**Out of scope:** every other brain region, Themes B and C, navigation between levels,
progress persistence, accounts, sound.

---

## Requirements

### 1. 3D Scene Foundation

**1.1** The app shall render a 3D brain model in a React Three Fiber canvas that the user
can rotate and zoom with mouse or touch.

**1.2** The brain model shall be sourced from an open-licensed anatomical mesh whose
license permits use in this project. The license shall be recorded in the repository.

**1.3** The source model shall be verified to expose the precentral gyrus as an
independently selectable and highlightable surface. If it does not, the motor strip
geometry shall instead be generated procedurally and overlaid on the brain mesh.

**1.4** The 3D canvas shall be wrapped in `<Suspense>` with a non-3D loading fallback so
the page never presents a blank canvas while assets load.

**1.5** The scene shall cap device pixel ratio to avoid uncapped retina rendering.

**1.6** The brain shall be rendered in the project's stylized-but-honest visual direction:
real anatomical proportions, custom material treatment, not photoreal medical imagery.

---

### 2. Motor Cortex Identification

**2.1** On initial load the precentral gyrus shall be visually highlighted as the region
of interest, distinguishable from surrounding cortex.

**2.2** Clicking or tapping the highlighted precentral gyrus shall trigger an animated
camera transition that frames the motor strip.

**2.3** The camera transition shall be skippable — a user who clicks again during the
transition shall land at the final framing immediately rather than being forced to wait.

**2.4** Free rotation of the whole brain shall be disabled once focused on the strip, and
a clearly labeled control shall return the user to the whole-brain view.

---

### 3. Homunculus Reveal

**3.1** Once focused, the motor strip shall display the motor homunculus: the topographic
mapping of body parts onto positions along the precentral gyrus.

**3.2** Body-part territories shall be sized in proportion to their real cortical
territory, not their physical body size — hands, fingers, and face occupying
disproportionately large areas relative to trunk and legs.

**3.3** Territories shall be ordered anatomically along the strip from medial to lateral:
toes, leg, hip, trunk, shoulder, arm, hand, fingers, thumb, neck, face, lips, jaw, tongue.

**3.4** The interface shall explicitly surface *why* the mapping is distorted — cortical
space is allocated by precision of control, not body size. This is the level's central
insight and shall not be left for the user to infer.

**3.5** Hovering or focusing a territory shall highlight both the cortical territory and
the corresponding body part on the body diagram, making the mapping legible in both
directions.

---

### 4. Lesion Scenarios

**4.1** The slice shall ship exactly three lesion scenarios:

| Scenario | Site | Real-world deficit |
|---|---|---|
| Hand-knob | hand/finger territory, lateral strip | isolated contralateral hand and finger weakness, mimicking a peripheral nerve injury |
| Lateral (MCA territory) | face and arm territory | contralateral face and arm weakness, leg relatively spared |
| Medial (ACA territory) | leg and foot territory, over the midline | contralateral leg-dominant weakness |

**4.2** The user shall select a lesion site by clicking a territory on the motor strip.

**4.2.1** Only territories with an authored scenario shall be selectable as lesion sites.
The set of selectable territories shall be derived from the content file, never hard-coded
in a component, so authoring a fourth scenario makes its territory selectable with no code
change.

**4.2.2** Territories without an authored scenario shall remain hoverable and informative —
they still teach the homunculus mapping — but shall be visibly and programmatically marked
as non-selectable rather than silently doing nothing when clicked.

**4.3** Resulting deficits shall be **contralateral** — a lesion in the left hemisphere
shall produce deficits on the right side of the body, and vice versa.

**4.4** The contralateral crossing shall be explicitly explained when it is first shown,
because it is counter-intuitive to a lay audience.

**4.5** Each scenario's clinical accuracy shall be traceable to its source. Content files
shall carry a source reference for every clinical claim.

**4.6** Scenarios shall be replayable and resettable without reloading the page.

---

### 5. Prediction Mechanic

**5.1** After selecting a lesion site and before the outcome is revealed, the user shall be
asked to predict which body part will be affected.

**5.2** The prediction shall be presented as a small set of concrete choices, not free text.

**5.3** The user shall be able to skip predicting and reveal the outcome directly.

**5.4** Feedback on an incorrect prediction shall explain *why* the real answer is correct.
It shall not shame, score, or gate progress on a correct answer.

**5.5** No points, streaks, or scoring shall be implemented in this slice. The prediction
exists to create a moment of commitment before the reveal, not to grade the user.

---

### 6. Deficit Visualization

**6.1** On reveal, the lesion site shall be visibly marked on the motor strip.

**6.2** A linked body diagram shall animate the resulting deficit on the correct
contralateral side, showing which parts lose function and which are spared.

**6.3** The visualization shall distinguish degrees of impairment — complete loss,
partial weakness, and spared — rather than a binary on/off.

**6.4** Accompanying plain-language text shall describe what this deficit would actually
mean for a person day to day.

**6.5** The deficit shall be derived by a pure function of lesion site and region content,
so it is unit-testable without mounting a 3D scene.

---

### 7. Neuroplasticity Beat

**7.1** Every scenario shall close with a neuroplasticity beat. No scenario shall end on
damage alone.

**7.2** The beat shall present a rehabilitation timeline over simulated weeks in which
repetitive training partially restores function.

**7.3** The visualization shall show neighboring cortical territory taking over some of
the lost region's function.

**7.4** Recovery shall be depicted as **partial and variable**, with the steepest gains
early. It shall not imply guaranteed or complete recovery.

**7.5** The beat shall name the real mechanism driving it — use-dependent plasticity and
cortical remapping — in plain language.

---

### 8. Content Data Layer

**8.1** All user-facing copy, scenario definitions, deficit descriptions, and plasticity
text shall live in `src/content/` as typed data, never inline in components.

**8.2** `src/content/schema.ts` shall define the `RegionContent` contract that all current
and future region content conforms to.

**8.3** The schema shall be designed so a future region can be authored as data alone,
without changing the schema — while accepting that its *mechanics* will be new code.

**8.4** Content files shall be validated against the schema by a unit test, so malformed
generated content fails in CI rather than at runtime.

**8.5** The motor cortex content file shall be complete enough to serve as the reference
example for generating all future region content.

---

### 9. Visual Design & Accessibility

**9.1** The interface shall support keyboard navigation for all interactive elements,
including territory selection and the prediction choices.

**9.2** Information shall never be conveyed by color alone — deficit severity shall also be
distinguished by label, pattern, or shape.

**9.3** Text and meaningful UI shall meet WCAG AA contrast against their backgrounds.

**9.4** The interface shall respect `prefers-reduced-motion`, replacing camera flights and
deficit animations with immediate state changes.

**9.5** The layout shall be usable at common laptop and tablet widths. Phone support is not
required in this slice.

---

### 10. Constraints

**10.1** The slice shall run entirely client-side with no backend, API, or database.

**10.2** The shipped build shall make no LLM API calls.

**10.3** Progress shall not persist between sessions.

**10.4** Verification shall follow the project policy: Vitest over pure logic, a passing
production build, and a manual browser check for all 3D and visual work.
