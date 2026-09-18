import { FLOW_STEPS, flowCopy } from '@content/flow';
import type { Phase } from '@lib/simulation/machine';

/** Completed steps with a way back. Predict and Reveal are re-entered by restarting from Focus. */
const JUMPABLE: ReadonlySet<Phase> = new Set<Phase>(['overview', 'focused']);

interface Props {
  phase: Phase;
  onJump: (phase: Phase) => void;
}

export function ProgressRail({ phase, onJump }: Props) {
  const currentIndex = FLOW_STEPS.findIndex((s) => s.phase === phase);

  return (
    <nav aria-label={flowCopy.railLabel} className="rounded-lg bg-slate-800/90 px-3 py-2 shadow-lg">
      <ol className="flex items-center gap-1 text-sm">
        {FLOW_STEPS.map((step, i) => {
          const done = i < currentIndex;
          const current = i === currentIndex;
          const canJump = done && JUMPABLE.has(step.phase);
          const tone = current
            ? 'bg-amber-500 text-slate-900 font-semibold'
            : done
              ? 'text-amber-200'
              : 'text-slate-500';

          return (
            <li key={step.phase} className="flex items-center gap-1">
              {canJump ? (
                <button
                  type="button"
                  onClick={() => onJump(step.phase)}
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
