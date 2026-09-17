# Drugs & the Brain — Tasks

**Spec:** `.kiro/specs/drugs-classes-slice/{requirements,design}.md` · **Branch:** `drugs-classes-slice`
**Mode:** controller implements directly; tests + build + lint gate; visuals by human walkthrough.

- [ ] **1. Schema: `pharmacologic` kind + validation + tests** _Req 1.1–1.3_
- [ ] **2. Mesh: add Caudate_L/R, Putamen_L/R via `scripts/build-brain-glb.mjs`; update license + decision record** _Req 2.1_
- [ ] **3. Content: `drugs.ts` (alcohol, cocaine, morphine) + tests** _Req 1.2_
- [ ] **4. `resolveEffect` + `rehabSynapse` pure functions + tests** _Req 4.1_
- [ ] **5. `SynapseView` SVG** _Req 3.1–3.3_
- [ ] **6. `DrugsBrainMesh` + `VtaMarker`, `DrugsLevel`, chooser, prompt, dashboard (with `HeartGauge` extracted to lib), tolerance timeline** _Req 2.2, 4.1–4.2_
- [ ] **7. Registry + themed hub sections + routing; verify; ledger visual checks** _Req 5.1, 6_
