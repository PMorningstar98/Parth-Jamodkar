import SectionHeading from '@/components/SectionHeading';
import GlassCard from '@/components/GlassCard';
import site from '@/data/site.json';

export const metadata = {
  title: 'Contact',
  description: `Get in touch with ${site.name}.`,
};

export default function ContactPage() {
  return (
    <div>
      <SectionHeading
        eyebrow="Contact"
        title="Get in touch"
        description="For research collaboration, speaking invitations, or just to talk about detection engineering."
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <GlassCard as="a" href={`mailto:${site.email}`} className="text-center">
          <p className="eyebrow mb-2">Email</p>
          <p className="font-mono text-sm text-ink">{site.email}</p>
        </GlassCard>
        <GlassCard as="a" href={site.social.linkedin} target="_blank" rel="noreferrer" className="text-center">
          <p className="eyebrow mb-2">LinkedIn</p>
          <p className="font-mono text-sm text-ink">Connect on LinkedIn ↗</p>
        </GlassCard>
        <GlassCard as="a" href={site.social.github} target="_blank" rel="noreferrer" className="text-center">
          <p className="eyebrow mb-2">GitHub</p>
          <p className="font-mono text-sm text-ink">@PMorningstar98 ↗</p>
        </GlassCard>
      </div>
    </div>
  );
}
