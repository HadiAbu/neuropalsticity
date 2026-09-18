import hippocampus from '@content/regions/hippocampus';
import type { MemoryProfile } from '@content/schema';
import { resolveTrial } from '@levels/hippocampus/simulation/resolveTrial';
import { useSimulation } from '@levels/hippocampus/useSimulation';

const PRIMARY =
  'rounded-md bg-amber-500 px-4 py-2 text-base font-medium text-slate-900 hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300';
const LINK =
  'rounded-md px-4 py-2 text-base text-slate-300 underline hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300';

const DIMENSIONS: { key: keyof MemoryProfile; label: string }[] = [
  { key: 'formsNewMemory', label: 'Forms a new memory' },
  { key: 'retainsOldMemories', label: 'Keeps old memories' },
  { key: 'learnsSkillsProcedurally', label: 'Learns the skill anyway' },
];

function ProfileCard({ title, profile, tone }: { title: string; profile: MemoryProfile; tone: 'intact' | 'damaged' }) {
  const border = tone === 'intact' ? 'border-sky-500/50' : 'border-amber-500/60';
  return (
    <div className={`flex flex-col gap-2 rounded-md border ${border} bg-slate-900/60 p-3`}>
      <h3 className="text-base font-semibold">{title}</h3>
      <ul className="flex flex-col gap-1 text-sm">
        {DIMENSIONS.map(({ key, label }) => {
          const yes = profile[key] as boolean;
          return (
            <li key={key} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm text-[10px] font-bold ${
                  yes ? 'bg-emerald-600 text-white' : 'bg-rose-700 text-white'
                }`}
              >
                {yes ? '✓' : '✗'}
              </span>
              <span className="text-slate-200">{label}: {yes ? 'yes' : 'no'}</span>
            </li>
          );
        })}
      </ul>
      <p className="text-sm text-slate-400">{profile.behavior}</p>
      <p className="text-sm italic text-slate-200">{profile.report}</p>
    </div>
  );
}

export function MemoryDashboard() {
  const { state, dispatch } = useSimulation();
  if ((state.phase !== 'revealed' && state.phase !== 'rehab') || !state.site) return null;

  const result = resolveTrial(state.site, hippocampus);
  const predicted = state.prediction ? result.trial.choices.find((c) => c.id === state.prediction) : null;
  const wasRight = predicted?.correct === true;

  return (
    <section className="rounded-lg bg-slate-800/95 p-5 text-slate-100 shadow-lg">
      <p className="text-sm uppercase tracking-wide text-amber-300">{result.trial.label}</p>

      {predicted && (
        <p className="mb-3 mt-2 rounded-md bg-slate-700/60 p-3 text-base">
          {wasRight ? 'You called it.' : `You guessed "${predicted.label}". Here is what actually happens, and why:`}
        </p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-3">
        <ProfileCard title="Intact hippocampus" profile={result.trial.intact} tone="intact" />
        <ProfileCard title="Damaged hippocampus" profile={result.trial.damaged} tone="damaged" />
      </div>

      <p className="mt-4 text-base leading-relaxed text-slate-300">{result.trial.explanation}</p>
      <p className="mt-3 rounded-md border-l-2 border-amber-400 bg-slate-900/60 p-3 text-base text-slate-300">
        {result.trial.dayToDay}
      </p>

      {state.phase === 'revealed' && (
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className={PRIMARY} onClick={() => dispatch({ type: 'ADVANCE_TO_REHAB' })}>
            What happens over time?
          </button>
          <button type="button" className={LINK} onClick={() => dispatch({ type: 'RESET_SCENARIO' })}>
            Try another scenario
          </button>
        </div>
      )}
    </section>
  );
}
