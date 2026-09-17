import { hubCopy, levels, type LevelEntry } from '@content/levels';

function LevelCard({ level, onEnter }: { level: LevelEntry; onEnter: (id: string) => void }) {
  const available = level.status === 'available';
  const base = 'flex h-full flex-col justify-between rounded-lg border p-4 text-left shadow-lg transition';

  if (!available) {
    return (
      <div
        aria-disabled="true"
        className={`${base} border-slate-700 bg-slate-800/50 text-slate-400`}
      >
        <div>
          <p className="text-xs uppercase tracking-wide">{level.plainName}</p>
          <h3 className="mt-1 text-base font-semibold text-slate-300">{level.name}</h3>
        </div>
        <span className="mt-4 inline-block w-fit rounded bg-slate-700 px-2 py-0.5 text-xs">{hubCopy.comingSoon}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onEnter(level.id)}
      className={`${base} border-amber-400/60 bg-slate-800 text-slate-100 hover:border-amber-300 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400`}
    >
      <div>
        <p className="text-xs uppercase tracking-wide text-amber-300">{level.plainName}</p>
        <h3 className="mt-1 text-base font-semibold">{level.name}</h3>
      </div>
      <span className="mt-4 inline-block w-fit rounded bg-amber-500 px-3 py-1 text-sm font-medium text-slate-900">{hubCopy.enter}</span>
    </button>
  );
}

export function LevelHub({ onEnter }: { onEnter: (id: string) => void }) {
  return (
    <main className="min-h-screen w-screen overflow-y-auto bg-slate-900 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-semibold tracking-tight">{hubCopy.title}</h1>
        <p className="mt-2 max-w-xl text-lg text-slate-300">{hubCopy.tagline}</p>

        <h2 className="mt-12 mb-4 text-sm font-medium uppercase tracking-wide text-slate-400">{hubCopy.sectionTitle}</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {levels.map((level) => (
            <li key={level.id} className="min-h-36">
              <LevelCard level={level} onEnter={onEnter} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
