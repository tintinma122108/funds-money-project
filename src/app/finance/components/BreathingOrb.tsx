'use client';

import { motion } from 'framer-motion';

export const BreathingOrb = () => {
  return (
    <div className="absolute top-[-150px] md:top-[-200px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] pointer-events-none z-0">
      <motion.div
        className="w-full h-full rounded-full bg-blue-500/20 blur-[80px] md:blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute inset-0 w-full h-full rounded-full bg-indigo-500/10 blur-[80px]"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </div>
  );
};


