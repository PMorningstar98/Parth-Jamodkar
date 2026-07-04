'use client';

import { motion } from 'framer-motion';
import timeline from '@/data/timeline.json';

export default function Timeline() {
  return (
    <ol className="relative border-l border-line pl-8">
      {timeline.map((item, i) => (
        <motion.li
          key={item.id}
          className="mb-10 last:mb-0"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.3) }}
        >
          <span className="absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full border-2 border-void bg-signal-blue" />
          <p className="font-mono text-xs uppercase tracking-wide text-signal-cyan">
            {item.year || 'Ongoing'}
          </p>
          <h3 className="mt-1 text-base font-semibold text-ink sm:text-lg">{item.title}</h3>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-muted">{item.description}</p>
        </motion.li>
      ))}
    </ol>
  );
}
