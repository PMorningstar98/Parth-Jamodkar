'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import skills from '@/data/skills.json';

const GROUP_ORDER = ['Core', 'Platforms', 'Frameworks', 'Tools & Languages'];

export default function SkillsCloud() {
  return (
    <div className="space-y-6">
      {GROUP_ORDER.map((group) => {
        const items = skills.filter((s) => s.group === group);
        if (items.length === 0) return null;
        return (
          <div key={group}>
            <p className="eyebrow mb-3">{group}</p>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <motion.div key={skill.name} whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href={`/search?q=${encodeURIComponent(skill.name)}`}
                    className="inline-block rounded-full border border-line bg-panel/60 px-3.5 py-1.5 font-mono text-xs text-ink-muted transition-colors hover:border-signal-blue/50 hover:text-signal-blue"
                  >
                    {skill.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
