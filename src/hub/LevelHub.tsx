import { useState } from 'react';
import { hubCopy, levels, themeTitles, type LevelEntry, type Theme } from '@content/levels';
import { HubScene } from '@/hub/HubScene';

const THEME_ORDER: Theme[] = ['regions', 'drugs', 'disorders'];

interface RowProps {
  level: LevelEntry;
  hovered: boolean;
  onHover: (id: string | null) => void;
  onEnter: (id: string) => void;
}

function LevelRow({ level, hovered, onHover, onEnter }: RowProps) {
  const available = level.status === 'available';
  const ring = hovered ? 'ring-2 ring-amber-400' : 'ring-1 ring-slate-700';
  const common = `flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left transition ${ring}`;

  if (!available) {
    return (
      <div
        aria-disabled="true"
        tabIndex={0}
        onMouseEnter={() => onHover(level.id)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(level.id)}
        onBlur={() => onHover(null)}
        className={`${common} bg-slate-800/50 text-slate-400 focus:outline-none`}
      >
        <span>
          <span className="block text-[10px] uppercase tracking-wide">{level.plainName}</span>
          <span className="block text-base text-slate-300">{level.name}</span>
        </span>
        <span className="shrink-0 rounded bg-slate-700 px-1.5 py-0.5 text-[10px]">{hubCopy.comingSoon}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onEnter(level.id)}
      onMouseEnter={() => onHover(level.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(level.id)}
      onBlur={() => onHover(null)}
      className={`${common} bg-slate-800 text-slate-100 hover:bg-slate-700 focus:outline-none`}
    >
      <span>
        <span className="block text-[10px] uppercase tracking-wide text-amber-300">{level.plainName}</span>
        <span className="block text-base font-medium">{level.name}</span>
      </span>
      <span className="shrink-0 rounded bg-amber-500 px-2 py-0.5 text-sm font-medium text-slate-900">{hubCopy.enter}</span>
    </button>
  );
}

export function LevelHub({ onEnter }: { onEnter: (id: string) => void }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-slate-900 text-slate-100">
      <div className="hidden h-full w-full md:block">
        <HubScene hoveredId={hoveredId} onHover={setHoveredId} onEnter={onEnter} />
      </div>

      <header className="pointer-events-none absolute left-6 top-6 max-w-md">
        <h1 className="text-4xl font-semibold tracking-tight">{hubCopy.title}</h1>
        <p className="mt-2 text-xl text-slate-300">{hubCopy.tagline}</p>
        <p className="mt-3 hidden text-sm text-slate-400 md:block">{hubCopy.hint}</p>
      </header>

      <aside className="absolute inset-x-0 bottom-0 top-36 overflow-y-auto px-6 pb-6 md:inset-x-auto md:right-6 md:top-6 md:w-80 md:px-0">
        {THEME_ORDER.map((theme) => {
          const entries = levels.filter((l) => l.theme === theme);
          if (entries.length === 0) return null;
          return (
            <section key={theme} aria-labelledby={`theme-${theme}`} className="mb-5">
              <h2 id={`theme-${theme}`} className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-400">
                {themeTitles[theme]}
              </h2>
              <ul className="flex flex-col gap-1.5">
                {entries.map((level) => (
                  <li key={level.id}>
                    <LevelRow level={level} hovered={hoveredId === level.id} onHover={setHoveredId} onEnter={onEnter} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </aside>
    </main>
  );
}
