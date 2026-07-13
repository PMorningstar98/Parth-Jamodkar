import SectionHeading from '@/components/SectionHeading';
import Timeline from '@/components/Timeline';
import SkillsCloud from '@/components/SkillsCloud';
import GlassCard from '@/components/GlassCard';
import Reveal from '@/components/Reveal';
import site from '@/data/site.json';

export const metadata = {
  title: 'About',
  description: `About ${site.name} — threat hunter, security researcher, and detection engineer.`,
};

export default function AboutPage() {
  return (
    <div className="space-y-16">
      <Reveal as="section">
        <SectionHeading eyebrow="Profile" title={`About ${site.name}`} gradient />
        <GlassCard hover={false} className="max-w-3xl">
          <p className="text-base leading-relaxed text-ink-muted sm:text-lg">{site.summary}</p>
        </GlassCard>
      </Reveal>

      <Reveal as="section">
        <SectionHeading eyebrow="Career" title="Timeline" />
        <Timeline />
      </Reveal>

      <Reveal as="section">
        <SectionHeading eyebrow="Capabilities" title="Skills" />
        <SkillsCloud />
      </Reveal>
    </div>
  );
}
