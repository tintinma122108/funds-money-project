'use client';

import React from 'react';

interface iPhoneViewProps {
  children: React.ReactNode;
  className?: string;
}

const iPhoneView = ({ children, className = '' }: iPhoneViewProps) => {
  return (
    <div className={`flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 ${className}`}>
      {/* iPhone Frame */}
      <div className="relative shrink-0">
        {/* iPhone Outer Frame */}
        <div className="relative w-[375px] h-[812px] bg-black rounded-[3.5rem] p-2 shadow-2xl shrink-0" style={{ width: '375px', height: '812px', maxWidth: '375px', maxHeight: '812px' }}>
          {/* Screen Bezel */}
          <div className="w-full h-full bg-black rounded-[3rem] overflow-hidden relative" id="iphone-screen" style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%' }}>
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[30px] bg-black rounded-b-[20px] z-50 flex items-center justify-center">
              <div className="w-[60px] h-[4px] bg-gray-800 rounded-full"></div>
            </div>
            
            {/* Status Bar Area */}
            <div className="absolute top-0 left-0 right-0 h-[44px] z-40 flex items-center justify-between px-6 pt-2">
              <div className="flex items-center gap-1">
                <span className="text-white text-[13px] font-semibold">9:41</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  <div className="w-1 h-1.5 bg-white rounded-sm"></div>
                  <div className="w-1 h-1.5 bg-white rounded-sm"></div>
                  <div className="w-1 h-1.5 bg-white/60 rounded-sm"></div>
                </div>
                <div className="w-6 h-3 border border-white rounded-sm">
                  <div className="w-4 h-2 bg-white rounded-sm m-0.5"></div>
                </div>
              </div>
            </div>

            {/* Screen Content */}
            <div className="w-full h-full pt-[44px] pb-[34px] relative" style={{ width: '100%', height: '100%' }}>
              <div 
                className="w-full overflow-y-auto overflow-x-hidden" 
                style={{ 
                  WebkitOverflowScrolling: 'touch',
                  width: '100%',
                  maxWidth: '100%',
                  height: 'calc(100% - 44px - 34px)',
                  maxHeight: 'calc(100% - 44px - 34px)'
                }}
              >
                {children}
              </div>
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-white/30 rounded-full z-50"></div>
          </div>

          {/* Side Buttons */}
          <div className="absolute left-0 top-[120px] w-[3px] h-[60px] bg-gray-800 rounded-r-sm"></div>
          <div className="absolute right-0 top-[180px] w-[3px] h-[60px] bg-gray-800 rounded-l-sm"></div>
          <div className="absolute right-0 top-[260px] w-[3px] h-[60px] bg-gray-800 rounded-l-sm"></div>
        </div>

        {/* Reflection Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent rounded-t-[3.5rem]"></div>
        </div>
      </div>
    </div>
  );
};

export default iPhoneView;
export { iPhoneView };

