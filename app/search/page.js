import { Suspense } from 'react';
import SearchClient from '@/components/SearchClient';

export const metadata = {
  title: 'Search',
  description: 'Search across all articles, talks, repositories, blog posts, and research by Parth Jamodkar.',
};

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="font-mono text-sm text-ink-faint">Loading search…</p>}>
      <SearchClient />
    </Suspense>
  );
}
