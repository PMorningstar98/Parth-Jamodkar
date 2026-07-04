import Link from 'next/link';
import site from '@/data/site.json';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line-soft bg-surface/60">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-mono text-sm font-bold text-ink">{site.name}</p>
            <p className="mt-2 max-w-xs text-sm text-ink-muted">{site.tagline}</p>
          </div>

          <div>
            <p className="eyebrow mb-3">Elsewhere</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={site.social.github} target="_blank" rel="noreferrer" className="text-ink-muted hover:text-signal-blue">
                  GitHub
                </a>
              </li>
              <li>
                <a href={site.social.linkedin} target="_blank" rel="noreferrer" className="text-ink-muted hover:text-signal-blue">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={site.social.microsoftBlog} target="_blank" rel="noreferrer" className="text-ink-muted hover:text-signal-blue">
                  Microsoft Security Blog
                </a>
              </li>
              <li>
                <a href={site.social.medium} target="_blank" rel="noreferrer" className="text-ink-muted hover:text-signal-blue">
                  Medium
                </a>
              </li>
              <li>
                <a href={site.social.aboutMe} target="_blank" rel="noreferrer" className="text-ink-muted hover:text-signal-blue">
                  About.me
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-3">Site</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/public-work" className="text-ink-muted hover:text-signal-blue">Public Work</Link>
              </li>
              <li>
                <Link href="/research" className="text-ink-muted hover:text-signal-blue">Research</Link>
              </li>
              <li>
                <Link href="/contact" className="text-ink-muted hover:text-signal-blue">Contact</Link>
              </li>
              <li>
                <a href="/rss.xml" className="text-ink-muted hover:text-signal-blue">RSS Feed</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line-soft pt-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono">© {year} {site.name}. All rights reserved.</p>
          <p className="font-mono">Built as a research portal, not a résumé.</p>
        </div>
      </div>
    </footer>
  );
}
