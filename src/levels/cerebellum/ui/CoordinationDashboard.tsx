import cerebellum from '@content/regions/cerebellum';
import type { CoordinationProfile } from '@content/schema';
import { resolveTrial } from '@levels/cerebellum/simulation/resolveTrial';
import { useSimulation } from '@levels/cerebellum/useSimulation';

const PRIMARY =
  'rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300';
const LINK =
  'rounded-md px-4 py-2 text-sm text-slate-300 underline hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300';

function StatusRow({ label, ok, valueLabel }: { label: string; ok: boolean; valueLabel: string }) {
  return (
    <li className="flex items-center gap-2 text-xs">
      <span
        aria-hidden="true"
        className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm text-[10px] font-bold ${
          ok ? 'bg-emerald-600 text-white' : 'bg-rose-700 text-white'
        }`}
      >
        {ok ? '✓' : '✗'}
      </span>
      <span className="text-slate-200">{label}: {valueLabel}</span>
    </li>
  );
}

function ProfileCard({ title, profile, tone }: { title: string; profile: CoordinationProfile; tone: 'intact' | 'damaged' }) {
  const border = tone === 'intact' ? 'border-sky-500/50' : 'border-amber-500/60';
  return (
    <div className={`flex flex-col gap-2 rounded-md border ${border} bg-slate-900/60 p-3`}>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="flex flex-col gap-1">
        <StatusRow label="Gait" ok={profile.gait === 'steady'} valueLabel={profile.gait} />
        <StatusRow label="Intention tremor" ok={!profile.intentionTremor} valueLabel={profile.intentionTremor ? 'present' : 'absent'} />
        <StatusRow label="Rapid movements" ok={profile.rapidAlternatingMovements === 'normal'} valueLabel={profile.rapidAlternatingMovements} />
        <StatusRow label="Speech" ok={profile.speechQuality === 'normal'} valueLabel={profile.speechQuality} />
      </ul>
      <p className="text-xs text-slate-400">{profile.behavior}</p>
      <p className="text-xs italic text-slate-200">{profile.report}</p>
    </div>
  );
}

export function CoordinationDashboard() {
  const { state, dispatch } = useSimulation();
  if ((state.phase !== 'revealed' && state.phase !== 'rehab') || !state.site) return null;

  const result = resolveTrial(state.site, cerebellum);
  const predicted = state.prediction ? result.trial.choices.find((c) => c.id === state.prediction) : null;
  const wasRight = predicted?.correct === true;

  return (
    <section className="rounded-lg bg-slate-800/95 p-5 text-slate-100 shadow-lg">
      <p className="text-xs uppercase tracking-wide text-amber-300">{result.trial.label}</p>

      {predicted && (
        <p className="mb-3 mt-2 rounded-md bg-slate-700/60 p-3 text-sm">
          {wasRight ? 'You called it.' : `You guessed "${predicted.label}". Here is what actually happens, and why:`}
        </p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-3">
        <ProfileCard title="Intact cerebellum" profile={result.trial.intact} tone="intact" />
        <ProfileCard title="Damaged cerebellum" profile={result.trial.damaged} tone="damaged" />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-300">{result.trial.explanation}</p>
      <p className="mt-3 rounded-md border-l-2 border-amber-400 bg-slate-900/60 p-3 text-sm text-slate-300">
        {result.trial.dayToDay}
      </p>

      {state.phase === 'revealed' && (
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className={PRIMARY} onClick={() => dispatch({ type: 'ADVANCE_TO_REHAB' })}>
            What happens with practice?
          </button>
          <button type="button" className={LINK} onClick={() => dispatch({ type: 'RESET_SCENARIO' })}>
            Try another test
          </button>
        </div>
      )}
    </section>
  );
}
