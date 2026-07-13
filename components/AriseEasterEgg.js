'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Konami code — the classic incantation.
const SEQUENCE = [
  'arrowup', 'arrowup', 'arrowdown', 'arrowdown',
  'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a',
];

// A hidden Solo-Leveling homage. Trigger it with the Konami code, or by
// clicking the "footsteps of Hunter Sung Jin-woo" line in the hero (which
// dispatches a window 'arise' event). Original styling — no copied assets.
export default function AriseEasterEgg() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let progress = 0;
    let timer;

    const trigger = () => {
      setActive(true);
      clearTimeout(timer);
      timer = setTimeout(() => setActive(false), 4200);
    };

    const onKey = (e) => {
      const key = (e.key || '').toLowerCase();
      if (key === 'escape') {
        setActive(false);
        return;
      }
      if (key === SEQUENCE[progress]) {
        progress += 1;
      } else {
        progress = key === SEQUENCE[0] ? 1 : 0;
      }
      if (progress === SEQUENCE.length) {
        progress = 0;
        trigger();
      }
    };

    const onArise = () => trigger();

    window.addEventListener('keydown', onKey);
    window.addEventListener('arise', onArise);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('arise', onArise);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => setActive(false)}
          role="presentation"
        >
          <div className="absolute inset-0 bg-void/85 backdrop-blur-sm" />

          {Array.from({ length: 9 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-[-8%] rounded-full blur-2xl"
              style={{
                left: `${8 + i * 10}%`,
                width: `${60 + (i % 3) * 30}px`,
                height: `${140 + (i % 4) * 50}px`,
                background: i % 2 ? 'rgba(157,92,255,0.5)' : 'rgba(76,124,243,0.5)',
              }}
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: -280, opacity: [0, 0.7, 0] }}
              transition={{ duration: 2.4, delay: i * 0.06, ease: 'easeOut' }}
            />
          ))}

          <motion.div
            className="relative rounded-2xl border border-signal-blue/50 bg-void/80 px-10 py-8 text-center shadow-[0_0_60px_-5px_rgba(76,124,243,0.7)]"
            initial={{ scale: 0.8, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.1 }}
          >
            <p className="mb-3 font-mono text-xs tracking-[0.4em] text-signal-blue">[ SYSTEM ]</p>
            <motion.p
              className="font-mono text-5xl font-extrabold text-ink sm:text-6xl"
              style={{ textShadow: '0 0 24px rgba(76,124,243,0.8)' }}
              initial={{ letterSpacing: '0.6em', opacity: 0 }}
              animate={{ letterSpacing: '0.18em', opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              ARISE.
            </motion.p>
            <div className="mx-auto my-4 h-px w-24 bg-signal-blue/40" />
            <p className="font-mono text-sm text-ink-muted">Shadow soldiers answer the call.</p>
            <p className="mt-3 font-mono text-[11px] italic text-ink-faint">— the Monarch of Shadows</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
