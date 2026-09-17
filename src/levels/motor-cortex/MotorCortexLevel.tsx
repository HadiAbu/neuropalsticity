import { useState } from 'react';
import motorCortex from '@content/regions/motor-cortex';
import type { BodyPart } from '@content/schema';
import { BrainScene } from '@levels/motor-cortex/scene/BrainScene';
import { CameraRig } from '@levels/motor-cortex/scene/CameraRig';
import { HomunculusStrip } from '@levels/motor-cortex/scene/HomunculusStrip';
import { LesionMarker } from '@levels/motor-cortex/scene/LesionMarker';
import { applyRecovery, recoveryAt } from '@levels/motor-cortex/simulation/recovery';
import { resolveDeficit } from '@levels/motor-cortex/simulation/resolveDeficit';
import { BodyDiagram } from '@levels/motor-cortex/ui/BodyDiagram';
import { DeficitPanel } from '@levels/motor-cortex/ui/DeficitPanel';
import { InsightPanel } from '@levels/motor-cortex/ui/InsightPanel';
import { PredictionPrompt } from '@levels/motor-cortex/ui/PredictionPrompt';
import { RehabTimeline } from '@levels/motor-cortex/ui/RehabTimeline';
import { SiteChooser } from '@levels/motor-cortex/ui/SiteChooser';
import { useSimulation } from '@levels/motor-cortex/useSimulation';

const BUTTON =
  'rounded-md bg-slate-700 px-3 py-1.5 text-sm text-slate-100 hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400';

export function MotorCortexLevel() {
  const { state, dispatch } = useSimulation();
  const [hoveredPart, setHoveredPart] = useState<BodyPart | null>(null);

  const showDeficits = (state.phase === 'revealed' || state.phase === 'rehab') && state.lesionSite !== null;
  const result = showDeficits ? resolveDeficit(state.lesionSite!, motorCortex, state.hemisphere) : null;
  const entries = result
    ? state.phase === 'rehab'
      ? applyRecovery(result.entries, recoveryAt(motorCortex, state.rehabWeek))
      : result.entries
    : [];

  const hoveredLabel = hoveredPart ? motorCortex.territories.find((t) => t.id === hoveredPart)?.label : null;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-900 text-slate-100">
      <BrainScene>
        <CameraRig />
        <HomunculusStrip onHover={setHoveredPart} />
        <LesionMarker />
      </BrainScene>

      <header className="absolute left-4 top-4 flex max-w-sm flex-col gap-3">
        <h1 className="text-xl font-semibold">{motorCortex.name}</h1>
        {state.phase === 'overview' ? (
          <div className="rounded-lg bg-slate-800/90 p-4 shadow-lg">
            <p className="mb-3 text-sm leading-relaxed text-slate-300">{motorCortex.overview}</p>
            <button type="button" className={BUTTON} onClick={() => dispatch({ type: 'FOCUS_STRIP' })}>
              Focus the motor strip
            </button>
          </div>
        ) : (
          <button type="button" className={BUTTON} onClick={() => dispatch({ type: 'RETURN_TO_OVERVIEW' })}>
            Back to the whole brain
          </button>
        )}
      </header>

      {state.phase !== 'overview' && (
        <aside className="absolute bottom-4 right-4 top-4 flex w-96 flex-col gap-4 overflow-y-auto">
          {state.phase === 'stripFocused' && <InsightPanel />}
          <SiteChooser onHover={setHoveredPart} />
          <PredictionPrompt />
          <DeficitPanel />
          <RehabTimeline />
          <BodyDiagram entries={entries} side={result?.side ?? null} highlighted={hoveredPart} />
        </aside>
      )}

      {hoveredLabel && (
        <div className="pointer-events-none absolute bottom-4 left-4 rounded-md bg-slate-800/90 px-3 py-1.5 text-sm shadow-lg">
          {hoveredLabel}
        </div>
      )}
    </div>
  );
}
