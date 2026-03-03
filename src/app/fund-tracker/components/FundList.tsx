'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { FundHolding } from '../types';
import { FundListItem } from './FundListItem';
import { Plus } from 'lucide-react';

interface FundListProps {
  funds: FundHolding[];
  onDelete?: (id: string) => void;
}

export const FundList: React.FC<FundListProps> = ({ funds, onDelete }) => {
  const sortedFunds = React.useMemo(() => {
    // 按“持有金额”从大到小排序；持有金额相同则按代码稳定排序
    return [...funds].sort((a, b) => {
      const diff = (b.holdingAmount ?? 0) - (a.holdingAmount ?? 0);
      if (diff !== 0) return diff;
      return (a.fundCode || '').localeCompare(b.fundCode || '');
    });
  }, [funds]);

  if (funds.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '64px',
        paddingBottom: '64px',
        gap: '16px',
        border: '2px dashed #e5e7eb',
        borderRadius: '24px',
        width: '100%',
        gridColumn: '1 / -1', // 跨越所有列
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Plus size={24} style={{ opacity: 0.3, color: '#6b7280' }} />
        </div>
        <p style={{ fontSize: '14px', fontWeight: 500, lineHeight: '1.25', color: '#374151' }}>暂无持仓，点击添加按钮添加</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: 'clamp(20px, 4vw, 40px)',
      rowGap: '48px', // gap-y-12 = 48px，为顶部突出的回形针留出足够的呼吸空间
      minHeight: '256px',
      width: '100%',
    }}>
      <AnimatePresence>
        {sortedFunds.map((fund, index) => (
          <FundListItem key={fund.id} fund={fund} onDelete={onDelete} index={index} />
        ))}
      </AnimatePresence>
    </div>
  );
};

