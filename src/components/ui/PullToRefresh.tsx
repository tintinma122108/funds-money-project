'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Caveat } from 'next/font/google';
import { LoadingMotion } from './LoadingMotion';

const caveat = Caveat({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
});

/** 与 fund-tracker 页面一致的背景渐变 */
export const PAGE_BACKGROUND = 'linear-gradient(to bottom, #faf9f7 0%, #f5f3f0 50%, #f0ebe5 100%)';

const RESISTANCE = 0.5;
const MIN_LOADING_DURATION_MS = 2000;

// ========== 下拉刷新动画 position 参数（调这里即可控制精准位置） ==========
/** 被推下的 main / 顶部区域高度，占视口高度比例，如 0.2 = 20% */
const PULL_RATIO = 0.2;
/** 笔书写 motion 距视口顶部的距离，占视口高度比例，0 = 紧贴顶部 */
const MOTION_POSITION_RATIO = 0;
/** 可选：在比例基础上再偏移的像素，正数往下、负数往上，0 表示不偏移 */
const MOTION_OFFSET_PX = 0;
/** 触发刷新的下拉阈值，占视口高度比例，如 0.1 = 10% */
const THRESHOLD_RATIO = 0.1;
/** 顶部区域 z-index，需高于页面内所有元素（如 FundHeader 的 40/50），否则 loading 会出现在 slogan 背后 */
const TOP_BAND_Z_INDEX = 100;
/** motion 与 main 之间的间距：占视口高度比例，随屏幕动态适配（如 0.16 在 600px 高约 96px） */
const MOTION_MAIN_GAP_RATIO = 0.16;
/** 间距像素下限，避免小屏过窄 */
const MOTION_MAIN_GAP_MIN_PX = 64;
/** 间距像素上限，避免大屏过宽 */
const MOTION_MAIN_GAP_MAX_PX = 144;
// ==========

type PullToRefreshProps = {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
};

export function PullToRefresh({ children, onRefresh, disabled = false }: PullToRefreshProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(600);
  const startY = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const thresholdPx = Math.round(viewportHeight * THRESHOLD_RATIO);
  const maxPullPx = Math.round(viewportHeight * PULL_RATIO);

  useEffect(() => {
    const update = () => {
      const h = typeof window !== 'undefined' ? window.innerHeight : 600;
      setViewportHeight(h);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const triggerRefresh = useCallback(async () => {
    if (disabled || isLoading) return;
    setIsLoading(true);
    const t0 = Date.now();
    try {
      await onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      const elapsed = Date.now() - t0;
      const wait = Math.max(0, MIN_LOADING_DURATION_MS - elapsed);
      await new Promise((r) => setTimeout(r, wait));
      setIsLoading(false);
      setPullDistance(0);
    }
  }, [onRefresh, disabled, isLoading]);

  const atTop = useCallback(() => {
    const el = scrollRef.current;
    return el ? el.scrollTop <= 0 : true;
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || isLoading) return;
      if (atTop()) startY.current = e.touches[0].clientY;
    },
    [disabled, isLoading, atTop]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || isLoading) return;
      if (!atTop()) return;
      const y = e.touches[0].clientY;
      const delta = y - startY.current;
      if (delta > 0) {
        e.preventDefault();
        setPullDistance(Math.min(delta * RESISTANCE, maxPullPx));
      } else {
        setPullDistance(0);
      }
    },
    [disabled, isLoading, atTop, maxPullPx]
  );

  const handleTouchEnd = useCallback(() => {
    if (isLoading || disabled) return;
    if (pullDistance >= thresholdPx) {
      triggerRefresh();
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, thresholdPx, isLoading, disabled, triggerRefresh]);

  const displayOffsetPx = isLoading ? maxPullPx : pullDistance;
  const motionTopPx = Math.round(viewportHeight * MOTION_POSITION_RATIO) + MOTION_OFFSET_PX;
  const motionAreaHeightPx = Math.max(60, maxPullPx - motionTopPx);
  const motionMainGapPx = Math.round(
    Math.max(MOTION_MAIN_GAP_MIN_PX, Math.min(MOTION_MAIN_GAP_MAX_PX, viewportHeight * MOTION_MAIN_GAP_RATIO))
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || isLoading) return;
      if (atTop()) startY.current = e.clientY;
    },
    [disabled, isLoading, atTop]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || isLoading || e.buttons !== 1) return;
      if (!atTop()) return;
      const delta = e.clientY - startY.current;
      if (delta > 0) {
        setPullDistance(Math.min(delta * RESISTANCE, maxPullPx));
      } else {
        setPullDistance(0);
      }
    },
    [disabled, isLoading, atTop, maxPullPx]
  );

  const handleMouseUp = useCallback(() => {
    if (isLoading || disabled) return;
    if (pullDistance >= thresholdPx) {
      triggerRefresh();
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, thresholdPx, isLoading, disabled, triggerRefresh]);

  const noLayerStyle = {
    boxShadow: 'none',
    border: 'none',
    outline: 'none',
    WebkitBoxShadow: 'none',
  } as const;

  /** 顶部延伸高度：覆盖 safe-area / 地址栏等可能露出的 body 深色，消除顶部黑条 */
  const topCoverPx = 20;

  return (
    <div
      ref={containerRef}
      className={caveat.variable}
      style={{
        minHeight: '100dvh',
        height: '100dvh',
        width: '100%',
        overflow: 'hidden',
        background: PAGE_BACKGROUND,
        position: 'relative',
        boxSizing: 'border-box',
        paddingTop: `max(${topCoverPx}px, env(safe-area-inset-top, 0px))`,
        ...noLayerStyle,
      }}
    >
      <div
        ref={scrollRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          if (!isLoading && pullDistance > 0) setPullDistance(0);
        }}
        style={{
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          background: PAGE_BACKGROUND,
          ...noLayerStyle,
        }}
      >
        {/* 整块由 motion 一层绘制背景，避免与 main 分层、硬线 */}
        <motion.div
          style={{
            background: PAGE_BACKGROUND,
            minHeight: '100%',
            backfaceVisibility: 'hidden',
            ...noLayerStyle,
          }}
          initial={false}
          animate={{ y: displayOffsetPx }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 40,
          }}
        >
          {/* 顶部区域：透明，露出 motion 的 PAGE_BACKGROUND */}
          <div
            style={{
              height: displayOffsetPx,
              minHeight: displayOffsetPx > 0 ? displayOffsetPx : 0,
              marginBottom: displayOffsetPx > 0 ? motionMainGapPx : 0,
              background: 'transparent',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              flexShrink: 0,
              position: 'relative',
              zIndex: TOP_BAND_Z_INDEX,
              paddingTop: displayOffsetPx > 0 ? Math.max(0, motionTopPx) : 0,
              ...noLayerStyle,
            }}
          >
            {displayOffsetPx > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ minHeight: 24, ...noLayerStyle }}
              >
                {isLoading && (
                  <LoadingMotion containerHeight={motionAreaHeightPx} transparentBackground />
                )}
              </motion.div>
            )}
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  );
}
