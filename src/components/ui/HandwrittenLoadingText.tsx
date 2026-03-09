'use client';

import { motion } from 'framer-motion';

const WORD = 'loading';
const LETTER_DURATION = 0.18;
const STAGGER = 0.06;

export function HandwrittenLoadingText() {
  return (
    <motion.span
      aria-hidden
      style={{
        fontFamily: 'var(--font-caveat), "Caveat", cursive',
        fontSize: '1.75rem',
        fontWeight: 600,
        color: '#1a1a1a',
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: '0.05em',
      }}
      initial="hidden"
      animate={['visible', 'hidden']}
      variants={{
        visible: {
          transition: {
            staggerChildren: STAGGER,
            delayChildren: 0,
          },
        },
        hidden: {},
      }}
      transition={{
        repeat: Infinity,
        repeatType: 'loop',
        duration: 1.2,
        repeatDelay: 0.6,
      }}
    >
      {WORD.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: {
              opacity: 0,
              clipPath: 'inset(0 100% 0 0)',
              transform: 'translateX(-2px)',
            },
            visible: {
              opacity: 1,
              clipPath: 'inset(0 0% 0 0)',
              transform: 'translateX(0)',
            },
          }}
          transition={{
            duration: LETTER_DURATION,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          style={{ display: 'inline-block' }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}
