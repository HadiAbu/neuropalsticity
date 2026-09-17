import { FLOW_STEPS, flowCopy } from '@content/flow';
import type { SimAction } from '@levels/motor-cortex/simulation/machine';
import { useSimulation } from '@levels/motor-cortex/useSimulation';

/** Completed steps that have a way back. Predict and Reveal are re-entered by restarting from Focus. */
const JUMP_BACK: Partial<Record<string, SimAction>> = {
  overview: { type: 'RETURN_TO_OVERVIEW' },
  stripFocused: { type: 'RESET_SCENARIO' },
};

export function ProgressRail() {
  const { state, dispatch } = useSimulation();
  const currentIndex = FLOW_STEPS.findIndex((s) => s.phase === state.phase);

  return (
    <nav aria-label={flowCopy.railLabel} className="rounded-lg bg-slate-800/90 px-3 py-2 shadow-lg">
      <ol className="flex items-center gap-1 text-xs">
        {FLOW_STEPS.map((step, i) => {
          const done = i < currentIndex;
          const current = i === currentIndex;
          const jump = done ? JUMP_BACK[step.phase] : undefined;
          const tone = current
            ? 'bg-amber-500 text-slate-900 font-semibold'
            : done
              ? 'text-amber-200'
              : 'text-slate-500';

          return (
            <li key={step.phase} className="flex items-center gap-1">
              {jump ? (
                <button
                  type="button"
                  onClick={() => dispatch(jump)}
                  className={`rounded px-2 py-1 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${tone}`}
                >
                  {step.label}
                </button>
              ) : (
                <span aria-current={current ? 'step' : undefined} className={`rounded px-2 py-1 ${tone}`}>
                  {step.label}
                </span>
              )}
              {i < FLOW_STEPS.length - 1 && <span aria-hidden="true" className="text-slate-600">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
