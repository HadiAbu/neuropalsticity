import parkinsons from '@content/regions/parkinsons';
import { useSimulation } from '@levels/parkinsons/useSimulation';

const BUTTON =
  'w-full rounded-md bg-slate-700 px-4 py-2 text-left hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400';

export function PredictionPrompt() {
  const { state, dispatch } = useSimulation();
  if (state.phase !== 'predicting' || !state.site) return null;

  const trial = parkinsons.trials.find((t) => t.id === state.site);
  if (!trial) return null;

  return (
    <section className="rounded-lg bg-slate-800/95 p-5 text-slate-100 shadow-lg">
      <p className="text-sm uppercase tracking-wide text-amber-300">{trial.label}</p>
      <h2 className="mb-1 mt-1 text-xl font-semibold">Before you look — what happens?</h2>
      <p className="mb-4 text-base text-slate-300">{trial.description}</p>
      <ul className="flex flex-col gap-2">
        {trial.choices.map((choice) => (
          <li key={choice.id}>
            <button type="button" className={BUTTON} onClick={() => dispatch({ type: 'SUBMIT_PREDICTION', choice: choice.id })}>
              {choice.label}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => dispatch({ type: 'SKIP_PREDICTION' })}
        className="mt-3 text-base text-slate-300 underline hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        Just show me
      </button>
    </section>
  );
}
