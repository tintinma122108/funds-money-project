'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { RecognizedFund } from '../types';

interface AddFundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (fund: RecognizedFund) => void;
}

export const AddFundModal: React.FC<AddFundModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [fundCode, setFundCode] = useState('');
  const [shares, setShares] = useState(''); // 持仓份额
  const [holdingAmount, setHoldingAmount] = useState(''); // 持仓金额
  const [purchasePrice, setPurchasePrice] = useState(''); // 持仓成本
  const [exitMode, setExitMode] = useState<'default' | 'cancel' | 'confirm'>('default');
  const [crumpledBallLoaded, setCrumpledBallLoaded] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 验证基金代码
    if (!/^\d{6}$/.test(fundCode)) {
      alert('基金代码必须是6位数字');
      return;
    }

    // 验证持仓份额
    const sharesNum = parseFloat(shares);
    if (isNaN(sharesNum) || sharesNum <= 0) {
      alert('请输入有效的持仓份额（必须大于0）');
      return;
    }

    // 验证持仓金额
    const amount = parseFloat(holdingAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('请输入有效的持仓金额（必须大于0）');
      return;
    }

    // 验证持仓成本
    const cost = parseFloat(purchasePrice);
    if (isNaN(cost) || cost <= 0) {
      alert('请输入有效的持仓成本（必须大于0）');
      return;
    }

    // 验证数据合理性：
    // 1. 持仓金额（当前市值）应该 >= 持仓份额 × 持仓成本（持有成本）
    //    因为持仓金额包含收益，所以应该大于等于成本
    // 2. 但也不应该过大（比如超过成本的10倍），避免输入错误
    const holdingCost = sharesNum * cost;
    const maxReasonableValue = holdingCost * 10; // 允许最多10倍，避免输入错误
    
    if (amount < holdingCost) {
      alert(`持仓金额（当前市值 ${amount.toFixed(2)}）不应小于持有成本（${holdingCost.toFixed(2)} = ${sharesNum} × ${cost.toFixed(4)}）`);
      return;
    }
    
    if (amount > maxReasonableValue) {
      alert(`持仓金额（${amount.toFixed(2)}）似乎过大，请确认是否输入正确。持有成本为 ${holdingCost.toFixed(2)}`);
      return;
    }

    // 提交数据
    setExitMode('confirm');
    requestAnimationFrame(() => {
      onConfirm({
        fundCode: fundCode.trim(),
        fundName: '', // 名称会自动从API获取
        shares: sharesNum,
        holdingAmount: amount,
        purchasePrice: cost,
      });
      onClose();
      setTimeout(() => {
        setFundCode('');
        setShares('');
        setHoldingAmount('');
        setPurchasePrice('');
        setExitMode('default');
      }, 500);
    });
  };

  const handleCancel = () => {
    setExitMode('cancel');
    requestAnimationFrame(() => {
      onClose();
      setTimeout(() => {
        setFundCode('');
        setShares('');
        setHoldingAmount('');
        setPurchasePrice('');
        setExitMode('default');
      }, 800);
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={
              exitMode === 'cancel'
                ? { opacity: [1, 1, 0], transition: { duration: 0.8, times: [0, 0.15, 1] } }
                : exitMode === 'confirm'
                ? { opacity: 0, transition: { duration: 0.5, delay: 0.3 } }
                : { opacity: 0, transition: { duration: 0.3 } }
            }
            onClick={handleCancel}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              zIndex: 40,
            }}
          />

          <div 
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              padding: '16px',
              pointerEvents: 'none',
              perspective: '1000px',
            }}
          >
            {/* 容器 Wrapper */}
            <motion.div
              style={{
                pointerEvents: 'auto',
                position: 'relative',
                width: '100%',
                maxWidth: '340px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              initial="initial"
              animate="animate"
              exit={exitMode === 'cancel' ? 'exitCancel' : exitMode === 'confirm' ? 'exitConfirm' : 'exitDefault'}
            >
              {/* Frame 1: 原始纸张 (Paper Content) */}
              <motion.div
                style={{
                  width: '100%',
                  background: '#f7f5f0',
                  paddingLeft: '32px',
                  paddingRight: '32px',
                  paddingBottom: '48px',
                  paddingTop: '40px',
                  position: 'relative',
                  zIndex: 10,
                  transformOrigin: 'center center',
                  filter: 'drop-shadow(20px 50px 60px rgba(0,0,0,0.45)) drop-shadow(5px 15px 15px rgba(0,0,0,0.2))',
                  backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.02) 60%, rgba(0,0,0,0.1) 100%), url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E")`,
                  maskImage: `
                    radial-gradient(circle 6px at bottom, transparent 6px, black 6.5px),
                    radial-gradient(circle 6px at top, transparent 6px, black 6.5px)
                  `,
                  WebkitMaskImage: `
                    radial-gradient(circle 6px at bottom, transparent 6px, black 6.5px),
                    radial-gradient(circle 6px at top, transparent 6px, black 6.5px)
                  `,
                  maskSize: '20px 51%',
                  maskPosition: 'bottom center, top center',
                  maskRepeat: 'repeat-x',
                  WebkitMaskSize: '20px 51%',
                  WebkitMaskPosition: 'bottom center, top center',
                  WebkitMaskRepeat: 'repeat-x',
                }}
                variants={{
                  initial: { opacity: 0, scale: 0.95, y: 20 },
                  animate: { 
                    opacity: 1, 
                    scale: 1, 
                    y: 0, 
                    rotate: 0,
                    rotateX: 0,
                    rotateY: 0,
                    transition: { duration: 0.4, type: "spring", stiffness: 200, damping: 20 } 
                  },
                  exitDefault: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } },
                  exitCancel: {
                    opacity: 0,
                    scale: 0.9, 
                    transition: { duration: 0.15, ease: "easeOut" }
                  },
                  exitConfirm: {
                    y: 150,
                    rotateX: -90,
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.5, ease: "backIn" }
                  }
                }}
              >
                <button 
                  type="button"
                  onClick={handleCancel}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    color: '#a8a29e',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    zIndex: 10,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#1c1917'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#a8a29e'}
                >
                  <X size={20} strokeWidth={2.5} style={{ opacity: 0.6 }} />
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h2 
                    style={{ 
                      fontSize: '30px',
                      textAlign: 'center',
                      color: '#1c1917',
                      marginBottom: '8px',
                      fontFamily: '"Playfair Display", serif',
                      fontStyle: 'italic',
                      fontWeight: 600,
                    }}
                  >
                    New Fund
                  </h2>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '40px', color: '#a8a29e' }}>
                    {'★★★★★'.split('').map((star, i) => (
                      <span key={i} style={{ fontSize: '10px', transform: 'scale(0.75)', display: 'block' }}>{star}</span>
                    ))}
                  </div>
                  <div style={{ width: '100%', borderBottom: '1px dashed #d6d3d1', marginBottom: '40px', opacity: 0.6 }} />

                  <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div style={{ position: 'relative', textAlign: 'center' }}>
                      <input
                        type="text"
                        value={fundCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setFundCode(value);
                        }}
                        placeholder="000001"
                        required
                        style={{
                          width: '100%',
                          background: 'transparent',
                          borderBottom: '1px solid #d6d3d1',
                          borderTop: 'none',
                          borderLeft: 'none',
                          borderRight: 'none',
                          padding: '8px 0',
                          fontSize: '20px',
                          fontFamily: 'var(--font-share-tech-mono), "Share Tech Mono", monospace',
                          color: '#1c1917',
                          textAlign: 'center',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => e.currentTarget.style.borderBottomColor = '#1c1917'}
                        onBlur={(e) => e.currentTarget.style.borderBottomColor = '#d6d3d1'}
                      />
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.2em', color: '#a8a29e', textTransform: 'uppercase', fontFamily: 'sans-serif', marginTop: '8px' }}>基金代码</label>
                    </div>

                    <div style={{ position: 'relative', textAlign: 'center' }}>
                      <input
                        type="number"
                        value={shares}
                        onChange={(e) => setShares(e.target.value)}
                        placeholder="4000"
                        step="0.01"
                        min="0.01"
                        required
                        style={{
                          width: '100%',
                          background: 'transparent',
                          borderBottom: '1px solid #d6d3d1',
                          borderTop: 'none',
                          borderLeft: 'none',
                          borderRight: 'none',
                          padding: '8px 0',
                          fontSize: '20px',
                          fontFamily: 'var(--font-share-tech-mono), "Share Tech Mono", monospace',
                          color: '#1c1917',
                          textAlign: 'center',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => e.currentTarget.style.borderBottomColor = '#1c1917'}
                        onBlur={(e) => e.currentTarget.style.borderBottomColor = '#d6d3d1'}
                      />
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.2em', color: '#a8a29e', textTransform: 'uppercase', fontFamily: 'sans-serif', marginTop: '8px' }}>持仓份额（份）</label>
                    </div>

                    <div style={{ position: 'relative', textAlign: 'center' }}>
                      <input
                        type="number"
                        value={holdingAmount}
                        onChange={(e) => setHoldingAmount(e.target.value)}
                        placeholder="10000"
                        step="0.01"
                        min="0.01"
                        required
                        style={{
                          width: '100%',
                          background: 'transparent',
                          borderBottom: '1px solid #d6d3d1',
                          borderTop: 'none',
                          borderLeft: 'none',
                          borderRight: 'none',
                          padding: '8px 0',
                          fontSize: '20px',
                          fontFamily: 'var(--font-share-tech-mono), "Share Tech Mono", monospace',
                          color: '#1c1917',
                          textAlign: 'center',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => e.currentTarget.style.borderBottomColor = '#1c1917'}
                        onBlur={(e) => e.currentTarget.style.borderBottomColor = '#d6d3d1'}
                      />
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.2em', color: '#a8a29e', textTransform: 'uppercase', fontFamily: 'sans-serif', marginTop: '8px' }}>持仓金额（元，当前市值）</label>
                    </div>

                    <div style={{ position: 'relative', textAlign: 'center' }}>
                      <input
                        type="number"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(e.target.value)}
                        placeholder="2.50"
                        step="0.0001"
                        min="0.0001"
                        required
                        style={{
                          width: '100%',
                          background: 'transparent',
                          borderBottom: '1px solid #d6d3d1',
                          borderTop: 'none',
                          borderLeft: 'none',
                          borderRight: 'none',
                          padding: '8px 0',
                          fontSize: '20px',
                          fontFamily: 'var(--font-share-tech-mono), "Share Tech Mono", monospace',
                          color: '#1c1917',
                          textAlign: 'center',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => e.currentTarget.style.borderBottomColor = '#1c1917'}
                        onBlur={(e) => e.currentTarget.style.borderBottomColor = '#d6d3d1'}
                      />
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.2em', color: '#a8a29e', textTransform: 'uppercase', fontFamily: 'sans-serif', marginTop: '8px' }}>持仓成本（元/份）</label>
                    </div>

                    <div style={{ paddingTop: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                      <button 
                        type="submit" 
                        style={{
                          background: '#1c1917',
                          color: '#f7f5f0',
                          padding: '12px 40px',
                          boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
                          border: 'none',
                          cursor: 'pointer',
                          width: '100%',
                          fontFamily: '"Playfair Display", serif',
                          fontStyle: 'italic',
                          fontWeight: 600,
                          fontSize: '16px',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#292524';
                          e.currentTarget.style.boxShadow = '0 15px 20px rgba(0,0,0,0.15)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#1c1917';
                          e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                        onMouseDown={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
                        }}
                        onMouseUp={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 15px 20px rgba(0,0,0,0.15)';
                        }}
                      >
                        Confirm Entry
                      </button>
                      <button 
                        type="button" 
                        onClick={handleCancel}
                        style={{
                          color: '#d6d3d1',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          fontFamily: 'sans-serif',
                          paddingTop: '8px',
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#78716c'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#d6d3d1'}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>

              {/* Frame 3: 揉皱的纸团 (Crumpled Ball) - Figma: w-[340px] */}
              {crumpledBallLoaded && (
                <motion.img 
                  src="/images/crumpled-ball.png"
                  alt="Crumpled Paper Ball"
                  style={{
                    position: 'absolute',
                    top: 0,
                    width: '340px',
                    height: 'auto',
                    pointerEvents: 'none',
                    objectFit: 'contain',
                    zIndex: 20,
                    opacity: 0,
                  }}
                  variants={{
                    initial: { opacity: 0, scale: 0.8 },
                    animate: { opacity: 0 },
                    exitDefault: { opacity: 0 },
                    exitConfirm: { opacity: 0 },
                    exitCancel: {
                      opacity: [0, 1, 1, 0],
                      scale: [0.8, 0.8, 0.3, 0],
                      y: [0, 0, 100, 600],
                      rotate: [0, 0, 180, 720],
                      transition: { 
                        duration: 0.8,
                        times: [0, 0.15, 0.4, 1],
                        ease: "easeInOut"
                      }
                    }
                  }}
                  onError={() => {
                    // 图片加载失败时，隐藏元素
                    setCrumpledBallLoaded(false);
                  }}
                />
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

