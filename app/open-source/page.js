import SectionHeading from '@/components/SectionHeading';
import ContentCard from '@/components/ContentCard';
import content from '@/data/content.json';
import site from '@/data/site.json';

export const metadata = {
  title: 'Open Source',
  description: 'Open-source repositories, pull requests, and detection rules by Parth Jamodkar.',
};

export default function OpenSourcePage() {
  const items = content.filter((item) => item.type === 'opensource');

  return (
    <div>
      <SectionHeading
        eyebrow="Open Source"
        title="Open source contributions"
        description="Repositories maintained directly, plus contributions to community projects."
      />

      <a
        href={site.social.github}
        target="_blank"
        rel="noreferrer"
        className="mb-8 flex items-center justify-between rounded-xl border border-line-soft bg-panel/60 px-5 py-4 font-mono text-sm text-ink-muted transition-colors hover:border-signal-blue/50 hover:text-signal-blue"
      >
        <span>@PMorningstar98 on GitHub — full profile and repository list</span>
        <span aria-hidden="true">↗</span>
      </a>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
        <div className="flex h-full min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-line p-6 text-center">
          <p className="font-mono text-xs uppercase tracking-wide text-ink-faint">Coming soon</p>
          <p className="mt-2 text-sm text-ink-faint">Future repositories and pull requests appear here automatically.</p>
        </div>
      </div>
    </div>
  );
}
