'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertCircle, Info } from 'lucide-react';
import Slider from 'react-slick';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceDot, Label } from 'recharts';
import { marketIndices } from '../data';
import { clsx } from 'clsx';
// CSS will be imported globally

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 border border-white/10 p-2 rounded shadow-xl backdrop-blur-md">
        <p className="text-white/70 text-[10px] mb-0.5">{label}</p>
        <p className="text-white font-mono font-medium text-xs">
          {payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export const MarketPulse = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    centerMode: false,
    variableWidth: true,
    autoplay: true,
    autoplaySpeed: 1500,
    pauseOnHover: true,
    afterChange: (current: number) => {
      setActiveIndex(current);
      const event = new CustomEvent('market-change', { detail: marketIndices[current] });
      window.dispatchEvent(event);
    },
    arrows: false,
    appendDots: (dots: any) => (
      <div style={{ bottom: "-25px" }}>
        <ul className="flex justify-center gap-2"> {dots} </ul>
      </div>
    ),
    customPaging: (i: number) => (
      <div className={clsx(
        "w-8 h-1 rounded-full transition-all duration-300",
        i === activeIndex ? "bg-white" : "bg-white/20"
      )} />
    )
  };

  const renderHighlightedText = (text: string) => {
    const parts = text.split(/(【.*?】)/g);
    return parts.map((part, index) => {
      if (part.startsWith('【') && part.endsWith('】')) {
        return (
          <span key={index} className="text-white font-bold mx-0.5">
            {part.replace(/[【】]/g, '')}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <section className="relative z-10 w-full pb-8">
      <div className="px-0">
        <Slider {...settings} className="market-pulse-slider pl-4">
          {marketIndices.map((index, i) => {
            const isActive = activeIndex === i;
            const isPositive = index.isPositive;
            const gradientFrom = isPositive ? "from-rose-600/30" : "from-emerald-600/30";
            const gradientTo = isPositive ? "to-rose-900/5" : "to-emerald-900/5";
            const strokeColor = isPositive ? "#fb7185" : "#34d399";

            return (
              <div key={index.id} className="outline-none" onClick={() => setActiveIndex(i)}>
                <motion.div
                  className={clsx(
                    "w-[280px] rounded-[2rem] overflow-hidden transition-all duration-500 border relative flex flex-col items-center text-center",
                    isActive 
                      ? "border-white/10 shadow-2xl shadow-black/50 h-[290px]" 
                      : "border-white/5 opacity-70 scale-95 h-[290px]"
                  )}
                  style={{
                    background: `linear-gradient(180deg, rgba(24,24,27,1) 0%, rgba(9,9,11,1) 100%)`
                  }}
                >
                  <div className={clsx("absolute inset-0 bg-gradient-to-br opacity-40 pointer-events-none", gradientFrom, "via-transparent to-transparent")} />
                  <div className={clsx("absolute -top-20 -left-20 w-60 h-60 rounded-full blur-[80px] opacity-30 pointer-events-none", isPositive ? "bg-rose-600" : "bg-emerald-600")} />

                  <div className="relative z-10 mt-5 mb-2 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-1.5">
                       <span className="text-zinc-400 text-xs font-medium tracking-widest uppercase">{index.name.split(' ')[0]}</span>
                       <span className={clsx(
                         "flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded-full tracking-wider border backdrop-blur-sm",
                         isPositive 
                           ? "text-rose-200 bg-rose-500/20 border-rose-500/30" 
                           : "text-emerald-200 bg-emerald-500/20 border-emerald-500/30"
                       )}>
                         {isPositive ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                         <span>{index.changePercent}</span>
                       </span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                       <span className="text-4xl font-light text-white tracking-tighter drop-shadow-2xl">
                         {index.value}
                       </span>
                       <span className={clsx("text-xs font-medium mt-0.5 tabular-nums", isPositive ? "text-rose-400" : "text-emerald-400")}>
                         {index.change}
                       </span>
                    </div>
                  </div>

                  <div className="absolute top-[100px] left-0 right-0 h-[100px] w-full z-0">
                     <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                       <AreaChart 
                         data={index.chartData} 
                         margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                       >
                         <defs>
                           <linearGradient id={`glow-${index.id}`} x1="0" y1="0" x2="0" y2="1">
                             <stop offset="0%" stopColor={strokeColor} stopOpacity={0.3} />
                             <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
                           </linearGradient>
                           <filter id={`shadow-${index.id}`} height="200%">
                              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={strokeColor} floodOpacity="0.5" />
                           </filter>
                         </defs>
                         <YAxis 
                           hide={true}
                           domain={['dataMin', 'dataMax']}
                           padding={{ top: 10, bottom: 10 }}
                         />
                         <Area 
                           type="linear" 
                           dataKey="value" 
                           stroke={strokeColor} 
                           strokeWidth={2.5} 
                           fill={`url(#glow-${index.id})`} 
                           isAnimationActive={isActive} 
                           filter={`url(#shadow-${index.id})`}
                           connectNulls={true}
                           dot={false}
                           activeDot={false}
                         />
                         <ReferenceDot 
                            x={index.chartData[index.chartData.length - 1].name} 
                            y={index.chartData[index.chartData.length - 1].value} 
                            r={4} 
                            fill="#fff" 
                            stroke={strokeColor}
                            strokeWidth={2}
                            isFront={true}
                         />
                         <ReferenceDot 
                            x={index.chartData[index.chartData.length - 1].name} 
                            y={index.chartData[index.chartData.length - 1].value} 
                            r={10} 
                            fill={strokeColor}
                            fillOpacity={0.4}
                            stroke="none"
                            isFront={false}
                         />
                       </AreaChart>
                     </ResponsiveContainer>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-lg">
                      <div className="flex gap-3 items-center">
                         <div className={clsx("w-7 h-7 rounded-full flex items-center justify-center shrink-0", isPositive ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400")}>
                            <TrendingUp className="w-3.5 h-3.5" />
                         </div>
                         <p className="text-[10px] text-zinc-300 leading-relaxed font-medium line-clamp-3 text-left">
                            {renderHighlightedText(index.oneLineNarrative)}
                         </p>
                      </div>
                    </div>
                  </div>

                </motion.div>
              </div>
            );
          })}
        </Slider>
      </div>
    </section>
  );
};

