import amygdala from '@content/regions/amygdala';
import { BrainScene } from '@lib/scene/BrainScene';
import { CameraRig, type Framing } from '@lib/scene/CameraRig';
import type { Phase } from '@lib/simulation/machine';
import { LevelShell } from '@lib/ui/LevelShell';
import { AmygdalaBrainMesh } from '@levels/amygdala/scene/AmygdalaBrainMesh';
import { CompensationTimeline } from '@levels/amygdala/ui/CompensationTimeline';
import { PredictionPrompt } from '@levels/amygdala/ui/PredictionPrompt';
import { ResponseDashboard } from '@levels/amygdala/ui/ResponseDashboard';
import { StimulusChooser } from '@levels/amygdala/ui/StimulusChooser';
import { useSimulation } from '@levels/amygdala/useSimulation';

const FOCUSED: Framing = { position: [90, 20, 190], target: [0, -10, 0] };
const FRAMING: Partial<Record<Phase, Framing>> = {
  focused: FOCUSED,
  predicting: FOCUSED,
  revealed: FOCUSED,
  rehab: FOCUSED,
};

export function AmygdalaLevel({ onExit }: { onExit: () => void }) {
  const { state, dispatch } = useSimulation();

  const jumpTo = (phase: Phase) =>
    dispatch(phase === 'overview' ? { type: 'RETURN_TO_OVERVIEW' } : { type: 'RESET_SCENARIO' });

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-900 text-slate-100">
      <BrainScene orbitEnabled={state.phase === 'overview'}>
        <AmygdalaBrainMesh />
        <CameraRig phase={state.phase} framing={FRAMING} />
      </BrainScene>

      <LevelShell
        title={amygdala.name}
        overview={amygdala.overview}
        focusLabel="Look inside"
        phase={state.phase}
        onFocus={() => dispatch({ type: 'FOCUS' })}
        onReturnToOverview={() => dispatch({ type: 'RETURN_TO_OVERVIEW' })}
        onJump={jumpTo}
        onExit={onExit}
      >
        {state.phase === 'focused' && (
          <div className="rounded-lg bg-slate-800/90 p-5 shadow-lg">
            <h2 className="mb-2 text-xl font-semibold">What fear is for</h2>
            <p className="mb-3 text-base leading-relaxed text-slate-300">{amygdala.insight}</p>
            <p className="rounded-md border-l-2 border-amber-400 bg-slate-900/60 p-3 text-base text-slate-300">{amygdala.premise}</p>
          </div>
        )}
        <StimulusChooser />
        <PredictionPrompt />
        <ResponseDashboard />
        <CompensationTimeline />
      </LevelShell>
    </div>
  );
}
