'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import site from '@/data/site.json';

const DecodeRain = dynamic(() => import('./DecodeRain'), { ssr: false });

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [creedIndex, setCreedIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setRoleIndex((i) => (i + 1) % site.roles.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!site.manifesto?.length) return undefined;
    const id = setInterval(() => {
      setCreedIndex((i) => (i + 1) % site.manifesto.length);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="grid gap-10 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-14">
      <div className="animate-fade-up">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line-soft bg-panel/50 px-3 py-1 font-mono text-xs text-signal-cyan backdrop-blur-sm">
          <span className="status-dot h-1.5 w-1.5 animate-pulse rounded-full bg-signal-cyan" />
          <span className="text-ink-faint">$</span> whoami
        </p>

        <h1 className="glow-halo font-mono text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
          <span className="text-gradient-animated">{site.name}</span>
        </h1>

        <div className="mt-4 flex h-8 items-center font-mono text-lg text-ink-muted sm:text-xl">
          <span className="text-signal-blue">&gt;&nbsp;</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
              className="text-ink"
            >
              {site.roles[roleIndex]}
            </motion.span>
          </AnimatePresence>
          <span className="prompt-caret" />
        </div>

        <p className="mt-6 max-w-lg text-lg text-ink-muted sm:text-xl">
          &ldquo;{site.tagline}&rdquo;
        </p>

        {site.manifesto?.length ? (
          <div className="mt-6 max-w-lg border-l-2 border-signal-violet/40 pl-4">
            <p className="eyebrow mb-1.5 text-signal-violet/80">// hunter&apos;s creed</p>
            <div className="flex min-h-[3rem] items-start">
              <AnimatePresence mode="wait">
                <motion.p
                  key={creedIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="font-mono text-sm italic leading-relaxed text-ink-muted sm:text-base"
                >
                  {site.manifesto[creedIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
            <p
              onClick={() => window.dispatchEvent(new Event('arise'))}
              className="mt-2 cursor-pointer select-none font-mono text-[11px] italic text-ink-faint transition-colors hover:text-signal-blue/70"
              title="⟨ ? ⟩"
            >
              — walking in the footsteps of Hunter Sung Jin-woo
            </p>
          </div>
        ) : null}

        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href="/publications"
            className="group inline-flex items-center gap-2 rounded-lg bg-signal-blue px-5 py-2.5 font-mono text-sm font-semibold text-void shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(76,124,243,0.5),0_10px_30px_rgba(76,124,243,0.35)]"
          >
            Microsoft Publications
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
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
        </div>
      </div>

      <div className="relative h-72 overflow-hidden rounded-2xl border border-line-soft bg-panel/60 shadow-glass sm:h-96 lg:h-[26rem]">
        <DecodeRain className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(115% 80% at 50% 28%, transparent 52%, rgba(5,6,15,0.82) 100%)' }}
        />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-signal-blue/10" />
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-line-soft bg-void/70 px-3 py-1 font-mono text-[11px] text-ink-muted backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-signal-blue" /> known
          <span className="ml-2 h-1.5 w-1.5 rounded-full bg-signal-violet" /> unknown
        </div>
      </div>
    </section>
  );
}
