import drugs from '@content/regions/drugs';
import type { EffectProfile } from '@content/schema';
import { HeartGauge } from '@lib/ui/HeartGauge';
import { resolveEffect } from '@levels/drugs/simulation/resolveEffect';
import { useSimulation } from '@levels/drugs/useSimulation';

const PRIMARY =
  'rounded-md bg-amber-500 px-4 py-2 text-base font-medium text-slate-900 hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300';
const LINK =
  'rounded-md px-4 py-2 text-base text-slate-300 underline hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300';

function ProfileCard({ title, profile, tone }: { title: string; profile: EffectProfile; tone: 'sober' | 'acute' }) {
  const border = tone === 'sober' ? 'border-sky-500/50' : 'border-amber-500/60';
  return (
    <div className={`flex flex-col gap-2 rounded-md border ${border} bg-slate-900/60 p-3`}>
      <h3 className="text-base font-semibold">{title}</h3>
      <HeartGauge bpm={profile.heartRateBpm} />
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-slate-400">Reacts in</dt>
        <dd className="text-slate-200">{profile.reactionTimeMs} ms</dd>
        <dt className="text-slate-400">Mood</dt>
        <dd className="text-slate-200">{profile.mood}</dd>
        <dt className="text-slate-400">Does</dt>
        <dd className="text-slate-200">{profile.behavior}</dd>
        <dt className="text-slate-400">Says</dt>
        <dd className="italic text-slate-200">{profile.report}</dd>
      </dl>
    </div>
  );
}

export function EffectDashboard() {
  const { state, dispatch } = useSimulation();
  if (state.phase !== 'revealed' || !state.site) return null;

  const { substance, correctChoiceId } = resolveEffect(state.site, drugs);
  const predicted = state.prediction ? substance.choices.find((c) => c.id === state.prediction) : null;
  const wasRight = predicted?.id === correctChoiceId;

  return (
    <section className="rounded-lg bg-slate-800/95 p-5 text-slate-100 shadow-lg">
      <p className="text-sm uppercase tracking-wide text-amber-300">{substance.label} · {substance.drugClass}</p>

      {predicted && (
        <p className="mb-3 mt-2 rounded-md bg-slate-700/60 p-3 text-base">
          {wasRight ? 'You called it.' : `You guessed "${predicted.label}". Here is what actually happens, and why:`}
        </p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-3">
        <ProfileCard title="Sober" profile={substance.sober} tone="sober" />
        <ProfileCard title="On it" profile={substance.acute} tone="acute" />
      </div>

      <p className="mt-4 text-base leading-relaxed text-slate-300">{substance.explanation}</p>
      <p className="mt-3 rounded-md border-l-2 border-amber-400 bg-slate-900/60 p-3 text-base text-slate-300">{substance.dayToDay}</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className={PRIMARY} onClick={() => dispatch({ type: 'ADVANCE_TO_REHAB' })}>
          What does repeated use do?
        </button>
        <button type="button" className={LINK} onClick={() => dispatch({ type: 'RESET_SCENARIO' })}>
          Try another substance
        </button>
      </div>
    </section>
  );
}
