'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import site from '@/data/site.json';

const DecodeRain = dynamic(() => import('./DecodeRain'), { ssr: false });

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setRoleIndex((i) => (i + 1) % site.roles.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="grid gap-10 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-14">
      <div className="animate-fade-up">
        <p className="mb-5 font-mono text-sm text-signal-cyan">
          <span className="text-ink-faint">$</span> whoami
        </p>

        <h1 className="font-mono text-4xl font-extrabold leading-[1.08] text-ink sm:text-5xl lg:text-6xl">
          {site.name}
        </h1>

        <div className="mt-4 h-8 font-mono text-lg text-ink-muted sm:text-xl">
          <span className="text-signal-blue">&gt; </span>
          <span key={roleIndex}>{site.roles[roleIndex]}</span>
          <span className="prompt-caret" />
        </div>

        <p className="mt-6 max-w-lg text-lg text-ink-muted sm:text-xl">
          &ldquo;{site.tagline}&rdquo;
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href="/publications"
            className="rounded-lg bg-signal-blue px-5 py-2.5 font-mono text-sm font-semibold text-void shadow-glow transition-transform hover:-translate-y-0.5"
          >
            Microsoft Publications
          </Link>
          <a
            href={site.social.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-line px-5 py-2.5 font-mono text-sm text-ink transition-colors hover:border-signal-blue/50 hover:text-signal-blue"
          >
            GitHub
          </a>
          <a
            href={site.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-line px-5 py-2.5 font-mono text-sm text-ink transition-colors hover:border-signal-blue/50 hover:text-signal-blue"
          >
            LinkedIn
          </a>
          <Link
            href="/research"
            className="rounded-lg border border-line px-5 py-2.5 font-mono text-sm text-ink transition-colors hover:border-signal-violet/50 hover:text-signal-violet"
          >
            Research
          </Link>
          <Link
            href={site.resumeUrl}
            className="rounded-lg border border-line px-5 py-2.5 font-mono text-sm text-ink transition-colors hover:border-signal-blue/50 hover:text-signal-blue"
          >
            Download Résumé
          </Link>
        </div>
      </div>

      <div className="relative h-72 overflow-hidden rounded-2xl border border-line-soft bg-panel/60 shadow-glass sm:h-96 lg:h-[26rem]">
        <DecodeRain className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-line-soft bg-void/70 px-3 py-1 font-mono text-[11px] text-ink-muted backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-signal-blue" /> known
          <span className="ml-2 h-1.5 w-1.5 rounded-full bg-signal-violet" /> unknown
        </div>
      </div>
    </section>
  );
}
