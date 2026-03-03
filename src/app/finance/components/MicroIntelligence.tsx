'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { yourFocusItems, marketIntelItems, radarItems as initialRadarItems, IntelligenceItem } from '../data';
import { BentoCard } from './BentoCard';
import { RadarCard } from './RadarCard';

export const MicroIntelligence = () => {
  const [activeSection, setActiveSection] = useState('focus');
  const [radarList, setRadarList] = useState(initialRadarItems);
  const [focusedCardId, setFocusedCardId] = useState<string | null>(null);

  // 移除数量限制，显示所有持仓情报和市场情报
  const visibleFocusItems = yourFocusItems;
  const visibleMarketItems = marketIntelItems;

  useEffect(() => {
    const handleScroll = () => {
      const center = window.innerHeight / 2;
      
      const sections = ['focus', 'market', 'radar'];
      let currentSection = 'focus';
      
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < center + 100) { 
            currentSection = sectionId;
          }
        }
      }
      setActiveSection(currentSection);

      const cards = document.querySelectorAll('.bento-card');
      let minDistance = Infinity;
      let closestId = null;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(center - cardCenter);

        if (distance < minDistance && distance < 250) { 
          minDistance = distance;
          closestId = card.getAttribute('data-id');
        }
      });

      setFocusedCardId(closestId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('micro-tab-change', { detail: { tab: activeSection } }));
  }, [activeSection]);
  
  useEffect(() => {
    const allItems = [...yourFocusItems, ...marketIntelItems, ...initialRadarItems]; 
    const item = allItems.find(i => i.id === focusedCardId);
    
    window.dispatchEvent(new CustomEvent('micro-card-focus', { 
      detail: { 
        section: activeSection,
        target: item ? item.target : null,
        tag: item ? item.tag : null,
        claim: item ? item.claim : null
      } 
    }));
  }, [focusedCardId, activeSection, radarList]);

  const handleSwipe = (id: string, direction: 'left' | 'right') => {
    if (direction === 'right') {
      toast.success('已加入持续关注列表', {
        description: 'AI将为你持续追踪相关机会'
      });
    }
    setTimeout(() => {
      setRadarList(prev => prev.filter(item => item.id !== id));
    }, 200);
  };

  const processGridItems = (items: IntelligenceItem[]) => items;

  return (
    <div id="micro-intelligence-root" className="relative w-full pb-32">
      <div className="px-4 space-y-2">
        <section>
          <div 
            id="focus" 
            className="sticky z-30 flex items-center gap-3 py-6 mb-4 bg-black -mx-4 px-4 border-b border-white/5 transition-all will-change-transform"
            style={{ top: 'calc(var(--header-height, 0px) - 48px)' }}
          >
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest shrink-0">
              持仓情报 <span className="text-zinc-300 ml-1 font-mono">{visibleFocusItems.length}</span>
            </span>
            <div className="h-[1px] bg-zinc-800/50 flex-1" />
          </div>
          
          <div className="flex flex-col space-y-3">
            {processGridItems(visibleFocusItems).map((item) => (
              <BentoCard 
                key={item.id} 
                item={item} 
                isHovered={focusedCardId === item.id}
              />
            ))}
          </div>
        </section>

        <section>
          <div 
            id="market" 
            className="sticky z-30 flex items-center gap-3 py-6 mb-4 bg-black -mx-4 px-4 border-b border-white/5 transition-all will-change-transform"
            style={{ top: 'calc(var(--header-height, 0px) - 48px)' }}
          >
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest shrink-0">
              市场情报 <span className="text-zinc-300 ml-1 font-mono">{visibleMarketItems.length}</span>
            </span>
            <div className="h-[1px] bg-zinc-800/50 flex-1" />
          </div>

          <div className="flex flex-col space-y-3">
             {processGridItems(visibleMarketItems).map((item) => (
              <BentoCard 
                key={item.id} 
                item={item} 
                isHovered={focusedCardId === item.id}
              />
            ))}
          </div>
        </section>

        <section>
          <div 
            id="radar" 
            className="sticky z-30 flex items-center gap-3 py-6 mb-4 bg-black -mx-4 px-4 border-b border-white/5 transition-all will-change-transform"
            style={{ top: 'calc(var(--header-height, 0px) - 48px)' }}
          >
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest shrink-0">
              拓域雷达 <span className="text-zinc-300 ml-1 font-mono">{radarList.length}</span>
            </span>
            <div className="h-[1px] bg-zinc-800/50 flex-1" />
          </div>

          <div className="flex flex-col space-y-3">
            <AnimatePresence>
              {radarList.map((item) => (
                <RadarCard key={item.id} item={item} onSwipe={handleSwipe} />
              ))}
            </AnimatePresence>
            {radarList.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-12 text-white/30 border border-dashed border-white/10 rounded-2xl text-sm"
              >
                暂无更多推荐
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

