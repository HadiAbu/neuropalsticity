import type { SomatotopicContent } from '@content/schema';

export function InsightPanel({ content, title }: { content: SomatotopicContent; title: string }) {
  return (
    <aside className="rounded-lg bg-slate-800/90 p-5 text-slate-100 shadow-lg">
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <p className="text-sm leading-relaxed text-slate-300">{content.insight}</p>
    </aside>
  );
}
