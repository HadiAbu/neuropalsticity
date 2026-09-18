import parkinsons from '@content/regions/parkinsons';
import { BrainScene } from '@lib/scene/BrainScene';
import { CameraRig, type Framing } from '@lib/scene/CameraRig';
import type { Phase } from '@lib/simulation/machine';
import { LevelShell } from '@lib/ui/LevelShell';
import { ParkinsonsBrainMesh } from '@levels/parkinsons/scene/ParkinsonsBrainMesh';
import { MotorExamDashboard } from '@levels/parkinsons/ui/MotorExamDashboard';
import { PredictionPrompt } from '@levels/parkinsons/ui/PredictionPrompt';
import { TreatmentTimeline } from '@levels/parkinsons/ui/TreatmentTimeline';
import { TrialChooser } from '@levels/parkinsons/ui/TrialChooser';
import { useSimulation } from '@levels/parkinsons/useSimulation';

const FOCUSED: Framing = { position: [70, 30, 200], target: [0, -10, 0] };
const FRAMING: Partial<Record<Phase, Framing>> = {
  focused: FOCUSED,
  predicting: FOCUSED,
  revealed: FOCUSED,
  rehab: FOCUSED,
};

export function ParkinsonsLevel({ onExit }: { onExit: () => void }) {
  const { state, dispatch } = useSimulation();

  const jumpTo = (phase: Phase) =>
    dispatch(phase === 'overview' ? { type: 'RETURN_TO_OVERVIEW' } : { type: 'RESET_SCENARIO' });

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-900 text-slate-100">
      <BrainScene orbitEnabled={state.phase === 'overview'}>
        <ParkinsonsBrainMesh />
        <CameraRig phase={state.phase} framing={FRAMING} />
      </BrainScene>

      <LevelShell
        title={parkinsons.name}
        overview={parkinsons.overview}
        focusLabel="Run the exam"
        phase={state.phase}
        onFocus={() => dispatch({ type: 'FOCUS' })}
        onReturnToOverview={() => dispatch({ type: 'RETURN_TO_OVERVIEW' })}
        onJump={jumpTo}
        onExit={onExit}
      >
        {state.phase === 'focused' && (
          <div className="rounded-lg bg-slate-800/90 p-5 shadow-lg">
            <h2 className="mb-2 text-xl font-semibold">A long silence before symptoms</h2>
            <p className="mb-3 text-base leading-relaxed text-slate-300">{parkinsons.insight}</p>
            <p className="rounded-md border-l-2 border-amber-400 bg-slate-900/60 p-3 text-base text-slate-300">{parkinsons.premise}</p>
          </div>
        )}
        <TrialChooser />
        <PredictionPrompt />
        <MotorExamDashboard />
        <TreatmentTimeline />
      </LevelShell>
    </div>
  );
}
