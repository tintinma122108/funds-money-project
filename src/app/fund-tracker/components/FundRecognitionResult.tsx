'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Edit2 } from 'lucide-react';
import { RecognizedFund } from '../types';
import { formatCurrency } from '../utils';

interface FundRecognitionResultProps {
  funds: RecognizedFund[];
  onConfirm: (funds: RecognizedFund[]) => void;
  onCancel: () => void;
  onEdit: (index: number, fund: RecognizedFund) => void;
}

export const FundRecognitionResult: React.FC<FundRecognitionResultProps> = ({
  funds,
  onConfirm,
  onCancel,
  onEdit,
}) => {
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [editedFunds, setEditedFunds] = React.useState<RecognizedFund[]>(funds);

  React.useEffect(() => {
    setEditedFunds(funds);
  }, [funds]);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleSave = (index: number, updatedFund: RecognizedFund) => {
    const newFunds = [...editedFunds];
    newFunds[index] = updatedFund;
    setEditedFunds(newFunds);
    setEditingIndex(null);
  };

  const handleFieldChange = (index: number, field: keyof RecognizedFund, value: string | number) => {
    const newFunds = [...editedFunds];
    newFunds[index] = { ...newFunds[index], [field]: value };
    setEditedFunds(newFunds);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-white font-semibold text-lg mb-1">
          识别到 {funds.length} 只基金
        </h3>
        <p className="text-zinc-400 text-sm">请确认信息是否正确</p>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {editedFunds.map((fund, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-lg p-4"
          >
            {editingIndex === index ? (
              // 编辑模式
              <div className="space-y-3">
                <div>
                  <label className="text-zinc-400 text-xs mb-1 block">基金代码</label>
                  <input
                    type="text"
                    value={fund.fundCode}
                    onChange={(e) => handleFieldChange(index, 'fundCode', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm"
                    placeholder="000001"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs mb-1 block">基金名称</label>
                  <input
                    type="text"
                    value={fund.fundName}
                    onChange={(e) => handleFieldChange(index, 'fundName', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm"
                    placeholder="基金名称"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs mb-1 block">持仓份额（份）</label>
                  <input
                    type="number"
                    step="0.01"
                    value={fund.shares || ''}
                    onChange={(e) => handleFieldChange(index, 'shares', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm"
                    placeholder="4000"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs mb-1 block">持仓金额（元）</label>
                  <input
                    type="number"
                    value={fund.holdingAmount}
                    onChange={(e) => handleFieldChange(index, 'holdingAmount', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm"
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs mb-1 block">持仓成本（元/份）</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={fund.purchasePrice || ''}
                    onChange={(e) => handleFieldChange(index, 'purchasePrice', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm"
                    placeholder="2.50"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(index, editedFunds[index])}
                    className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              // 显示模式
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-medium">{fund.fundName}</h4>
                      <span className="text-zinc-500 text-xs font-mono">{fund.fundCode}</span>
                    </div>
                    <div className="text-zinc-400 text-sm space-y-1">
                      <div>持仓份额: {fund.shares ? `${fund.shares.toFixed(2)} 份` : '未设置'}</div>
                      <div>持仓金额: {formatCurrency(fund.holdingAmount)}</div>
                      {fund.purchasePrice !== undefined && (
                        <div>持仓成本: ¥{fund.purchasePrice.toFixed(4)} / 份</div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-zinc-400 hover:text-white transition-colors p-1"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onConfirm(editedFunds)}
          className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          确认添加
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-5 h-5" />
          取消
        </button>
      </div>
    </div>
  );
};

