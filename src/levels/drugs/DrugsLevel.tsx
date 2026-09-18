import drugs from '@content/regions/drugs';
import { BrainScene } from '@lib/scene/BrainScene';
import { CameraRig, type Framing } from '@lib/scene/CameraRig';
import type { Phase } from '@lib/simulation/machine';
import { recoveryAt } from '@lib/simulation/recovery';
import { LevelShell } from '@lib/ui/LevelShell';
import { DrugsBrainMesh } from '@levels/drugs/scene/DrugsBrainMesh';
import { rehabSynapse, resolveEffect } from '@levels/drugs/simulation/resolveEffect';
import { EffectDashboard } from '@levels/drugs/ui/EffectDashboard';
import { PredictionPrompt } from '@levels/drugs/ui/PredictionPrompt';
import { SubstanceChooser } from '@levels/drugs/ui/SubstanceChooser';
import { SynapseView } from '@levels/drugs/ui/SynapseView';
import { ToleranceTimeline } from '@levels/drugs/ui/ToleranceTimeline';
import { useSimulation } from '@levels/drugs/useSimulation';

const FOCUSED: Framing = { position: [70, 30, 200], target: [0, -10, 0] };
const FRAMING: Partial<Record<Phase, Framing>> = {
  focused: FOCUSED,
  predicting: FOCUSED,
  revealed: FOCUSED,
  rehab: FOCUSED,
};

export function DrugsLevel({ onExit }: { onExit: () => void }) {
  const { state, dispatch } = useSimulation();

  const jumpTo = (phase: Phase) =>
    dispatch(phase === 'overview' ? { type: 'RETURN_TO_OVERVIEW' } : { type: 'RESET_SCENARIO' });

  const substance = state.site ? resolveEffect(state.site, drugs).substance : drugs.substances[0];
  const synapse =
    state.phase === 'revealed'
      ? { state: substance.synapse.acute, drugActive: true, title: `${substance.label}, acute` }
      : state.phase === 'rehab'
        ? { state: rehabSynapse(substance, recoveryAt(drugs, state.rehabWeek)), drugActive: false, title: `${substance.label}, in recovery` }
        : { state: substance.synapse.baseline, drugActive: false, title: state.site ? `${substance.label}, before` : 'A resting synapse' };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-900 text-slate-100">
      <BrainScene orbitEnabled={state.phase === 'overview'}>
        <DrugsBrainMesh />
        <CameraRig phase={state.phase} framing={FRAMING} />
      </BrainScene>

      <LevelShell
        title={drugs.name}
        overview={drugs.overview}
        focusLabel="Go to the synapse"
        phase={state.phase}
        onFocus={() => dispatch({ type: 'FOCUS' })}
        onReturnToOverview={() => dispatch({ type: 'RETURN_TO_OVERVIEW' })}
        onJump={jumpTo}
        onExit={onExit}
      >
        <p className="rounded-md bg-slate-800/80 px-3 py-2 text-xs text-slate-300">{drugs.pathway}</p>
        <SynapseView
          state={synapse.state}
          transmitter={substance.transmitter}
          action={substance.action}
          drugActive={synapse.drugActive}
          title={synapse.title}
        />
        {state.phase === 'focused' && (
          <div className="rounded-lg bg-slate-800/90 p-5 shadow-lg">
            <h2 className="mb-2 text-lg font-semibold">Three ways in</h2>
            <p className="text-sm leading-relaxed text-slate-300">{drugs.insight}</p>
          </div>
        )}
        <SubstanceChooser />
        <PredictionPrompt />
        <EffectDashboard />
        <ToleranceTimeline />
      </LevelShell>
    </div>
  );
}
