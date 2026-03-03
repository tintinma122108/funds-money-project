'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { IntelligenceItem } from '../data';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceDot, Legend } from 'recharts';

interface BentoCardProps {
  item: IntelligenceItem;
  isHovered?: boolean;
}

const tagColors = {
  red: 'bg-red-500/20 text-red-300 border-red-500/30',
  green: 'bg-green-500/20 text-green-300 border-green-500/30',
  blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
};

export const BentoCard = ({ item, isHovered }: BentoCardProps) => {
  const isWide = item.size === 'wide';

  return (
    <motion.div
      className={clsx(
        "bento-card relative overflow-hidden rounded-xl border transition-all duration-300 group",
        "w-full mb-3",
        isHovered 
          ? "bg-white/[0.08] border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] scale-[1.03] z-10 ring-1 ring-white/10" 
          : "bg-white/5 border-white/5 hover:bg-white/8"
      )}
      data-id={item.id}
      layout
    >
      <div className="p-5 h-full flex flex-col justify-between relative z-10">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 pr-2">
            <h3 className="text-zinc-100 font-medium text-[15px] tracking-wide drop-shadow-md">{item.target}</h3>
            {(item.returnRate || item.changeRate) && (
              <div className="flex items-center gap-2 mt-1">
                {item.returnRate && (
                  <span className={clsx(
                    "text-[11px] font-semibold tabular-nums",
                    item.returnRate.includes('+') ? "text-rose-400" : "text-emerald-400"
                  )}>
                    持仓: {item.returnRate}
                  </span>
                )}
                {item.changeRate && (
                  <span className={clsx(
                    "text-[11px] font-semibold tabular-nums",
                    item.changeRate.includes('+') ? "text-rose-400" : "text-emerald-400"
                  )}>
                    {item.returnRate ? '|' : ''} 涨跌: {item.changeRate}
                  </span>
                )}
              </div>
            )}
          </div>
          <span className={clsx(
            "px-2 py-0.5 rounded-md text-[10px] border font-bold whitespace-nowrap backdrop-blur-sm shadow-sm shrink-0", 
            tagColors[item.tagColor || 'blue']
          )}>
            {item.tag}
          </span>
        </div>

        <p className="text-zinc-400 text-xs mb-4 leading-relaxed font-light tracking-wide">
          {item.claim}
        </p>

        <div className="mt-auto flex items-end w-full">
          
          {item.evidenceType === 'number' && (
            <div className="flex flex-col">
               <div className={clsx(
                 "text-4xl font-semibold tracking-tighter tabular-nums drop-shadow-lg", 
                 (item.evidenceValue as string).includes('+') ? "text-rose-500" : 
                 (item.evidenceValue as string).includes('-') ? "text-emerald-500" : "text-white"
               )}>
                  {item.highlightValue || item.evidenceValue as string}
               </div>
               <div className="flex items-center gap-1.5 mt-1">
                  <div className={clsx("w-1.5 h-1.5 rounded-full", (item.evidenceValue as string).includes('+') ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]")} />
                  <span className="text-zinc-400 text-[11px] uppercase tracking-widest font-bold">
                    {item.highlightLabel || '核心指标'}
                  </span>
               </div>
            </div>
          )}

          {item.evidenceType === 'news' && (
            <div className="relative w-full p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm group-hover:bg-white/[0.06] transition-all duration-300">
               <div className="flex items-start gap-3">
                 <div className="w-0.5 h-8 bg-indigo-500/50 shrink-0" />
                 <p className="text-zinc-300 text-[11px] leading-snug font-light">
                   {item.evidenceValue as string}
                 </p>
               </div>
            </div>
          )}

          {item.evidenceType === 'chart' && Array.isArray(item.evidenceValue) && item.evidenceValue.length > 0 && (
            <div className="relative w-full h-[110px] -mb-1 overflow-visible mt-2">
              {/* Highlight Badge - 显示最关键数据 */}
              {item.highlightValue && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                  <div className="px-3 py-1.5 bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-xl shadow-xl flex flex-col items-center">
                     <span className={clsx(
                       "text-sm font-bold tabular-nums",
                       item.tagColor === 'green' ? "text-emerald-400" : 
                       item.tagColor === 'yellow' ? "text-yellow-400" :
                       item.tagColor === 'blue' ? "text-blue-400" :
                       "text-rose-400"
                     )}>
                       {item.highlightValue}
                     </span>
                     <span className="text-[9px] text-zinc-500 font-medium tracking-wide uppercase">
                       {item.highlightLabel || '关键指标'}
                     </span>
                  </div>
                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-zinc-900/90"></div>
                </div>
              )}

              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                {item.chartType === 'line' ? (
                  <LineChart data={item.evidenceValue} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid 
                      vertical={false} 
                      horizontal={true} 
                      stroke="rgba(255,255,255,0.05)" 
                      strokeDasharray="4 4" 
                    />
                    <XAxis 
                      dataKey="name" 
                      tick={{fontSize: 10, fill: '#71717a'}} 
                      axisLine={false}
                      tickLine={false}
                      dy={4}
                    />
                    <YAxis 
                      tick={{fontSize: 10, fill: '#71717a'}} 
                      axisLine={false}
                      tickLine={false}
                      width={35}
                      domain={['dataMin', 'dataMax']}
                      padding={{ top: 10, bottom: 10 }}
                    />
                    <Tooltip 
                      cursor={{stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1}}
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px' }}
                      itemStyle={{ color: '#fff' }}
                      labelStyle={{ display: 'none' }}
                      formatter={(value: any, name: any, props: any) => {
                        const payload = props.payload;
                        if (payload.growthRate !== undefined) {
                          return [`${value} (增长率: ${payload.growthRate}%)`, name];
                        }
                        if (payload.marketShare !== undefined) {
                          return [`${value} (市占率: ${payload.marketShare}%)`, name];
                        }
                        if (payload.volume !== undefined) {
                          return [`${value} (销量: ${payload.volume}M)`, name];
                        }
                        return [value, name];
                      }}
                    />
                    <Line 
                      type="linear" 
                      dataKey="value" 
                      stroke={item.tagColor === 'green' ? '#34d399' : item.tagColor === 'yellow' ? '#fbbf24' : item.tagColor === 'blue' ? '#60a5fa' : '#fb7185'} 
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 4, fill: '#fff', strokeWidth: 2 }}
                    />
                    <ReferenceDot 
                      x={(item.evidenceValue as any[])[(item.evidenceValue as any[]).length - 1].name} 
                      y={(item.evidenceValue as any[])[(item.evidenceValue as any[]).length - 1].value} 
                      r={4} 
                      fill={item.tagColor === 'green' ? '#34d399' : item.tagColor === 'yellow' ? '#fbbf24' : item.tagColor === 'blue' ? '#60a5fa' : '#fb7185'} 
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  </LineChart>
                ) : item.chartType === 'bar' ? (
                  <BarChart data={item.evidenceValue} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid 
                      vertical={false} 
                      horizontal={true} 
                      stroke="rgba(255,255,255,0.05)" 
                      strokeDasharray="4 4" 
                    />
                    <XAxis 
                      dataKey="name" 
                      tick={{fontSize: 10, fill: '#71717a'}} 
                      axisLine={false}
                      tickLine={false}
                      dy={4}
                    />
                    <YAxis 
                      tick={{fontSize: 10, fill: '#71717a'}} 
                      axisLine={false}
                      tickLine={false}
                      width={35}
                      domain={['dataMin', 'dataMax']}
                      padding={{ top: 10, bottom: 10 }}
                    />
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px' }}
                      itemStyle={{ color: '#fff' }}
                      labelStyle={{ display: 'none' }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill={item.tagColor === 'green' ? '#34d399' : item.tagColor === 'yellow' ? '#fbbf24' : item.tagColor === 'blue' ? '#60a5fa' : '#fb7185'} 
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                      isAnimationActive={false}
                    />
                  </BarChart>
                ) : item.chartType === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={(item.evidenceValue as any[]).filter((entry: any) => entry.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={50}
                      paddingAngle={3}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {(item.evidenceValue as any[]).filter((entry: any) => entry.value > 0).map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color || (item.tagColor === 'green' ? '#34d399' : item.tagColor === 'yellow' ? '#fbbf24' : item.tagColor === 'blue' ? '#60a5fa' : '#fb7185')}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value: any, name: any) => {
                        return [`${value}%`, name];
                      }}
                    />
                  </PieChart>
                ) : (
                  <AreaChart data={item.evidenceValue} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`gradient-rose-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fb7185" stopOpacity={0.4}/>
                        <stop offset="100%" stopColor="#fb7185" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id={`gradient-emerald-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" stopOpacity={0.4}/>
                        <stop offset="100%" stopColor="#34d399" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id={`gradient-yellow-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.4}/>
                        <stop offset="100%" stopColor="#fbbf24" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id={`gradient-blue-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.4}/>
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    
                    <CartesianGrid 
                      vertical={true} 
                      horizontal={false} 
                      stroke="rgba(255,255,255,0.05)" 
                    />
                    
                    <XAxis 
                      dataKey="name" 
                      tick={{fontSize: 10, fill: '#71717a'}} 
                      axisLine={false}
                      tickLine={false}
                      dy={5}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      tick={{fontSize: 10, fill: '#71717a'}} 
                      axisLine={false}
                      tickLine={false}
                      width={35}
                      domain={['dataMin', 'dataMax']}
                      padding={{ top: 10, bottom: 10 }}
                    />
                    <Tooltip 
                      cursor={{stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1}}
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px' }}
                      itemStyle={{ color: '#fff' }}
                      labelStyle={{ display: 'none' }}
                      formatter={(value: any, name: any, props: any) => {
                        const payload = props.payload;
                        if (payload.growthRate !== undefined) {
                          return [`${value} (增长率: ${payload.growthRate}%)`, name];
                        }
                        if (payload.volume !== undefined) {
                          return [`${value} (销量: ${payload.volume}M)`, name];
                        }
                        if (payload.change !== undefined) {
                          return [`${value}% (变化: ${payload.change > 0 ? '+' : ''}${payload.change}%)`, name];
                        }
                        return [value, name];
                      }}
                    />

                    <Area 
                      type="linear" 
                      dataKey="value" 
                      stroke={item.tagColor === 'green' ? '#34d399' : item.tagColor === 'yellow' ? '#fbbf24' : item.tagColor === 'blue' ? '#60a5fa' : '#fb7185'} 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill={(() => {
                        const colorMap: Record<string, string> = {
                          'green': `url(#gradient-emerald-${item.id})`,
                          'yellow': `url(#gradient-yellow-${item.id})`,
                          'blue': `url(#gradient-blue-${item.id})`,
                          'red': `url(#gradient-rose-${item.id})`
                        };
                        return colorMap[item.tagColor || 'red'] || colorMap['red'];
                      })()}
                      isAnimationActive={false} 
                      connectNulls={true}
                      dot={false}
                    />
                    <ReferenceDot 
                      x={(item.evidenceValue as any[])[(item.evidenceValue as any[]).length - 1].name} 
                      y={(item.evidenceValue as any[])[(item.evidenceValue as any[]).length - 1].value} 
                      r={4} 
                      fill={item.tagColor === 'green' ? '#34d399' : item.tagColor === 'yellow' ? '#fbbf24' : item.tagColor === 'blue' ? '#60a5fa' : '#fb7185'} 
                      stroke="#fff"
                      strokeWidth={2}
                    />
                    <ReferenceDot 
                      x={(item.evidenceValue as any[])[(item.evidenceValue as any[]).length - 1].name} 
                      y={(item.evidenceValue as any[])[(item.evidenceValue as any[]).length - 1].value} 
                      r={10} 
                      fill={item.tagColor === 'green' ? 'rgba(52, 211, 153, 0.3)' : item.tagColor === 'yellow' ? 'rgba(251, 191, 36, 0.3)' : item.tagColor === 'blue' ? 'rgba(96, 165, 250, 0.3)' : 'rgba(251, 113, 133, 0.3)'} 
                      stroke="none"
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

