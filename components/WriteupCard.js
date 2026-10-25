'use client';

import Link from 'next/link';
import GlassCard from './GlassCard';

const BASE = process.env.NODE_ENV === 'production' ? '/Parth-Jamodkar' : '';

export default function WriteupCard({ item }) {
  return (
    <Link href={`/writeups/${item.slug}/`} className="group block h-full no-underline">
      <GlassCard className="flex h-full flex-col overflow-hidden !p-0">
        <div className="relative aspect-[21/9] w-full overflow-hidden border-b border-line-soft">
          <img
            src={`${BASE}${item.cover}`}
            alt={item.coverAlt || ''}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute left-3 top-3 rounded-full border border-signal-cyan/40 bg-void/80 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-signal-cyan backdrop-blur">
            Write-up
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex flex-wrap items-center gap-2 font-mono text-[11px] text-ink-faint">
            <span>{item.dateLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{item.readTime}</span>
          </div>
          <h3 className="mb-2 text-base font-semibold text-ink transition-colors group-hover:text-signal-blue sm:text-lg">
            {item.title}
            <span aria-hidden="true" className="ml-1.5 inline-block text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-signal-blue">→</span>
          </h3>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-ink-muted">{item.hook}</p>
          <div className="mt-auto flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span key={tag} className="rounded-md border border-line-soft px-2 py-0.5 font-mono text-[10px] text-ink-faint">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
