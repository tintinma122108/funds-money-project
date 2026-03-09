'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { LOADING_VIEWBOX, LOADING_PATH_DATA } from './loadingMotionPaths';

const LOADING_BG = 'linear-gradient(to bottom, #faf9f7 0%, #f5f3f0 50%, #f0ebe5 100%)';

const FIGMA_REF_HEIGHT = 220;
const PEN_SIZE_MULTIPLIER = 2;
/** loading 文字上移重叠笔图透明边缘的比例（相对 pen 尺寸），使笔尖与字母顶部紧贴，可微调 */
const TEXT_OVERLAP_PEN_RATIO = 0.2;
/** 整 8 条 path 反向播放一轮的总时长（秒），单条 = 总时长/8，前一个结束马上接下一个 */
const LOADING_CYCLE_DURATION = 2;
const LOADING_PATH_DURATION = LOADING_CYCLE_DURATION / 8;

/** 与 Figma Loading Animation Design 一致；containerHeight 时按当前页面比例适配；笔放大一倍，loading 紧贴笔下方（slogan 位） */
export function LoadingMotion({
  compact = false,
  containerHeight,
  transparentBackground = false,
}: {
  compact?: boolean;
  /** 下拉刷新时展示区域高度(px)，动画按此比例缩放适配当前页面 */
  containerHeight?: number;
  /** 透明背景，与父级同一 layer，无投影不遮盖 */
  transparentBackground?: boolean;
}) {
  const refH = FIGMA_REF_HEIGHT;
  const targetH = containerHeight ?? (compact ? 72 : refH);
  const scale = Math.min(1, targetH / refH);
  const penSize = Math.round(185.185 * scale * PEN_SIZE_MULTIPLIER);
  const overlapUpPx = Math.round(penSize * TEXT_OVERLAP_PEN_RATIO);
  const svgWidth = Math.round(144 * scale);
  const svgHeight = Math.round(64 * scale);

  const [cycleKey, setCycleKey] = useState(0);
  useEffect(() => {
    const ms = LOADING_CYCLE_DURATION * 1000;
    const id = setInterval(() => setCycleKey((k) => k + 1), ms);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        background: transparentBackground ? 'transparent' : LOADING_BG,
        minHeight: targetH,
        height: targetH,
        boxShadow: 'none',
        border: 'none',
      }}
      data-name="loading motion"
    >
      {/* 笔尖图片：尺寸放大一倍，左右摇摆旋转 */}
      <div
        className="flex items-center justify-center flex-none"
        style={{
          width: penSize + 24,
          height: penSize + 24,
        }}
      >
        <motion.div
          className="flex-none"
          animate={{ rotate: [8.35, 3, 8.35, 13, 8.35] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{ width: penSize, height: penSize }}
          >
            <Image
              alt=""
              src="/loading-pen.png"
              width={penSize}
              height={penSize}
              className="object-cover pointer-events-none"
              unoptimized
            />
          </div>
        </motion.div>
      </div>

      {/* 手写 loading：8 条 path 反向顺序播放，总时长 2 秒一轮，前一个结束马上接下一个 */}
      <div
        className="flex justify-center items-center"
        style={{ marginTop: -overlapUpPx, marginBottom: 0 }}
      >
        <motion.svg
          key={cycleKey}
          width={svgWidth}
          height={svgHeight}
          viewBox={LOADING_VIEWBOX}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: LOADING_PATH_DURATION,
              },
            },
          }}
        >
          {[...LOADING_PATH_DATA].reverse().map((d, index) => (
            <motion.path
              key={LOADING_PATH_DATA.length - 1 - index}
              d={d}
              fill="none"
              stroke="black"
              strokeWidth={0.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: {
                  pathLength: 1,
                  opacity: 1,
                  transition: {
                    type: 'tween',
                    duration: LOADING_PATH_DURATION,
                    ease: 'easeInOut',
                  },
                },
              }}
            />
          ))}
        </motion.svg>
      </div>
    </div>
  );
}
