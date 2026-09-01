'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';
import ContentCard from '@/components/ContentCard';
import GlassCard from '@/components/GlassCard';
import content from '@/data/content.json';
import site from '@/data/site.json';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'microsoft', label: 'Microsoft' },
  { key: 'csa', label: 'Cloud Security Alliance' },
  { key: 'bhis', label: 'Black Hills InfoSec' },
  { key: 'medium', label: 'Medium' },
  { key: 'talk', label: 'Talks' },
  { key: 'opensource', label: 'Open Source' },
];

const matchesFilter = (item, key) => {
  if (key === 'all') return true;
  if (key === 'microsoft') return (item.source || '').startsWith('Microsoft');
  if (key === 'csa') return item.source === 'Cloud Security Alliance';
  if (key === 'bhis') return item.source === 'Black Hills Information Security';
  if (key === 'medium') return item.source === 'Medium';
  return item.type === key;
};

export default function PublicWorkPage() {
  const [filter, setFilter] = useState('all');

  const items = useMemo(
    () => content.filter((item) => matchesFilter(item, filter)),
    [filter]
  );

  return (
    <div>
      <SectionHeading
        eyebrow="One index"
        title="Public work"
        description="Browse work by publisher — Microsoft, Cloud Security Alliance, Black Hills Information Security, and Medium — alongside conference talks and open-source contributions."
        gradient
      />

      <GlassCard
        as="a"
        href={site.social.microsoftBlog}
        target="_blank"
        rel="noreferrer"
        className="group mb-8 flex items-center justify-between gap-5 no-underline"
      >
        <div>
          <p className="mb-1 font-mono text-xs uppercase tracking-wide text-signal-cyan">
            Official author profile
          </p>
          <h2 className="text-lg font-semibold text-ink group-hover:text-signal-blue">
            Microsoft Security Blog
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Browse my complete author archive and published Microsoft security research.
          </p>
        </div>
        <span
          aria-hidden="true"
          className="shrink-0 font-mono text-xl text-signal-blue transition-transform group-hover:translate-x-1"
        >
          →
        </span>
      </GlassCard>

      <div className="mb-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          const count = content.filter((i) => matchesFilter(i, f.key)).length;
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
                {count}
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
