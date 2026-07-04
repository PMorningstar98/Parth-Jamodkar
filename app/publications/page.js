import SectionHeading from '@/components/SectionHeading';
import ContentCard from '@/components/ContentCard';
import content from '@/data/content.json';

export const metadata = {
  title: 'Publications',
  description: 'Microsoft Security Blog and Microsoft Tech Community publications by Parth Jamodkar.',
};

export default function PublicationsPage() {
  const items = content.filter((item) => item.type === 'publication');

  return (
    <div>
      <SectionHeading
        eyebrow="Publications"
        title="Microsoft publications"
        description="Research published through official Microsoft security channels. New articles are added here automatically as soon as they're added to the data file — no code changes needed."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
        <PlaceholderCard label="Next Microsoft publication" />
      </div>
    </div>
  );
}

function PlaceholderCard({ label }) {
  return (
    <div className="flex h-full min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-line p-6 text-center">
      <p className="font-mono text-xs uppercase tracking-wide text-ink-faint">Coming soon</p>
      <p className="mt-2 text-sm text-ink-faint">{label} appears here — just add it to data/content.json.</p>
    </div>
  );
}
