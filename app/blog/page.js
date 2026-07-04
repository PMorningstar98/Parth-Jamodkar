import SectionHeading from '@/components/SectionHeading';
import ContentCard from '@/components/ContentCard';
import content from '@/data/content.json';

export const metadata = {
  title: 'Blog',
  description: 'Personal writing on threat hunting, detection engineering, and security research by Parth Jamodkar.',
};

export default function BlogPage() {
  const items = content.filter((item) => item.type === 'blog');

  return (
    <div>
      <SectionHeading
        eyebrow="Blog"
        title="Writing"
        description="Longer-form personal writing, published outside of official Microsoft channels."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
        <div className="flex h-full min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-line p-6 text-center">
          <p className="font-mono text-xs uppercase tracking-wide text-ink-faint">Coming soon</p>
          <p className="mt-2 text-sm text-ink-faint">Future posts appear here automatically.</p>
        </div>
      </div>
    </div>
  );
}
