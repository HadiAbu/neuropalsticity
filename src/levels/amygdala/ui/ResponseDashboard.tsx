import amygdala from '@content/regions/amygdala';
import type { ResponseProfile, Sweat } from '@content/schema';
import { resolveResponse } from '@levels/amygdala/simulation/resolveResponse';
import { useSimulation } from '@levels/amygdala/useSimulation';

const PRIMARY =
  'rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300';
const LINK =
  'rounded-md px-4 py-2 text-sm text-slate-300 underline hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300';

const SWEAT_LABEL: Record<Sweat, string> = { none: 'dry', mild: 'clammy', strong: 'sweating' };

function heartBand(bpm: number): string {
  if (bpm < 80) return 'resting';
  if (bpm < 100) return 'elevated';
  return 'racing';
}

/** Semicircular gauge; the number is always printed so colour never carries the meaning alone. */
function HeartGauge({ bpm }: { bpm: number }) {
  const fraction = Math.min(1, Math.max(0, (bpm - 40) / 140));
  const angle = Math.PI * (1 - fraction);
  const r = 36;
  const x = 50 + r * Math.cos(angle);
  const y = 50 - r * Math.sin(angle);
  const fill = bpm < 80 ? '#22c55e' : bpm < 100 ? '#f59e0b' : '#dc2626';

  return (
    <svg viewBox="0 0 100 60" className="h-16 w-28" role="img" aria-label={`${bpm} beats per minute, ${heartBand(bpm)}`}>
      <path d="M14 50 A36 36 0 0 1 86 50" fill="none" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
      <path d={`M14 50 A36 36 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}`} fill="none" stroke={fill} strokeWidth="8" strokeLinecap="round" />
      <text x="50" y="48" textAnchor="middle" fill="#f1f5f9" fontSize="16" fontWeight="600">{bpm}</text>
      <text x="50" y="58" textAnchor="middle" fill="#cbd5e1" fontSize="7">bpm · {heartBand(bpm)}</text>
    </svg>
  );
}

function ProfileCard({ title, profile, tone }: { title: string; profile: ResponseProfile; tone: 'intact' | 'damaged' }) {
  const border = tone === 'intact' ? 'border-sky-500/50' : 'border-amber-500/60';
  return (
    <div className={`flex flex-col gap-2 rounded-md border ${border} bg-slate-900/60 p-3`}>
      <h3 className="text-sm font-semibold">{title}</h3>
      <HeartGauge bpm={profile.heartRateBpm} />
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
        <dt className="text-slate-400">Skin</dt>
        <dd className="text-slate-200">{SWEAT_LABEL[profile.sweat]}</dd>
        <dt className="text-slate-400">Does</dt>
        <dd className="text-slate-200">{profile.behavior}</dd>
        <dt className="text-slate-400">Says</dt>
        <dd className="italic text-slate-200">{profile.report}</dd>
        {profile.fearRecognized !== undefined && (
          <>
            <dt className="text-slate-400">Reads fear</dt>
            <dd className="text-slate-200">{profile.fearRecognized ? 'yes' : 'no'}</dd>
          </>
        )}
      </dl>
    </div>
  );
}

export function ResponseDashboard() {
  const { state, dispatch } = useSimulation();
  if ((state.phase !== 'revealed' && state.phase !== 'rehab') || !state.site) return null;

  const result = resolveResponse(state.site, amygdala);
  const predicted = state.prediction ? result.stimulus.choices.find((c) => c.id === state.prediction) : null;
  const wasRight = predicted?.correct === true;

  return (
    <section className="rounded-lg bg-slate-800/95 p-5 text-slate-100 shadow-lg">
      <p className="text-xs uppercase tracking-wide text-amber-300">{result.stimulus.label}</p>

      {predicted && (
        <p className="mb-3 mt-2 rounded-md bg-slate-700/60 p-3 text-sm">
          {wasRight ? 'You called it.' : `You guessed "${predicted.label}". Here is what actually happens, and why:`}
        </p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-3">
        <ProfileCard title="Intact amygdala" profile={result.intact} tone="intact" />
        <ProfileCard title="Damaged amygdala" profile={result.damaged} tone="damaged" />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-300">{result.stimulus.explanation}</p>
      <p className="mt-3 rounded-md border-l-2 border-amber-400 bg-slate-900/60 p-3 text-sm text-slate-300">
        {result.stimulus.dayToDay}
      </p>

      {state.phase === 'revealed' && (
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className={PRIMARY} onClick={() => dispatch({ type: 'ADVANCE_TO_REHAB' })}>
            What happens over time?
          </button>
          <button type="button" className={LINK} onClick={() => dispatch({ type: 'RESET_SCENARIO' })}>
            Try another situation
          </button>
        </div>
      )}
    </section>
  );
}
