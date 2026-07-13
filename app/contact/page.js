import SectionHeading from '@/components/SectionHeading';
import GlassCard from '@/components/GlassCard';
import Reveal from '@/components/Reveal';
import site from '@/data/site.json';

export const metadata = {
  title: 'Contact',
  description: `Get in touch with ${site.name}.`,
};

const CHANNELS = [
  {
    key: 'email',
    label: 'Email',
    value: site.email,
    href: `mailto:${site.email}`,
    hint: 'Best for research collaboration & speaking',
    icon: MailIcon,
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    value: 'Connect on LinkedIn',
    href: site.social.linkedin,
    hint: 'Professional network & DMs',
    icon: LinkedInIcon,
    external: true,
  },
  {
    key: 'github',
    label: 'GitHub',
    value: '@PMorningstar98',
    href: site.social.github,
    hint: 'Detection rules & open-source work',
    icon: GitHubIcon,
    external: true,
  },
];

const ELSEWHERE = [
  { label: 'Microsoft Security Blog', href: site.social.microsoftBlog },
  { label: 'Medium', href: site.social.medium },
  { label: 'About.me', href: site.social.aboutMe },
];

export default function ContactPage() {
  return (
    <div>
      <SectionHeading
        eyebrow="Contact"
        title="Get in touch"
        description="For research collaboration, speaking invitations, or just to talk about detection engineering."
        gradient
      />

      <Reveal className="grid gap-5 sm:grid-cols-3">
        {CHANNELS.map(({ key, label, value, href, hint, icon: Icon, external }) => (
          <GlassCard
            key={key}
            as="a"
            href={href}
            {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
            className="group no-underline"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-panel/60 text-signal-blue transition-colors group-hover:border-signal-blue/50 group-hover:text-signal-cyan">
                <Icon />
              </span>
              <div>
                <p className="eyebrow mb-0.5">{label}</p>
                <p className="font-mono text-sm text-ink transition-colors group-hover:text-signal-blue">
                  {value}
                  <span aria-hidden="true" className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs text-ink-faint">{hint}</p>
          </GlassCard>
        ))}
      </Reveal>

      <Reveal className="mt-10" delay={0.1}>
        <p className="eyebrow mb-3">Elsewhere</p>
        <div className="flex flex-wrap gap-2">
          {ELSEWHERE.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line bg-panel/50 px-3.5 py-1.5 font-mono text-xs text-ink-muted transition-colors hover:border-signal-blue/50 hover:text-signal-blue"
            >
              {label} ↗
            </a>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21h-4z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}
