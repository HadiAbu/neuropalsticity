# ADR 001: Brain mesh source, license, and highlighting strategy

Status: **Accepted**
Date: 2026-09-17

## Summary

- **strategy: separable-gyrus**
- Model source: **BodyParts3D / Anatomography** (Database Center for Life
  Science, Japan), obtained via the STL mirror at
  `github.com/Kevin-Mattheus-Moerman/BodyParts3D`.
- License: **CC BY-SA 2.1 Japan** (acceptable per project ruling; share-alike
  obligation recorded in `docs/ASSET_LICENSE.md`).
- Committed asset: `public/models/brain.glb` (2.32 MB, Draco-compressed,
  452,744 triangles across 4 named mesh nodes).
- Exact glTF node names for the primary motor cortex (precentral gyrus):
  **`PrecentralGyrus_R`** and **`PrecentralGyrus_L`**.

## Candidates evaluated

| Candidate | Source | License | Separable precentral gyrus? | Poly count | glTF export? | Verdict |
|---|---|---|---|---|---|---|
| **BodyParts3D / Anatomography** (STL mirror) | github.com/Kevin-Mattheus-Moerman/BodyParts3D | CC BY-SA 2.1 Japan | **Yes** — `FMA72661.stl` (right precentral gyrus) and `FMA72662.stl` (left precentral gyrus) exist as standalone STL files, confirmed present in the repo tree and in `parts_list_e.txt` | 18,838 / 18,836 tri (gyri) + 176,564 (white matter) + 238,506 (cerebellum) tri for context = 452,744 tri total, undecimated | No native glTF export, but STL→glTF is a simple, lossless, scriptable conversion (no Blender needed) — see below | **Chosen** |
| Z-Anatomy | simtk.org/projects/z-anatomy (Blender project, itself a retopologized fork of BodyParts3D) | CC BY-SA | Unknown without opening the Blender file; likely yes given lineage, but unverifiable here | Unknown | Requires Blender to extract/export individual meshes — **Blender is not installed in this environment** | Rejected — no Blender-free path to individual meshes; same underlying data is reachable directly through BodyParts3D instead |
| Sketchfab "Regions of the brain" (Univ. of Dundee, CAHID) | sketchfab.com/3d-models/regions-of-the-brain-... | CC BY-SA 2.1 Japan (also BodyParts3D-derived) | Not confirmed from the listing page; likely similar granularity to BodyParts3D | 8.3M triangles / 4.1M vertices — far too dense for real-time web without heavy decimation | Sketchfab's "Download" flow requires an authenticated, interactive session (no curl/API path available here) | Rejected — same license lineage as our chosen candidate, but not scriptably downloadable and far too dense |
| FreeSurfer fsaverage / Desikan-Killiany parcellation | surfer.nmr.mgh.harvard.edu | Permissive research license (not a standard CC license; would need separate review) | Yes in principle — "precentral" is a named DK atlas region | Unknown (typically ~150k tri per hemisphere at full res) | Ships as FreeSurfer surface + `.annot` label files, requiring `nibabel`/FreeSurfer tooling to extract a per-label sub-mesh and export to OBJ/glTF. **No Python interpreter is available in this environment** (`python3` not found), and no npm package converts FreeSurfer surface formats. | Not pursued past a ~15 min scoping pass — real candidate for a future revisit if Python tooling is added, but blocked here and a working alternative was already found |
| Sketchfab CC0 "Model of a human brain" (Science Museum Group) and similar generic whole-brain models | sketchfab.com | CC0 / CC BY 4.0 | No — whole-brain scan surface with no region labels | Unknown | Sketchfab download friction as above | Rejected — would only support `procedural-strip`, and the chosen candidate already gives a real separable gyrus |
| Various Sketchfab "labeled brain" / medical-illustration models | sketchfab.com | Store/royalty-priced or unclear/NC | N/A | N/A | N/A | Rejected outright — unacceptable or unclear licenses per project ruling |

BodyParts3D resolved the project's single largest risk on the first fully
verifiable candidate, so evaluation stopped there rather than exhausting the
full ~20-minutes-per-candidate budget on the remaining entries.

## Why BodyParts3D / Anatomography

BodyParts3D (RIKEN / Database Center for Life Science) is a whole-body
anatomical model in which every structure is tagged with an FMA
(Foundational Model of Anatomy) ontology ID and shipped as an individually
selectable mesh, all sharing one body-scale coordinate system. Critically,
its ontology already splits gyri out individually, including:

- `FMA72661` — right precentral gyrus
- `FMA72662` — left precentral gyrus

