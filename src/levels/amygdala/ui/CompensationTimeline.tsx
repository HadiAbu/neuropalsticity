import amygdala from '@content/regions/amygdala';
import { useSimulation } from '@levels/amygdala/useSimulation';

export function CompensationTimeline() {
  const { state, dispatch } = useSimulation();
  if (state.phase !== 'rehab') return null;

  const { timeline, mechanism, caveat } = amygdala.plasticity;
  const currentIndex = Math.max(0, timeline.findIndex((p) => p.week === state.rehabWeek));
  const current = timeline[currentIndex];
  const weeks = current.week;
  const when = weeks === 0 ? 'Right after' : weeks < 52 ? `Week ${weeks}` : `Year ${Math.round(weeks / 52)}`;

  return (
    <section className="rounded-lg bg-slate-800/95 p-5 text-slate-100 shadow-lg">
      <h2 className="mb-2 text-xl font-semibold">The brain works around it</h2>
      <p className="mb-4 text-base leading-relaxed text-slate-300">{mechanism}</p>

      <label htmlFor="compensation-week" className="mb-1 block text-base font-medium">
        {when} — {Math.round(current.recoveryFraction * 100)}% of safety behaviours learned as rules
      </label>
      <input
        id="compensation-week"
        type="range"
        min={0}
        max={timeline.length - 1}
        step={1}
        value={currentIndex}
        onChange={(e) => dispatch({ type: 'SET_REHAB_WEEK', week: timeline[Number(e.target.value)].week })}
        className="w-full accent-amber-400"
      />

      <p className="mt-4 rounded-md border-l-2 border-slate-500 bg-slate-900/60 p-3 text-base text-slate-300">{caveat}</p>

      <button
        type="button"
        onClick={() => dispatch({ type: 'RESET_SCENARIO' })}
        className="mt-4 rounded-md bg-amber-500 px-4 py-2 text-base font-medium text-slate-900 hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
      >
        Try another situation
      </button>
    </section>
  );
}
