import { useMemo } from 'react';
import motorCortex from '@content/regions/motor-cortex';
import type { BodyPart } from '@content/schema';
import { useSimulation } from '@levels/motor-cortex/useSimulation';

const BUTTON =
  'w-full rounded-md bg-slate-700 px-4 py-2 text-left hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400';

/** The true worst-affected part plus three plausible decoys, alphabetical so the answer never sits first. */
function choicesFor(site: BodyPart): BodyPart[] {
  const scenario = motorCortex.scenarios.find((s) => s.siteTerritory === site);
  if (!scenario) return [];
  const worst = scenario.deficits.find((d) => d.severity === 'complete')?.part ?? site;
  const decoys = scenario.deficits.filter((d) => d.severity === 'spared').slice(0, 3).map((d) => d.part);
  return [worst, ...decoys].sort();
}

const labelOf = (part: BodyPart) => motorCortex.territories.find((t) => t.id === part)?.label ?? part;

export function PredictionPrompt() {
  const { state, dispatch } = useSimulation();
  const choices = useMemo(() => (state.site ? choicesFor(state.site) : []), [state.site]);

  if (state.phase !== 'predicting') return null;

  return (
    <section className="rounded-lg bg-slate-800/95 p-5 text-slate-100 shadow-lg">
      <h2 className="mb-1 text-lg font-semibold">Before you look — what stops working?</h2>
      <p className="mb-4 text-sm text-slate-300">Commit to a guess. Getting it wrong is the interesting outcome.</p>
      <ul className="flex flex-col gap-2">
        {choices.map((part) => (
          <li key={part}>
            <button type="button" className={BUTTON} onClick={() => dispatch({ type: 'SUBMIT_PREDICTION', choice: part })}>
              {labelOf(part)}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => dispatch({ type: 'SKIP_PREDICTION' })}
        className="mt-3 text-sm text-slate-300 underline hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        Just show me
      </button>
    </section>
  );
}
