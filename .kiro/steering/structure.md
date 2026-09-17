---
inclusion: always
---

# Project Structure

## Folder Layout

```
src/
├── content/
│   ├── schema.ts           # typed contract ALL level content conforms to
│   └── regions/
│       └── motor-cortex.ts # copy, subregions, scenarios, plasticity beat
├── levels/
│   └── motor-cortex/       # bespoke mechanics for this level only
│       ├── scene/          # R3F scene components
│       ├── simulation/     # reducer, state machine, deficit resolution
│       └── ui/             # level-specific 2D overlay components
├── hub/                    # level-select screen, driven by content/levels.ts
├── lib/                    # shared 3D helpers — model loading, highlighting, camera
├── components/             # shared 2D UI primitives
└── types/                  # shared TypeScript types
```

## The Content / Mechanics Split

This is the central architectural rule of the project.

**Content is data.** Anatomy copy, scenario text, deficit descriptions, and plasticity
beats live in `src/content/` as typed objects conforming to `schema.ts`. This is the
part that repeats across all 30+ eventual levels, and it is the handoff point for
build-time content generation with Fable.

**Mechanics are bespoke.** How a level *simulates* lives in `src/levels/<level>/` as
concrete components. A motor deficit animation is genuinely nothing like a synapse
simulation or a memory-mapping puzzle. Do not build a generic scenario engine.

Extract shared mechanics into `src/lib/` only when a *second* level actually demonstrates
the need. Abstractions here are discovered, never guessed.

## Conventions

### Components
- One component per file. Filename matches the export name (PascalCase).
- Typed props inline or via an exported `Props` interface. No `any`.
- R3F scene components live under `levels/<level>/scene/` and are suffixed by role
  (`BrainMesh`, `HomunculusStrip`, `LesionMarker`).

### Content Files
- Every file in `content/regions/` default-exports one object satisfying `RegionContent`.
- Content files contain **no JSX and no logic** — data only.
- Never hard-code user-facing copy inside a component. Read it from `@content`.

### Simulation
- All simulation state transitions go through the level's reducer. No ad-hoc `useState`
  for simulation state.
- Deficit resolution is a **pure function** — `(lesionSite, regionContent) => Deficit`.
  This keeps it unit-testable without mounting a 3D scene.

### Naming
- Anatomical names use standard clinical terms in code (`precentralGyrus`, `handKnob`),
  with plain-language labels living in content files for display.
