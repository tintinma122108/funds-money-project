'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { RecognizedFund } from '../types';
import { recognizeFundFromImage } from '../utils';
import { FundRecognitionResult } from './FundRecognitionResult';
import { ManualFundInput } from './ManualFundInput';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecognized: (funds: RecognizedFund[]) => void;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onRecognized,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [recognizedFunds, setRecognizedFunds] = useState<RecognizedFund[] | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }

    // 显示预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // 开始识别
    setIsProcessing(true);
    setProgress(0);
    setErrorMessage(null);
    
    try {
      // 模拟进度更新
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) {
            return Math.min(prev + 5, 90);
          }
          return prev;
        });
      }, 300);

      const funds = await recognizeFundFromImage(file);
      
      clearInterval(progressInterval);
      setProgress(100);

      if (funds.length > 0) {
        setRecognizedFunds(funds);
        // 不立即关闭，显示确认界面
      } else {
        setErrorMessage('未能识别到基金信息');
        setShowManualInput(true);
      }
    } catch (error) {
      console.error('识别失败:', error);
      const errorMsg = error instanceof Error ? error.message : '未知错误';
      setErrorMessage(errorMsg);
      setShowManualInput(true);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClose = () => {
    setPreview(null);
    setRecognizedFunds(null);
    setShowManualInput(false);
    setErrorMessage(null);
    setIsDragging(false);
    setIsProcessing(false);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleConfirm = (funds: RecognizedFund[]) => {
    onRecognized(funds);
    handleClose();
  };

  const handleCancel = () => {
    setRecognizedFunds(null);
    setIsProcessing(false);
    setProgress(0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* 模态框 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-zinc-900 rounded-2xl border border-white/10 w-full max-w-md overflow-hidden shadow-2xl">
              {/* 头部 */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="text-white font-semibold text-lg">上传基金持仓截图</h2>
                <button
                  onClick={handleClose}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 内容区域 */}
              <div className="p-6">
                {showManualInput ? (
                  // 手动输入界面
                  <div className="space-y-4">
                    {errorMessage && (
                      <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
                        <p className="text-rose-400 text-sm">{errorMessage}</p>
                        <p className="text-zinc-400 text-xs mt-1">请手动输入基金信息</p>
                      </div>
                    )}
                    {preview && (
                      <div className="relative rounded-lg overflow-hidden border border-white/10">
                        <img
                          src={preview}
                          alt="预览"
                          className="w-full h-auto max-h-32 object-contain"
                        />
                      </div>
                    )}
                    <ManualFundInput
                      onConfirm={handleConfirm}
                      onCancel={handleCancel}
                    />
                  </div>
                ) : recognizedFunds ? (
                  // 识别结果确认
                  <FundRecognitionResult
                    funds={recognizedFunds}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    onEdit={(index, fund) => {
                      const newFunds = [...recognizedFunds];
                      newFunds[index] = fund;
                      setRecognizedFunds(newFunds);
                    }}
                  />
                ) : preview ? (
                  // 预览模式
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden border border-white/10">
                      <img
                        src={preview}
                        alt="预览"
                        className="w-full h-auto max-h-64 object-contain"
                      />
                    </div>
                    {isProcessing && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2 text-zinc-400">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="text-sm">正在识别基金信息...</span>
                        </div>
                        {progress > 0 && (
                          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                            <motion.div
                              className="bg-emerald-500 h-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  // 上传区域
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      isDragging
                        ? 'border-emerald-400 bg-emerald-400/10'
                        : 'border-white/20 hover:border-white/30'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium mb-1">
                          拖拽图片到此处或点击上传
                        </p>
                        <p className="text-zinc-400 text-sm">
                          支持 JPG、PNG 等图片格式
                        </p>
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        选择文件
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

