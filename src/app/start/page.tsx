'use client';

import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Container } from '@/components/layout';
import { useGame } from '@/contexts/GameContext';

export default function StartPage() {
  const router = useRouter();
  const { state, actions } = useGame();

  const handleStartGame = async () => {
    await actions.startGame();
    router.push('/play');
  };

  const handleChangePuzzle = async () => {
    await actions.changePuzzle();
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <Container className="py-8">
        {/* 主标题区域 */}
        <div className="text-center mb-12">
          <h1 className="text-h1 mb-4">海龟汤推理游戏</h1>
          <p className="text-body text-text-secondary max-w-2xl mx-auto">
            通过提问获得"是"、"不是"、"不重要"或"是又不是"的回答，
            最终推理出完整的故事真相。
          </p>
        </div>

        {/* 游戏说明卡片 */}
        <Card className="mb-8 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>游戏规则</CardTitle>
            <CardDescription>了解如何玩海龟汤游戏</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-fuschia-100 text-white text-sm flex items-center justify-center font-bold">
                  1
                </div>
                <p className="text-body text-text-secondary">
                  我会给你一个奇怪的情况或故事开头
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-fuschia-100 text-white text-sm flex items-center justify-center font-bold">
                  2
                </div>
                <p className="text-body text-text-secondary">
                  你可以问我任何问题，我会回答"是"、"不是"、"不重要"或"是又不是"
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-fuschia-100 text-white text-sm flex items-center justify-center font-bold">
                  3
                </div>
                <p className="text-body text-text-secondary">
                  通过逻辑推理，找出完整的故事真相
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
          <Button
            size="lg"
            onClick={handleStartGame}
            disabled={state.isLoading}
            className="w-full sm:w-auto"
          >
            {state.isLoading ? '加载中...' : '开始推理'}
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            onClick={handleChangePuzzle}
            disabled={state.isLoading}
            className="w-full sm:w-auto"
          >
            换题
          </Button>
        </div>

        {/* 提示信息 */}
        <div className="text-center mt-8">
          <p className="text-sm text-text-secondary">
            提示：问题越具体，越容易找到答案
          </p>
        </div>
      </Container>
    </div>
  );
}
