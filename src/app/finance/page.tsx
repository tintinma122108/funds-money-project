'use client';

import React from 'react';
import { Toaster } from 'sonner';
import { BreathingOrb } from './components/BreathingOrb';
import { MarketPulse } from './components/MarketPulse';
import { MicroIntelligence } from './components/MicroIntelligence';
import { DailyBriefing } from './components/DailyBriefing';
import { ChatInput } from './components/ChatInput';
import './finance.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const FinancePage = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <div className="fixed inset-0 pointer-events-none z-0">
        <BreathingOrb />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <main className="relative z-10 w-full max-w-md mx-auto bg-black/80 backdrop-blur-sm shadow-2xl min-h-screen border-x border-white/5">
        <DailyBriefing />
        <MarketPulse />
        <MicroIntelligence />
      </main>

      {/* Bottom Fade Mask for Focus Area */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-32 bg-gradient-to-t from-black via-black/60 to-transparent z-20 pointer-events-none" />

      <ChatInput />
      <Toaster position="top-center" theme="dark" />
    </div>
  );
};

export default FinancePage;

