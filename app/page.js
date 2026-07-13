import Link from 'next/link';
import Hero from '@/components/Hero';
import SectionHeading from '@/components/SectionHeading';
import ContentCard from '@/components/ContentCard';
import Timeline from '@/components/Timeline';
import SkillsCloud from '@/components/SkillsCloud';
import GlassCard from '@/components/GlassCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import content from '@/data/content.json';

export default function HomePage() {
  const featured = content.filter((item) => item.featured).slice(0, 3);

  const counts = {
    publication: content.filter((i) => i.type === 'publication').length,
    talk: content.filter((i) => i.type === 'talk').length,
    opensource: content.filter((i) => i.type === 'opensource').length,
    blog: content.filter((i) => i.type === 'blog').length,
  };

  return (
    <>
      <Hero />

      <section className="py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Latest"
            title="Latest research"
            description="Recent publications, talks, and open-source work — pulled straight from the same data that powers Public Work."
            className="mb-0"
          />
          <Link href="/public-work" className="font-mono text-sm text-signal-blue hover:underline">
            View all public work →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="py-16">
        <SectionHeading
          eyebrow="One place"
          title="Public work, aggregated"
          description="Every Microsoft publication, conference talk, merged pull request, and blog post — in one index, so you don't have to hunt across five sites to find it."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="Microsoft Publications" value={counts.publication} accent="blue" />
          <StatTile label="Conference Talks" value={counts.talk} accent="violet" />
          <StatTile label="Open Source Contributions" value={counts.opensource} accent="cyan" />
          <StatTile label="Blog Posts" value={counts.blog} accent="blue" />
        </div>
      </section>

      <section className="py-16">
        <SectionHeading eyebrow="Career" title="Timeline" />
        <Timeline />
      </section>

      <section className="py-16">
        <SectionHeading
          eyebrow="Capabilities"
          title="Skills"
          description="Tap any skill to see the research, publications, and repos where it shows up."
        />
        <SkillsCloud />
      </section>
    </>
  );
}

function StatTile({ label, value, accent }) {
  const accentClass =
    accent === 'violet' ? 'text-signal-violet' : accent === 'cyan' ? 'text-signal-cyan' : 'text-signal-blue';
  return (
    <GlassCard hover={false} className="text-center">
      <p className={`font-mono text-4xl font-extrabold ${accentClass}`}>
        <AnimatedCounter value={value} />
      </p>
      <p className="mt-2 text-xs uppercase tracking-wide text-ink-muted">{label}</p>
    </GlassCard>
  );
}
