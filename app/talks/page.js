import SectionHeading from '@/components/SectionHeading';
import ContentCard from '@/components/ContentCard';
import content from '@/data/content.json';

export const metadata = {
  title: 'Talks',
  description: 'Conference talks and speaking engagements by Parth Jamodkar.',
};

export default function TalksPage() {
  const items = content.filter((item) => item.type === 'talk');

  return (
    <div>
      <SectionHeading
        eyebrow="Talks & Sessions"
        title="Talks & sessions"
        description="Conference talks, guest lectures, and hands-on workshops — past and upcoming."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
        <div className="flex h-full min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-line p-6 text-center">
          <p className="font-mono text-xs uppercase tracking-wide text-ink-faint">Coming soon</p>
          <p className="mt-2 text-sm text-ink-faint">Future conference talks appear here automatically.</p>
        </div>
      </div>
    </div>
  );
}
