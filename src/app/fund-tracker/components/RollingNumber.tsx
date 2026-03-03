'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface RollingNumberProps {
  value: number;
  format?: (value: number) => string;
  duration?: number;
}

/**
 * RollingNumber 组件 - 实现类似老虎机或里程表的垂直滚动动画
 * 每个数字位独立滚动，支持小数位、正负号和百分比后缀
 */
export const RollingNumber: React.FC<RollingNumberProps> = ({ 
  value, 
  format = (v) => v.toFixed(2),
  duration = 0.8 
}) => {
  const prevValueRef = useRef<string>('');
  const [displayValue, setDisplayValue] = React.useState<string>(format(value));
  
  useEffect(() => {
    const newFormatted = format(value);
    if (newFormatted !== prevValueRef.current) {
      setDisplayValue(newFormatted);
      prevValueRef.current = newFormatted;
    }
  }, [value, format]);
  
  // 格式化数值为字符串
  const formattedValue = displayValue;
  
  // 解析字符串，提取各部分（支持千位分隔符、货币符号、正负号、百分比）
  const parseValue = (str: string) => {
    const parts: Array<{ type: 'sign' | 'digit' | 'decimal' | 'separator' | 'prefix' | 'suffix'; value: string }> = [];
    let i = 0;
    
    // 提取前缀（如货币符号 ¥）
    if (str[i] === '¥' || str[i] === '$' || str[i] === '€') {
      parts.push({ type: 'prefix', value: str[i] });
      i++;
    }
    
    // 提取正负号
    if (str[i] === '+' || str[i] === '-') {
      parts.push({ type: 'sign', value: str[i] });
      i++;
    }
    
    // 提取数字部分（包括小数点和千位分隔符）
    let digitPart = '';
    while (i < str.length && (/\d/.test(str[i]) || str[i] === '.' || str[i] === ',')) {
      digitPart += str[i];
      i++;
    }
    
    // 提取后缀（如 %）
    const suffix = str.slice(i);
    if (suffix) {
      parts.push({ type: 'suffix', value: suffix });
    }
    
    // 处理数字部分（保留原始格式，包括千位分隔符）
    const decimalIndex = digitPart.indexOf('.');
    
    if (decimalIndex !== -1) {
      // 有小数点
      const integerPart = digitPart.slice(0, decimalIndex);
      const decimalPart = digitPart.slice(decimalIndex + 1);
      
      // 整数部分（保留千位分隔符）
      for (let j = 0; j < integerPart.length; j++) {
        if (integerPart[j] === ',') {
          parts.push({ type: 'separator', value: ',' });
        } else {
          parts.push({ type: 'digit', value: integerPart[j] });
        }
      }
      
      // 小数点
      parts.push({ type: 'decimal', value: '.' });
      
      // 小数部分
      for (let j = 0; j < decimalPart.length; j++) {
        parts.push({ type: 'digit', value: decimalPart[j] });
      }
    } else {
      // 无小数点
      for (let j = 0; j < digitPart.length; j++) {
        if (digitPart[j] === ',') {
          parts.push({ type: 'separator', value: ',' });
        } else {
          parts.push({ type: 'digit', value: digitPart[j] });
        }
      }
    }
    
    return parts;
  };
  
  const parts = parseValue(formattedValue);
  
  // 渲染单个数字位（0-9 滚动）
  const renderDigit = (digit: string, uniqueKey: string) => {
    const num = parseInt(digit);
    if (isNaN(num)) return <span key={uniqueKey}>{digit}</span>;
    
    // 计算目标位置（每个数字高度为 1em）
    const targetY = -num * 1; // em 单位
    
    return (
      <span
        key={uniqueKey}
        style={{
          display: 'inline-block',
          position: 'relative',
          overflow: 'hidden',
          height: '1em',
          verticalAlign: 'bottom',
          minWidth: '0.6em', // 确保数字位有足够宽度
        }}
      >
        <motion.span
          key={`${uniqueKey}-${num}`} // 使用 key 触发重新动画
          style={{
            display: 'inline-block',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
          }}
          initial={{ y: '0em' }}
          animate={{ y: `${targetY}em` }}
          transition={{
            duration: duration,
            ease: [0.25, 0.1, 0.25, 1], // cubic-bezier for smooth deceleration
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <span
              key={n}
              style={{
                display: 'block',
                height: '1em',
                lineHeight: '1em',
                textAlign: 'center',
              }}
            >
              {n}
            </span>
          ))}
        </motion.span>
      </span>
    );
  };
  
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        lineHeight: '1em',
      }}
    >
      {parts.map((part, index) => {
        const uniqueKey = `${formattedValue}-${index}-${part.type}-${part.value}`;
        if (part.type === 'sign' || part.type === 'decimal' || part.type === 'suffix' || part.type === 'separator' || part.type === 'prefix') {
          // 非数字字符直接显示
          return <span key={uniqueKey}>{part.value}</span>;
        } else {
          // 数字字符使用滚动动画
          return renderDigit(part.value, uniqueKey);
        }
      })}
    </span>
  );
};

