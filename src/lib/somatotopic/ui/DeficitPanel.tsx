import type { SomatotopicContent } from '@content/schema';
import { resolveDeficit } from '@lib/somatotopic/simulation/resolveDeficit';
import { useSimulation } from '@lib/somatotopic/useSimulation';

const PRIMARY =
  'rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300';
const LINK =
  'rounded-md px-4 py-2 text-sm text-slate-300 underline hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300';

interface Props {
  content: SomatotopicContent;
  crossingExplanation: string;
  advanceLabel: string;
}

export function DeficitPanel({ content, crossingExplanation, advanceLabel }: Props) {
  const { state, dispatch } = useSimulation();
  if (state.phase !== 'revealed' || !state.site) return null;

  const result = resolveDeficit(state.site, content, state.hemisphere);
  const scenario = content.scenarios.find((s) => s.id === result.scenarioId)!;

  const predicted = state.prediction;
  const predictedSeverity = predicted ? result.entries.find((e) => e.part === predicted)?.severity : null;
  const wasRight = predictedSeverity === 'complete';
  const predictedLabel = predicted
    ? content.territories.find((t) => t.id === predicted)?.label.toLowerCase() ?? predicted
    : null;

  return (
    <section className="rounded-lg bg-slate-800/95 p-5 text-slate-100 shadow-lg">
      <h2 className="mb-2 text-lg font-semibold">{scenario.label}</h2>

      {predictedLabel && (
        <p className="mb-3 rounded-md bg-slate-700/60 p-3 text-sm">
          {wasRight
            ? 'You called it.'
            : `You picked the ${predictedLabel}, which is ${predictedSeverity ?? 'unaffected'} here. Here is why:`}
        </p>
      )}

      <p className="mb-3 text-sm leading-relaxed text-slate-300">{scenario.dayToDay}</p>

      <p className="mb-3 rounded-md border-l-2 border-amber-400 bg-slate-900/60 p-3 text-sm text-slate-300">
        The damage is in the <strong className="text-slate-100">{state.hemisphere}</strong> hemisphere, but it
        shows up on the <strong className="text-slate-100">{result.side}</strong> side of the body. {crossingExplanation}
      </p>

      {scenario.surprise && <p className="mb-4 text-sm leading-relaxed text-amber-200">{scenario.surprise}</p>}

      <div className="flex flex-wrap gap-3">
        <button type="button" className={PRIMARY} onClick={() => dispatch({ type: 'ADVANCE_TO_REHAB' })}>
          {advanceLabel}
        </button>
        <button type="button" className={LINK} onClick={() => dispatch({ type: 'RESET_SCENARIO' })}>
          Try another site
        </button>
      </div>
    </section>
  );
}