Both exist as real, downloadable binary STL files (941,984 and 941,884
bytes respectively) in the community GitHub mirror
`Kevin-Mattheus-Moerman/BodyParts3D` (a re-packaging of the official
`lifesciencedb.jp/bp3d` release as binary STL for size/portability). This
directly satisfies the brief's hardest requirement: the primary motor
cortex is not something we have to carve out ourselves — it is already a
distinct anatomical part in the source data.

For brain context (so the gyrus isn't floating in space with nothing
around it), two more parts from the same body model were added:

- `FMA61822` — white matter structure of cerebral hemisphere (176,564 tri)
- `FMA67944` — cerebellum (238,506 tri)

These three families of parts (white matter body, cerebellum, precentral
gyri) share the same coordinate frame by construction (BodyParts3D is one
segmented body), which was confirmed empirically: combining the four raw
STL files without any manual alignment produced one coherent bounding box
of adult-brain scale (~120 x 132 x 154 mm) rather than four disjoint,
randomly-placed blobs.

Whole-lobe meshes (frontal/parietal/temporal lobe) are *not* available as
single STL files in this mirror — only individual gyri and a few
lobes (occipital, insula) are. A full patchwork of all ~26 available gyri
was considered but rejected as unnecessary scope for this task; the base
white-matter + cerebellum shape already gives a recognizable brain
silhouette, and the two precentral gyrus nodes are the only surface pieces
this project currently needs to be individually highlightable. Nothing
prevents adding more BodyParts3D gyri later using the same pipeline.

## Four-criteria answers

1. **License** — CC BY-SA 2.1 Japan. Acceptable under project rulings
   (attribution + share-alike, not NC). Full text and required attribution
   string recorded in `docs/ASSET_LICENSE.md`.
2. **Precentral gyrus separable?** — Yes, natively. `FMA72661.stl` /
   `FMA72662.stl` are standalone meshes in the source data, not something
   we extracted or guessed at. In the committed GLB they are the
   independent nodes `PrecentralGyrus_R` / `PrecentralGyrus_L`.
3. **Poly count** — 452,744 triangles total across all 4 nodes (176,564 +
   238,506 + 18,838 + 18,836), undecimated. This is workable for real-time
   web for a single static prop with no skinning/morph targets; no
   decimation was applied because Draco compression alone already met the
   size budget without any quality loss (see below). If Task 7/8
   profiling later shows a need, `npx @gltf-transform/cli simplify` can
   decimate further — attempted here at `--ratio 0.15 --error 0.01/0.03`,
   which reduced triangle count by <5% (the folded cortical surface has
   high curvature everywhere, so meshoptimizer's error metric refuses more
   aggressive collapses without a much larger, quality-degrading error
   budget). Left at full resolution rather than degrading gyral detail
   that Task 8 is specifically meant to highlight.
4. **glTF export** — No native exporter ships with BodyParts3D (source
   format is STL). Converted via a one-off Node script using three.js's
   own `STLLoader` + `GLTFExporter` (both ship in this repo's
   `node_modules/three/examples/jsm/...`), so no Blender or Python was
   required. See reproduction steps below.

## Bounding box, center, scale, up-axis (for Task 7 camera placement)

All measured on the final committed `public/models/brain.glb` via
`npx @gltf-transform/cli inspect`:

- Bounding box min: `(-60.096, -65.880, -77.116)`
- Bounding box max: `(60.097, 65.880, 77.116)`
- Size: `120.19 x 131.76 x 154.23` (X x Y x Z), in millimeters (real-world
  adult-anatomy scale from the source data)
- Center: `(0, 0, 0)` (recentered during conversion; original source data
  was centered at body-coordinate `(-0.65, -90.85, 1563.67)`, i.e. near the
  top of a ~1.7 m whole-body model — this was translated out)
- Up axis: **+Y** (glTF/three.js convention). The source body model uses
  +Z as the height/up axis; a -90° rotation about X was baked into the
  root `Brain` node during conversion to reorient it to +Y-up, so
  consumers do not need to reason about the original body frame.
- Largest dimension: 154.23 (Z depth) → suggested initial camera distance
  ≈ 2.5x that, ~385, rounded to 400 (used in the temporary `App.tsx`
  verification render as `camera.position = [0, 0, 400]`).

## GLB node structure

```
AuxScene (glTF scene)
└─ Brain              (rotation: -90° about X, bakes Z-up → Y-up)
   └─ BrainParts       (translation: recenters source body coords to origin)
      ├─ WhiteMatter_CerebralHemispheres   (mesh 0, 176,564 tri)
      ├─ Cerebellum                        (mesh 1, 238,506 tri)
      ├─ PrecentralGyrus_R                 (mesh 2, 18,838 tri)  ← highlight target
      └─ PrecentralGyrus_L                 (mesh 3, 18,836 tri)  ← highlight target
```

