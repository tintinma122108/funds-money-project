'use client';

import React from 'react';
import { Button } from '@/components/ui';
import { useGame } from '@/contexts/GameContext';

interface HeaderProps {
  title?: string;
  showChangeButton?: boolean;
  onBack?: () => void;
}

export function Header({ title, showChangeButton = false, onBack }: HeaderProps) {
  const { actions } = useGame();

  const handleChangePuzzle = () => {
    if (confirm('确定要换题吗？当前进度将丢失。')) {
      actions.changePuzzle();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-background-primary/80 backdrop-blur-glass">
      <div className="container-responsive flex h-16 items-center justify-between">
        {/* 左侧：返回按钮或标题 */}
        <div className="flex items-center gap-4">
          {onBack && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onBack}
              className="!h-8 !w-8 !p-0"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>
          )}
          {title && (
            <h1 className="text-h2 text-text-primary">{title}</h1>
          )}
        </div>

        {/* 右侧：换题按钮 */}
        {showChangeButton && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleChangePuzzle}
          >
            换题
          </Button>
        )}
      </div>
    </header>
  );
}
