'use client';

import React, { useState, useEffect } from 'react';
import { Keyboard, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

export const ChatInput = () => {
  const [placeholder, setPlaceholder] = useState("深入解读今日市场情报...");
  const [activeSection, setActiveSection] = useState<'briefing' | 'micro_content'>('briefing');
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      setIsVisible(false);
      
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);
  
  useEffect(() => {
    const handleBriefingChange = (e: any) => {
      setActiveSection(e.detail.section);
      if (e.detail.section === 'briefing') {
        setPlaceholder("深入解读今日市场情报...");
      }
    };

    const handleCardFocus = (e: any) => {
      const { section, target } = e.detail;
      
      if (target) {
        let hint = "";
        switch (section) {
          case 'focus':
            hint = `进一步分析你的${target}持仓...`;
            break;
          case 'market':
            hint = `进一步解读${target}机会...`;
            break;
          case 'radar':
            hint = `评估${target}投资潜力...`;
            break;
          default:
            hint = `关于${target}的更多细节...`;
        }
        
        setPlaceholder(hint);
      }
    };

    window.addEventListener('briefing-section-change', handleBriefingChange);
    window.addEventListener('micro-card-focus', handleCardFocus);

    return () => {
      window.removeEventListener('briefing-section-change', handleBriefingChange);
      window.removeEventListener('micro-card-focus', handleCardFocus);
    };
  }, []);

  useEffect(() => {
    if (activeSection === 'briefing') {
      setPlaceholder("深入解读今日市场情报...");
    }
  }, [activeSection]);

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 pb-8 z-50 pointer-events-none">
       <motion.div 
         initial={{ y: 20, opacity: 0 }}
         animate={{ 
           y: isVisible ? 0 : 20, 
           opacity: isVisible ? 1 : 0 
         }}
         transition={{ duration: 0.3 }}
         className="flex items-center gap-3 w-full pointer-events-auto"
       >
          <div className="flex-1 relative h-14 bg-zinc-900/95 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl flex items-center px-1 overflow-hidden group">
             <input 
               type="text"
               className="w-full h-full bg-transparent border-none outline-none text-zinc-200 placeholder:text-zinc-500/80 px-4 text-[15px] font-medium tracking-wide"
               placeholder={placeholder}
             />
             
             <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 mr-1 text-zinc-400 group-focus-within:text-zinc-200 transition-colors cursor-pointer hover:bg-white/10">
                <Keyboard size={20} strokeWidth={2} />
             </div>
          </div>

          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="h-14 w-14 rounded-full bg-zinc-900/95 backdrop-blur-xl border border-white/10 text-zinc-200 flex items-center justify-center shadow-2xl hover:bg-zinc-800 transition-colors"
          >
             <Mic size={24} strokeWidth={2.5} />
          </motion.button>
       </motion.div>
    </div>
  );
};


