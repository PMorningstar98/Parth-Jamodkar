import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';
import ContentCard from '@/components/ContentCard';
import GlassCard from '@/components/GlassCard';
import content from '@/data/content.json';
import categories from '@/data/research-categories.json';

export const metadata = {
  title: 'Research',
  description: 'Research by Parth Jamodkar organized by category: threat hunting, detection engineering, AI security, cloud security, supply chain security, threat intelligence, and MITRE ATT&CK mapping.',
};

export default function ResearchPage() {
  return (
    <div>
      <SectionHeading
        eyebrow="Research"
        title="Research areas"
        description="Work organized by category rather than by where it was published — each area pulls from publications, talks, open-source contributions, and blog posts alike."
      />

      <div className="space-y-16">
        {(() => {
          const seen = new Set();
          return categories.map((category) => {
          const items = content.filter(
            (item) => item.categories?.includes(category.name) && !seen.has(item.id),
          );
          items.forEach((item) => seen.add(item.id));
          if (items.length === 0) return null;

          return (
            <section key={category.name} id={category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
              <div className="mb-6 flex flex-col gap-2 border-l-2 border-signal-blue/50 pl-4">
                <h2 className="font-mono text-xl font-bold text-ink sm:text-2xl">{category.name}</h2>
                <p className="max-w-2xl text-sm text-ink-muted">{category.description}</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <ContentCard key={`${category.name}-${item.id}`} item={item} />
                ))}
              </div>
            </section>
          );
          });
        })()}
      </div>

      <GlassCard hover={false} className="mt-16 text-center">
        <p className="font-mono text-sm text-ink-muted">
          Want everything in one list instead?{' '}
          <Link href="/public-work" className="text-signal-blue hover:underline">
            See Public Work →
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
