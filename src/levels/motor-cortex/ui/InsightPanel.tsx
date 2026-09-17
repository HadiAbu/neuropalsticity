import motorCortex from '@content/regions/motor-cortex';

export function InsightPanel() {
  return (
    <aside className="rounded-lg bg-slate-800/90 p-5 text-slate-100 shadow-lg">
      <h2 className="mb-2 text-lg font-semibold">Why is the map so lopsided?</h2>
      <p className="text-sm leading-relaxed text-slate-300">{motorCortex.insight}</p>
    </aside>
  );
}
