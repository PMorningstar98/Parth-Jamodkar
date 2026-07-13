'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
        gradient
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-4 py-1.5 font-mono text-xs transition-colors ${
                active
                  ? 'border-signal-blue/60 bg-signal-blue/10 text-signal-blue'
                  : 'border-line text-ink-muted hover:border-signal-blue/40 hover:text-ink'
              }`}
            >
              {f.label}
              <span className={`ml-1.5 ${active ? 'text-signal-blue/70' : 'text-ink-faint'}`}>
                {f.key === 'all' ? content.length : content.filter((i) => i.type === f.key).length}
              </span>
            </button>
          );
        })}
      </div>

      <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.32, ease: 'easeOut', delay: Math.min(i * 0.03, 0.25) }}
              className="h-full"
            >
              <ContentCard item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {items.length === 0 && (
        <p className="mt-10 text-center font-mono text-sm text-ink-faint">Nothing in this category yet.</p>
      )}
    </div>
  );
}
