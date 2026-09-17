# 3D Hub — Requirements

## Overview

Replace the card-grid landing screen with the brain itself. Every level lives on its
anatomy: available levels glow and are clickable, locked levels are dim hotspots with
labels. A compact themed list stays beside the brain as the keyboard and screen-reader path
and cross-highlights with the hotspots.

### 1. Content

**1.1** Each registry entry gains `anatomy`: `nodePrefixes` (mesh node name prefixes to
highlight) and/or `marker` (approximate `[x, y, z]` in the mesh frame). Every level has one
or the other.

### 2. Scene

**2.1** The hub renders the shared `brain.glb` ghosted (translucent) and slowly rotating.

**2.2** Nodes matching an available level's prefixes glow amber; matching a locked level's
prefixes render dim. All other nodes are ghost.

**2.3** Levels with a `marker` render a small sphere there: amber if available, grey if
locked.

**2.4** Hovering a hotspot shows a floating label with the level's name and, if locked,
"Coming soon". Clicking an available hotspot enters the level. Clicking a locked one does
nothing beyond the label.

**2.5** Auto-rotation pauses while a hotspot is hovered and is disabled under
`prefers-reduced-motion`.

### 3. List

**3.1** A right-hand column lists levels grouped by theme with the same available/locked
treatment as before, in compact rows.

**3.2** Hovering or focusing a row highlights its hotspot; hovering a hotspot highlights its
row.

**3.3** Below the `md` breakpoint the canvas is hidden and the list fills the screen.

### 4. Constraints

Client-side only; no persistence; all copy from `src/content/`; existing 90 tests pass;
build + lint clean; visuals by human walkthrough.
