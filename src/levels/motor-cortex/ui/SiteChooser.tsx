import motorCortex from '@content/regions/motor-cortex';
import type { BodyPart } from '@content/schema';
import { selectableSites } from '@levels/motor-cortex/simulation/resolveDeficit';
import { useSimulation } from '@levels/motor-cortex/useSimulation';

/** Keyboard-reachable twin of clicking a territory on the 3D strip. */
export function SiteChooser({ onHover }: { onHover: (id: BodyPart | null) => void }) {
  const { state, dispatch } = useSimulation();
  if (state.phase !== 'focused') return null;

  return (
    <nav aria-label="Choose a lesion site" className="rounded-lg bg-slate-800/90 p-4 shadow-lg">
      <p className="mb-2 text-sm text-slate-300">Damage one of the highlighted territories:</p>
      <ul className="flex flex-wrap gap-2">
        {selectableSites(motorCortex).map((site) => (
          <li key={site}>
            <button
              type="button"
              onClick={() => dispatch({ type: 'SELECT_SITE', site })}
              onFocus={() => onHover(site)}
              onBlur={() => onHover(null)}
              onMouseEnter={() => onHover(site)}
              onMouseLeave={() => onHover(null)}
              className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              {motorCortex.territories.find((t) => t.id === site)?.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
