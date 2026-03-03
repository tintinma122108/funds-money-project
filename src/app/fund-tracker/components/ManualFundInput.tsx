'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { RecognizedFund } from '../types';

interface ManualFundInputProps {
  onConfirm: (funds: RecognizedFund[]) => void;
  onCancel: () => void;
}

export const ManualFundInput: React.FC<ManualFundInputProps> = ({
  onConfirm,
  onCancel,
}) => {
  const [funds, setFunds] = useState<RecognizedFund[]>([
    { fundCode: '', fundName: '', holdingAmount: 0, purchasePrice: undefined },
  ]);

  const addFund = () => {
    setFunds([...funds, { fundCode: '', fundName: '', holdingAmount: 0, purchasePrice: undefined }]);
  };

  const removeFund = (index: number) => {
    if (funds.length > 1) {
      setFunds(funds.filter((_, i) => i !== index));
    }
  };

  const updateFund = (index: number, field: keyof RecognizedFund, value: string | number) => {
    const newFunds = [...funds];
    newFunds[index] = { ...newFunds[index], [field]: value };
    setFunds(newFunds);
  };

  const handleConfirm = () => {
    // 验证并过滤空数据
    const validFunds = funds.filter(
      (fund) => fund.fundCode.trim().length > 0 && fund.holdingAmount > 0
    );

    if (validFunds.length === 0) {
      alert('请至少输入一只有效的基金信息');
      return;
    }

    // 验证基金代码格式
    const invalidCodes = validFunds.filter((fund) => !/^\d{6}$/.test(fund.fundCode));
    if (invalidCodes.length > 0) {
      alert('基金代码必须是6位数字');
      return;
    }

    onConfirm(validFunds);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-white font-semibold text-lg mb-1">手动输入基金信息</h3>
        <p className="text-zinc-400 text-sm">OCR识别失败，请手动输入基金信息</p>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {funds.map((fund, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-white font-medium">基金 {index + 1}</h4>
              {funds.length > 1 && (
                <button
                  onClick={() => removeFund(index)}
                  className="text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-zinc-400 text-xs mb-1 block">
                  基金代码 <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={fund.fundCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    updateFund(index, 'fundCode', value);
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="000001"
                  maxLength={6}
                />
              </div>

              <div>
                <label className="text-zinc-400 text-xs mb-1 block">基金名称</label>
                <input
                  type="text"
                  value={fund.fundName}
                  onChange={(e) => updateFund(index, 'fundName', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="基金名称（可选，会自动获取）"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-xs mb-1 block">
                  持有金额（元） <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  value={fund.holdingAmount || ''}
                  onChange={(e) => updateFund(index, 'holdingAmount', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="10000"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-xs mb-1 block">买入价格（可选）</label>
                <input
                  type="number"
                  step="0.0001"
                  value={fund.purchasePrice || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : undefined;
                    updateFund(index, 'purchasePrice', value);
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="1.0（不填则使用当前净值）"
                  min="0"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={addFund}
        className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        添加更多基金
      </button>

      <div className="flex gap-3">
        <button
          onClick={handleConfirm}
          className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
        >
          确认添加
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-medium transition-colors"
        >
          取消
        </button>
      </div>
    </div>
  );
};


