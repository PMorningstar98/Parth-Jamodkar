'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Scroll-reveal wrapper. Fades/slides its children in when they enter the
 * viewport. Respects the user's reduced-motion preference.
 */
export default function Reveal({ children, className = '', delay = 0, y = 20, as = 'div' }) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] || motion.div;

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </MotionTag>
  );
}
