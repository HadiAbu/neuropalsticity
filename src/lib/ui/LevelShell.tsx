import { Children, type ReactNode } from 'react';
import { flowCopy } from '@content/flow';
import type { Phase } from '@lib/simulation/machine';
import { ProgressRail } from '@lib/ui/ProgressRail';

const BUTTON =
  'rounded-md bg-slate-700 px-3 py-1.5 text-base text-slate-100 hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400';

interface Props {
  title: string;
  overview: string;
  focusLabel: string;
  phase: Phase;
  onFocus: () => void;
  onReturnToOverview: () => void;
  onJump: (phase: Phase) => void;
  onExit: () => void;
  /** The level's own panels — site/stimulus chooser, prediction, dashboard, timeline. */
  children: ReactNode;
}

/**
 * The header + side panel chrome shared by every level. Above the `sm` breakpoint this
 * matches the original desktop layout exactly (floating header, right-side column).
 * Below it, the header narrows to fit the screen and the panel column stops floating
 * over the canvas — it docks as a full-width sheet along the bottom instead, sized by
 * viewport height rather than the header's (variable) height, so the two never collide
 * regardless of how much header text a given level has. The canvas keeps the remaining
 * top portion of the screen for touch-drag orbiting.
 */
export function LevelShell({
  title, overview, focusLabel, phase, onFocus, onReturnToOverview, onJump, onExit, children,
}: Props) {
  return (
    <>
      <header className="absolute left-4 right-4 top-4 z-10 flex flex-col gap-3 sm:right-auto sm:max-w-sm">
        <div className="flex items-center gap-3">
          <button type="button" className={BUTTON} onClick={onExit}>
            ← {flowCopy.exit}
          </button>
          <h1 className="text-xl font-semibold sm:text-2xl">{title}</h1>
        </div>
        <ProgressRail phase={phase} onJump={onJump} />
        {phase === 'overview' ? (
          <div className="max-w-md rounded-lg bg-slate-800/90 p-4 shadow-lg">
            <p className="mb-3 text-base leading-relaxed text-slate-300">{overview}</p>
            <button type="button" className={BUTTON} onClick={onFocus}>
              {focusLabel}
            </button>
          </div>
        ) : (
          <button type="button" className={`${BUTTON} self-start`} onClick={onReturnToOverview}>
            Back to the whole brain
          </button>
        )}
      </header>

      {phase !== 'overview' && (
        // Keyed by phase so the browser resets scroll to the top on every transition —
        // otherwise a scroll position from a taller earlier phase (e.g. focused) carries
        // over and can leave a shorter new phase's heading scrolled out of view. The same
        // remount also makes every child below a fresh DOM insertion each phase, which is
        // what makes their entrance animation replay on every transition, not just once.
        <aside
          key={phase}
          className="absolute inset-x-0 bottom-0 z-10 flex h-[55vh] flex-col gap-4 overflow-y-auto
                     bg-slate-900/95 px-4 pb-4 pt-3
                     sm:inset-x-auto sm:bottom-4 sm:right-4 sm:top-4 sm:h-auto sm:w-96 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-0"
        >
          {Children.map(children, (child) => (
            <div className="animate-panel-in">{child}</div>
          ))}
        </aside>
      )}
    </>
  );
}
