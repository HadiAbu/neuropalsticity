# Amygdala Slice — Tasks

**Goal:** Generalize the shared parts of the first slice into `src/lib/`, then build the
amygdala level: translucent brain, glowing amygdalae, three threat stimuli with prediction,
an intact-vs-damaged response dashboard, and a compensation-style plasticity beat.

**Spec:** `.kiro/specs/amygdala-slice/{requirements,design}.md`
**Mode:** controller implements directly; tests + build + lint are the gates; visual checks
are a human walkthrough. Commits per task, on branch `amygdala-slice`.

## Global Constraints

- Client-side only; no LLM calls; no persistence.
- No state library. TypeScript strict, no `any`.
- All copy in `src/content/`. Aliases only (`@/*`, `@content/*`, `@levels/*`, `@lib/*`).
- Motor level behaviour unchanged; all 53 existing tests pass after the refactor.

---

- [ ] **1. Generalize the content schema**
  Add `RegionBase`, `SomatotopicMechanic`, `ThreatMechanic`, `ResponseProfile`,
  `PredictionChoice`, `ThreatStimulus`, `SomatotopicContent`, `ThreatContent`; make
  `RegionContent` the union. Split the validator into base + per-kind, adding the threat
  checks. Add `kind: 'somatotopic'` to `motor-cortex.ts`. Add threat-validator tests.
  _Requirement: 1.1–1.5_

- [ ] **2. Extract the generic state machine and simulation factory**
  Move `machine.ts` to `src/lib/simulation/` with `SimState<Site, Choice>`, rename
  `stripFocused→focused`, `lesionSite→site`, `FOCUS_STRIP→FOCUS`, `SELECT_LESION→SELECT_SITE`.
  Add `createSimulation.tsx`. Point the motor level's `useSimulation` at the factory. Update
  motor components, `flow.ts`, and tests for the renames.
  _Requirement: 2.1, 2.2, 2.4, 2.5_

- [ ] **3. Extract the scene shell and rail**
  Move `BrainScene` (with `orbitEnabled` prop), `CameraRig` (with `framing` + `phase` props),
  `Lighting`, `SceneLoader`, `ProgressRail` (with `phase` + `onJump`) to `src/lib/`. Motor
  level passes its `BrainMesh` as a child and its framing table as a prop.
  _Requirement: 2.3, 2.5_

- [ ] **4. Rebuild the mesh with amygdalae and commit the pipeline**
  Write `scripts/build-brain-glb.mjs` (STL → merged, rotated, recentred, GLB, Draco) covering
  the four existing parts plus FMA61841/FMA61842. Regenerate `public/models/brain.glb`.
  Update `docs/ASSET_LICENSE.md` and the decision record with the new parts and node names.
  Verify with `gltf-transform inspect` that all six nodes exist and the bbox matches the old
  frame.
  _Requirement: 3.1, 3.2, 3.4_

- [ ] **5. Author the amygdala content**
  `src/content/regions/amygdala.ts` (`kind: 'threat'`): overview, insight, premise, three
  stimuli with four choices each, intact/damaged profiles, explanations, sources; plasticity
  beat framed as compensation. Tests: conforms, three stimuli, one correct choice each,
  damaged snake heart rate lower than intact, fearful-face damaged `fearRecognized === false`.
  _Requirement: 5.1, 6.2, 7.1–7.4_

- [ ] **6. Pure response resolution**
  `src/levels/amygdala/simulation/resolveResponse.ts`:
  `resolveResponse(stimulusId, content) → { stimulus, intact, damaged, correctChoiceId }`;
  throws on unknown id. Tests.
  _Requirement: 6.1_

- [ ] **7. Amygdala scene**
  `AmygdalaBrainMesh` (translucent outside overview, glowing `Amygdala_L/R`, click → FOCUS),
  level `useSimulation` instance, framing table, `AmygdalaLevel` shell with header, rail, exit.
  _Requirement: 3.3, 4.1–4.3_

- [ ] **8. Stimuli, prediction, dashboard, compensation**
  `StimulusChooser` (focused), `PredictionPrompt` (four choices + skip), `ResponseDashboard`
  (intact vs damaged, gauge + text), `CompensationTimeline`. Wire into `AmygdalaLevel`.
  _Requirement: 5.2–5.4, 6.1–6.4, 7.1–7.4, 9.1_

- [ ] **9. Hub wiring and verification**
  Registry: amygdala `available`; `App` routes `amygdala` to `AmygdalaLevel`. Run tests, build,
  lint; dev-server 200s for the new GLB; ledger the visual checks for the human walkthrough.
  _Requirement: 8.1–8.3, 9.2–9.4_
