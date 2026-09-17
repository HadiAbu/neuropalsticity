# 3D Hub — Design

```
src/content/levels.ts        LevelEntry.anatomy: { nodePrefixes?: string[]; marker?: Vec3 }
src/hub/HubScene.tsx         Canvas + ghost brain + glow/dim nodes + markers + hover labels
src/hub/LevelHub.tsx         layout: full-bleed HubScene, title, compact themed list, shared hover state
```

## Hotspot resolution

At load, walk the GLB once and build `nodeLevel: Map<meshName, levelId>` from each level's
`nodePrefixes`. Materials: `ghost` (translucent, no depth write) for unmatched nodes;
`glow` / `glowHover` for available matches; `dim` for locked matches. Label anchor per level
is `marker` if present, else the centroid of its matched meshes' bounding box.

## Events

Pointer handlers sit on the `<primitive>`; `e.object.name` maps through `nodeLevel`. Because
R3F delivers events to every intersected object, the handler only *sets* hover on a match and
never clears on a non-match; clearing happens on `pointerout` of the matched object. Markers
are ordinary meshes with their own handlers.

## Shared hover

`LevelHub` owns `hoveredId`. `HubScene` and the list both read it and both set it, so
highlighting is symmetric. Auto-rotate is `!reducedMotion && hoveredId === null`.

## Positions (approximate, mesh frame: x left–right, y up, z front)

somatosensory `[30, 58, -15]` · visual `[0, 5, -70]` · speech `[-58, 5, 25]` · prefrontal
`[0, 25, 66]` · hippocampus `[-28, -20, -12]` · basal ganglia `[-22, -8, 8]` · brainstem
`[0, -50, -12]` · VTA (drugs) `[0, -18, -6]`. Real meshes: precentral gyri, amygdalae,
striatum, cerebellum (dim, locked).
