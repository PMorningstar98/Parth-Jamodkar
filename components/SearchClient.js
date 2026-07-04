'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SectionHeading from './SectionHeading';
import ContentCard from './ContentCard';
import content from '@/data/content.json';
import { searchContent } from '@/lib/search';

export default function SearchClient() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const results = useMemo(() => searchContent(content, query), [query]);

  return (
    <div>
      <SectionHeading
        eyebrow="Search"
        title="Search public work"
        description="Search across publications, talks, open-source contributions, and blog posts."
      />

      <div className="mb-8 flex items-center gap-3 rounded-xl border border-line bg-panel/60 px-4 py-3">
        <span aria-hidden="true" className="text-ink-faint">
          <SearchIcon />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a topic, tool, or keyword — e.g. KQL, supply chain, AI security"
          className="w-full bg-transparent font-mono text-sm text-ink placeholder:text-ink-faint focus:outline-none"
          autoFocus
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="font-mono text-xs text-ink-faint hover:text-ink"
          >
            Clear
          </button>
        )}
      </div>

      <p className="mb-6 font-mono text-xs text-ink-faint">
        {results.length} result{results.length === 1 ? '' : 's'}
        {query && <> for &ldquo;{query}&rdquo;</>}
      </p>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>

      {results.length === 0 && (
        <p className="mt-10 text-center font-mono text-sm text-ink-faint">
          No results. Try a different keyword — or browse{' '}
          <a href="/public-work" className="text-signal-blue hover:underline">
            all public work
          </a>
          .
        </p>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" />
    </svg>
  );
}
