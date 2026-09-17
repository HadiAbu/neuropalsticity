import drugs from '@content/regions/drugs';
import type { DrugClass } from '@content/schema';
import { useSimulation } from '@levels/drugs/useSimulation';

const CLASS_LABEL: Record<DrugClass, string> = {
  depressant: 'depressant',
  stimulant: 'stimulant',
  opioid: 'opioid',
};

export function SubstanceChooser() {
  const { state, dispatch } = useSimulation();
  if (state.phase !== 'focused') return null;

  return (
    <nav aria-label="Choose a substance" className="rounded-lg bg-slate-800/95 p-5 text-slate-100 shadow-lg">
      <h2 className="mb-1 text-lg font-semibold">Pick a substance</h2>
      <p className="mb-4 text-sm text-slate-300">Same person, same evening. What happens at the synapse?</p>
      <ul className="flex flex-col gap-2">
        {drugs.substances.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => dispatch({ type: 'SELECT_SITE', site: s.id })}
              className="w-full rounded-md bg-slate-700 px-4 py-3 text-left hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <span className="flex items-baseline justify-between">
                <span className="font-medium">{s.label}</span>
                <span className="text-xs uppercase tracking-wide text-amber-300">{CLASS_LABEL[s.drugClass]}</span>
              </span>
              <span className="mt-0.5 block text-xs text-slate-300">{s.scenario}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
