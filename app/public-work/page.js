'use client';

import { useMemo, useState } from 'react';
import SectionHeading from '@/components/SectionHeading';
import ContentCard from '@/components/ContentCard';
import content from '@/data/content.json';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'publication', label: 'Publications' },
  { key: 'talk', label: 'Talks' },
  { key: 'opensource', label: 'Open Source' },
  { key: 'blog', label: 'Blog' },
];

export default function PublicWorkPage() {
  const [filter, setFilter] = useState('all');

  const items = useMemo(() => {
    if (filter === 'all') return content;
    return content.filter((item) => item.type === filter);
  }, [filter]);

  return (
    <div>
      <SectionHeading
        eyebrow="One index"
        title="Public work"
        description="Everything published in one place — Microsoft security articles, Microsoft Community Hub posts, conference talks, GitHub repositories, merged pull requests, and Medium posts. No more checking five different sites."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full border px-4 py-1.5 font-mono text-xs transition-colors ${
              filter === f.key
                ? 'border-signal-blue/60 bg-signal-blue/10 text-signal-blue'
                : 'border-line text-ink-muted hover:border-signal-blue/40 hover:text-ink'
            }`}
          >
            {f.label}
            <span className="ml-1.5 text-ink-faint">
              {f.key === 'all' ? content.length : content.filter((i) => i.type === f.key).length}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>

      {items.length === 0 && (
        <p className="mt-10 text-center font-mono text-sm text-ink-faint">Nothing in this category yet.</p>
      )}
    </div>
  );
}
