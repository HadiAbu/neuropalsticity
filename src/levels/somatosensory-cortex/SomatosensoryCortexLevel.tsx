import { useState } from 'react';
import { flowCopy } from '@content/flow';
import somatosensoryCortex from '@content/regions/somatosensory-cortex';
import type { BodyPart } from '@content/schema';
import { BrainScene } from '@lib/scene/BrainScene';
import { CameraRig, type Framing } from '@lib/scene/CameraRig';
import type { Phase } from '@lib/simulation/machine';
import { applyRecovery, recoveryAt } from '@lib/simulation/recovery';
import { HomunculusStrip } from '@lib/somatotopic/scene/HomunculusStrip';
import { LesionMarker } from '@lib/somatotopic/scene/LesionMarker';
import { resolveDeficit } from '@lib/somatotopic/simulation/resolveDeficit';
import { BodyDiagram } from '@lib/somatotopic/ui/BodyDiagram';
import { DeficitPanel } from '@lib/somatotopic/ui/DeficitPanel';
import { InsightPanel } from '@lib/somatotopic/ui/InsightPanel';
import { PredictionPrompt } from '@lib/somatotopic/ui/PredictionPrompt';
import { RehabTimeline } from '@lib/somatotopic/ui/RehabTimeline';
import { SiteChooser } from '@lib/somatotopic/ui/SiteChooser';
import { useSimulation } from '@lib/somatotopic/useSimulation';
import { ProgressRail } from '@lib/ui/ProgressRail';
import { BrainMesh } from '@levels/somatosensory-cortex/scene/BrainMesh';

const BUTTON =
  'rounded-md bg-slate-700 px-3 py-1.5 text-sm text-slate-100 hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400';

const FOCUSED: Framing = { position: [80, 50, -215], target: [45, 15, 0] };
const FRAMING: Partial<Record<Phase, Framing>> = {
  focused: FOCUSED,
  predicting: FOCUSED,
  revealed: FOCUSED,
  rehab: FOCUSED,
};

const CROSSING_EXPLANATION =
  'Touch signals cross to the opposite side of the brain on their way up, just as motor commands cross on the way down.';

const SEVERITY_LABELS = { complete: 'no feeling', partial: 'dulled feeling', spared: 'unaffected' };

export function SomatosensoryCortexLevel({ onExit }: { onExit: () => void }) {
  const { state, dispatch } = useSimulation();
  const [hoveredPart, setHoveredPart] = useState<BodyPart | null>(null);

  const showDeficits = (state.phase === 'revealed' || state.phase === 'rehab') && state.site !== null;
  const result = showDeficits ? resolveDeficit(state.site!, somatosensoryCortex, state.hemisphere) : null;
  const entries = result
    ? state.phase === 'rehab'
      ? applyRecovery(result.entries, recoveryAt(somatosensoryCortex, state.rehabWeek))
      : result.entries
    : [];

  const hoveredLabel = hoveredPart ? somatosensoryCortex.territories.find((t) => t.id === hoveredPart)?.label : null;

  const jumpTo = (phase: Phase) =>
    dispatch(phase === 'overview' ? { type: 'RETURN_TO_OVERVIEW' } : { type: 'RESET_SCENARIO' });

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-900 text-slate-100">
      <BrainScene orbitEnabled={state.phase === 'overview'}>
        <BrainMesh />
        <CameraRig phase={state.phase} framing={FRAMING} />
        <HomunculusStrip content={somatosensoryCortex} onHover={setHoveredPart} />
        <LesionMarker content={somatosensoryCortex} />
      </BrainScene>

      <header className="absolute left-4 top-4 flex max-w-sm flex-col gap-3">
        <div className="flex items-center gap-3">
          <button type="button" className={BUTTON} onClick={onExit}>
            ← {flowCopy.exit}
          </button>
          <h1 className="text-xl font-semibold">{somatosensoryCortex.name}</h1>
        </div>
        <ProgressRail phase={state.phase} onJump={jumpTo} />
        {state.phase === 'overview' ? (
          <div className="rounded-lg bg-slate-800/90 p-4 shadow-lg">
            <p className="mb-3 text-sm leading-relaxed text-slate-300">{somatosensoryCortex.overview}</p>
            <button type="button" className={BUTTON} onClick={() => dispatch({ type: 'FOCUS' })}>
              Focus the touch strip
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
          {state.phase === 'focused' && <InsightPanel content={somatosensoryCortex} title="Why does the map favour lips and fingertips?" />}
          <SiteChooser content={somatosensoryCortex} onHover={setHoveredPart} />
          <PredictionPrompt content={somatosensoryCortex} prompt="Before you look — what loses feeling?" />
          <DeficitPanel
            content={somatosensoryCortex}
            crossingExplanation={CROSSING_EXPLANATION}
            advanceLabel="What happens next?"
          />
          <RehabTimeline content={somatosensoryCortex} title="The brain relearns how to feel" unitLabel="feeling regained" />
          <BodyDiagram entries={entries} side={result?.side ?? null} highlighted={hoveredPart} severityLabels={SEVERITY_LABELS} />
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
