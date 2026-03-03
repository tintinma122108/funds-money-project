'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FundHolding } from '../types';
import { formatPercent } from '../utils';
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';

interface FundListItemProps {
  fund: FundHolding;
  onDelete?: (id: string) => void;
  index?: number;
}

export const FundListItem: React.FC<FundListItemProps> = ({ fund, onDelete, index = 0 }) => {
  // 持有金额使用实时计算的市值：currentValue = shares × currentPrice
  const currentValue = fund.currentValue ?? (fund.shares ?? 0) * (fund.currentPrice ?? 0);
  const holdingProfit = fund.holdingProfit ?? 0;
  const holdingProfitPercent = fund.holdingProfitPercent ?? 0;
  const estimatedTodayProfit = fund.estimatedTodayProfit ?? 0;
  const estimatedTodayChangePercent = fund.estimatedTodayChangePercent ?? 0;
  
  const isPositive = estimatedTodayChangePercent >= 0;

  const formatNumber = (num: number) => {
    return num.toFixed(2);
  };

  const formatPercentDisplay = (num: number) => {
    return num >= 0 ? `+${num.toFixed(2)}%` : `${num.toFixed(2)}%`;
  };

  // 生成撕纸边缘的 clipPath - 更精确的锯齿效果
  const generateTornEdgePath = () => {
    const points: string[] = ['0 0', '100% 0', '100% calc(100% - 16px)'];
    // 创建更自然的锯齿效果，从右到左
    for (let i = 0; i <= 25; i++) {
      const xPercent = 100 - (i * 4); // 每4%一个锯齿
      const isHigh = i % 2 === 0;
      const yOffset = isHigh ? 16 : 8; // 高低交替
      points.push(`calc(${xPercent}% - ${i * 0.3}px) calc(100% - ${yOffset}px)`);
    }
    points.push('0 calc(100% - 16px)');
    return `polygon(${points.join(', ')})`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      style={{
        position: 'relative',
        background: 'white',
        padding: '32px',
        paddingBottom: '40px',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12)) drop-shadow(0 8px 24px rgba(0,0,0,0.08))',
        clipPath: generateTornEdgePath(),
      }}
    >
      {/* 基金名称和代码 */}
      <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '8px', fontWeight: 400, color: '#111827', letterSpacing: '-0.01em' }}>{fund.fundName}</h3>
            <div style={{ fontSize: '14px', color: '#6b7280', fontFamily: 'var(--font-share-tech-mono), "Share Tech Mono", monospace', letterSpacing: '0.05em' }}>{fund.fundCode}</div>
          </div>
          {onDelete && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(fund.id); }}
              style={{
                padding: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#d1d5db',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ef4444';
                e.currentTarget.style.background = '#fef2f2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#d1d5db';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* 估算今日涨跌幅 - 视觉核心 */}
      <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px', letterSpacing: '0.05em', fontWeight: 500 }}>估算涨跌</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
          <div
            style={{
              fontSize: '36px',
              color: isPositive ? '#e84e32' : '#3a6e5a',
              fontFamily: 'var(--font-share-tech-mono), "Share Tech Mono", monospace',
              letterSpacing: '-0.02em',
              textShadow: isPositive 
                ? '0 0 2px rgba(232, 78, 50, 0.3)' 
                : '0 0 2px rgba(58, 110, 90, 0.3)',
            }}
          >
            {isPositive ? '+' : ''}
            <AnimatedNumber value={estimatedTodayChangePercent} format={(v) => `${v.toFixed(2)}%`} />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '18px',
              color: isPositive ? '#e84e32' : '#3a6e5a',
              fontFamily: 'var(--font-share-tech-mono), "Share Tech Mono", monospace',
            }}
          >
            {isPositive ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <AnimatedNumber value={estimatedTodayProfit} format={(v) => formatNumber(v)} />
          </div>
        </div>
      </div>

      {/* 持仓信息网格 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* 持有金额与份额 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', letterSpacing: '0.05em', fontWeight: 500 }}>持有金额</div>
            <div 
              style={{
                fontSize: '18px',
                color: '#111827',
                fontWeight: 300,
                fontFamily: 'var(--font-share-tech-mono), "Share Tech Mono", monospace',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <AnimatedNumber value={currentValue} format={(v) => formatNumber(v)} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', letterSpacing: '0.05em', fontWeight: 500 }}>持有份额</div>
            <div 
              style={{
                fontSize: '18px',
                color: '#111827',
                fontWeight: 300,
                fontFamily: 'var(--font-share-tech-mono), "Share Tech Mono", monospace',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <AnimatedNumber value={fund.shares ?? 0} format={(v) => formatNumber(v)} />
            </div>
          </div>
        </div>

        {/* 分割线 */}
        <div style={{ borderBottom: '1px solid #f0f0f0' }} />

        {/* 成本与收益 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', letterSpacing: '0.05em', fontWeight: 500 }}>持仓成本</div>
            <div 
              style={{
                fontSize: '18px',
                color: '#111827',
                fontWeight: 300,
                fontFamily: 'var(--font-share-tech-mono), "Share Tech Mono", monospace',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <AnimatedNumber value={fund.purchasePrice ?? 0} format={(v) => formatNumber(v)} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', letterSpacing: '0.05em', fontWeight: 500 }}>持有收益</div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 400,
                fontFamily: 'var(--font-share-tech-mono), "Share Tech Mono", monospace',
                fontVariantNumeric: 'tabular-nums',
                color: holdingProfit >= 0 ? '#ef4444' : '#059669',
              }}
            >
              <AnimatedNumber value={holdingProfit} format={(v) => formatNumber(v)} />
            </div>
            <div
              style={{
                fontSize: '14px',
                marginTop: '4px',
                fontWeight: 300,
                fontFamily: 'var(--font-share-tech-mono), "Share Tech Mono", monospace',
                fontVariantNumeric: 'tabular-nums',
                color: holdingProfitPercent >= 0 ? '#ef4444' : '#059669',
              }}
            >
              {formatPercentDisplay(holdingProfitPercent)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

