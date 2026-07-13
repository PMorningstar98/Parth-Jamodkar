import GlassCard from './GlassCard';

const TYPE_META = {
  publication: { label: 'Publication', className: 'text-signal-blue border-signal-blue/40 bg-signal-blue/10' },
  profile: { label: 'Profile', className: 'text-signal-cyan border-signal-cyan/40 bg-signal-cyan/10' },
  talk: { label: 'Talk', className: 'text-signal-violet border-signal-violet/40 bg-signal-violet/10' },
  opensource: { label: 'Open Source', className: 'text-signal-cyan border-signal-cyan/40 bg-signal-cyan/10' },
  blog: { label: 'Blog', className: 'text-ink-muted border-line bg-panel' },
};

export default function ContentCard({ item }) {
  const meta = TYPE_META[item.type] || TYPE_META.blog;
  const isLink = Boolean(item.url);
  const linkProps = isLink
    ? { as: 'a', href: item.url, target: '_blank', rel: 'noreferrer' }
    : { as: 'div' };

  return (
    <GlassCard
      {...linkProps}
      hover={isLink}
      className="group flex h-full flex-col no-underline"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide ${meta.className}`}>
          {meta.label}
        </span>
        {item.source && <span className="font-mono text-[11px] text-ink-faint">{item.source}</span>}
        {item.date && <span className="font-mono text-[11px] text-ink-faint">· {item.date}</span>}
      </div>

      <h3 className="mb-2 text-base font-semibold text-ink transition-colors group-hover:text-signal-blue sm:text-lg">
        {item.title}
        {isLink && (
          <span aria-hidden="true" className="ml-1.5 inline-block text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-signal-blue">↗</span>
        )}
      </h3>

      {item.description && (
        <p className="mb-4 flex-1 text-sm leading-relaxed text-ink-muted">{item.description}</p>
      )}

      {item.categories && item.categories.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1.5">
          {item.categories.map((cat) => (
            <span key={cat} className="rounded-md border border-line-soft px-2 py-0.5 font-mono text-[10px] text-ink-faint">
              {cat}
            </span>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
