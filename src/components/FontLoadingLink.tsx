'use client';

import { useEffect } from 'react';

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Just+Me+Again+Down+Here&display=swap';

/** 在客户端注入 Loading 动画用字体，避免 CSS @import 与 Tailwind 冲突 */
export function FontLoadingLink() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const id = 'font-loading-motion';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = FONT_URL;
    document.head.appendChild(link);
  }, []);
  return null;
}
