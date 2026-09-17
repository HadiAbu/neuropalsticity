import { flowCopy } from '@content/flow';
import cerebellum from '@content/regions/cerebellum';
import { BrainScene } from '@lib/scene/BrainScene';
import { CameraRig, type Framing } from '@lib/scene/CameraRig';
import type { Phase } from '@lib/simulation/machine';
import { ProgressRail } from '@lib/ui/ProgressRail';
import { CerebellumBrainMesh } from '@levels/cerebellum/scene/CerebellumBrainMesh';
import { CoordinationDashboard } from '@levels/cerebellum/ui/CoordinationDashboard';
import { PredictionPrompt } from '@levels/cerebellum/ui/PredictionPrompt';
import { RecoveryTimeline } from '@levels/cerebellum/ui/RecoveryTimeline';
import { TrialChooser } from '@levels/cerebellum/ui/TrialChooser';
import { useSimulation } from '@levels/cerebellum/useSimulation';

const BUTTON =
  'rounded-md bg-slate-700 px-3 py-1.5 text-sm text-slate-100 hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400';

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

      <header className="absolute left-4 top-4 flex max-w-sm flex-col gap-3">
        <div className="flex items-center gap-3">
          <button type="button" className={BUTTON} onClick={onExit}>
            ← {flowCopy.exit}
          </button>
          <h1 className="text-xl font-semibold">{cerebellum.name}</h1>
        </div>
        <ProgressRail phase={state.phase} onJump={jumpTo} />
        {state.phase === 'overview' ? (
          <div className="rounded-lg bg-slate-800/90 p-4 shadow-lg">
            <p className="mb-3 text-sm leading-relaxed text-slate-300">{cerebellum.overview}</p>
            <button type="button" className={BUTTON} onClick={() => dispatch({ type: 'FOCUS' })}>
              Run the exam
            </button>
          </div>
        ) : (
          <button type="button" className={BUTTON} onClick={() => dispatch({ type: 'RETURN_TO_OVERVIEW' })}>
            Back to the whole brain
          </button>
        )}
      </header>

      {state.phase !== 'overview' && (
        <aside className="absolute bottom-4 right-4 top-4 flex w-[26rem] flex-col gap-4 overflow-y-auto">
          {state.phase === 'focused' && (
            <div className="rounded-lg bg-slate-800/90 p-5 shadow-lg">
              <h2 className="mb-2 text-lg font-semibold">A real-time comparator</h2>
              <p className="mb-3 text-sm leading-relaxed text-slate-300">{cerebellum.insight}</p>
              <p className="rounded-md border-l-2 border-amber-400 bg-slate-900/60 p-3 text-sm text-slate-300">{cerebellum.premise}</p>
            </div>
          )}
          <TrialChooser />
          <PredictionPrompt />
          <CoordinationDashboard />
          <RecoveryTimeline />
        </aside>
      )}
    </div>
  );
}
