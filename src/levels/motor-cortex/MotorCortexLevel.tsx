import { useState } from 'react';
import motorCortex from '@content/regions/motor-cortex';
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
import { LevelShell } from '@lib/ui/LevelShell';
import { useSimulation } from '@lib/somatotopic/useSimulation';
import { BrainMesh } from '@levels/motor-cortex/scene/BrainMesh';

const FOCUSED: Framing = { position: [80, 50, 215], target: [45, 15, 0] };
const FRAMING: Partial<Record<Phase, Framing>> = {
  focused: FOCUSED,
  predicting: FOCUSED,
  revealed: FOCUSED,
  rehab: FOCUSED,
};

const CROSSING_EXPLANATION =
  'Almost every motor pathway crosses the midline on its way down, so each half of the brain drives the opposite half of the body.';

export function MotorCortexLevel({ onExit }: { onExit: () => void }) {
  const { state, dispatch } = useSimulation();
  const [hoveredPart, setHoveredPart] = useState<BodyPart | null>(null);

  const showDeficits = (state.phase === 'revealed' || state.phase === 'rehab') && state.site !== null;
  const result = showDeficits ? resolveDeficit(state.site!, motorCortex, state.hemisphere) : null;
  const entries = result
    ? state.phase === 'rehab'
      ? applyRecovery(result.entries, recoveryAt(motorCortex, state.rehabWeek))
      : result.entries
    : [];

  const hoveredLabel = hoveredPart ? motorCortex.territories.find((t) => t.id === hoveredPart)?.label : null;

  const jumpTo = (phase: Phase) =>
    dispatch(phase === 'overview' ? { type: 'RETURN_TO_OVERVIEW' } : { type: 'RESET_SCENARIO' });

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-900 text-slate-100">
      <BrainScene orbitEnabled={state.phase === 'overview'}>
        <BrainMesh />
        <CameraRig phase={state.phase} framing={FRAMING} />
        <HomunculusStrip content={motorCortex} onHover={setHoveredPart} />
        <LesionMarker content={motorCortex} />
      </BrainScene>

      <LevelShell
        title={motorCortex.name}
        overview={motorCortex.overview}
        focusLabel="Focus the motor strip"
        phase={state.phase}
        onFocus={() => dispatch({ type: 'FOCUS' })}
        onReturnToOverview={() => dispatch({ type: 'RETURN_TO_OVERVIEW' })}
        onJump={jumpTo}
        onExit={onExit}
      >
        {state.phase === 'focused' && <InsightPanel content={motorCortex} title="Why is the map so lopsided?" />}
        <SiteChooser content={motorCortex} onHover={setHoveredPart} />
        <PredictionPrompt content={motorCortex} prompt="Before you look — what stops working?" />
        <DeficitPanel
          content={motorCortex}
          crossingExplanation={CROSSING_EXPLANATION}
          advanceLabel="What happens next?"
        />
        <RehabTimeline content={motorCortex} title="The brain starts rewiring" unitLabel="lost function regained" />
        <BodyDiagram entries={entries} side={result?.side ?? null} highlighted={hoveredPart} />
      </LevelShell>

      {hoveredLabel && (
        <div className="pointer-events-none absolute bottom-[calc(55vh+1rem)] left-4 z-10 rounded-md bg-slate-800/90 px-3 py-1.5 text-base shadow-lg sm:bottom-4">
          {hoveredLabel}
        </div>
      )}
    </div>
  );
}
