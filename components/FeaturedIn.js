import GlassCard from './GlassCard';
import recognition from '@/data/recognition.json';

export default function FeaturedIn() {
  if (!recognition?.length) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {recognition.map((item) => (
        <GlassCard
          key={item.id}
          as="a"
          href={item.url}
          target="_blank"
          rel="noreferrer"
          hover
          className="group no-underline"
        >
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-signal-cyan/40 bg-signal-cyan/10 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide text-signal-cyan">
              Featured In
            </span>
            <span className="font-mono text-[11px] text-ink-faint">{item.source}</span>
          </div>
          <h3 className="mb-2 text-base font-semibold text-ink transition-colors group-hover:text-signal-blue">
            {item.title}
            <span aria-hidden="true" className="ml-1.5 inline-block text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-signal-blue">
              ↗
            </span>
          </h3>
          <p className="text-sm leading-relaxed text-ink-muted">{item.description}</p>
        </GlassCard>
      ))}
    </div>
  );
}
