'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Share_Tech_Mono } from 'next/font/google';
import { FundHolding, RecognizedFund, PortfolioSummary } from './types';
import { FundHeader } from './components/FundHeader';
import { FundList } from './components/FundList';
import { AddFundModal } from './components/AddFundModal';
import { PullToRefresh, PAGE_BACKGROUND } from '@/components/ui/PullToRefresh';
import {
  calculateFundHolding,
  calculateFundHoldingSync,
  calculatePortfolioSummary,
  getFundName,
  getMultipleFundSnapshots,
} from './utils';

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-share-tech-mono',
});

export default function FundTrackerClient() {
  const [holdings, setHoldings] = useState<FundHolding[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary>({
    totalValue: 0,
    totalHoldingProfit: 0,
    totalEstimatedTodayProfit: 0,
    totalEstimatedTodayChangePercent: 0,
  });
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const holdingsRef = useRef<FundHolding[]>([]);

  useEffect(() => {
    holdingsRef.current = holdings;
  }, [holdings]);

  useEffect(() => {
    const saved = localStorage.getItem('fund-holdings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHoldings(parsed);
      } catch (e) {
        console.error('Failed to load holdings:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (holdings.length > 0) {
      localStorage.setItem('fund-holdings', JSON.stringify(holdings));
    }
  }, [holdings]);

  useEffect(() => {
    const newSummary = calculatePortfolioSummary(holdings);
    setSummary(newSummary);
  }, [holdings]);

  const updatePrices = useCallback(async () => {
    try {
      let snapshotHoldings: FundHolding[] = [];
      setHoldings((prevHoldings) => {
        snapshotHoldings = prevHoldings;
        return prevHoldings;
      });
      if (snapshotHoldings.length === 0) return;

      holdingsRef.current = snapshotHoldings;
      const fundCodes = snapshotHoldings.map((h) => h.fundCode);
      const snapshots = await getMultipleFundSnapshots(fundCodes);

      const updatedHoldings = await Promise.all(
        snapshotHoldings.map(async (holding) => {
          const snapshot = snapshots.get(holding.fundCode);
          const currentPrice = snapshot?.currentPrice ?? holding.currentPrice ?? holding.purchasePrice;
          const yesterdayPrice = snapshot?.yesterdayPrice ?? holding.yesterdayPrice ?? currentPrice;
          const changePercent = snapshot?.changePercent ?? 0;
          let fundName = holding.fundName;
          if (!fundName || fundName === `基金${holding.fundCode}`) {
            try {
              fundName = await getFundName(holding.fundCode);
            } catch (e) {
              console.error(`Failed to get fund name for ${holding.fundCode}:`, e);
            }
          }
          return calculateFundHoldingSync(
            holding.fundCode,
            fundName,
            holding.holdingAmount,
            holding.purchasePrice,
            currentPrice,
            yesterdayPrice,
            changePercent,
            holding.id,
            holding.shares
          );
        })
      );

      setHoldings((currentHoldings) => {
        const updatedIds = new Set(updatedHoldings.map(h => h.id));
        const newHoldings = currentHoldings.filter(h => !updatedIds.has(h.id));
        const finalHoldings = [...updatedHoldings, ...newHoldings];
        holdingsRef.current = finalHoldings;
        return finalHoldings;
      });
    } catch (error) {
      console.error('更新价格失败:', error);
    }
  }, []);

  useEffect(() => {
    updatePrices();
    const interval = setInterval(updatePrices, 2000);
    return () => clearInterval(interval);
  }, [updatePrices]);

  const handleFundAdded = async (fund: RecognizedFund) => {
    try {
      const fundName = fund.fundName || (await getFundName(fund.fundCode));
      const newHolding = await calculateFundHolding(
        fund.fundCode,
        fundName,
        fund.shares,
        fund.holdingAmount,
        fund.purchasePrice
      );

      setHoldings((prev) => {
        const next = [...prev, newHolding];
        holdingsRef.current = next;
        return next;
      });
    } catch (error) {
      console.error('添加基金失败:', error);
      alert('添加基金失败，请检查基金代码是否正确');
    }
  };

  const handleDeleteFund = (id: string) => {
    if (confirm('确定要删除这只基金吗？')) {
      setHoldings((prev) => {
        const next = prev.filter((h) => h.id !== id);
        holdingsRef.current = next;
        return next;
      });
    }
  };

  return (
    <PullToRefresh onRefresh={updatePrices}>
      <div
        style={{
          minHeight: '100%',
          position: 'relative',
          background: 'transparent',
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.02,
            background: `
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 79px,
                rgba(0,0,0,0.03) 79px,
                rgba(0,0,0,0.03) 80px
              ),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 79px,
                rgba(0,0,0,0.02) 79px,
                rgba(0,0,0,0.02) 80px
              )
            `,
          }}
        />
        <div style={{
          maxWidth: '1280px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '32px',
          paddingRight: '32px',
          paddingTop: '32px',
          paddingBottom: '32px',
        }}>
          <main style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 'clamp(32px, 8vw, 64px)' }}>
              <h1
                style={{
                  fontFamily: 'var(--font-slogan), serif',
                  fontSize: 'clamp(36px, 8vw, 72px)',
                  cursor: 'default',
                  lineHeight: 1.1,
                  letterSpacing: '0.01em',
                  color: '#1a1a1a',
                  textTransform: 'uppercase',
                  fontWeight: '400',
                  margin: 0,
                  maxWidth: '100%',
                }}
                onMouseMove={(e) => {
                  const metalColors = [
                    '#1a1a1a', '#2d2d2d', '#B8860B', '#DAA520', '#CD7F32', '#C0C0C0', '#A8A8A8', '#B8B8B8',
                  ];
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const children = e.currentTarget.querySelectorAll('.hover-char');
                  for (let i = 0; i < children.length; i++) {
                    const child = children[i] as HTMLElement;
                    const childRect = child.getBoundingClientRect();
                    const childX = childRect.left + childRect.width / 2 - rect.left;
                    const childY = childRect.top + childRect.height / 2 - rect.top;
                    const distance = Math.sqrt(Math.pow(x - childX, 2) + Math.pow(y - childY, 2));
                    if (distance < 120) {
                      const randomColor = metalColors[Math.floor(Math.random() * metalColors.length)];
                      child.style.color = randomColor;
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  const children = e.currentTarget.querySelectorAll('.hover-char');
                  for (let i = 0; i < children.length; i++) {
                    (children[i] as HTMLElement).style.color = '#1a1a1a';
                  }
                }}
              >
                {['FUND', 'YOUR', 'FORTUNE'].map((word, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                      marginRight: i < 2 ? '0.25em' : 0,
                    }}
                  >
                    {word.split('').map((char, j) => (
                      <span
                        key={j}
                        className="hover-char"
                        style={{ display: 'inline-block', color: '#1a1a1a', transition: 'color 0.2s ease-out' }}
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                ))}
              </h1>
            </div>

            <div style={{ marginBottom: '40px' }} className={shareTechMono.variable}>
              <FundHeader summary={summary} />
            </div>

            <div style={{ width: '100%' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                marginBottom: '32px',
                flexWrap: 'wrap',
              }}>
                <h2
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 600,
                    fontStyle: 'italic',
                    fontSize: 'clamp(20px, 4vw, 32px)',
                    color: '#1a1a1a',
                    whiteSpace: 'nowrap',
                    letterSpacing: '-0.01em',
                  }}
                >
                  我的资产
                </h2>
                <div style={{
                  height: '1px',
                  background: '#2d2d2d',
                  opacity: 0.5,
                  flexGrow: 1,
                  minWidth: '100px',
                  marginRight: 'clamp(16px, 4vw, 64px)',
                }} />
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  style={{
                    position: 'relative',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '40px',
                    width: '96px',
                    outline: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    background: 'transparent',
                  }}
                  aria-label="Add Fund"
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      position: 'relative',
                      zIndex: 10,
                      transition: 'transform 0.1s',
                      backgroundImage: `
                        url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E"),
                        linear-gradient(180deg, #ea553a 0%, #d64126 100%)
                      `,
                      backgroundBlendMode: 'overlay, normal',
                      boxShadow: `
                        inset 0 1px 0 rgba(255,255,255,0.3),
                        inset 0 -1px 2px rgba(0,0,0,0.2),
                        0 1px 2px rgba(0,0,0,0.2),
                        0 0 0 1px rgba(0,0,0,0.1),
                        0 0 0 4px #e8e6e1,
                        0 0 0 5px rgba(255,255,255,0.6),
                        0 1px 3px 4px rgba(0,0,0,0.1),
                        inset 0 0 8px rgba(0,0,0,0.15)
                      `,
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'scale(0.95)';
                      e.currentTarget.style.boxShadow = `
                        inset 0 2px 4px rgba(0,0,0,0.3),
                        inset 0 -1px 2px rgba(0,0,0,0.2),
                        0 1px 2px rgba(0,0,0,0.2),
                        0 0 0 1px rgba(0,0,0,0.1),
                        0 0 0 4px #e8e6e1,
                        0 0 0 5px rgba(255,255,255,0.6),
                        0 1px 3px 4px rgba(0,0,0,0.1),
                        inset 0 0 8px rgba(0,0,0,0.15)
                      `;
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = `
                        inset 0 1px 0 rgba(255,255,255,0.3),
                        inset 0 -1px 2px rgba(0,0,0,0.2),
                        0 1px 2px rgba(0,0,0,0.2),
                        0 0 0 1px rgba(0,0,0,0.1),
                        0 0 0 4px #e8e6e1,
                        0 0 0 5px rgba(255,255,255,0.6),
                        0 1px 3px 4px rgba(0,0,0,0.1),
                        inset 0 0 8px rgba(0,0,0,0.15)
                      `;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = `
                        inset 0 1px 0 rgba(255,255,255,0.3),
                        inset 0 -1px 2px rgba(0,0,0,0.2),
                        0 1px 2px rgba(0,0,0,0.2),
                        0 0 0 1px rgba(0,0,0,0.1),
                        0 0 0 4px #e8e6e1,
                        0 0 0 5px rgba(255,255,255,0.6),
                        0 1px 3px 4px rgba(0,0,0,0.1),
                        inset 0 0 8px rgba(0,0,0,0.15)
                      `;
                    }}
                  >
                    <span style={{
                      color: '#fbfaf8',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      letterSpacing: '0.05em',
                      paddingTop: '2px',
                      textShadow: '0 1px 0 rgba(0,0,0,0.2)',
                    }}>
                      添加
                    </span>
                    <Plus
                      size={16}
                      style={{
                        color: '#fbfaf8',
                        width: '16px',
                        height: '16px',
                        strokeWidth: 3,
                        filter: 'drop-shadow(0 1px 0 rgba(0,0,0,0.2))',
                      }}
                    />
                  </div>
                </button>
              </div>

              <div className={shareTechMono.variable}>
                <FundList funds={holdings} onDelete={handleDeleteFund} />
              </div>
            </div>
          </main>
        </div>

        <div className={shareTechMono.variable}>
          <AddFundModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            onConfirm={handleFundAdded}
          />
        </div>
      </div>
    </PullToRefresh>
  );
}
