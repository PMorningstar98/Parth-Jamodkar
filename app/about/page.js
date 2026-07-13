import SectionHeading from '@/components/SectionHeading';
import Timeline from '@/components/Timeline';
import SkillsCloud from '@/components/SkillsCloud';
import StatusWindow from '@/components/StatusWindow';
import GlassCard from '@/components/GlassCard';
import Certifications from '@/components/Certifications';
import FeaturedIn from '@/components/FeaturedIn';
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
        <SectionHeading eyebrow="Credentials" title="Certifications" />
        <Certifications />
      </Reveal>

      <Reveal as="section">
        <SectionHeading
          eyebrow="Recognition"
          title="Featured in"
          description="Where my research has been cited, syndicated, or featured by the wider security community."
        />
        <FeaturedIn />
      </Reveal>

      <Reveal as="section">
        <SectionHeading eyebrow="Capabilities" title="Skills" />
        <StatusWindow />
        <div className="mt-10">
          <SkillsCloud />
        </div>
      </Reveal>
    </div>
  );
}
