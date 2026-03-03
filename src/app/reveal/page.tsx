'use client';

import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Container } from '@/components/layout';
import { useGame } from '@/contexts/GameContext';

export default function RevealPage() {
  const router = useRouter();
  const { state, actions } = useGame();

  // 如果没有当前题目，重定向到开始页
  if (!state.currentPuzzle) {
    router.push('/start');
    return null;
  }

  const handlePlayAgain = async () => {
    await actions.changePuzzle();
    router.push('/play');
  };

  const handleBackToStart = () => {
    actions.dispatch({ type: 'RESET_GAME' });
    router.push('/start');
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <Container className="py-8">
        {/* 成功祝贺 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-h1 mb-2">恭喜你！</h1>
          <p className="text-body text-text-secondary">
            你已经成功推理出了完整的故事
          </p>
        </div>

        {/* 题目信息 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{state.currentPuzzle.title}</CardTitle>
            <CardDescription>题目描述</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-body text-text-secondary leading-relaxed">
              {state.currentPuzzle.prompt}
            </p>
          </CardContent>
        </Card>

        {/* 完整答案 */}
        <Card variant="elevated" className="mb-8">
          <CardHeader>
            <CardTitle>完整故事</CardTitle>
            <CardDescription>这就是整个故事的真相</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-body text-text-primary leading-relaxed">
              {state.currentPuzzle.solution}
            </p>
          </CardContent>
        </Card>

        {/* 问答记录 */}
        {state.qaList.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>推理过程</CardTitle>
              <CardDescription>你的提问记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {state.qaList.map((qa, index) => (
                  <div key={qa.id} className="flex items-start gap-3 p-3 bg-background-secondary rounded-default">
                    <div className="w-6 h-6 bg-fuschia-100 text-white text-sm rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-body text-text-primary mb-1">{qa.question}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-text-secondary">回答：</span>
                        <span className={`text-sm font-medium ${
                          qa.answer === 'YES' ? 'text-success' :
                          qa.answer === 'NO' ? 'text-error' :
                          qa.answer === 'BOTH' ? 'text-warning' :
                          'text-info'
                        }`}>
                          {qa.answer === 'YES' ? '是' :
                           qa.answer === 'NO' ? '不是' :
                           qa.answer === 'BOTH' ? '是又不是' :
                           '不重要'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={handlePlayAgain}
            className="w-full sm:w-auto"
          >
            再来一题
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            onClick={handleBackToStart}
            className="w-full sm:w-auto"
          >
            回到开始
          </Button>
        </div>

        {/* 统计信息 */}
        <div className="text-center mt-8">
          <p className="text-sm text-text-secondary">
            本次推理共提问 {state.qaList.length} 次
          </p>
        </div>
      </Container>
    </div>
  );
}
