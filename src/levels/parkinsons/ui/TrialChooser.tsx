import parkinsons from '@content/regions/parkinsons';
import { useSimulation } from '@levels/parkinsons/useSimulation';

export function TrialChooser() {
  const { state, dispatch } = useSimulation();
  if (state.phase !== 'focused') return null;

  return (
    <nav aria-label="Choose a motor test" className="rounded-lg bg-slate-800/95 p-5 text-slate-100 shadow-lg">
      <h2 className="mb-1 text-lg font-semibold">Run a bedside test</h2>
      <p className="mb-4 text-sm text-slate-300">Dopamine to the basal ganglia is depleted. What happens when…</p>
      <ul className="flex flex-col gap-2">
        {parkinsons.trials.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => dispatch({ type: 'SELECT_SITE', site: t.id })}
              className="w-full rounded-md bg-slate-700 px-4 py-3 text-left hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <span className="block font-medium">{t.label}</span>
              <span className="mt-0.5 block text-xs text-slate-300">{t.description}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
