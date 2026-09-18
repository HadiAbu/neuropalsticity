import hippocampus from '@content/regions/hippocampus';
import { useSimulation } from '@levels/hippocampus/useSimulation';

export function TrialChooser() {
  const { state, dispatch } = useSimulation();
  if (state.phase !== 'focused') return null;

  return (
    <nav aria-label="Choose a scenario" className="rounded-lg bg-slate-800/95 p-5 text-slate-100 shadow-lg">
      <h2 className="mb-1 text-xl font-semibold">Put them in a scenario</h2>
      <p className="mb-4 text-base text-slate-300">Both hippocampi are gone. What happens when…</p>
      <ul className="flex flex-col gap-2">
        {hippocampus.trials.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => dispatch({ type: 'SELECT_SITE', site: t.id })}
              className="w-full rounded-md bg-slate-700 px-4 py-3 text-left hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <span className="block font-medium">{t.label}</span>
              <span className="mt-0.5 block text-sm text-slate-300">{t.description}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
