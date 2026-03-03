'use client';

import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { RadarItem } from '../data';
import { X, Check } from 'lucide-react';

interface RadarCardProps {
  item: RadarItem;
  onSwipe: (id: string, direction: 'left' | 'right') => void;
}

export const RadarCard = ({ item, onSwipe }: RadarCardProps) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const bg = useTransform(
    x, 
    [-200, -100, 0, 100, 200], 
    ['rgba(239, 68, 68, 0.5)', 'rgba(239, 68, 68, 0)', 'rgba(0, 0, 0, 0.1)', 'rgba(34, 197, 94, 0)', 'rgba(34, 197, 94, 0.5)']
  );
  const controls = useAnimation();

  const handleDragEnd = async (event: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -100 || velocity < -500) {
      await controls.start({ x: -500, opacity: 0 });
      onSwipe(item.id, 'left');
    } else if (offset > 100 || velocity > 500) {
      await controls.start({ x: 500, opacity: 0 });
      onSwipe(item.id, 'right');
    } else {
      controls.start({ x: 0 });
    }
  };

  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const likeScale = useTransform(x, [50, 150], [0.8, 1.2]);
  const nopeOpacity = useTransform(x, [-50, -150], [0, 1]);
  const nopeScale = useTransform(x, [-50, -150], [0.8, 1.2]);

  return (
    <motion.div
      style={{ x, opacity, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      className="relative w-full h-[400px] rounded-[32px] overflow-hidden mb-8 cursor-grab active:cursor-grabbing border border-white/10 shadow-2xl group"
    >
      <div className="absolute inset-0 z-0 select-none">
         <div className="absolute inset-0 bg-zinc-900/50 z-10" />
         <motion.img 
            src={item.imageUrl} 
            alt={item.target} 
            className="w-full h-full object-cover scale-110 group-hover:scale-105 transition-transform duration-700 ease-out" 
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
         <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent z-10" />
      </div>

      <motion.div 
        style={{ backgroundColor: bg }} 
        className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay" 
      />

      <motion.div 
        style={{ opacity: likeOpacity, scale: likeScale }}
        className="absolute left-8 top-12 text-green-400 z-30 border-4 border-green-400 rounded-xl px-4 py-2 rotate-[-15deg]"
      >
        <span className="text-4xl font-black uppercase tracking-widest">LIKE</span>
      </motion.div>
      <motion.div 
        style={{ opacity: nopeOpacity, scale: nopeScale }}
        className="absolute right-8 top-12 text-red-500 z-30 border-4 border-red-500 rounded-xl px-4 py-2 rotate-[15deg]"
      >
        <span className="text-4xl font-black uppercase tracking-widest">NOPE</span>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 p-8 z-30 pointer-events-none flex flex-col justify-end h-full bg-gradient-to-t from-black/90 via-transparent to-transparent">
        <div className="transform translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
            <div className="mb-4">
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-lg tracking-wide uppercase">
                  {item.tag}
                </span>
            </div>
            
            <h3 className="text-4xl font-black text-white leading-[0.95] tracking-tighter mb-4 drop-shadow-2xl">
              {item.target}
            </h3>
            
            <p className="text-lg text-white/90 font-medium leading-snug line-clamp-3 drop-shadow-lg pr-4">
              {item.claim}
            </p>
        </div>
      </div>
      
      <div className="absolute bottom-6 right-6 z-30 opacity-40 animate-pulse">
         <div className="w-12 h-1 rounded-full bg-white/50" />
      </div>
    </motion.div>
  );
};


