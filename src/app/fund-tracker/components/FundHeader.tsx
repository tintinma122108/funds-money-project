'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { PortfolioSummary } from '../types';
import { RollingNumber } from './RollingNumber';

interface FundHeaderProps {
  summary: PortfolioSummary;
}

export const FundHeader: React.FC<FundHeaderProps> = ({ summary }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [binderClipLoaded, setBinderClipLoaded] = useState(true);
  const [paperClipLoaded, setPaperClipLoaded] = useState(true);

  const totalValue = summary.totalValue ?? 0;
  const totalReturn = summary.totalHoldingProfit ?? 0;
  const totalReturnPercent = totalValue > 0 ? (totalReturn / (totalValue - totalReturn)) * 100 : 0;
  const dailyReturn = summary.totalEstimatedTodayProfit ?? 0;
  const dailyReturnPercent = summary.totalEstimatedTodayChangePercent ?? 0;

  // RollingNumber 组件会自动处理数字变化动画，无需额外的更新状态

  const formatNumber = (num: number) => {
    return num.toFixed(2);
  };

  return (
    <div style={{ position: 'relative', zIndex: 40, width: '100%' }}>
      {/* 回形针装饰 - 定位在卡片顶部，自适应视窗大小 */}
      {paperClipLoaded && (
        <div 
          style={{
            position: 'absolute',
            top: 'clamp(-120px, -8vw, -90px)',
            left: '12%',
            zIndex: 50,
            pointerEvents: 'none',
            transition: '0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: isOpen 
              ? 'translateX(-50%) translateY(clamp(-64px, -4vw, -40px)) translateX(clamp(-48px, -3vw, -32px)) rotate(-60deg)' 
              : 'translateX(-50%) translateY(0px) rotate(-16deg)',
            opacity: isOpen ? 0 : 0.95,
            transformOrigin: 'center bottom',
            width: 'clamp(120px, 10vw, 164px)',
            height: 'clamp(210px, 18vw, 292px)',
          }}
        >
          <img 
            src="/images/paper-clip.png"
            alt="Paper Clip"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.15))',
            }}
            onError={() => {
              setPaperClipLoaded(false);
            }}
          />
        </div>
      )}

      <label 
        style={{
          position: 'relative',
          display: 'block',
          width: '100%',
          perspective: '2000px',
          cursor: 'pointer',
          userSelect: 'none',
          minHeight: '280px',
        }}
      >
        <input 
          type="checkbox" 
          checked={isOpen}
          onChange={(e) => setIsOpen(e.target.checked)}
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
        />

        {/* 夹子装饰 (右侧) */}
        {binderClipLoaded && (
          <div 
            style={{
              position: 'absolute',
              top: '30%',
              right: '-70px',
              zIndex: 50,
              transition: '0.5s ease-in-out',
              transform: isOpen 
                ? 'translateY(-50%) translateX(96px) rotate(-180deg) scaleX(-1)' 
                : 'translateY(-50%) translateX(0px) rotate(-180deg) scaleX(-1)',
              opacity: isOpen ? 0 : 1,
              transformOrigin: 'center center',
              width: '210px',
              height: 'auto',
            }}
          >
            <img 
              alt="Binder Clip"
              src="/images/binder-clip.png"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                pointerEvents: 'none',
              }}
              onError={() => {
                setBinderClipLoaded(false);
              }}
            />
          </div>
        )}

        {/* BOTTOM LAYER: REAL DATA */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            background: '#fbfaf8',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e8e6e1',
            padding: '24px',
            paddingRight: '64px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
          }}
        >
          {/* Texture */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.4,
              backgroundImage: 'radial-gradient(#d4d1cc 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          
          <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {/* Header Section */}
            <div>
              {/* Total Assets */}
              <div>
                <div style={{ fontSize: '14px', color: '#78716c', marginBottom: '12px', fontWeight: 500, letterSpacing: '0.05em' }}>总资产 (CNY)</div>
                <div
                  style={{
                    fontSize: '48px',
                    color: '#1c1917',
                    fontFamily: 'var(--font-share-tech-mono), "Share Tech Mono", monospace',
                    fontWeight: 400,
                    letterSpacing: '-0.02em',
                  }}
                >
                  <RollingNumber value={totalValue} format={formatNumber} />
                </div>
              </div>
            </div>
            
            {/* Grid Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', borderTop: '1px solid #e7e5e4', paddingTop: '24px' }}>
              {/* Total Profit */}
              <div>
                <div style={{ fontSize: '12px', color: '#a8a29e', marginBottom: '8px', fontWeight: 500 }}>累计收益</div>
                <div
                  style={{
                    fontSize: '24px',
                    fontFamily: 'var(--font-share-tech-mono), "Share Tech Mono", monospace',
                    color: totalReturn >= 0 ? '#dc2626' : '#059669',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  <RollingNumber value={totalReturn} format={(v) => formatNumber(v)} />
                </div>
                <div style={{ fontSize: '14px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-share-tech-mono), "Share Tech Mono", monospace', fontVariantNumeric: 'tabular-nums', color: totalReturnPercent >= 0 ? '#ef4444' : '#059669' }}>
                  {totalReturnPercent >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    <span>{totalReturnPercent >= 0 ? '+' : '-'}</span>
                    <RollingNumber value={Math.abs(totalReturnPercent)} format={(v) => formatNumber(v)} />
                    <span>%</span>
                  </span>
                </div>
              </div>
              
              {/* Today Profit */}
              <div>
                <div style={{ fontSize: '12px', color: '#a8a29e', marginBottom: '8px', fontWeight: 500 }}>当日盈亏</div>
                <div
                  style={{
                    fontSize: '24px',
                    fontFamily: 'var(--font-share-tech-mono), "Share Tech Mono", monospace',
                    color: dailyReturn >= 0 ? '#dc2626' : '#059669',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  <RollingNumber value={dailyReturn} format={(v) => formatNumber(v)} />
                </div>
                <div style={{ fontSize: '14px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-share-tech-mono), "Share Tech Mono", monospace', fontVariantNumeric: 'tabular-nums', color: dailyReturnPercent >= 0 ? '#ef4444' : '#059669' }}>
                  {dailyReturnPercent >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    <span>{dailyReturnPercent >= 0 ? '+' : '-'}</span>
                    <RollingNumber value={Math.abs(dailyReturnPercent)} format={(v) => formatNumber(v)} />
                    <span>%</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TOP LAYER: COVER SHEET (MASKED) */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.7s cubic-bezier(0.23,1,0.32,1)',
            transform: isOpen ? 'rotateY(-140deg)' : 'rotateY(0deg)',
          }}
        >
          {/* FRONT FACE: Masked Data */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              background: '#faf9f6',
              borderRadius: '12px',
              border: '1px solid #e8e6e1',
              padding: '24px',
              paddingRight: '64px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backfaceVisibility: 'hidden',
            }}
          >
            {/* Paper Texture Overlay */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.4,
                pointerEvents: 'none',
                borderRadius: '12px',
                backgroundImage: 'radial-gradient(#d4d1cc 0.5px, transparent 0.5px)',
                backgroundSize: '12px 12px',
              }}
            />
            
            <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {/* Header */}
              <div>
                {/* Total Assets MASKED */}
                <div>
                  <div style={{ fontSize: '14px', color: '#78716c', marginBottom: '12px', fontWeight: 500, letterSpacing: '0.05em' }}>总资产 (CNY)</div>
                  <div style={{ fontSize: '48px', color: '#1c1917', fontFamily: 'var(--font-share-tech-mono), "Share Tech Mono", monospace', fontWeight: 300, letterSpacing: '0.1em' }}>
                    ****
                  </div>
                </div>
              </div>
              
              {/* Grid Section MASKED */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', borderTop: '1px solid #e7e5e4', paddingTop: '24px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#a8a29e', marginBottom: '8px', fontWeight: 500 }}>累计收益</div>
                  <div style={{ fontSize: '24px', fontFamily: 'var(--font-share-tech-mono), "Share Tech Mono", monospace', color: '#d6d3d1', letterSpacing: '0.05em' }}>***</div>
                  <div style={{ fontSize: '14px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-share-tech-mono), "Share Tech Mono", monospace', color: '#e7e5e4' }}>
                    +**%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#a8a29e', marginBottom: '8px', fontWeight: 500 }}>当日盈亏</div>
                  <div style={{ fontSize: '24px', fontFamily: 'var(--font-share-tech-mono), "Share Tech Mono", monospace', color: '#d6d3d1', letterSpacing: '0.05em' }}>***</div>
                  <div style={{ fontSize: '14px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-share-tech-mono), "Share Tech Mono", monospace', color: '#e7e5e4' }}>
                    +**%
                  </div>
                </div>
              </div>
            </div>
            
            {/* "Click to Open" Hint */}
            <div style={{ position: 'absolute', bottom: '16px', right: '24px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'opacity 0.1s' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a8a29e', fontFamily: 'sans-serif' }}>点击查看详情</span>
            </div>
          </div>

          {/* BACK FACE: Blank Paper */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              background: '#f8f6f3',
              borderRadius: '12px',
              border: '1px solid #e8e6e1',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.2,
                pointerEvents: 'none',
                borderRadius: '12px',
                backgroundImage: 'radial-gradient(#d4d1cc 0.5px, transparent 0.5px)',
                backgroundSize: '12px 12px',
              }}
            />
          </div>
        </div>
      </label>
    </div>
  );
};