Task 8 can select the motor cortex with, e.g.,
`scene.getObjectByName('PrecentralGyrus_R')` /
`'PrecentralGyrus_L'` (or both, for a bilateral highlight).

## Reproduction: download + conversion commands

```bash
# 1. Download the four source STL parts (shared body coordinate system)
BASE="https://raw.githubusercontent.com/Kevin-Mattheus-Moerman/BodyParts3D/main/assets/BodyParts3D_data/stl"
curl -sL -o FMA61822.stl "$BASE/FMA61822.stl"   # white matter, cerebral hemispheres
curl -sL -o FMA67944.stl "$BASE/FMA67944.stl"   # cerebellum
curl -sL -o FMA72661.stl "$BASE/FMA72661.stl"   # precentral gyrus, right
curl -sL -o FMA72662.stl "$BASE/FMA72662.stl"   # precentral gyrus, left

# 2. Convert + combine with a Node script using three.js's own STLLoader
#    and GLTFExporter (no Blender/Python required). Key steps per part:
#      - STLLoader().parse(arrayBuffer)                  // read STL
#      - mergeVertices(geometry, 1e-4)                    // weld (STL has
#                                                          // no shared verts)
#      - geometry.computeVertexNormals()
#      - new THREE.Mesh(geometry, material); mesh.name = '<NodeName>'
#    Then: recenter the combined group at its bounding-box center, apply a
#    -90 deg rotation about X to convert the source Z-up frame to glTF's
#    Y-up, and export with GLTFExporter({ binary: true }).
#    (A Node FileReader polyfill is required for GLTFExporter's binary
#    path outside a browser: readAsArrayBuffer(blob) -> blob.arrayBuffer().)

# 3. Compress with Draco (no decimation — full triangle detail kept)
npx @gltf-transform/cli draco brain_raw.glb public/models/brain.glb
```

`npx @gltf-transform/cli inspect public/models/brain.glb` was used
throughout to verify triangle counts, bounding box, and (via `copy` back to
plain `.gltf` to inspect the JSON) that node names survive Draco
compression.

## Risk / follow-up notes for Task 7/8

- `@react-three/drei`'s `useGLTF` auto-wires a `DRACOLoader` pointed at
  Google's `gstatic.com` CDN by default (confirmed in
  `node_modules/@react-three/drei/core/Gltf.js`). This is standard
  practice and requires no extra configuration, but does mean decoding the
  mesh needs network access to that CDN the first time (cached after). If
  fully offline operation is ever required, the decoder can be
  self-hosted and pointed at via `useGLTF.setDecoderPath(...)`.
- Only white matter + cerebellum + the two precentral gyri are included.
  The rest of the cortical surface (frontal pole, parietal lobule,
  occipital lobe detail, etc.) is not modeled with gyral detail — the
  white matter mass gives the overall brain silhouette but will look
  smoother/less folded than a full pial surface almost everywhere except
  where the two gyrus meshes sit. This was an explicit scope decision (see
  "Why BodyParts3D" above) and is not a limitation of the source data —
  more BodyParts3D gyri (see `docs/ASSET_LICENSE.md` source repo) can be
  added with the same pipeline if a fuller cortex is wanted later.
- Visual/aesthetic confirmation (does it actually *look* like a brain and
  rotate smoothly) has **not** been done by a human — this was verified
  only via `curl` (HTTP 200, correct byte size) and `npm run build`
  passing, per this task's environment constraints. A human should open
  `npm run dev` and eyeball it before Task 7 relies on the visual result.

## Update — amygdala slice

The conversion pipeline narrated above is now committed as `scripts/build-brain-glb.mjs`
(closes the reproducibility gap). It hardcodes the original four-part recentring offset
`(-0.65, -90.85, 1563.67)` so added parts never shift the frame. Added `Amygdala_R`
(FMA72832, 1,744 tri) and `Amygdala_L` (FMA72833, 1,736 tri). Node tree is unchanged
otherwise; GLB is 2,343,936 bytes.

## Update — drugs slice

Added the striatum (`Caudate_L/R`, `Putamen_L/R`; FMA72826–72829) for the reward-pathway
glow. BodyParts3D has no nucleus accumbens or VTA part; the level marks the VTA with an
approximate sphere at `(0, -18, -6)` in the mesh frame and labels it approximate in the UI.

## Update — somatosensory slice

Added `PostcentralGyrus_R` / `PostcentralGyrus_L` (FMA72665/72666, 16,862 / 16,858 tri) —
the primary somatosensory cortex, separable in the same way the precentral gyrus was.
GLB is now 12 nodes, 2,924,568 bytes.
