import type { DrugAction, SynapseState, Transmitter } from '@content/schema';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const RECEPTOR_SLOTS = 10;
const TRANSMITTER_SLOTS = 24;

const TRANSMITTER_COLOR: Record<Transmitter, string> = {
  GABA: '#60a5fa',
  dopamine: '#f472b6',
  endorphin: '#a78bfa',
};

const DRUG_COLOR = '#facc15';

/** Deterministic scatter for transmitter dots inside the cleft. */
const TRANSMITTER_POSITIONS = Array.from({ length: TRANSMITTER_SLOTS }, (_, i) => {
  const col = i % 8;
  const row = Math.floor(i / 8);
  const jitterX = ((i * 37) % 11) - 5;
  const jitterY = ((i * 53) % 7) - 3;
  return { x: 40 + col * 32 + jitterX, y: 118 + row * 16 + jitterY };
});

interface Props {
  state: SynapseState;
  transmitter: Transmitter;
  action: DrugAction;
  drugActive: boolean;
  title: string;
}

function Hexagon({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  return <polygon points={pts} fill={DRUG_COLOR} stroke="#713f12" strokeWidth="1" />;
}

export function SynapseView({ state, transmitter, action, drugActive, title }: Props) {
  const reducedMotion = usePrefersReducedMotion();
  const transition = reducedMotion ? undefined : 'opacity 400ms ease, fill 400ms ease';

  const receptorsShown = Math.round(state.receptorDensity * RECEPTOR_SLOTS);
  const receptorsLit = Math.round(state.receptorActivation * receptorsShown);
  const dotsShown = Math.round(state.transmitterInCleft * TRANSMITTER_SLOTS);
  const pumpBlocked = drugActive && action === 'blocks-reuptake';
  const color = TRANSMITTER_COLOR[transmitter];

  const summary =
    `${title}: ${Math.round(state.transmitterInCleft * 100)}% transmitter in the cleft, ` +
    `${receptorsShown} of ${RECEPTOR_SLOTS} receptors present, ${receptorsLit} active` +
    (drugActive ? `, drug ${action.replace('-', ' ')}` : '');

  return (
    <figure className="rounded-lg bg-slate-800/95 p-4 shadow-lg">
      <figcaption className="mb-2 flex items-baseline justify-between text-base">
        <span className="font-semibold text-slate-100">{title}</span>
        <span className="text-sm text-slate-300">{transmitter} synapse</span>
      </figcaption>

      <svg viewBox="0 0 320 240" className="w-full" role="img" aria-label={summary}>
        {/* presynaptic terminal */}
        <path d="M40 10 Q160 -20 280 10 L280 96 Q160 112 40 96 Z" fill="#1e293b" stroke="#475569" strokeWidth="2" />
        <text x="50" y="30" fill="#94a3b8" fontSize="10">sending neuron</text>
        {[80, 130, 180, 230].map((x) => (
          <circle key={x} cx={x} cy={60} r={12} fill="none" stroke={color} strokeWidth="2" opacity={0.8} />
        ))}
        {[80, 130, 180, 230].flatMap((x) =>
          [-4, 3, 0].map((dx, j) => <circle key={`${x}-${j}`} cx={x + dx} cy={60 + (j - 1) * 4} r={2} fill={color} />)
        )}

        {/* reuptake pump */}
        <g>
          <rect x={276} y={84} width={22} height={22} rx={4} fill={pumpBlocked ? '#334155' : '#0f766e'} stroke="#134e4a" strokeWidth="1.5" style={{ transition }} />
          <text x={287} y={99} textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="600">↺</text>
          {pumpBlocked && <Hexagon cx={287} cy={95} r={9} />}
          <text x={287} y={80} textAnchor="middle" fill="#94a3b8" fontSize="8">pump{pumpBlocked ? ' blocked' : ''}</text>
        </g>

        {/* cleft transmitter */}
        {TRANSMITTER_POSITIONS.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3.2} fill={color} opacity={i < dotsShown ? 1 : 0} style={{ transition }} />
        ))}
        <text x={160} y={165} textAnchor="middle" fill="#94a3b8" fontSize="10">synaptic cleft</text>

        {/* postsynaptic membrane + receptors */}
        <path d="M40 232 Q160 246 280 232 L280 190 Q160 176 40 190 Z" fill="#1e293b" stroke="#475569" strokeWidth="2" />
        <text x="50" y="222" fill="#94a3b8" fontSize="10">receiving neuron</text>
        {Array.from({ length: RECEPTOR_SLOTS }, (_, i) => {
          const x = 52 + i * 24;
          const present = i < receptorsShown;
          const lit = i < receptorsLit;
          const occupiedByDrug = drugActive && lit && action === 'mimics-transmitter';
          const boostedByDrug = drugActive && lit && action === 'enhances-receptor';
          return (
            <g key={i} opacity={present ? 1 : 0.12} style={{ transition }}>
              <rect x={x - 6} y={178} width={12} height={16} rx={3} fill={lit ? color : '#475569'} stroke="#0f172a" strokeWidth="1" style={{ transition }} />
              {lit && !occupiedByDrug && <circle cx={x} cy={176} r={3.2} fill={color} />}
              {occupiedByDrug && <Hexagon cx={x} cy={176} r={5} />}
              {boostedByDrug && <Hexagon cx={x + 8} cy={184} r={4} />}
            </g>
          );
        })}
      </svg>

      <dl className="mt-2 grid grid-cols-3 gap-2 text-center text-sm">
        <div><dt className="text-slate-400">In the cleft</dt><dd className="font-semibold text-slate-100">{Math.round(state.transmitterInCleft * 100)}%</dd></div>
        <div><dt className="text-slate-400">Receptors</dt><dd className="font-semibold text-slate-100">{receptorsShown} / {RECEPTOR_SLOTS}</dd></div>
        <div><dt className="text-slate-400">Active</dt><dd className="font-semibold text-slate-100">{receptorsLit}</dd></div>
      </dl>
      {drugActive && (
        <p className="mt-2 text-center text-sm text-amber-200">
          <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: DRUG_COLOR }} />
          drug molecule — {action.replace('-', ' ')}
        </p>
      )}
    </figure>
  );
}
