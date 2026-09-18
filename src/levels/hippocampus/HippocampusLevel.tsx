import hippocampus from '@content/regions/hippocampus';
import { BrainScene } from '@lib/scene/BrainScene';
import { CameraRig, type Framing } from '@lib/scene/CameraRig';
import type { Phase } from '@lib/simulation/machine';
import { LevelShell } from '@lib/ui/LevelShell';
import { HippocampusBrainMesh } from '@levels/hippocampus/scene/HippocampusBrainMesh';
import { CompensationTimeline } from '@levels/hippocampus/ui/CompensationTimeline';
import { MemoryDashboard } from '@levels/hippocampus/ui/MemoryDashboard';
import { PredictionPrompt } from '@levels/hippocampus/ui/PredictionPrompt';
import { TrialChooser } from '@levels/hippocampus/ui/TrialChooser';
import { useSimulation } from '@levels/hippocampus/useSimulation';

const FOCUSED: Framing = { position: [95, 10, 175], target: [0, -15, 5] };
const FRAMING: Partial<Record<Phase, Framing>> = {
  focused: FOCUSED,
  predicting: FOCUSED,
  revealed: FOCUSED,
  rehab: FOCUSED,
};

export function HippocampusLevel({ onExit }: { onExit: () => void }) {
  const { state, dispatch } = useSimulation();

  const jumpTo = (phase: Phase) =>
    dispatch(phase === 'overview' ? { type: 'RETURN_TO_OVERVIEW' } : { type: 'RESET_SCENARIO' });

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-900 text-slate-100">
      <BrainScene orbitEnabled={state.phase === 'overview'}>
        <HippocampusBrainMesh />
        <CameraRig phase={state.phase} framing={FRAMING} />
      </BrainScene>

      <LevelShell
        title={hippocampus.name}
        overview={hippocampus.overview}
        focusLabel="Look inside"
        phase={state.phase}
        onFocus={() => dispatch({ type: 'FOCUS' })}
        onReturnToOverview={() => dispatch({ type: 'RETURN_TO_OVERVIEW' })}
        onJump={jumpTo}
        onExit={onExit}
      >
        {state.phase === 'focused' && (
          <div className="rounded-lg bg-slate-800/90 p-5 shadow-lg">
            <h2 className="mb-2 text-lg font-semibold">Memory is not one thing</h2>
            <p className="mb-3 text-sm leading-relaxed text-slate-300">{hippocampus.insight}</p>
            <p className="rounded-md border-l-2 border-amber-400 bg-slate-900/60 p-3 text-sm text-slate-300">{hippocampus.premise}</p>
          </div>
        )}
        <TrialChooser />
        <PredictionPrompt />
        <MemoryDashboard />
        <CompensationTimeline />
      </LevelShell>
    </div>
  );
}
