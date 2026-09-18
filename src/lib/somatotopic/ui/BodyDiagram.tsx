import type { BodyPart, DeficitEntry, Hemisphere, Severity } from '@content/schema';

const SEVERITY_FILL: Record<Severity, string> = {
  complete: '#dc2626',
  partial: '#f59e0b',
  spared: '#475569',
};

const SEVERITY_LABEL: Record<Severity, string> = {
  complete: 'no movement',
  partial: 'weakened',
  spared: 'unaffected',
};

interface Shape { cx: number; cy: number; rx: number; ry: number }

/** Front-facing figure, 200 wide. Midline parts sit at cx=100; lateral parts are mirrored. */
const PART_SHAPES: Record<BodyPart, Shape> = {
  face:     { cx: 100, cy: 30,  rx: 18, ry: 20 },
  lips:     { cx: 100, cy: 40,  rx: 7,  ry: 4 },
  jaw:      { cx: 100, cy: 48,  rx: 12, ry: 6 },
  tongue:   { cx: 100, cy: 42,  rx: 4,  ry: 3 },
  neck:     { cx: 100, cy: 58,  rx: 8,  ry: 8 },
  shoulder: { cx: 100, cy: 74,  rx: 32, ry: 10 },
  trunk:    { cx: 100, cy: 108, rx: 26, ry: 30 },
  arm:      { cx: 136, cy: 108, rx: 9,  ry: 32 },
  hand:     { cx: 136, cy: 146, rx: 9,  ry: 10 },
  fingers:  { cx: 136, cy: 158, rx: 8,  ry: 6 },
  thumb:    { cx: 127, cy: 150, rx: 4,  ry: 6 },
  hip:      { cx: 100, cy: 142, rx: 22, ry: 12 },
  leg:      { cx: 112, cy: 190, rx: 11, ry: 38 },
  toes:     { cx: 112, cy: 232, rx: 10, ry: 6 },
};

const PARTS = Object.keys(PART_SHAPES) as BodyPart[];

interface Props {
  entries: DeficitEntry[];
  /** Body side carrying the deficit; null shows a healthy figure. */
  side: Hemisphere | null;
  highlighted: BodyPart | null;
  severityLabels?: Partial<Record<Severity, string>>;
}

/**
 * The figure faces the viewer, so its right side is on the viewer's left
 * (x < 100). Deficits are one-sided, so the affected half is drawn with the
 * resolved severities and the other half as spared, using two clip paths.
 */
export function BodyDiagram({ entries, side, highlighted, severityLabels }: Props) {
  const labels = { ...SEVERITY_LABEL, ...severityLabels };
  const severityOf = new Map(entries.map((e) => [e.part, e.severity]));
  const affectedClip = side === 'right' ? 'url(#viewer-left)' : side === 'left' ? 'url(#viewer-right)' : undefined;
  const healthyClip = side === 'right' ? 'url(#viewer-right)' : side === 'left' ? 'url(#viewer-left)' : undefined;

  const renderHalf = (clip: string | undefined, useSeverity: boolean) => (
    <g clipPath={clip}>
      {PARTS.map((part) => {
        const s = PART_SHAPES[part];
        const severity = useSeverity ? severityOf.get(part) ?? 'spared' : 'spared';
        const positions = s.cx === 100 ? [s.cx] : [s.cx, 200 - s.cx];
        return positions.map((cx) => (
          <ellipse
            key={`${part}-${cx}-${useSeverity}`}
            cx={cx} cy={s.cy} rx={s.rx} ry={s.ry}
            fill={SEVERITY_FILL[severity]}
            stroke={highlighted === part ? '#fbbf24' : '#0f172a'}
            strokeWidth={highlighted === part ? 3 : 1}
          >
            <title>{`${part}: ${labels[severity]}`}</title>
          </ellipse>
        ));
      })}
    </g>
  );

  return (
    <figure className="flex flex-col items-center rounded-lg bg-slate-800/90 p-4 shadow-lg">
      <svg
        viewBox="0 0 200 250"
        className="h-72 w-auto"
        role="img"
        aria-label={side ? `Body diagram showing deficits on the ${side} side` : 'Body diagram, no deficits'}
      >
        <defs>
          <clipPath id="viewer-left"><rect x="0" y="0" width="100" height="250" /></clipPath>
          <clipPath id="viewer-right"><rect x="100" y="0" width="100" height="250" /></clipPath>
        </defs>
        {side ? (
          <>
            {renderHalf(healthyClip, false)}
            {renderHalf(affectedClip, true)}
          </>
        ) : (
          renderHalf(undefined, false)
        )}
      </svg>

      <figcaption className="mt-3 flex flex-wrap justify-center gap-4 text-sm text-slate-300">
        {(['complete', 'partial', 'spared'] as Severity[]).map((severity) => (
          <span key={severity} className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: SEVERITY_FILL[severity] }} />
            {labels[severity]}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
