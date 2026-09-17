---
inclusion: always
---

# Tech Stack

## Core

| Layer | Choice |
|---|---|
| Framework | React 19 |
| Language | TypeScript — strict mode, `noImplicitAny`, `strictNullChecks` |
| Build tool | Vite |
| 3D | React Three Fiber (`@react-three/fiber`) over Three.js |
| 3D helpers | `@react-three/drei` — loaders, camera controls, performance helpers |
| Styling | Tailwind CSS for 2D UI chrome |
| State | React `useReducer` + context. **No state library.** |
| Testing | Vitest for pure logic |
| Backend | None. Static site. |

Exact versions are pinned at scaffold time — install current stable, do not guess.

## Deliberate Omissions

- **No Zustand/Redux.** One level does not justify a state library. The simulation is a
  single reducer-driven state machine. Revisit only when a second level proves shared
  cross-level state is actually needed.
- **No backend, no API client, no auth.** See non-goals in `product.md`.
- **No Playwright/Docker for the first slice.** See verification policy below.

## Verification Policy

Lean and targeted. Per milestone:

1. `npm run test` — Vitest over pure logic: lesion→deficit resolution, state machine
   transitions, content schema validation.
2. `npm run build` — type-check + production build must pass.
3. **Manual browser check** for anything 3D or visual. Unit tests cannot confirm that a
   brain looks right or that a camera move feels good. Do not claim visual work is done
   without actually looking at it.

Reserve Playwright and Docker for changes that genuinely need a live browser harness.

## What Gets Tested vs. Eyeballed

| Testable with Vitest | Verify by eye in the browser |
|---|---|
| lesion site → deficit mapping | mesh loading, materials, lighting |
| state machine transitions | camera flight and framing |
| content schema conformance | homunculus layout and legibility |
| rehab recovery curve math | animation timing and feel |

## Common Commands

```bash
npm run dev          # start dev server
npm run build        # type-check + production build
npm run preview      # preview production build
npm run test         # Vitest
npm run lint         # ESLint
```

## Path Aliases

Defined in both `vite.config.ts` and `tsconfig.app.json`. Always use aliases over
relative paths.

| Alias | Resolves to |
|---|---|
| `@/*` | `src/*` |
| `@content/*` | `src/content/*` |
| `@levels/*` | `src/levels/*` |
| `@lib/*` | `src/lib/*` |
| `@components/*` | `src/components/*` |

Shared types import from `@/types`. There is deliberately **no `@types/*` alias** — that
name collides with TypeScript's ambient package namespace, where `@types/index` can resolve
to `node_modules/@types` instead of our source.

## 3D Performance Notes

- Load meshes as glTF/GLB, Draco-compressed where the source allows.
- Suspend 3D scenes behind `<Suspense>` with a non-3D fallback.
- Cap `dpr` (device pixel ratio) on the canvas — uncapped retina rendering tanks
  framerate for no visual gain at this art style.
- Prefer instancing and shared materials over per-region material clones.
