import GlassCard from './GlassCard';
import certifications from '@/data/certifications.json';

export default function Certifications() {
  if (!certifications?.length) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {certifications.map((cert) => (
        <GlassCard
          key={cert.id}
          as="a"
          href={cert.url}
          target="_blank"
          rel="noreferrer"
          hover
          className="group no-underline"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-signal-violet/40 bg-signal-violet/10 font-mono text-xs font-bold text-signal-violet">
              {cert.abbr}
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-semibold text-ink transition-colors group-hover:text-signal-blue sm:text-base">
                {cert.name}
                <span aria-hidden="true" className="ml-1.5 inline-block text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-signal-blue">
                  ↗
                </span>
              </span>
              <span className="mt-0.5 font-mono text-xs text-ink-faint">
                {cert.issuer}
                {cert.date ? ` · ${cert.date}` : ''}
              </span>
            </span>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
