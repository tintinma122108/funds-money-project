'use client';

import React from 'react';
import { animate } from 'framer-motion';

type AnimatedNumberProps = {
  value: number | null | undefined;
  format: (value: number) => string;
  duration?: number;
  className?: string;
};

export function AnimatedNumber({
  value,
  format,
  duration = 0.55,
  className,
}: AnimatedNumberProps) {
  const safeValue = Number.isFinite(value as number) ? (value as number) : 0;
  const prevRef = React.useRef<number>(safeValue);
  const [displayValue, setDisplayValue] = React.useState<number>(safeValue);

  React.useEffect(() => {
    const from = prevRef.current;
    const to = safeValue;

    // 直接设置（避免首帧/极小变化抖动）
    if (from === to) {
      setDisplayValue(to);
      return;
    }

    const controls = animate(from, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => {
        setDisplayValue(latest);
      },
    });

    prevRef.current = to;
    return () => controls.stop();
  }, [safeValue, duration]);

  return <span className={className}>{format(displayValue)}</span>;
}



