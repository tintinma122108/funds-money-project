'use client';

import React from 'react';
// @ts-ignore - TypeScript may not recognize the component correctly
import iPhoneViewComponent from '../../../components/iPhoneView';
import { Toaster } from 'sonner';
import { BreathingOrb } from '../components/BreathingOrb';
import { MarketPulse } from '../components/MarketPulse';
import { MicroIntelligence } from '../components/MicroIntelligence';
import { DailyBriefing } from '../components/DailyBriefing';
import { ChatInput } from '../components/ChatInput';
import '../finance.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const FinancePreviewPage = () => {
  const Content = () => (
    <div className="bg-black text-white selection:bg-blue-500/30 relative" style={{ width: '375px', maxWidth: '375px', minWidth: '375px' }}>
      <div className="absolute inset-0 pointer-events-none z-0">
        <BreathingOrb />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <main className="relative z-10 w-full bg-black/80 backdrop-blur-sm shadow-2xl" style={{ width: '375px', maxWidth: '375px' }}>
        <DailyBriefing />
        <MarketPulse />
        <MicroIntelligence />
      </main>

      {/* Bottom Fade Mask for Focus Area */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/60 to-transparent z-20 pointer-events-none" style={{ width: '375px' }} />

      <div className="relative z-50" style={{ width: '375px', maxWidth: '375px' }}>
        <ChatInput />
      </div>
      <Toaster position="top-center" theme="dark" />
    </div>
  );

  return (
    <iPhoneViewComponent>
      <Content />
    </iPhoneViewComponent>
  );
};

export default FinancePreviewPage;

