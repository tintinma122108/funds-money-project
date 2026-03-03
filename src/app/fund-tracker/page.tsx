'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Share_Tech_Mono } from 'next/font/google';
import { FundHolding, RecognizedFund, PortfolioSummary } from './types';
import { FundHeader } from './components/FundHeader';
import { FundList } from './components/FundList';
import { AddFundModal } from './components/AddFundModal';
import {
  calculateFundHolding,
  calculateFundHoldingSync,
  calculatePortfolioSummary,
  getFundName,
  getMultipleFundSnapshots,
} from './utils';

// 加载 Share Tech Mono 字体（核心强调字体，用于总资产数字和估值涨跌幅）
const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-share-tech-mono',
});

const FundTrackerPage = () => {
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

  // 从localStorage加载数据
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

  // 保存数据到localStorage
  useEffect(() => {
    if (holdings.length > 0) {
      localStorage.setItem('fund-holdings', JSON.stringify(holdings));
    }
  }, [holdings]);

  // 计算总持仓统计
  useEffect(() => {
    const newSummary = calculatePortfolioSummary(holdings);
    setSummary(newSummary);
  }, [holdings]);

  // 实时更新价格（每2秒刷新一次）
  useEffect(() => {
    const updatePrices = async () => {
      try {
        // 使用函数式更新获取最新状态，避免竞态条件
        let snapshotHoldings: FundHolding[] = [];
        setHoldings((prevHoldings) => {
          snapshotHoldings = prevHoldings;
          return prevHoldings; // 先返回当前状态，不改变
        });
        
        if (snapshotHoldings.length === 0) return;
        
        // 同步 ref 到最新状态
        holdingsRef.current = snapshotHoldings;
        
        const fundCodes = snapshotHoldings.map((h) => h.fundCode);
        const snapshots = await getMultipleFundSnapshots(fundCodes);

        // 同时获取基金名称（如果名称为空）
        const updatedHoldings = await Promise.all(
          snapshotHoldings.map(async (holding) => {
            const snapshot = snapshots.get(holding.fundCode);
            const currentPrice = snapshot?.currentPrice ?? holding.currentPrice ?? holding.purchasePrice;
            const yesterdayPrice = snapshot?.yesterdayPrice ?? holding.yesterdayPrice ?? currentPrice;
            const changePercent = snapshot?.changePercent ?? 0;
            let fundName = holding.fundName;
            
            // 如果基金名称为空，从API获取
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
              holding.id, // 保留原有ID
              holding.shares // 保留原有份额
            );
          })
        );

        // 使用函数式更新，确保不会覆盖新添加的基金
        setHoldings((currentHoldings) => {
          // 创建当前列表的ID映射
          const currentIds = new Set(currentHoldings.map(h => h.id));
          const updatedIds = new Set(updatedHoldings.map(h => h.id));
          
          // 找出新添加的基金（在当前列表中但不在更新列表中）
          const newHoldings = currentHoldings.filter(h => !updatedIds.has(h.id));
          
          // 合并：更新的基金 + 新添加的基金
          const finalHoldings = [...updatedHoldings, ...newHoldings];
          holdingsRef.current = finalHoldings;
          return finalHoldings;
        });
      } catch (error) {
        console.error('更新价格失败:', error);
      }
    };

    // 每2秒更新一次（配合动画反馈）
    const interval = setInterval(updatePrices, 2000);
    // 立即执行一次
    updatePrices();

    return () => clearInterval(interval);
  }, []);

  // 处理添加的基金
  const handleFundAdded = async (fund: RecognizedFund) => {
    try {
      const fundName = fund.fundName || (await getFundName(fund.fundCode));
      const newHolding = await calculateFundHolding(
        fund.fundCode,
        fundName,
        fund.shares, // 使用用户输入的份额
        fund.holdingAmount,
        fund.purchasePrice
      );

      setHoldings((prev) => {
        const next = [...prev, newHolding];
        // 同步 ref，避免定时刷新用旧列表覆盖
        holdingsRef.current = next;
        return next;
      });
    } catch (error) {
      console.error('添加基金失败:', error);
      alert('添加基金失败，请检查基金代码是否正确');
    }
  };

  // 删除基金
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
    <div 
      style={{
        minHeight: '100vh',
        position: 'relative',
        background: 'linear-gradient(to bottom, #faf9f7 0%, #f5f3f0 50%, #f0ebe5 100%)',
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      {/* 纸张纹理叠加层 */}
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
      
      {/* 微妙的纸张折痕效果 */}
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

      {/* 容器 - 响应式最大宽度 */}
      <div style={{
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: '32px', // 从 16px 调整为 32px（两倍）
        paddingRight: '32px', // 从 16px 调整为 32px（两倍）
        paddingTop: '32px',
        paddingBottom: '32px',
      }}>
        {/* 主内容 */}
        <main style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* 头部标题 - Slogan：视窗宽时一行，变窄时按词自动换行；字号随视窗自适应 */}
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
                  '#1a1a1a',
                  '#2d2d2d',
                  '#B8860B',
                  '#DAA520',
                  '#CD7F32',
                  '#C0C0C0',
                  '#A8A8A8',
                  '#B8B8B8',
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

          {/* 头部总览（固定在顶部，Figma风格） */}
          <div style={{ marginBottom: '40px' }} className={shareTechMono.variable}>
            <FundHeader summary={summary} />
          </div>

          {/* 主内容区域 */}
          <div style={{ width: '100%' }}>
            {/* 标题栏 */}
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
              
              {/* Decorative Line */}
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
                {/* Capsule Body - Figma 优化样式 */}
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
                    // Matte texture with noise
                    backgroundImage: `
                      url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E"),
                      linear-gradient(180deg, #ea553a 0%, #d64126 100%)
                    `,
                    backgroundBlendMode: 'overlay, normal',
                    // Recessed "pit" effect using multiple shadows
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
                    textShadow: '0 1px 0 rgba(0,0,0,0.2)' 
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

            {/* 基金列表 - 响应式网格 */}
            <div className={shareTechMono.variable}>
              <FundList funds={holdings} onDelete={handleDeleteFund} />
            </div>
          </div>
        </main>
      </div>

      {/* 添加基金模态框 */}
      <div className={shareTechMono.variable}>
        <AddFundModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onConfirm={handleFundAdded}
        />
      </div>
    </div>
  );
};

export default FundTrackerPage;

