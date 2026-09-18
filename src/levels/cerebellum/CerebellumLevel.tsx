import cerebellum from '@content/regions/cerebellum';
import { BrainScene } from '@lib/scene/BrainScene';
import { CameraRig, type Framing } from '@lib/scene/CameraRig';
import type { Phase } from '@lib/simulation/machine';
import { LevelShell } from '@lib/ui/LevelShell';
import { CerebellumBrainMesh } from '@levels/cerebellum/scene/CerebellumBrainMesh';
import { CoordinationDashboard } from '@levels/cerebellum/ui/CoordinationDashboard';
import { PredictionPrompt } from '@levels/cerebellum/ui/PredictionPrompt';
import { RecoveryTimeline } from '@levels/cerebellum/ui/RecoveryTimeline';
import { TrialChooser } from '@levels/cerebellum/ui/TrialChooser';
import { useSimulation } from '@levels/cerebellum/useSimulation';

const FOCUSED: Framing = { position: [10, -30, -180], target: [0, -40, -70] };
const FRAMING: Partial<Record<Phase, Framing>> = {
  focused: FOCUSED,
  predicting: FOCUSED,
  revealed: FOCUSED,
  rehab: FOCUSED,
};

export function CerebellumLevel({ onExit }: { onExit: () => void }) {
  const { state, dispatch } = useSimulation();

  const jumpTo = (phase: Phase) =>
    dispatch(phase === 'overview' ? { type: 'RETURN_TO_OVERVIEW' } : { type: 'RESET_SCENARIO' });

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-900 text-slate-100">
      <BrainScene orbitEnabled={state.phase === 'overview'}>
        <CerebellumBrainMesh />
        <CameraRig phase={state.phase} framing={FRAMING} />
      </BrainScene>

      <LevelShell
        title={cerebellum.name}
        overview={cerebellum.overview}
        focusLabel="Run the exam"
        phase={state.phase}
        onFocus={() => dispatch({ type: 'FOCUS' })}
        onReturnToOverview={() => dispatch({ type: 'RETURN_TO_OVERVIEW' })}
        onJump={jumpTo}
        onExit={onExit}
      >
        {state.phase === 'focused' && (
          <div className="rounded-lg bg-slate-800/90 p-5 shadow-lg">
            <h2 className="mb-2 text-xl font-semibold">A real-time comparator</h2>
            <p className="mb-3 text-base leading-relaxed text-slate-300">{cerebellum.insight}</p>
            <p className="rounded-md border-l-2 border-amber-400 bg-slate-900/60 p-3 text-base text-slate-300">{cerebellum.premise}</p>
          </div>
        )}
        <TrialChooser />
        <PredictionPrompt />
        <CoordinationDashboard />
        <RecoveryTimeline />
      </LevelShell>
    </div>
  );
}
