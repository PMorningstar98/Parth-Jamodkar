'use client';

import { motion } from 'framer-motion';
import timeline from '@/data/timeline.json';

export default function Timeline() {
  return (
    <ol className="relative space-y-10 pl-8">
      <span
        aria-hidden="true"
        className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-signal-blue via-signal-violet to-transparent"
      />
      {timeline.map((item, i) => (
        <motion.li
          key={item.id}
          className="group relative"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.3) }}
        >
          <span className="absolute -left-[calc(2rem+1px)] mt-1.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-void bg-signal-blue shadow-[0_0_0_4px_rgba(76,124,243,0.15)] transition-all duration-300 group-hover:bg-signal-cyan group-hover:shadow-[0_0_0_5px_rgba(94,234,212,0.2)]" />
          <p className="font-mono text-xs uppercase tracking-wide text-signal-cyan">
            {item.year || 'Ongoing'}
          </p>
          <h3 className="mt-1 text-base font-semibold text-ink transition-colors group-hover:text-signal-blue sm:text-lg">
            {item.title}
          </h3>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-muted">{item.description}</p>
        </motion.li>
      ))}
    </ol>
  );
}
